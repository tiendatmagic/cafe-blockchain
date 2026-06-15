<?php

namespace App\Application\Orders\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Domain\Entities\Order;
use App\Domain\Entities\OrderItem;
use App\Domain\Entities\Product;
use App\Domain\Entities\Customer;
use Illuminate\Support\Facades\DB;

class CreateOrderCommand
{
    protected BlockchainRelayerServiceInterface $blockchainService;

    public function __construct(BlockchainRelayerServiceInterface $blockchainService)
    {
        $this->blockchainService = $blockchainService;
    }

    public function execute(string $storeOwner, array $data): Order
    {
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
                        throw new \Exception("Biến thể sản phẩm không hợp lệ cho món: " . $product->name);
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
                    throw new \Exception("NFT Voucher chỉ áp dụng cho khách hàng có liên kết ví EVM!");
                }

                // Truy vấn thông tin voucher directly on-chain
                $relayerGet = $this->blockchainService->getVoucher($storeOwner, (int)$voucherNftTokenId);
                if (!$relayerGet['success']) {
                    throw new \Exception("Không thể xác thực NFT Voucher từ Blockchain: " . ($relayerGet['error'] ?? 'Lỗi không xác định'));
                }

                if ($relayerGet['isUsed']) {
                    throw new \Exception("NFT Voucher này đã được sử dụng hoặc đã bị tiêu hủy trên chuỗi!");
                }

                if (strtolower($relayerGet['owner']) !== strtolower($customer->wallet_address)) {
                    throw new \Exception("NFT Voucher này không thuộc sở hữu của khách hàng được chọn!");
                }

                $blockchainMinOrder = (int)$relayerGet['minOrderAmount'];
                if ($totalAmount < $blockchainMinOrder) {
                    throw new \Exception("Đơn hàng chưa đạt giá trị tối thiểu " . number_format($blockchainMinOrder) . "đ để áp dụng NFT Voucher!");
                }

                // Thực hiện gọi Relayer để tiêu hủy (burn) NFT Voucher trên chuỗi bằng chữ ký số của khách hàng
                $relayerResult = $this->blockchainService->useVoucher(
                    $storeOwner,
                    (int)$voucherNftTokenId,
                    $orderCode,
                    $voucherNftSignature
                );

                if (!$relayerResult['success']) {
                    throw new \Exception("Không thể quy đổi NFT Voucher trên Blockchain: " . ($relayerResult['error'] ?? 'Lỗi không xác định'));
                }

                $discountAmount = (int)$relayerGet['discountAmount'];

                // Xóa chữ ký và đơn hàng tạm thời sau khi quy đổi thành công
                DB::table('voucher_signatures')->where('order_code', $orderCode)->delete();
            }

            $shippingFee = isset($data['shipping_fee']) ? (float)$data['shipping_fee'] : 0;
            $finalTotalAmount = max(0, $totalAmount - $discountAmount) + $shippingFee;

            if ($data['payment_method'] === 'debt') {
                if (empty($data['customer_id'])) {
                    throw new \Exception("Đơn hàng ghi nợ bắt buộc phải chọn khách hàng!");
                }
            }

            // Tạo đơn hàng
            $order = Order::create([
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
            ]);

            // Tạo chi tiết đơn hàng
            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            // Ghi nhận công nợ nếu phương thức thanh toán là Ghi nợ
            if ($order->payment_method === 'debt') {
                $customer = Customer::findOrFail($order->customer_id);
                $customer->increment('debt_balance', $order->total_amount);

                \App\Domain\Entities\DebtLog::create([
                    'store_owner_address' => $storeOwner,
                    'customer_id' => $order->customer_id,
                    'order_id' => $order->id,
                    'type' => 'debt',
                    'amount' => $order->total_amount,
                    'note' => "Nợ đơn hàng " . ($order->order_code ?? $order->id),
                    'recorded_at' => now()->toDateString(),
                ]);
            }

            return $order;
        });
    }
}
