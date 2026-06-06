<?php

namespace App\Infrastructure\Services;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Domain\Entities\Setting;
use Illuminate\Support\Facades\Log;

class BlockchainRelayerService implements BlockchainRelayerServiceInterface
{
    /**
     * Thực hiện đúc (mint) một NFT Voucher mới
     *
     * @param string $storeOwnerAddress Địa chỉ ví của chủ quán để lấy cấu hình RPC/Contract
     * @param string $toAddress Địa chỉ ví của khách hàng nhận NFT
     * @param string $tokenUri Đường dẫn metadata JSON của NFT
     * @param int $discountAmount Số tiền giảm giá của voucher (ví dụ 5000)
     * @param int $minOrderAmount Số tiền tối thiểu của hóa đơn để sử dụng (ví dụ 100000)
     * @return array Mảng chứa thông tin kết quả (success, txHash, tokenId)
     */
    public function mintVoucher(string $storeOwnerAddress, string $toAddress, string $tokenUri, int $discountAmount, int $minOrderAmount): array
    {
        $contractAddress = Setting::getForStore('voucher_contract_address', $storeOwnerAddress);
        $rpcUrl = Setting::getForStore('rpc_url', $storeOwnerAddress, 'https://ethereum-sepolia.publicnode.com');
        
        $encryptedKey = Setting::getForStore('relayer_private_key', $storeOwnerAddress);
        $privateKey = null;
        if (!empty($encryptedKey)) {
            try {
                $privateKey = \Illuminate\Support\Facades\Crypt::decryptString($encryptedKey);
            } catch (\Exception $e) {
                return ['success' => false, 'error' => 'Lỗi giải mã khóa ví Relayer của quán: ' . $e->getMessage()];
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'Chưa cấu hình hợp đồng NFT Voucher cho quán!'];
        }

        if (empty($privateKey)) {
            return ['success' => false, 'error' => 'Chưa cấu hình khóa ví Relayer (relayer_private_key) cho quán trong cơ sở dữ liệu!'];
        }

        $payload = [
            'action' => 'mint',
            'privateKey' => $privateKey,
            'rpcUrl' => $rpcUrl,
            'contractAddress' => $contractAddress,
            'to' => $toAddress,
            'tokenUri' => $tokenUri,
            'discountAmount' => $discountAmount,
            'minOrderAmount' => $minOrderAmount
        ];

        return $this->executeRelayer($payload);
    }

    /**
     * Kiểm tra xem Voucher NFT cho mã đơn hàng này đã được đúc on-chain hay chưa
     */
    public function checkVoucherMinted(string $storeOwnerAddress, string $customerAddress, string $orderCode): array
    {
        $contractAddress = Setting::getForStore('voucher_contract_address', $storeOwnerAddress);
        $rpcUrl = Setting::getForStore('rpc_url', $storeOwnerAddress, 'https://ethereum-sepolia.publicnode.com');
        
        $encryptedKey = Setting::getForStore('relayer_private_key', $storeOwnerAddress);
        $privateKey = null;
        if (!empty($encryptedKey)) {
            try {
                $privateKey = \Illuminate\Support\Facades\Crypt::decryptString($encryptedKey);
            } catch (\Exception $e) {
                // Bỏ qua lỗi giải mã vì check view không bắt buộc dùng khóa Relayer thật
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'Chưa cấu hình hợp đồng NFT Voucher cho quán!'];
        }

        $payload = [
            'action' => 'checkMinted',
            'privateKey' => $privateKey ?: '0x0000000000000000000000000000000000000000000000000000000000000000',
            'rpcUrl' => $rpcUrl,
            'contractAddress' => $contractAddress,
            'to' => $customerAddress,
            'orderCode' => $orderCode
        ];

        return $this->executeRelayer($payload);
    }

    /**
     * Thực hiện quy đổi và tiêu hủy (burn) voucher NFT sử dụng chữ ký số EIP-712
     */
    public function useVoucher(string $storeOwnerAddress, int $tokenId, string $orderCode, string $signature): array
    {
        $contractAddress = Setting::getForStore('voucher_contract_address', $storeOwnerAddress);
        $rpcUrl = Setting::getForStore('rpc_url', $storeOwnerAddress, 'https://ethereum-sepolia.publicnode.com');
        
        $encryptedKey = Setting::getForStore('relayer_private_key', $storeOwnerAddress);
        $privateKey = null;
        if (!empty($encryptedKey)) {
            try {
                $privateKey = \Illuminate\Support\Facades\Crypt::decryptString($encryptedKey);
            } catch (\Exception $e) {
                return ['success' => false, 'error' => 'Lỗi giải mã khóa ví Relayer của quán: ' . $e->getMessage()];
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'Chưa cấu hình hợp đồng NFT Voucher cho quán!'];
        }

        if (empty($privateKey)) {
            return ['success' => false, 'error' => 'Chưa cấu hình khóa ví Relayer (relayer_private_key) cho quán trong cơ sở dữ liệu!'];
        }

        $payload = [
            'action' => 'burn',
            'privateKey' => $privateKey,
            'rpcUrl' => $rpcUrl,
            'contractAddress' => $contractAddress,
            'tokenId' => $tokenId,
            'orderCode' => $orderCode,
            'signature' => $signature
        ];

        return $this->executeRelayer($payload);
    }

    /**
     * Truy vấn thông tin chi tiết của một NFT Voucher trực tiếp on-chain
     */
    public function getVoucher(string $storeOwnerAddress, int $tokenId): array
    {
        $contractAddress = Setting::getForStore('voucher_contract_address', $storeOwnerAddress);
        $rpcUrl = Setting::getForStore('rpc_url', $storeOwnerAddress, 'https://ethereum-sepolia.publicnode.com');
        
        $encryptedKey = Setting::getForStore('relayer_private_key', $storeOwnerAddress);
        $privateKey = null;
        if (!empty($encryptedKey)) {
            try {
                $privateKey = \Illuminate\Support\Facades\Crypt::decryptString($encryptedKey);
            } catch (\Exception $e) {
                return ['success' => false, 'error' => 'Lỗi giải mã khóa ví Relayer: ' . $e->getMessage()];
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'Chưa cấu hình hợp đồng NFT Voucher cho quán!'];
        }

        $payload = [
            'action' => 'getVoucher',
            'privateKey' => $privateKey ?: '0x0000000000000000000000000000000000000000000000000000000000000000',
            'rpcUrl' => $rpcUrl,
            'contractAddress' => $contractAddress,
            'tokenId' => $tokenId
        ];

        return $this->executeRelayer($payload);
    }

    /**
     * Thực thi lệnh NodeJS để chạy relayer.js
     */
    private function executeRelayer(array $payload): array
    {
        $jsonPayload = json_encode($payload);
        $base64Payload = base64_encode($jsonPayload);
        
        $scriptPath = base_path('bin/relayer.cjs');
        $command = "node {$scriptPath} {$base64Payload} 2>&1";

        try {
            $output = shell_exec($command);
            
            if (empty($output)) {
                return [
                    'success' => false,
                    'error' => 'Không nhận được phản hồi từ tiến trình Blockchain Relayer Node.js.'
                ];
            }

            $result = json_decode($output, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Blockchain Relayer raw output error: ' . $output);
                return [
                    'success' => false,
                    'error' => 'Lỗi định dạng phản hồi từ Relayer: ' . substr($output, 0, 300)
                ];
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Blockchain Relayer Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Lỗi thực thi Relayer: ' . $e->getMessage()
            ];
        }
    }
}
