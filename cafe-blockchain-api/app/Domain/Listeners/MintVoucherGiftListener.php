<?php

namespace App\Domain\Listeners;

use App\Domain\Events\OrderCompletedEvent;
use App\Domain\Entities\Setting;
use App\Domain\Entities\Customer;
use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class MintVoucherGiftListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(OrderCompletedEvent $event): void
    {
        $order = $event->order;

        if (!$order->customer_id) {
            return;
        }

        $storeOwner = $order->store_owner_address;
        
        // Kiểm tra cấu hình tặng voucher
        $voucherEnabled = Setting::getForStore('voucher_enabled', $storeOwner, '0') === '1';
        if (!$voucherEnabled) {
            return;
        }

        $minGiftAmount = (int)Setting::getForStore('voucher_gift_min_amount', $storeOwner, 100000);
        $originalTotal = $order->total_amount + $order->discount_amount;
        
        if ($originalTotal >= $minGiftAmount) {
            $giftDiscount = (int)Setting::getForStore('voucher_discount_amount', $storeOwner, 5000);
            $useMinAmount = (int)Setting::getForStore('voucher_use_min_amount', $storeOwner, 100000);
            
            $customer = Customer::find($order->customer_id);
            $customerWallet = $customer ? $customer->wallet_address : null;
            $voucherContract = Setting::getForStore('voucher_contract_address', $storeOwner);

            if (!empty($customerWallet) && !empty($voucherContract)) {
                // Tạo mã voucher gắn với mã đơn hàng
                $voucherCode = 'NFT-' . $giftDiscount . '-' . $useMinAmount . '-' . $order->order_code;
                $tokenUri = url("/api/vouchers/metadata/{$voucherCode}");

                // Gọi Relayer thực hiện đúc (mint) NFT trên Blockchain
                $blockchainService = app(BlockchainRelayerServiceInterface::class);
                
                Log::info("Starting async NFT Voucher minting for Order: {$order->order_code}, Customer: {$customerWallet}");
                
                $relayerResult = $blockchainService->mintVoucher(
                    $storeOwner,
                    $customerWallet,
                    $tokenUri,
                    $giftDiscount,
                    $useMinAmount
                );

                if ($relayerResult['success']) {
                    Log::info("Async Minted NFT Voucher successfully with code: {$voucherCode}, TxHash: " . ($relayerResult['txHash'] ?? ''));
                    
                    // Cập nhật token_id được tặng vào DB
                    if (!empty($relayerResult['tokenId'])) {
                        $order->gift_voucher_nft_token_id = (int)$relayerResult['tokenId'];
                        $order->verification_hash = $order->generateVerificationHash();
                        $order->saveQuietly();
                    }
                } else {
                    Log::warning("Async Mint NFT Voucher failed: " . ($relayerResult['error'] ?? 'Unknown error'));
                }
            }
        }
    }
}
