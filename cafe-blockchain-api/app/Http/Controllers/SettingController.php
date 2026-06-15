<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Application\Orders\Commands\CreateOrderCommand;
use Illuminate\Support\Facades\Cache;


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
            'menu_registry_contract_address' => '',
            'relayer_private_key' => '',
            'rpc_url' => 'https://bsc-testnet.rpc.sentio.xyz',
            'chain_id' => '97',
            'explorer_url' => 'https://testnet.bscscan.com',
            'explorer_api_key' => '',
            'default_print_size' => '80mm',
            'voucher_gift_min_amount' => '100000',
            'voucher_discount_amount' => '5000',
            'voucher_use_min_amount' => '100000',
            'show_crypto_payment' => '0',
            'voucher_enabled' => '0',
            'has_synced_menu' => '0',
            'website_slug' => '',
            'store_categories' => '',
            'website_cover_image' => '',
            'store_status' => '0',
            'shipping_fee_flat_enabled' => '0',
            'shipping_fee_flat_amount' => '0',
            'shipping_fee_free_enabled' => '0',
            'shipping_fee_free_min_amount' => '0',
            'website_avatar_image' => '',
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

        $settings['has_synced_orders'] = \App\Infrastructure\Persistence\Eloquent\OrderModel::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $settings['has_synced_transactions'] = \App\Domain\Entities\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();

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
            'menu_registry_contract_address' => 'nullable|string|max:255',
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
            'show_crypto_payment' => 'nullable|string|in:0,1',
            'voucher_enabled' => 'nullable|string|in:0,1',
            'has_synced_menu' => 'nullable|string|in:0,1',
            'website_slug' => 'nullable|string|max:100',
            'store_categories' => 'nullable|string',
            'website_cover_image' => 'nullable|string|max:1000',
            'store_status' => 'nullable|string|in:0,1',
            'shipping_fee_flat_enabled' => 'nullable|string|in:0,1',
            'shipping_fee_flat_amount' => 'nullable|integer|min:0',
            'shipping_fee_free_enabled' => 'nullable|string|in:0,1',
            'shipping_fee_free_min_amount' => 'nullable|integer|min:0',
            'website_avatar_image' => 'nullable|string|max:1000',
        ]);

        // Lấy các cấu hình hiện tại trong Database để đối soát bảo mật
        $existingChainId = Setting::getForStore('chain_id', $storeOwner);
        $existingContractAddress = Setting::getForStore('contract_address', $storeOwner);
        $existingFinanceContractAddress = Setting::getForStore('finance_contract_address', $storeOwner);
        $existingMenuRegistryContractAddress = Setting::getForStore('menu_registry_contract_address', $storeOwner);
        $hasSyncedMenu = Setting::getForStore('has_synced_menu', $storeOwner) === '1';

        // Xử lý logic cho website_slug
        $slugInput = isset($settingsData['website_slug']) ? trim($settingsData['website_slug']) : '';
        $currentSlug = Setting::getForStore('website_slug', $storeOwner);

        if (!empty($slugInput)) {
            // Làm sạch slug và chuyển sang không dấu
            $processedSlug = Str::slug($this->removeVietnameseAccents($slugInput), '-');

            // Kiểm tra trùng lặp trên hệ thống
            $existing = Setting::where('key', 'website_slug')
                ->where('value', $processedSlug)
                ->where('store_owner_address', '!=', $storeOwner)
                ->exists();
            if ($existing) {
                return response()->json([
                    'message' => 'Slug website đã được sử dụng bởi quán khác, vui lòng chọn slug khác!'
                ], 400);
            }
            $settingsData['website_slug'] = $processedSlug;
        } else {
            if (!empty($currentSlug)) {
                $settingsData['website_slug'] = $currentSlug;
            } else {
                $storeName = $settingsData['store_name'] ?? Setting::getForStore('store_name', $storeOwner, 'Cafe Web3 POS');
                $baseSlug = Str::slug($this->removeVietnameseAccents($storeName), '-');
                if (empty($baseSlug)) {
                    $baseSlug = 'cafe-web3';
                }

                do {
                    $processedSlug = $baseSlug . '-' . strtolower(Str::random(4));
                    $exists = Setting::where('key', 'website_slug')
                        ->where('value', $processedSlug)
                        ->where('store_owner_address', '!=', $storeOwner)
                        ->exists();
                } while ($exists);

                $settingsData['website_slug'] = $processedSlug;
            }
        }


        // Lấy số lượng đơn hàng và giao dịch tài chính đã đồng bộ thành công lên Blockchain
        $hasSyncedOrders = \App\Infrastructure\Persistence\Eloquent\OrderModel::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $hasSyncedTransactions = \App\Domain\Entities\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();

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

        // 4. Logic khóa cứng địa chỉ Smart Contract Menu Registry linh hoạt (chỉ khóa khi đã đồng bộ thực đơn thành công)
        if ($hasSyncedMenu && !empty($existingMenuRegistryContractAddress) && isset($settingsData['menu_registry_contract_address']) && $settingsData['menu_registry_contract_address'] !== $existingMenuRegistryContractAddress) {
            return response()->json([
                'message' => 'Địa chỉ Smart Contract Menu Registry đã được sử dụng để đồng bộ thực đơn lên Blockchain và bị khóa vĩnh viễn! Không thể chỉnh sửa.'
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

        // Giải phóng cache storefront của quán khi đổi cài đặt
        Setting::clearStorefrontCache($storeOwner);

        $updatedSettings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        $updatedSettings['has_synced_orders'] = \App\Infrastructure\Persistence\Eloquent\OrderModel::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();
        $updatedSettings['has_synced_transactions'] = \App\Domain\Entities\Transaction::where('store_owner_address', $storeOwner)->where('blockchain_status', 'success')->exists();

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
        $storeOwner = null;
        $tempOrderData = null;
        $order = null;

        if (empty($orderCode)) {
            // Lấy store_owner_address đầu tiên từ bảng settings
            $firstSetting = Setting::whereNotNull('store_owner_address')->first();
            if ($firstSetting) {
                $storeOwner = strtolower($firstSetting->store_owner_address);
            } else {
                // Thử lấy ví admin đầu tiên từ users
                $firstUser = \App\Domain\Entities\User::first();
                $storeOwner = $firstUser ? strtolower($firstUser->store_owner_address ?: $firstUser->wallet_address) : '';
            }
        } else {
            // Tìm đơn hàng để lấy store_owner_address của quán
            $order = \App\Infrastructure\Persistence\Eloquent\OrderModel::where('order_code', $orderCode)->first();

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
            'menu_registry_contract_address' => $settings['menu_registry_contract_address'] ?? '',
            'has_synced_menu' => $settings['has_synced_menu'] ?? '0',
            'rpc_url' => $settings['rpc_url'] ?? '',
            'chain_id' => $settings['chain_id'] ?? '',
            'explorer_url' => $settings['explorer_url'] ?? '',
            'show_crypto_payment' => $settings['show_crypto_payment'] ?? '0',
            'voucher_enabled' => $settings['voucher_enabled'] ?? '0',
            'website_slug' => $settings['website_slug'] ?? '',
            'store_categories' => $settings['store_categories'] ?? '',
            'website_cover_image' => $settings['website_cover_image'] ?? '',
            'store_status' => $settings['store_status'] ?? '0',
            'shipping_fee_flat_enabled' => $settings['shipping_fee_flat_enabled'] ?? '0',
            'shipping_fee_flat_amount' => $settings['shipping_fee_flat_amount'] ?? '0',
            'shipping_fee_free_enabled' => $settings['shipping_fee_free_enabled'] ?? '0',
            'shipping_fee_free_min_amount' => $settings['shipping_fee_free_min_amount'] ?? '0',
            'website_avatar_image' => $settings['website_avatar_image'] ?? '',
            'temp_order' => $tempOrderData, // Trả về thông tin đơn hàng tạm thời/thực tế để client hiển thị
            'order_status' => $order ? $order->status : null,
            'blockchain_status' => $order ? $order->blockchain_status : null,
            'tx_hash' => $order ? $order->tx_hash : null,
            'voucher_nft_token_id' => $order ? $order->voucher_nft_token_id : null,
            'gift_voucher_nft_token_id' => $order ? $order->gift_voucher_nft_token_id : null,
        ];

        return response()->json($publicSettings);
    }

    /**
     * Hàm loại bỏ dấu tiếng Việt để tạo slug chính xác
     */
    private function removeVietnameseAccents($str)
    {
        $unicode = [
            'a' => 'á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ',
            'd' => 'đ',
            'e' => 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
            'i' => 'í|ì|ỉ|ĩ|ị',
            'o' => 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
            'u' => 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
            'y' => 'ý|ỳ|ỷ|ỹ|ỵ',
            'A' => 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
            'D' => 'Đ',
            'E' => 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
            'I' => 'Í|Ì|Ỉ|Ĩ|Ị',
            'O' => 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
            'U' => 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
            'Y' => 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
        ];
        foreach ($unicode as $nonUnicode => $uni) {
            $str = preg_replace("/($uni)/i", $nonUnicode, $str);
        }
        return $str;
    }

    /**
     * Lấy chi tiết thông tin cửa hàng, danh mục và thực đơn bằng website_slug công khai
     */
    public function getStoreDetailsBySlug(string $slug)
    {
        $cacheKey = "store_details:{$slug}";

        $storeData = Cache::remember($cacheKey, 86400, function () use ($slug) {
            $setting = Setting::where('key', 'website_slug')->where('value', $slug)->first();
            if (!$setting) {
                return null;
            }

            $storeOwner = strtolower($setting->store_owner_address);

            // Đảm bảo có settings đầy đủ
            $settings = $this->ensureDefaultSettings($storeOwner);

            // Chỉ trả về các cấu hình an toàn cho client
            $publicSettings = [
                'store_name' => $settings['store_name'] ?? 'Cafe Web3 POS',
                'primary_color' => $settings['primary_color'] ?? '#7c3aed',
                'secondary_color' => $settings['secondary_color'] ?? '#c084fc',
                'contract_address' => $settings['contract_address'] ?? '',
                'finance_contract_address' => $settings['finance_contract_address'] ?? '',
                'voucher_contract_address' => $settings['voucher_contract_address'] ?? '',
                'menu_registry_contract_address' => $settings['menu_registry_contract_address'] ?? '',
                'has_synced_menu' => $settings['has_synced_menu'] ?? '0',
                'rpc_url' => $settings['rpc_url'] ?? '',
                'chain_id' => $settings['chain_id'] ?? '',
                'explorer_url' => $settings['explorer_url'] ?? '',
                'show_crypto_payment' => $settings['show_crypto_payment'] ?? '0',
                'voucher_enabled' => $settings['voucher_enabled'] ?? '0',
                'website_slug' => $settings['website_slug'] ?? '',
                'store_categories' => $settings['store_categories'] ?? '',
                'website_cover_image' => $settings['website_cover_image'] ?? '',
                'store_status' => $settings['store_status'] ?? '0',
                'shipping_fee_flat_enabled' => $settings['shipping_fee_flat_enabled'] ?? '0',
                'shipping_fee_flat_amount' => $settings['shipping_fee_flat_amount'] ?? '0',
                'shipping_fee_free_enabled' => $settings['shipping_fee_free_enabled'] ?? '0',
                'shipping_fee_free_min_amount' => $settings['shipping_fee_free_min_amount'] ?? '0',
                'website_avatar_image' => $settings['website_avatar_image'] ?? '',
            ];

            // Nếu cửa hàng tạm đóng thì không cần load danh mục và sản phẩm
            $storeStatus = $settings['store_status'] ?? '0';
            if ($storeStatus === '0') {
                return [
                    'store' => $publicSettings,
                    'categories' => [],
                    'products' => []
                ];
            }

            // Lấy các danh mục của quán
            $categoriesQuery = \App\Domain\Entities\Category::where('store_owner_address', $storeOwner);
            $storeCategoriesCsv = $settings['store_categories'] ?? '';

            if (!empty($storeCategoriesCsv) && $storeCategoriesCsv !== 'all') {
                $categoryIds = explode(',', $storeCategoriesCsv);
                $categoriesQuery->whereIn('id', $categoryIds);
            }
            $categories = $categoriesQuery->get();

            // Lấy sản phẩm thuộc các danh mục này
            $categoryIdsToLoad = $categories->pluck('id')->all();
            $products = \App\Domain\Entities\Product::where('store_owner_address', $storeOwner)
                ->where('status', 1)
                ->whereHas('categories', function ($q) use ($categoryIdsToLoad) {
                    $q->whereIn('categories.id', $categoryIdsToLoad);
                })
                ->with(['variants', 'categories' => function ($q) use ($categoryIdsToLoad) {
                    $q->whereIn('categories.id', $categoryIdsToLoad);
                }])
                ->get();

            // Thêm đường dẫn ảnh đầy đủ cho sản phẩm nếu cần
            foreach ($products as $product) {
                if ($product->image && !str_starts_with($product->image, 'http')) {
                    $product->image = url($product->image);
                }
            }

            return [
                'store' => $publicSettings,
                'categories' => $categories->toArray(),
                'products' => $products->toArray()
            ];
        });

        if (!$storeData) {
            return response()->json(['message' => 'Cửa hàng không tồn tại!'], 404);
        }

        return response()->json($storeData);
    }

    /**
     * Tạo đơn hàng mới từ website cửa hàng (công khai)
     */
    public function createStoreOrderBySlug(Request $request, string $slug, \App\Application\Common\Bus\CommandBus $bus)
    {
        $setting = Setting::where('key', 'website_slug')->where('value', $slug)->first();
        if (!$setting) {
            return response()->json(['message' => 'Cửa hàng không tồn tại!'], 404);
        }

        $storeOwner = strtolower($setting->store_owner_address);

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'table_number' => 'required|string|max:255', // Chứa số bàn hoặc địa chỉ giao hàng
            'payment_method' => 'required|string|in:cash,bank_transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:255',
        ]);

        try {
            // Tìm hoặc tạo khách hàng mới
            $customer = \App\Domain\Entities\Customer::firstOrCreate(
                [
                    'phone' => $validated['customer_phone'],
                    'store_owner_address' => $storeOwner
                ],
                [
                    'name' => $validated['customer_name'],
                    'customer_code' => 'KH-' . strtoupper(bin2hex(random_bytes(2))),
                ]
            );

            // Cập nhật tên khách hàng nếu họ đổi tên khi đặt hàng
            if ($customer->name !== $validated['customer_name']) {
                $customer->name = $validated['customer_name'];
                $customer->save();
            }

            // Tính toán giá trị đơn hàng trước khi giảm giá/phí ship để làm cơ sở tính miễn phí ship
            $itemSubtotal = 0;
            foreach ($validated['items'] as $item) {
                $product = \App\Domain\Entities\Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                $price = $product->price;
                if (!empty($item['product_variant_id'])) {
                    $variant = $product->variants()->where('id', $item['product_variant_id'])->first();
                    if ($variant) {
                        $price = $variant->price;
                    }
                }
                $itemSubtotal += $price * $item['quantity'];
            }

            // Tính toán phí vận chuyển thực tế
            $shippingFee = 0;
            $shippingFeeEnabled = Setting::getForStore('shipping_fee_flat_enabled', $storeOwner, '0') === '1';
            if ($shippingFeeEnabled) {
                $flatAmount = (float)Setting::getForStore('shipping_fee_flat_amount', $storeOwner, 0);
                $freeEnabled = Setting::getForStore('shipping_fee_free_enabled', $storeOwner, '0') === '1';
                if ($freeEnabled) {
                    $minAmount = (float)Setting::getForStore('shipping_fee_free_min_amount', $storeOwner, 0);
                    if ($itemSubtotal >= $minAmount) {
                        $shippingFee = 0;
                    } else {
                        $shippingFee = $flatAmount;
                    }
                } else {
                    $shippingFee = $flatAmount;
                }
            }

            // Chuẩn bị payload để tạo đơn hàng qua CreateOrderCommand
            $orderData = [
                'table_number' => $validated['table_number'] ?? null,
                'customer_id' => $customer->id,
                'payment_method' => $validated['payment_method'],
                'items' => $validated['items'],
                'shipping_fee' => $shippingFee,
            ];

            // Thực thi tạo đơn hàng thông qua CommandBus
            $command = new CreateOrderCommand($storeOwner, $orderData);
            $order = $bus->dispatch($command);

            return response()->json([
                'message' => 'Đặt đơn hàng thành công!',
                'data' => \App\Infrastructure\Persistence\Eloquent\OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đặt đơn hàng thất bại: ' . $e->getMessage()
            ], 500);
        }
    }
}