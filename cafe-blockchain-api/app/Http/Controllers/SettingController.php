<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SettingController extends Controller
{
    /**
     * Lấy danh sách cấu hình
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        
        // Nếu chưa có cấu hình nào thì khởi tạo mặc định cho cửa hàng
        if (empty($settings)) {
            $defaultSettings = [
                'store_name' => 'Cafe Web3 POS',
                'primary_color' => '#7c3aed',
                'secondary_color' => '#c084fc',
                'contract_address' => '',
                'finance_contract_address' => '',
                'rpc_url' => '',
                'chain_id' => '',
                'explorer_url' => '',
                'explorer_api_key' => '',
                'default_print_size' => '80mm',
                'voucher_gift_min_amount' => '100000',
                'voucher_discount_amount' => '5000',
                'voucher_use_min_amount' => '100000',
            ];
            
            foreach ($defaultSettings as $key => $value) {
                Setting::setForStore($key, $value, $storeOwner);
            }
            
            $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        } else {
            // Đảm bảo finance_contract_address tồn tại trong kết quả
            if (!isset($settings['finance_contract_address'])) {
                Setting::setForStore('finance_contract_address', '', $storeOwner);
                $settings['finance_contract_address'] = '';
            }

            // Đảm bảo các cấu hình voucher tồn tại trong kết quả
            foreach ([
                'voucher_gift_min_amount' => '100000',
                'voucher_discount_amount' => '5000',
                'voucher_use_min_amount' => '100000'
            ] as $key => $defaultVal) {
                if (!isset($settings[$key])) {
                    Setting::setForStore($key, $defaultVal, $storeOwner);
                    $settings[$key] = $defaultVal;
                }
            }
        }
        
        $settings['has_synced_orders'] = \App\Models\Order::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $settings['has_synced_transactions'] = \App\Models\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        
        return response()->json($settings);
    }

    /**
     * Cập nhật danh sách cấu hình
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $settingsData = $request->validate([
            'store_name' => 'nullable|string|max:255',
            'contract_address' => 'nullable|string|max:255',
            'finance_contract_address' => 'nullable|string|max:255',
            'rpc_url' => 'nullable|string|max:1000',
            'chain_id' => 'nullable|string|max:50',
            'explorer_url' => 'nullable|string|max:1000',
            'explorer_api_key' => 'nullable|string|max:255',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
            'default_print_size' => 'nullable|string|in:80mm,A4,A5',
            'voucher_gift_min_amount' => 'nullable|integer|min:0',
            'voucher_discount_amount' => 'nullable|integer|min:0',
            'voucher_use_min_amount' => 'nullable|integer|min:0',
        ]);

        // Lấy các cấu hình hiện tại trong Database để đối soát bảo mật
        $existingChainId = Setting::getForStore('chain_id', $storeOwner);
        $existingContractAddress = Setting::getForStore('contract_address', $storeOwner);
        $existingFinanceContractAddress = Setting::getForStore('finance_contract_address', $storeOwner);

        // Lấy số lượng đơn hàng và giao dịch tài chính đã đồng bộ thành công lên Blockchain
        $hasSyncedOrders = \App\Models\Order::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $hasSyncedTransactions = \App\Models\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();

        // 1. Logic khóa cứng Mạng Blockchain (Chain ID)
        if (!empty($existingChainId) && isset($settingsData['chain_id']) && $settingsData['chain_id'] !== $existingChainId) {
            return response()->json([
                'message' => 'Mạng Blockchain (Chain ID) đã được thiết lập trước đó và đã bị khóa để đảm bảo tính toàn vẹn tài chính! Không thể thay đổi Chain ID.'
            ], 400);
        }

        // 2. Logic khóa cứng địa chỉ Smart Contract POS linh hoạt (chỉ khóa khi đã có giao dịch thành công)
        if ($hasSyncedOrders && !empty($existingContractAddress) && isset($settingsData['contract_address']) && $settingsData['contract_address'] !== $existingContractAddress) {
            return response()->json([
                'message' => 'Địa chỉ Smart Contract POS đã được sử dụng để đồng bộ đơn hàng lên Blockchain và bị khóa vĩnh viễn! Không thể chỉnh sửa.'
            ], 400);
        }

        // 3. Logic khóa cứng địa chỉ Smart Contract Tài chính linh hoạt (chỉ khóa khi đã có giao dịch thành công)
        if ($hasSyncedTransactions && !empty($existingFinanceContractAddress) && isset($settingsData['finance_contract_address']) && $settingsData['finance_contract_address'] !== $existingFinanceContractAddress) {
            return response()->json([
                'message' => 'Địa chỉ Smart Contract Tài chính đã được sử dụng để đồng bộ giao dịch lên Blockchain và bị khóa vĩnh viễn! Không thể chỉnh sửa.'
            ], 400);
        }

        // 4. Logic kiểm tra chéo RPC Endpoint xem có thuộc đúng Chain ID đang cấu hình hay không
        if (isset($settingsData['rpc_url']) && !empty($settingsData['rpc_url'])) {
            $targetChainId = $existingChainId ?: ($settingsData['chain_id'] ?? null);
            if ($targetChainId) {
                try {
                    $payload = [
                        'jsonrpc' => '2.0',
                        'method' => 'eth_chainId',
                        'params' => [],
                        'id' => 1
                    ];
                    
                    $response = Http::timeout(5)->post($settingsData['rpc_url'], $payload);
                    if ($response->successful()) {
                        $rpcChainIdHex = $response->json('result');
                        if ($rpcChainIdHex) {
                            $rpcChainIdDec = (string)hexdec($rpcChainIdHex);
                            if ($rpcChainIdDec !== (string)$targetChainId) {
                                return response()->json([
                                    'message' => "RPC Endpoint không hợp lệ! Mạng này trả về Chain ID là $rpcChainIdDec, không khớp với Chain ID được cấu hình của cửa hàng là $targetChainId."
                                ], 400);
                            }
                        } else {
                            return response()->json([
                                'message' => 'RPC Endpoint không trả về Chain ID hợp lệ.'
                            ], 400);
                        }
                    } else {
                        return response()->json([
                            'message' => 'Không thể kết nối đến RPC Endpoint được cung cấp. Vui lòng kiểm tra lại URL.'
                        ], 400);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'Lỗi kết nối RPC để kiểm tra Chain ID: ' . $e->getMessage()
                    ], 400);
                }
            }
        }

        // Lưu cấu hình nếu các điều kiện bảo mật được thỏa mãn
        foreach ($settingsData as $key => $value) {
            Setting::setForStore($key, $value ?? '', $storeOwner);
        }

        $updatedSettings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        $updatedSettings['has_synced_orders'] = \App\Models\Order::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $updatedSettings['has_synced_transactions'] = \App\Models\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => $updatedSettings
        ]);
    }
}
