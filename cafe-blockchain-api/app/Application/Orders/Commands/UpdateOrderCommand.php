<?php

namespace App\Application\Orders\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Domain\Entities\Order;
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

    public function execute(string $storeOwner, int|string $id, array $data): Order
    {
        $order = Order::where('store_owner_address', $storeOwner)->findOrFail($id);

        if ($order->status !== 'pending') {
            throw new \Exception("Chỉ có thể chỉnh sửa đơn hàng đang ở trạng thái chờ (pending)!");
        }

        if ($order->blockchain_status !== 'none') {
            throw new \Exception("Không thể chỉnh sửa đơn hàng đã được đồng bộ lên Blockchain!");
        }

        return DB::transaction(function () use ($storeOwner, $order, $data) {
            $totalAmount = 0;
            $itemsData = [];

            foreach ($data['items'] as $item) {
                $product = Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                
                $price = $product->price;
                $variantId = $item['product_variant_id'] ?? null;

                if ($variantId) {
                    $variant = $product->variants()->where('id', $variantId)->first();
                    if ($variant) {
                        $price = $variant->price;
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
                    'note' => $item['note'] ?? null,
                ];
            }

            $discountAmount = 0;
            $voucherNftTokenId = $data['voucher_nft_token_id'] ?? null;
            $voucherNftSignature = $data['voucher_nft_signature'] ?? null;
            $relayerResult = null;

            if ($order->voucher_nft_token_id !== null) {
                if ($voucherNftTokenId !== null && (int)$voucherNftTokenId !== (int)$order->voucher_nft_token_id) {
                    throw new \Exception("Không thể thay đổi NFT Voucher đã được áp dụng và tiêu hủy cho đơn hàng này!");
                }
                $discountAmount = $order->discount_amount;
                $voucherNftTokenId = $order->voucher_nft_token_id;
            } elseif ($voucherNftTokenId !== null && !empty($voucherNftSignature)) {
                $customer = null;
                if (!empty($data['customer_id'])) {
                    $customer = Customer::find($data['customer_id']);
                }

                if (!$customer || empty($customer->wallet_address)) {
                    throw new \Exception("NFT Voucher chỉ áp dụng cho khách hàng có liên kết ví EVM!");
                }

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

                $relayerResult = $this->blockchainService->useVoucher(
                    $storeOwner,
                    (int)$voucherNftTokenId,
                    $order->order_code,
                    $voucherNftSignature
                );

                if (!$relayerResult['success']) {
                    throw new \Exception("Không thể quy đổi NFT Voucher trên Blockchain: " . ($relayerResult['error'] ?? 'Lỗi không xác định'));
                }

                $discountAmount = (int)$relayerGet['discountAmount'];

                DB::table('voucher_signatures')->where('order_code', $order->order_code)->delete();
            }

            $finalTotalAmount = max(0, $totalAmount - $discountAmount);

            $order->update([
                'table_number' => $data['table_number'] ?? null,
                'customer_id' => $data['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $data['payment_method'],
                'tx_hash' => isset($relayerResult['txHash']) ? $relayerResult['txHash'] : $order->tx_hash,
            ]);

            $order->items()->delete();

            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            return $order;
        });
    }
}
