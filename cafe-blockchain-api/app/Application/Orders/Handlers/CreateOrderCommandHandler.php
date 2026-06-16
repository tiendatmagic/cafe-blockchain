<?php

namespace App\Application\Orders\Handlers;

use App\Application\Orders\Commands\CreateOrderCommand;
use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Domain\Repositories\OrderRepositoryInterface;
use App\Domain\Entities\Order;
use App\Domain\Entities\OrderItem;
use App\Domain\Entities\Product;
use App\Domain\Entities\Customer;
use App\Domain\Entities\Setting;
use App\Domain\Entities\DebtLog;
use Illuminate\Support\Facades\DB;

class CreateOrderCommandHandler
{
    protected BlockchainRelayerServiceInterface $blockchainService;
    protected OrderRepositoryInterface $orderRepository;

    public function __construct(
        BlockchainRelayerServiceInterface $blockchainService,
        OrderRepositoryInterface $orderRepository
    ) {
        $this->blockchainService = $blockchainService;
        $this->orderRepository = $orderRepository;
    }

    public function handle(CreateOrderCommand $command): Order
    {
        $storeOwner = $command->storeOwner;
        $data = $command->data;

        return DB::transaction(function () use ($storeOwner, $data) {
            $totalAmount = 0;
            $itemsData = [];

            // Tính tổng tiền và lấy chi tiết món
            foreach ($data['items'] as $item) {
                $product = Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                
                $price = $product->price;
                $costPrice = $product->cost_price;
                $variantId = $item['product_variant_id'] ?? null;

                if ($variantId) {
                    $variant = $product->variants()->where('id', $variantId)->first();
                    if ($variant) {
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

            // Áp dụng voucher nếu có
            $discountAmount = 0;
            $voucherNftTokenId = $data['voucher_nft_token_id'] ?? null;
            $voucherNftSignature = $data['voucher_nft_signature'] ?? null;
            $relayerResult = null;

            if ($voucherNftTokenId !== null && !empty($voucherNftSignature)) {
                $voucherEnabled = Setting::getForStore('voucher_enabled', $storeOwner, '0') === '1';
                if (!$voucherEnabled) {
                    throw new \Exception("The store's NFT Voucher program is currently disabled!");
                }

                $orderCode = $data['order_code'] ?? null;
                if (empty($orderCode)) {
                    $orderCode = 'HD-' . strtoupper(bin2hex(random_bytes(3)));
                    $data['order_code'] = $orderCode;
                }

                $customer = null;
                if (!empty($data['customer_id'])) {
                    $customer = Customer::find($data['customer_id']);
                }

                if (!$customer || empty($customer->wallet_address)) {
                    throw new \Exception("NFT Vouchers only apply to customers with linked EVM wallets!");
                }

                // Truy vấn thông tin voucher directly on-chain
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

                // Thực hiện gọi Relayer để tiêu hủy (burn) NFT Voucher trên chuỗi bằng chữ ký số của khách hàng
                $relayerResult = $this->blockchainService->useVoucher(
                    $storeOwner,
                    (int)$voucherNftTokenId,
                    $orderCode,
                    $voucherNftSignature
                );

                if (!$relayerResult['success']) {
                    throw new \Exception("Cannot redeem NFT Voucher on the blockchain: " . ($relayerResult['error'] ?? 'Unknown error'));
                }

                $discountAmount = (int)$relayerGet['discountAmount'];

                // Xóa chữ ký và đơn hàng tạm thời sau khi quy đổi thành công
                DB::table('voucher_signatures')->where('order_code', $orderCode)->delete();
            }

            $shippingFee = isset($data['shipping_fee']) ? (float)$data['shipping_fee'] : 0;
            $finalTotalAmount = max(0, $totalAmount - $discountAmount) + $shippingFee;

            if ($data['payment_method'] === 'debt') {
                if (empty($data['customer_id'])) {
                    throw new \Exception("A customer must be selected for debt orders!");
                }
            }

            // Tìm ca trực đang mở của nhân viên hiện tại
            $shiftId = null;
            $user = auth()->user();
            if ($user) {
                $activeShift = \App\Domain\Entities\Shift::where('user_id', $user->id)
                    ->where('status', 'open')
                    ->first();
                if ($activeShift) {
                    $shiftId = $activeShift->id;
                }
            }

            // Tạo đơn hàng thông qua Domain Entity & Repository
            $order = new Order([
                'order_code' => $data['order_code'] ?? null,
                'table_number' => $data['table_number'] ?? null,
                'customer_id' => $data['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $data['payment_method'],
                'status' => 'pending',
                'tx_hash' => $relayerResult['txHash'] ?? null,
                'blockchain_status' => 'none',
                'store_owner_address' => $storeOwner,
                'shift_id' => $shiftId,
            ]);

            $savedOrder = $this->orderRepository->save($order);

            // Tạo chi tiết đơn hàng
            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $savedOrder->id;
                OrderItem::create($itemData);
            }

            // Ghi nhận công nợ nếu phương thức thanh toán là Ghi nợ
            if ($savedOrder->payment_method === 'debt') {
                $customer = Customer::findOrFail($savedOrder->customer_id);
                $customer->increment('debt_balance', $savedOrder->total_amount);

                DebtLog::create([
                    'store_owner_address' => $storeOwner,
                    'customer_id' => $savedOrder->customer_id,
                    'order_id' => $savedOrder->id,
                    'type' => 'debt',
                    'amount' => $savedOrder->total_amount,
                    'note' => "Debt for order " . ($savedOrder->order_code ?? $savedOrder->id),
                    'recorded_at' => now()->toDateString(),
                ]);
            }

            return $savedOrder;
        });
    }
}
