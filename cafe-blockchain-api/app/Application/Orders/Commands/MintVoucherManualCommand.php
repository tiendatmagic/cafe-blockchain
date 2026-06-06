<?php

namespace App\Application\Orders\Commands;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Domain\Entities\Order;
use App\Domain\Entities\Setting;
use App\Domain\Entities\Customer;

class MintVoucherManualCommand
{
    protected BlockchainRelayerServiceInterface $blockchainService;

    public function __construct(BlockchainRelayerServiceInterface $blockchainService)
    {
        $this->blockchainService = $blockchainService;
    }

    public function execute(string $storeOwner, int|string $id): Order
    {
        $order = Order::where('store_owner_address', $storeOwner)->with('customer')->findOrFail($id);

        if ($order->status !== 'completed') {
            throw new \Exception("Chỉ có thể tặng voucher cho đơn hàng đã hoàn thành!");
        }

        if ($order->blockchain_status !== 'success') {
            throw new \Exception("Chỉ có thể tặng voucher cho đơn hàng đã đồng bộ blockchain thành công!");
        }

        if ($order->gift_voucher_nft_token_id !== null) {
            throw new \Exception("Đơn hàng này đã được tặng Voucher NFT rồi (Token ID: " . $order->gift_voucher_nft_token_id . ").");
        }

        if (!$order->customer || empty($order->customer->wallet_address)) {
            throw new \Exception("Khách hàng của đơn hàng này không liên kết ví Web3!");
        }

        $minGiftAmount = (int)Setting::getForStore('voucher_gift_min_amount', $storeOwner, 100000);
        $originalTotal = $order->total_amount + $order->discount_amount;
        if ($originalTotal < $minGiftAmount) {
            throw new \Exception("Đơn hàng chưa đạt giá trị tối thiểu " . number_format($minGiftAmount) . "đ để được tặng voucher!");
        }

        $giftDiscount = (int)Setting::getForStore('voucher_discount_amount', $storeOwner, 5000);
        $useMinAmount = (int)Setting::getForStore('voucher_use_min_amount', $storeOwner, 100000);
        $customerWallet = $order->customer->wallet_address;

        // Chống mint trùng: Gọi Relayer checkMinted on-chain trước
        $checkResult = $this->blockchainService->checkVoucherMinted(
            $storeOwner,
            $customerWallet,
            $order->order_code
        );

        if ($checkResult['success'] && $checkResult['exists']) {
            $order->gift_voucher_nft_token_id = (int)$checkResult['tokenId'];
            $order->verification_hash = $order->generateVerificationHash();
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
            throw new \Exception("Không thể đúc Voucher NFT qua Blockchain Relayer: " . ($relayerResult['error'] ?? 'Lỗi không xác định'));
        }

        $tokenId = isset($relayerResult['tokenId']) ? (int)$relayerResult['tokenId'] : null;
        if ($tokenId) {
            $order->gift_voucher_nft_token_id = $tokenId;
            $order->verification_hash = $order->generateVerificationHash();
            $order->saveQuietly();
        }

        return $order;
    }
}
