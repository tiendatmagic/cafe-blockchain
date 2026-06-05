<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SettingController extends Controller
{
    /**
     * Khởi tạo và chuẩn hóa cấu hình mặc định cho cửa hàng (Mạng BSC Testnet 97)
     */
    private function ensureDefaultSettings($storeOwner)
    {
        $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        
        $defaultSettings = [
            'store_name' => 'Cafe Web3 POS',
            'primary_color' => '#7c3aed',
            'secondary_color' => '#c084fc',
            'contract_address' => '0xC6b3fc5a2E5Aba0e5a0B6eD8FaCD412A76dC5D2A',
            'finance_contract_address' => '0x7988500670EC631F7be36eD91E367760f380d6Af',
            'voucher_contract_address' => '0xc6828e46E100B248173e28a33e8D92662Cd1A8c7',
            'relayer_private_key' => '',
            'rpc_url' => 'https://bnb-testnet.api.onfinality.io/public',
            'chain_id' => '97',
            'explorer_url' => 'https://testnet.bscscan.com',
            'explorer_api_key' => '',
            'default_print_size' => '80mm',
            'voucher_gift_min_amount' => '100000',
            'voucher_discount_amount' => '5000',
            'voucher_use_min_amount' => '100000',
        ];

        if (empty($settings)) {
            foreach ($defaultSettings as $key => $value) {
                Setting::setForStore($key, $value, $storeOwner);
            }
            $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        } else {
            // Đảm bảo tất cả các key mặc định đều tồn tại trong database
            $changed = false;
            foreach ($defaultSettings as $key => $defaultValue) {
                if (!isset($settings[$key])) {
                    Setting::setForStore($key, $defaultValue, $storeOwner);
                    $settings[$key] = $defaultValue;
                    $changed = true;
                }
            }
            if ($changed) {
                $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
            }
        }

        return $settings;
    }

    /**
     * Lấy danh sách cấu hình
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $settings = $this->ensureDefaultSettings($storeOwner);
        
        $settings['has_synced_orders'] = \App\Models\Order::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $settings['has_synced_transactions'] = \App\Models\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        
        // Ẩn Private Key thô trước khi gửi về client, chỉ trả về flag boolean trạng thái đã cấu hình
        $settings['has_relayer_private_key'] = !empty($settings['relayer_private_key'] ?? '');
        unset($settings['relayer_private_key']);

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
            'voucher_contract_address' => 'nullable|string|max:255',
            'relayer_private_key' => 'nullable|string|max:255',
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
            if ($key === 'relayer_private_key') {
                if (!empty($value)) {
                    // Mã hóa khóa bí mật bằng AES-256 (sử dụng APP_KEY của Laravel)
                    $encryptedValue = \Illuminate\Support\Facades\Crypt::encryptString($value);
                    Setting::setForStore($key, $encryptedValue, $storeOwner);
                }
                // Nếu rỗng, bỏ qua để giữ nguyên khóa cũ đã mã hóa trong database
                continue;
            }
            Setting::setForStore($key, $value ?? '', $storeOwner);
        }

        $updatedSettings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        $updatedSettings['has_synced_orders'] = \App\Models\Order::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $updatedSettings['has_synced_transactions'] = \App\Models\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();

        // Ẩn Private Key thô trước khi phản hồi
        $updatedSettings['has_relayer_private_key'] = !empty($updatedSettings['relayer_private_key'] ?? '');
        unset($updatedSettings['relayer_private_key']);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => $updatedSettings
        ]);
    }

    /**
     * Lấy cấu hình public của quán dựa vào mã hóa đơn (order_code)
     */
    public function getPublicSettings(Request $request)
    {
        $orderCode = $request->query('order_code');
        if (empty($orderCode)) {
            return response()->json(['message' => 'Thiếu mã hóa đơn!'], 400);
        }

        // Tìm đơn hàng để lấy store_owner_address của quán
        $order = \App\Models\Order::where('order_code', $orderCode)->first();
        $tempOrderData = null;

        if (!$order) {
            // Thử tìm trong bảng voucher_signatures xem có thông tin tạm thời không
            $sigRecord = \Illuminate\Support\Facades\DB::table('voucher_signatures')->where('order_code', $orderCode)->first();
            if ($sigRecord && !empty($sigRecord->store_owner_address)) {
                $storeOwner = strtolower($sigRecord->store_owner_address);
                $tempOrderData = !empty($sigRecord->temp_order_data) ? json_decode($sigRecord->temp_order_data, true) : null;
            } else {
                return response()->json(['message' => 'Không tìm thấy đơn hàng tương ứng!'], 404);
            }
        } else {
            $storeOwner = strtolower($order->store_owner_address);
            
            // Nếu đơn hàng đã lưu thực tế, gom thông tin chi tiết hóa đơn
            $orderItems = \Illuminate\Support\Facades\DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->where('order_items.order_id', $order->id)
                ->select('products.name as product_name', 'product_variants.variant_name as variant_name', 'order_items.quantity', 'order_items.price')
                ->get();
                
            $tempOrderData = [
                'table_number' => $order->table_number,
                'payment_method' => $order->payment_method,
                'total_amount' => $order->total_amount + $order->discount_amount, // Giá gốc trước giảm
                'discount_amount' => $order->discount_amount,
                'final_amount' => $order->total_amount,
                'items' => $orderItems
            ];
        }

        $settings = $this->ensureDefaultSettings($storeOwner);

        // Chỉ trả về các cấu hình an toàn cho client
        $publicSettings = [
            'store_name' => $settings['store_name'] ?? 'Cafe Web3 POS',
            'primary_color' => $settings['primary_color'] ?? '#7c3aed',
            'secondary_color' => $settings['secondary_color'] ?? '#c084fc',
            'contract_address' => $settings['contract_address'] ?? '',
            'finance_contract_address' => $settings['finance_contract_address'] ?? '',
            'voucher_contract_address' => $settings['voucher_contract_address'] ?? '',
            'rpc_url' => $settings['rpc_url'] ?? '',
            'chain_id' => $settings['chain_id'] ?? '',
            'explorer_url' => $settings['explorer_url'] ?? '',
            'temp_order' => $tempOrderData, // Trả về thông tin đơn hàng tạm thời/thực tế để client hiển thị
            'order_status' => $order ? $order->status : null,
            'blockchain_status' => $order ? $order->blockchain_status : null,
            'tx_hash' => $order ? $order->tx_hash : null,
        ];

        return response()->json($publicSettings);
    }
}
