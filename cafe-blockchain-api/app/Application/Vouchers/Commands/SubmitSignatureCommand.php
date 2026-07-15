<?php

namespace App\Application\Vouchers\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Domain\Entities\OrderItem;
use Illuminate\Support\Facades\DB;

class SubmitSignatureCommand
{
    protected BlockchainRelayerServiceInterface $blockchainService;

    public function __construct(BlockchainRelayerServiceInterface $blockchainService)
    {
        $this->blockchainService = $blockchainService;
    }

    public function execute(string $orderCode, string $signature): bool
    {
        $sigRecord = DB::table('voucher_signatures')
            ->where('order_code', $orderCode)
            ->first();

        if (!$sigRecord) {
            throw new \Exception("No signature request found for this invoice!", 404);
        }

        if ($sigRecord->status === 'signed') {
            throw new \Exception("This invoice has already been signed and finalized!", 400);
        }

        return DB::transaction(function () use ($sigRecord, $orderCode, $signature) {
            $storeOwner = strtolower($sigRecord->store_owner_address);
            $voucherNftTokenId = (int)$sigRecord->token_id;

            // 1. Thực hiện quy đổi (burn) NFT Voucher trên Blockchain thông qua Relayer
            $relayerResult = $this->blockchainService->useVoucher(
                $storeOwner,
                $voucherNftTokenId,
                $orderCode,
                $signature
            );

            if (!$relayerResult['success']) {
                throw new \Exception("Cannot redeem NFT Voucher on the blockchain: " . ($relayerResult['error'] ?? 'Unknown error'));
            }

            // 2. Tự động tạo đơn hàng chính thức từ temp_order_data
            $tempOrderData = !empty($sigRecord->temp_order_data) ? json_decode($sigRecord->temp_order_data, true) : null;
            if (empty($tempOrderData) || empty($tempOrderData['items'])) {
                throw new \Exception("Temporary cart data is invalid or has been deleted!");
            }

            $discountAmount = (int)($tempOrderData['discount_amount'] ?? 0);
            $finalTotalAmount = (float)($tempOrderData['final_amount'] ?? 0);

            // Tạo đơn hàng
            $order = OrderModel::create([
                'id' => (string) \Illuminate\Support\Str::uuid7(),
                'order_code' => $orderCode,
                'table_number' => $tempOrderData['table_number'] ?? null,
                'customer_id' => $tempOrderData['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $tempOrderData['payment_method'] ?? 'cash',
                'status' => 'pending',
                'tx_hash' => $relayerResult['txHash'] ?? null,
                'blockchain_status' => 'none',
                'store_owner_address' => $storeOwner,
            ]);

            // Tạo các chi tiết món ăn
            foreach ($tempOrderData['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'note' => $item['note'] ?? null,
                ]);
            }

            // 3. Cập nhật chữ ký số và chuyển trạng thái yêu cầu sang signed
            DB::table('voucher_signatures')
                ->where('order_code', $orderCode)
                ->update([
                    'signature' => $signature,
                    'status' => 'signed',
                    'updated_at' => now()
                ]);

            return true;
        });
    }
}
