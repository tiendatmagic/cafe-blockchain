<?php

namespace App\Application\Orders\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Domain\Entities\OrderItem;
use App\Domain\Entities\Product;
use App\Domain\Entities\Customer;
use App\Domain\Entities\DebtLog;
use Illuminate\Support\Facades\DB;

class UpdateOrderCommand
{
    protected BlockchainRelayerServiceInterface $blockchainService;

    public function __construct(BlockchainRelayerServiceInterface $blockchainService)
    {
        $this->blockchainService = $blockchainService;
    }

    public function execute(string $storeOwner, int|string $id, array $data): OrderModel
    {
        $order = OrderModel::where('store_owner_address', $storeOwner)->findOrFail($id);

        if ($order->status !== 'pending') {
            throw new \Exception("Only orders in pending status can be edited!");
        }

        if ($order->blockchain_status !== 'none') {
            throw new \Exception("Cannot edit orders that have already been synchronized to the blockchain!");
        }

        return DB::transaction(function () use ($storeOwner, $order, $data) {
            // Xác thực khách hàng thuộc sở hữu của quán và tải trước
            $customer = null;
            if (!empty($data['customer_id'])) {
                $customer = Customer::where('id', $data['customer_id'])
                    ->where('store_owner_address', $storeOwner)
                    ->first();
                if (!$customer) {
                    throw new \Exception("The selected customer was not found or does not belong to this store!");
                }
            }

            if ($data['payment_method'] === 'debt') {
                if (empty($data['customer_id'])) {
                    throw new \Exception("A customer must be selected for debt orders!");
                }
            }

            $totalAmount = 0;
            $totalTaxAmount = 0;
            $itemsData = [];

            // Đọc cấu hình thuế của cửa hàng
            $taxEnabled = \App\Domain\Entities\Setting::getForStore('tax_enabled', $storeOwner, '0') === '1';
            $taxDefaultRate = (float)\App\Domain\Entities\Setting::getForStore('tax_default_rate', $storeOwner, 10);
            $taxInclusive = \App\Domain\Entities\Setting::getForStore('tax_inclusive', $storeOwner, '0') === '1';

            foreach ($data['items'] as $item) {
                $product = Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                
                if (!$product->status) {
                    throw new \Exception("Product '" . $product->name . "' is currently disabled and not available for purchase!");
                }
                
                $price = $product->price;
                $costPrice = $product->cost_price;
                $variantId = $item['product_variant_id'] ?? null;

                if ($variantId) {
                    $variant = $product->variants()->where('id', $variantId)->first();
                    if ($variant) {
                        if (!$variant->status) {
                            throw new \Exception("Variant '" . $variant->variant_name . "' of product '" . $product->name . "' is currently disabled!");
                        }
                        $price = $variant->price;
                        $costPrice = $variant->cost_price;
                    } else {
                        throw new \Exception("Invalid product variant for item: " . $product->name);
                    }
                }

                $quantity = $item['quantity'];

                // Tính toán thuế của sản phẩm
                $itemTaxRate = 0;
                if ($taxEnabled) {
                    if ($product->tax_rate !== null) {
                        $itemTaxRate = $product->tax_rate == -1 ? 0 : (float)$product->tax_rate;
                    } else {
                        $itemTaxRate = $taxDefaultRate;
                    }
                }

                $itemTaxAmount = 0;
                if ($itemTaxRate > 0) {
                    if ($taxInclusive) {
                        $itemTaxAmount = ($price * $quantity) * ($itemTaxRate / (100 + $itemTaxRate));
                    } else {
                        $itemTaxAmount = ($price * $quantity) * ($itemTaxRate / 100);
                    }
                }

                $totalTaxAmount += $itemTaxAmount;

                if ($taxInclusive) {
                    $subTotal = $price * $quantity;
                } else {
                    $subTotal = ($price * $quantity) + $itemTaxAmount;
                }
                $totalAmount += $subTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'cost_price' => $costPrice,
                    'note' => $item['note'] ?? null,
                    'tax_rate' => $itemTaxRate,
                    'tax_amount' => $itemTaxAmount,
                ];
            }

            $discountAmount = 0;
            $voucherNftTokenId = $data['voucher_nft_token_id'] ?? null;
            $voucherNftSignature = $data['voucher_nft_signature'] ?? null;
            $relayerResult = null;

            if ($order->voucher_nft_token_id !== null) {
                if ($voucherNftTokenId !== null && (int)$voucherNftTokenId !== (int)$order->voucher_nft_token_id) {
                    throw new \Exception("Cannot change the NFT Voucher that has already been applied and burned for this order!");
                }
                $discountAmount = $order->discount_amount;
                $voucherNftTokenId = $order->voucher_nft_token_id;
            } elseif ($voucherNftTokenId !== null && !empty($voucherNftSignature)) {
                if (!$customer || empty($customer->wallet_address)) {
                    throw new \Exception("NFT Vouchers only apply to customers with linked EVM wallets!");
                }

                $relayerGet = $this->blockchainService->getVoucher($storeOwner, (int)$voucherNftTokenId);
                if (!$relayerGet['success']) {
                    throw new \Exception("Cannot validate NFT Voucher from the blockchain: " . ($relayerGet['error'] ?? 'Unknown error'));
                }

                if ($relayerGet['isUsed']) {
                    throw new \Exception("This NFT Voucher has already been used or burned on-chain!");
                }

                if (strtolower($relayerGet['owner']) !== strtolower($customer->wallet_address)) {
                    throw new \Exception("This NFT Voucher does not belong to the selected customer!");
                }

                $blockchainMinOrder = (int)$relayerGet['minOrderAmount'];
                if ($totalAmount < $blockchainMinOrder) {
                    throw new \Exception("The order total has not reached the minimum value of " . number_format($blockchainMinOrder) . " VND to apply the NFT Voucher!");
                }

                $relayerResult = $this->blockchainService->useVoucher(
                    $storeOwner,
                    (int)$voucherNftTokenId,
                    $order->order_code,
                    $voucherNftSignature
                );

                if (!$relayerResult['success']) {
                    throw new \Exception("Cannot redeem NFT Voucher on the blockchain: " . ($relayerResult['error'] ?? 'Unknown error'));
                }

                $discountAmount = (int)$relayerGet['discountAmount'];

                DB::table('voucher_signatures')->where('order_code', $order->order_code)->delete();
            }

            $finalTotalAmount = max(0, $totalAmount - $discountAmount);

            // Lưu trữ thông tin cũ của đơn hàng trước khi cập nhật để tính toán công nợ
            $oldPaymentMethod = $order->payment_method;
            $oldCustomerId = $order->customer_id;
            $oldTotalAmount = $order->total_amount;

            $updateData = [
                'table_number' => $data['table_number'] ?? null,
                'customer_id' => $data['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'tax_amount' => $totalTaxAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $data['payment_method'],
                'tx_hash' => isset($relayerResult['txHash']) ? $relayerResult['txHash'] : $order->tx_hash,
            ];

            if ($order->shift_id === null) {
                $user = auth()->user();
                if ($user) {
                    $activeShift = \App\Domain\Entities\Shift::where('user_id', $user->id)
                        ->where('status', 'open')
                        ->first();
                    if ($activeShift) {
                        $updateData['shift_id'] = $activeShift->id;
                    }
                }
            }

            $order->update($updateData);

            // Điều chỉnh công nợ khách hàng nếu có sự thay đổi
            if ($oldPaymentMethod === 'debt' && $updateData['payment_method'] !== 'debt') {
                // Chuyển từ Ghi nợ sang hình thức khác -> Hoàn trả nợ cho khách hàng cũ
                if ($oldCustomerId) {
                    $oldCustomer = Customer::find($oldCustomerId);
                    if ($oldCustomer) {
                        $oldCustomer->decrement('debt_balance', $oldTotalAmount);
                    }
                    DebtLog::where('order_id', $order->id)->where('type', 'debt')->delete();
                }
            } elseif ($oldPaymentMethod !== 'debt' && $updateData['payment_method'] === 'debt') {
                // Chuyển từ hình thức khác sang Ghi nợ -> Ghi nhận nợ mới
                if ($customer) {
                    $customer->increment('debt_balance', $finalTotalAmount);
                    DebtLog::create([
                        'store_owner_address' => $storeOwner,
                        'customer_id' => $customer->id,
                        'order_id' => $order->id,
                        'type' => 'debt',
                        'amount' => $finalTotalAmount,
                        'note' => "Debt for order " . ($order->order_code ?? $order->id),
                        'recorded_at' => now()->toDateString(),
                    ]);
                }
            } elseif ($oldPaymentMethod === 'debt' && $updateData['payment_method'] === 'debt') {
                // Vẫn giữ hình thức Ghi nợ
                if ($oldCustomerId === $customer->id) {
                    // Cùng khách hàng -> Cập nhật chênh lệch số tiền nợ
                    $diffAmount = $finalTotalAmount - $oldTotalAmount;
                    if ($diffAmount !== 0) {
                        $customer->increment('debt_balance', $diffAmount);
                    }
                    // Cập nhật lại DebtLog
                    DebtLog::updateOrCreate(
                        ['order_id' => $order->id, 'type' => 'debt'],
                        [
                            'store_owner_address' => $storeOwner,
                            'customer_id' => $customer->id,
                            'amount' => $finalTotalAmount,
                            'note' => "Debt for order " . ($order->order_code ?? $order->id),
                            'recorded_at' => now()->toDateString(),
                        ]
                    );
                } else {
                    // Thay đổi khách hàng ghi nợ
                    // 1. Trừ nợ khách hàng cũ
                    if ($oldCustomerId) {
                        $oldCustomer = Customer::find($oldCustomerId);
                        if ($oldCustomer) {
                            $oldCustomer->decrement('debt_balance', $oldTotalAmount);
                        }
                    }
                    // 2. Cộng nợ khách hàng mới
                    if ($customer) {
                        $customer->increment('debt_balance', $finalTotalAmount);
                    }
                    // 3. Cập nhật lại DebtLog
                    DebtLog::updateOrCreate(
                        ['order_id' => $order->id, 'type' => 'debt'],
                        [
                            'store_owner_address' => $storeOwner,
                            'customer_id' => $customer->id,
                            'amount' => $finalTotalAmount,
                            'note' => "Debt for order " . ($order->order_code ?? $order->id),
                            'recorded_at' => now()->toDateString(),
                        ]
                    );
                }
            }

            $order->items()->delete();

            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            return $order;
        });
    }
}
