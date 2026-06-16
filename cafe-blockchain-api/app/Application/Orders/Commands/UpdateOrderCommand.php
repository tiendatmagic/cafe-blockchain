<?php

namespace App\Application\Orders\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Domain\Entities\OrderItem;
use App\Domain\Entities\Product;
use App\Domain\Entities\Customer;
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
            $totalAmount = 0;
            $itemsData = [];

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
                $subTotal = $price * $quantity;
                $totalAmount += $subTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'price' => $price,
                    'cost_price' => $costPrice,
                    'note' => $item['note'] ?? null,
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
                $customer = null;
                if (!empty($data['customer_id'])) {
                    $customer = Customer::find($data['customer_id']);
                }

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

            $updateData = [
                'table_number' => $data['table_number'] ?? null,
                'customer_id' => $data['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
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

            $order->items()->delete();

            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            return $order;
        });
    }
}
