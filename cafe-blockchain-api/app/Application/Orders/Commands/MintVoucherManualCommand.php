<?php

namespace App\Application\Orders\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Infrastructure\Persistence\Mappers\OrderMapper;
use App\Domain\Entities\Setting;
use App\Domain\Entities\Customer;

class MintVoucherManualCommand
{
    protected BlockchainRelayerServiceInterface $blockchainService;

    public function __construct(BlockchainRelayerServiceInterface $blockchainService)
    {
        $this->blockchainService = $blockchainService;
    }

    public function execute(string $storeOwner, int|string $id): OrderModel
    {
        $voucherEnabled = Setting::getForStore('voucher_enabled', $storeOwner, '0') === '1';
        if (!$voucherEnabled) {
            throw new \Exception("The store's NFT Voucher program is currently disabled!");
        }

        $order = OrderModel::where('store_owner_address', $storeOwner)->with('customer')->findOrFail($id);

        if ($order->status !== 'completed' && $order->status !== 'cancelled') {
            throw new \Exception("Vouchers can only be gifted or returned for completed or cancelled orders!");
        }

        if ($order->status === 'completed' && $order->blockchain_status !== 'success') {
            throw new \Exception("Vouchers can only be gifted for completed orders after successful blockchain synchronization!");
        }

        if ($order->status === 'cancelled' && $order->voucher_nft_token_id === null) {
            throw new \Exception("This cancelled order did not apply any NFT Voucher, cannot refund!");
        }

        if ($order->gift_voucher_nft_token_id !== null) {
            $message = $order->status === 'cancelled' 
                ? "This order has already been refunded an NFT Voucher (Token ID: " . $order->gift_voucher_nft_token_id . ")."
                : "This order has already been gifted an NFT Voucher (Token ID: " . $order->gift_voucher_nft_token_id . ").";
            throw new \Exception($message);
        }

        if (!$order->customer || empty($order->customer->wallet_address)) {
            throw new \Exception("The customer of this order is not linked to a Web3 wallet!");
        }

        $giftDiscount = (int)Setting::getForStore('voucher_discount_amount', $storeOwner, 5000);
        $useMinAmount = (int)Setting::getForStore('voucher_use_min_amount', $storeOwner, 100000);

        if ($order->status === 'completed') {
            $minGiftAmount = (int)Setting::getForStore('voucher_gift_min_amount', $storeOwner, 100000);
            $originalTotal = $order->total_amount + $order->discount_amount;
            if ($originalTotal < $minGiftAmount) {
                throw new \Exception("The order total has not reached the minimum value of " . number_format($minGiftAmount) . " VND to receive a voucher!");
            }
        } else {
            // Trường hợp cancelled: Lấy lại thông tin của voucher đã áp dụng
            try {
                $relayerGet = $this->blockchainService->getVoucher($storeOwner, (int)$order->voucher_nft_token_id);
                if ($relayerGet['success']) {
                    $giftDiscount = (int)$relayerGet['discountAmount'];
                    $useMinAmount = (int)$relayerGet['minOrderAmount'];
                }
            } catch (\Exception $e) {
                $giftDiscount = $order->discount_amount ?: $giftDiscount;
            }
        }

        $customerWallet = $order->customer->wallet_address;

        // Chống mint trùng: Gọi Relayer checkMinted on-chain trước
        $checkResult = $this->blockchainService->checkVoucherMinted(
            $storeOwner,
            $customerWallet,
            $order->order_code
        );

        if ($checkResult['success'] && $checkResult['exists']) {
            $order->gift_voucher_nft_token_id = (int)$checkResult['tokenId'];
            $orderEntity = OrderMapper::toDomain($order);
            $order->verification_hash = $orderEntity->generateVerificationHash();
            $order->saveQuietly();
            return $order;
        }

        // Tiến hành đúc Voucher NFT mới
        $voucherCode = 'NFT-' . $giftDiscount . '-' . $useMinAmount . '-' . $order->order_code;
        $tokenUri = url("/api/vouchers/metadata/{$voucherCode}");

        $relayerResult = $this->blockchainService->mintVoucher(
            $storeOwner,
            $customerWallet,
            $tokenUri,
            $giftDiscount,
            $useMinAmount
        );

        if (!$relayerResult['success']) {
            throw new \Exception("Cannot mint NFT Voucher via Blockchain Relayer: " . ($relayerResult['error'] ?? 'Unknown error'));
        }

        $tokenId = isset($relayerResult['tokenId']) ? (int)$relayerResult['tokenId'] : null;
        if ($tokenId) {
            $order->gift_voucher_nft_token_id = $tokenId;
            $orderEntity = OrderMapper::toDomain($order);
            $order->verification_hash = $orderEntity->generateVerificationHash();
            $order->saveQuietly();
        }

        return $order;
    }
}
