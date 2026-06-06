<?php

namespace App\Application\Common\Interfaces;

interface BlockchainRelayerServiceInterface
{
    /**
     * Thực hiện đúc (mint) một NFT Voucher mới
     *
     * @param string $storeOwnerAddress Địa chỉ ví của chủ quán để lấy cấu hình RPC/Contract
     * @param string $toAddress Địa chỉ ví của khách hàng nhận NFT
     * @param string $tokenUri Đường dẫn metadata JSON của NFT
     * @param int $discountAmount Số tiền giảm giá của voucher
     * @param int $minOrderAmount Số tiền tối thiểu của hóa đơn để sử dụng
     * @return array Mảng chứa thông tin kết quả (success, txHash, tokenId)
     */
    public function mintVoucher(string $storeOwnerAddress, string $toAddress, string $tokenUri, int $discountAmount, int $minOrderAmount): array;

    /**
     * Kiểm tra xem Voucher NFT cho mã đơn hàng này đã được đúc on-chain hay chưa
     */
    public function checkVoucherMinted(string $storeOwnerAddress, string $customerAddress, string $orderCode): array;

    /**
     * Thực hiện quy đổi và tiêu hủy (burn) voucher NFT sử dụng chữ ký số EIP-712
     */
    public function useVoucher(string $storeOwnerAddress, int $tokenId, string $orderCode, string $signature): array;

    /**
     * Truy vấn thông tin chi tiết của một NFT Voucher trực tiếp on-chain
     */
    public function getVoucher(string $storeOwnerAddress, int $tokenId): array;
}
