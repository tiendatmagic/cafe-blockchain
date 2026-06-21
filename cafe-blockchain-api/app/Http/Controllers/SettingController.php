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

    private function ensureDefaultSettings($storeOwner)
    {
        $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();

        // Các settings mặc định an toàn — KHÔNG bao gồm địa chỉ contract (chỉ điền khi người dùng chủ động deploy/cấu hình)
        $defaultSettings = [
            'store_name' => 'Cafe Web3 POS',
            'primary_color' => '#7c3aed',
            'secondary_color' => '#c084fc',
            'contract_address' => '',
            'finance_contract_address' => '',
            'voucher_contract_address' => '',
            'menu_registry_contract_address' => '',
            'loyalty_token_contract_address' => '',
            'voucher_shop_contract_address' => '',
            'voucher_marketplace_contract_address' => '',
            'relayer_private_key' => '',
            'rpc_url' => '',
            'chain_id' => '',
            'explorer_url' => '',
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
            'store_phone' => '',
            'store_opening_hours' => '',
            'store_address' => '',
            'store_description' => '',
        ];

        if (empty($settings)) {
            // Chủ quán mới: chỉ lưu các settings thiết yếu (không lưu tất cả để tiết kiệm DB)
            $essentialKeys = ['store_name', 'primary_color', 'secondary_color', 'rpc_url', 'chain_id', 'explorer_url', 'default_print_size'];
            foreach ($essentialKeys as $key) {
                Setting::setForStore($key, $defaultSettings[$key], $storeOwner);
            }
            $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        } else {
            // Đảm bảo các key thiết yếu tồn tại, bỏ qua contract address (không ghi đè bằng rỗng nếu đã có)
            $safeDefaultKeys = [
                'store_name',
                'primary_color',
                'secondary_color',
                'rpc_url',
                'chain_id',
                'explorer_url',
                'default_print_size',
                'voucher_gift_min_amount',
                'voucher_discount_amount',
                'voucher_use_min_amount',
                'show_crypto_payment',
                'voucher_enabled',
                'has_synced_menu',
                'store_status',
                'shipping_fee_flat_enabled',
                'shipping_fee_flat_amount',
                'shipping_fee_free_enabled',
                'shipping_fee_free_min_amount'
            ];
            $changed = false;
            foreach ($safeDefaultKeys as $key) {
                if (!isset($settings[$key])) {
                    Setting::setForStore($key, $defaultSettings[$key], $storeOwner);
                    $settings[$key] = $defaultSettings[$key];
                    $changed = true;
                }
            }
            if ($changed) {
                $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
            }
        }

        // Đảm bảo tất cả các key có giá trị fallback khi trả về (không lưu vào DB)
        foreach ($defaultSettings as $key => $defaultValue) {
            if (!isset($settings[$key])) {
                $settings[$key] = $defaultValue;
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
            'store_name' => 'required|string|max:255',
            'store_phone' => 'required|string|regex:/^[0-9]+$/',
            'store_opening_hours' => 'nullable|string',
            'store_address' => 'nullable|string|max:500',
            'store_description' => 'nullable|string|max:1000',
            'contract_address' => 'nullable|string|max:255',
            'finance_contract_address' => 'nullable|string|max:255',
            'voucher_contract_address' => 'nullable|string|max:255',
            'menu_registry_contract_address' => 'nullable|string|max:255',
            'loyalty_token_contract_address' => 'nullable|string|max:255',
            'voucher_shop_contract_address' => 'nullable|string|max:255',
            'voucher_marketplace_contract_address' => 'nullable|string|max:255',
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
                    'message' => 'This website slug is already taken by another store, please choose a different one!'
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
                'message' => 'Blockchain network (Chain ID) has been set previously and is locked to ensure financial integrity! Chain ID cannot be changed.'
            ], 400);
        }

        // 2. Logic khóa cứng địa chỉ Smart Contract POS linh hoạt (chỉ khóa khi đã có giao dịch thành công)
        if ($hasSyncedOrders && !empty($existingContractAddress) && isset($settingsData['contract_address']) && $settingsData['contract_address'] !== $existingContractAddress) {
            return response()->json([
                'message' => 'POS Smart Contract address has been used to sync orders to the blockchain and is permanently locked! It cannot be edited.'
            ], 400);
        }

        // 3. Logic khóa cứng địa chỉ Smart Contract Tài chính linh hoạt (chỉ khóa khi đã có giao dịch thành công)
        if ($hasSyncedTransactions && !empty($existingFinanceContractAddress) && isset($settingsData['finance_contract_address']) && $settingsData['finance_contract_address'] !== $existingFinanceContractAddress) {
            return response()->json([
                'message' => 'Finance Smart Contract address has been used to sync transactions to the blockchain and is permanently locked! It cannot be edited.'
            ], 400);
        }

        // 4. Logic khóa cứng địa chỉ Smart Contract Menu Registry linh hoạt (chỉ khóa khi đã đồng bộ thực đơn thành công)
        if ($hasSyncedMenu && !empty($existingMenuRegistryContractAddress) && isset($settingsData['menu_registry_contract_address']) && $settingsData['menu_registry_contract_address'] !== $existingMenuRegistryContractAddress) {
            return response()->json([
                'message' => 'Menu Registry Smart Contract address has been used to sync the menu to the blockchain and is permanently locked! It cannot be edited.'
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
                                    'message' => "Invalid RPC Endpoint! This network returned Chain ID $rpcChainIdDec, which does not match the store's configured Chain ID $targetChainId."
                                ], 400);
                            }
                        } else {
                            return response()->json([
                                'message' => 'RPC Endpoint did not return a valid Chain ID.'
                            ], 400);
                        }
                    } else {
                        return response()->json([
                            'message' => 'Could not connect to the provided RPC Endpoint. Please check the URL again.'
                        ], 400);
                    }
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'RPC connection error to verify Chain ID: ' . $e->getMessage()
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
                    return response()->json(['message' => 'Order not found!'], 404);
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
            'primary_color' => empty($orderCode) ? '#7c3aed' : ($settings['primary_color'] ?? '#7c3aed'),
            'secondary_color' => empty($orderCode) ? '#c084fc' : ($settings['secondary_color'] ?? '#c084fc'),
            'contract_address' => $settings['contract_address'] ?? '',
            'finance_contract_address' => $settings['finance_contract_address'] ?? '',
            'voucher_contract_address' => $settings['voucher_contract_address'] ?? '',
            'menu_registry_contract_address' => $settings['menu_registry_contract_address'] ?? '',
            'loyalty_token_contract_address' => $settings['loyalty_token_contract_address'] ?? '',
            'voucher_shop_contract_address' => $settings['voucher_shop_contract_address'] ?? '',
            'voucher_marketplace_contract_address' => $settings['voucher_marketplace_contract_address'] ?? '',
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
            'store_phone' => $settings['store_phone'] ?? '',
            'store_opening_hours' => $settings['store_opening_hours'] ?? '',
            'store_address' => $settings['store_address'] ?? '',
            'store_description' => $settings['store_description'] ?? '',
            'temp_order' => $tempOrderData, // Trả về thông tin đơn hàng tạm thời/thực tế để client hiển thị
            'order_status' => $order ? $order->status : null,
            'blockchain_status' => $order ? $order->blockchain_status : null,
            'tx_hash' => $order ? $order->tx_hash : null,
            'voucher_nft_token_id' => $order ? $order->voucher_nft_token_id : null,
            'gift_voucher_nft_token_id' => $order ? $order->gift_voucher_nft_token_id : null,
            'turnstile_site_key' => $this->getTurnstileSiteKey(),
        ];

        return response()->json($publicSettings);
    }

    /**
     * Kiểm tra Turnstile có được bật trong hệ thống không (cần cả Secret Key .env VÀ toggle DB)
     */
    private function isTurnstileEnabled(): bool
    {
        $setting = \Illuminate\Support\Facades\DB::table('system_settings')
            ->where('key', 'turnstile_enabled')
            ->first();
        if (!$setting) {
            return false;
        }
        $value = json_decode($setting->value, true);
        return (bool)($value['enabled'] ?? false);
    }

    /**
     * Trả về Site Key công khai khi Turnstile được bật đầy đủ
     */
    private function getTurnstileSiteKey(): ?string
    {
        if (empty(config('services.turnstile.secret_key'))) {
            return null;
        }
        if (!$this->isTurnstileEnabled()) {
            return null;
        }
        return config('services.turnstile.site_key');
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
            'E' => 'É|È|Ẻ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
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
        $setting = Setting::where('key', 'website_slug')->where('value', $slug)->first();
        if (!$setting) {
            return response()->json(['message' => 'Store does not exist!'], 404);
        }

        $storeOwner = strtolower($setting->store_owner_address);

        $owner = \App\Domain\Entities\User::where('wallet_address', $storeOwner)->first();
        if (!$owner) {
            return response()->json(['message' => 'Store owner not found!'], 404);
        }

        if ($owner->subscription_status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'This store website is currently suspended.'
            ], 403);
        }

        if ($owner->subscription_expires_at !== null && now()->greaterThan($owner->subscription_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'This store website service has expired.'
            ], 403);
        }

        // Kiểm tra xem gói cước hiện tại có hỗ trợ storefront không
        $plan = \App\Domain\Entities\SubscriptionPlan::where('code', $owner->plan_code ?: 'free')->first();
        if ($plan && isset($plan->features['enable_storefront']) && !$plan->features['enable_storefront']) {
            return response()->json([
                'success' => false,
                'message' => 'Storefront feature is not enabled for this store\'s subscription plan.',
                'feature' => 'enable_storefront'
            ], 403);
        }

        $cacheKey = "store_details:{$slug}";

        $storeData = Cache::remember($cacheKey, 86400, function () use ($slug, $storeOwner) {
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
                'loyalty_token_contract_address' => $settings['loyalty_token_contract_address'] ?? '',
                'voucher_shop_contract_address' => $settings['voucher_shop_contract_address'] ?? '',
                'voucher_marketplace_contract_address' => $settings['voucher_marketplace_contract_address'] ?? '',
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
                'store_phone' => $settings['store_phone'] ?? '',
                'store_opening_hours' => $settings['store_opening_hours'] ?? '',
                'store_address' => $settings['store_address'] ?? '',
                'store_description' => $settings['store_description'] ?? '',
                'turnstile_site_key' => $this->getTurnstileSiteKey(),
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
                ->where('type', 'product')
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

            // Lấy danh sách phương thức thanh toán đã kích hoạt
            $paymentMethods = \App\Domain\Entities\PaymentMethod::where('store_owner_address', $storeOwner)
                ->where('is_active', 1)
                ->get();

            return [
                'store' => $publicSettings,
                'categories' => $categories->toArray(),
                'products' => $products->toArray(),
                'payment_methods' => $paymentMethods->toArray()
            ];
        });

        if (!$storeData) {
            return response()->json(['message' => 'Store does not exist!'], 404);
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
            return response()->json(['message' => 'Store does not exist!'], 404);
        }

        $storeOwner = strtolower($setting->store_owner_address);

        $owner = \App\Domain\Entities\User::where('wallet_address', $storeOwner)->first();
        if (!$owner) {
            return response()->json(['message' => 'Store owner not found!'], 404);
        }

        if ($owner->subscription_status === 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'This store website is currently suspended.'
            ], 403);
        }

        if ($owner->subscription_expires_at !== null && now()->greaterThan($owner->subscription_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'This store website service has expired.'
            ], 403);
        }

        // Kiểm tra xem gói cước hiện tại có hỗ trợ storefront không
        $plan = \App\Domain\Entities\SubscriptionPlan::where('code', $owner->plan_code ?: 'free')->first();
        if ($plan && isset($plan->features['enable_storefront']) && !$plan->features['enable_storefront']) {
            return response()->json([
                'success' => false,
                'message' => 'Storefront feature is not enabled for this store\'s subscription plan.',
                'feature' => 'enable_storefront'
            ], 403);
        }

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
            'turnstile_token' => 'nullable|string',
        ]);

        // Xác thực Cloudflare Turnstile token nếu đã bật trong hệ thống (cả .env và DB)
        $turnstileSecret = config('services.turnstile.secret_key');
        if (!empty($turnstileSecret) && $this->isTurnstileEnabled()) {
            $token = $request->input('turnstile_token');
            if (empty($token)) {
                return response()->json([
                    'message' => 'Security verification token is required to place an order.'
                ], 400);
            }

            try {
                $verifyResponse = Http::asForm()->timeout(5)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $turnstileSecret,
                    'response' => $token,
                    'remoteip' => $request->ip()
                ]);

                if (!$verifyResponse->successful() || !$verifyResponse->json('success')) {
                    return response()->json([
                        'message' => 'Security check (Turnstile) failed. Please refresh the page and try again.'
                    ], 400);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Turnstile verification connection failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Unable to verify security status at this moment. Please try again later.'
                ], 400);
            }
        }

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
                'message' => 'Order placed successfully!',
                'data' => \App\Infrastructure\Persistence\Eloquent\OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }
}
