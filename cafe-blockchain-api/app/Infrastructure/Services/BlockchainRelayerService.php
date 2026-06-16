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
                return ['success' => false, 'error' => 'Error decrypting store relayer wallet key: ' . $e->getMessage()];
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'NFT Voucher contract address is not configured for the store!'];
        }

        if (empty($privateKey)) {
            return ['success' => false, 'error' => 'Relayer wallet private key is not configured for the store in the database!'];
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
            return ['success' => false, 'error' => 'NFT Voucher contract address is not configured for the store!'];
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
                return ['success' => false, 'error' => 'Error decrypting store relayer wallet key: ' . $e->getMessage()];
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'NFT Voucher contract address is not configured for the store!'];
        }

        if (empty($privateKey)) {
            return ['success' => false, 'error' => 'Relayer wallet private key is not configured for the store in the database!'];
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
                return ['success' => false, 'error' => 'Error decrypting relayer wallet key: ' . $e->getMessage()];
            }
        }

        if (empty($contractAddress)) {
            return ['success' => false, 'error' => 'NFT Voucher contract address is not configured for the store!'];
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
        
        $nodeBinary = $this->getNodeBinary();
        $scriptPath = base_path('bin/relayer.bundle.cjs');
        $command = "{$nodeBinary} {$scriptPath} {$base64Payload} 2>&1";

        try {
            $output = null;
            if (function_exists('shell_exec')) {
                $output = \shell_exec($command);
            } elseif (function_exists('exec')) {
                $results = [];
                \exec($command, $results);
                $output = implode("\n", $results);
            } elseif (function_exists('system')) {
                ob_start();
                \system($command);
                $output = ob_get_clean();
            } elseif (function_exists('passthru')) {
                ob_start();
                \passthru($command);
                $output = ob_get_clean();
            } else {
                return [
                    'success' => false,
                    'error' => 'System execution functions (shell_exec, exec, system, passthru) are disabled on your hosting for security reasons.'
                ];
            }
            
            if (empty($output)) {
                return [
                    'success' => false,
                    'error' => 'No response received from the Blockchain Relayer Node.js process.'
                ];
            }

            $result = json_decode($output, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Blockchain Relayer raw output error: ' . $output);
                return [
                    'success' => false,
                    'error' => 'Relayer response format error: ' . substr($output, 0, 300)
                ];
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Blockchain Relayer Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Relayer execution error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Dò tìm đường dẫn thực thi của lệnh node trên hệ thống
     */
    private function getNodeBinary(): string
    {
        // 1. Ưu tiên cấu hình trong .env
        $envNode = env('NODE_BINARY');
        if (!empty($envNode)) {
            return $envNode;
        }

        // 1.5. Kiểm tra xem có Node.js Standalone/Portable đi kèm trong thư mục dự án không
        if (PHP_OS_FAMILY === 'Windows') {
            $portablePath = base_path('bin/node-bin/node.exe');
            if (is_file($portablePath)) {
                return $portablePath;
            }
        } else {
            $portablePath = base_path('bin/node-bin/node');
            if (is_file($portablePath)) {
                if (!is_executable($portablePath)) {
                    @chmod($portablePath, 0755);
                }
                return $portablePath;
            }
        }

        // 2. Kiểm tra xem lệnh 'node' mặc định có hoạt động không
        $testCmd = PHP_OS_FAMILY === 'Windows' ? 'where node' : 'which node';
        $path = null;
        try {
            if (function_exists('shell_exec')) {
                $path = trim(\shell_exec($testCmd));
            } elseif (function_exists('exec')) {
                $results = [];
                \exec($testCmd, $results);
                $path = trim(implode('', $results));
            }
        } catch (\Exception $e) {
            // Bỏ qua lỗi
        }

        if (!empty($path) && !str_contains($path, 'not found') && !str_contains($path, 'no node in')) {
            return $path;
        }

        // 3. Nếu là Linux, dò tìm các đường dẫn tuyệt đối phổ biến của Node
        if (PHP_OS_FAMILY !== 'Windows') {
            $commonPaths = [
                '/usr/local/bin/node',
                '/usr/bin/node',
                '/opt/node/bin/node',
                '/opt/nodejs/bin/node',
                '/usr/share/node/bin/node',
            ];

            // Trích xuất thư mục home của user chạy hosting
            $home = $_SERVER['HOME'] ?? getenv('HOME');
            if (empty($home)) {
                $basePath = base_path();
                if (str_starts_with($basePath, '/home/')) {
                    $parts = explode('/', $basePath);
                    if (count($parts) >= 3) {
                        $home = '/' . $parts[1] . '/' . $parts[2];
                    }
                }
            }

            if (!empty($home)) {
                // Dò tìm các thư mục phiên bản node trong thư mục .nvm của NVM
                $nvmDir = $home . '/.nvm/versions/node';
                if (is_dir($nvmDir)) {
                    $versions = scandir($nvmDir);
                    if ($versions !== false) {
                        foreach ($versions as $version) {
                            if ($version !== '.' && $version !== '..') {
                                $nvmPath = "{$nvmDir}/{$version}/bin/node";
                                if (is_file($nvmPath) && is_executable($nvmPath)) {
                                    return $nvmPath;
                                }
                            }
                        }
                    }
                }
            }

            foreach ($commonPaths as $p) {
                if (is_file($p) && is_executable($p)) {
                    return $p;
                }
            }
        }

        // Mặc định trả về 'node'
        return 'node';
    }
}
