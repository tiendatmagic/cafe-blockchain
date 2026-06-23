<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'store_owner_address',
    ];

    protected static $systemDefaults = [
        'store_name' => 'Cafe Web3 POS',
        'primary_color' => '#ff00dd',
        'secondary_color' => '#8000ff',
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

    public static function getSystemDefaults()
    {
        return self::$systemDefaults;
    }

    /**
     * Lấy giá trị cấu hình theo key cho một cửa hàng cụ thể
     */
    public static function getForStore($key, $storeOwnerAddress, $default = null)
    {
        if (!$storeOwnerAddress) {
            return self::get($key, $default);
        }
        $setting = self::where('key', $key)
            ->where('store_owner_address', strtolower($storeOwnerAddress))
            ->first();
        if ($setting) {
            return $setting->value;
        }
        if (array_key_exists($key, self::$systemDefaults)) {
            return self::$systemDefaults[$key];
        }
        return $default;
    }

    /**
     * Thiết lập giá trị cấu hình theo key cho một cửa hàng cụ thể
     */
    public static function setForStore($key, $value, $storeOwnerAddress)
    {
        if (!$storeOwnerAddress) {
            return self::set($key, $value);
        }
        return self::updateOrCreate(
            [
                'key' => $key,
                'store_owner_address' => strtolower($storeOwnerAddress)
            ],
            ['value' => $value]
        );
    }

    /**
     * Lấy giá trị cấu hình theo key (Tương thích ngược)
     */
    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if ($setting) {
            return $setting->value;
        }
        if (array_key_exists($key, self::$systemDefaults)) {
            return self::$systemDefaults[$key];
        }
        return $default;
    }

    /**
     * Thiết lập giá trị cấu hình theo key (Tương thích ngược)
     */
    public static function set($key, $value)
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    public static function clearStorefrontCache($storeOwnerAddress)
    {
        if (!$storeOwnerAddress) {
            return;
        }
        $storeOwnerAddress = strtolower($storeOwnerAddress);
        $slug = self::getForStore('website_slug', $storeOwnerAddress);
        if ($slug) {
            \Illuminate\Support\Facades\Cache::forget("store_details:{$slug}");
        }
        \Illuminate\Support\Facades\Cache::forget("store_products_all:{$storeOwnerAddress}");
        \Illuminate\Support\Facades\Cache::forget("store_categories_all:{$storeOwnerAddress}");
    }

    /**
     * Đăng ký cache key động của cửa hàng vào danh sách quản lý
     */
    public static function registerCacheKey($storeOwnerAddress, $key)
    {
        if (!$storeOwnerAddress) {
            return;
        }
        $storeOwnerAddress = strtolower($storeOwnerAddress);
        $keysKey = "store_cache_keys:{$storeOwnerAddress}";
        $keys = \Illuminate\Support\Facades\Cache::get($keysKey, []);
        if (!in_array($key, $keys)) {
            $keys[] = $key;
            \Illuminate\Support\Facades\Cache::put($keysKey, $keys, 604800); // Lưu trữ trong 1 tuần
        }
    }

    /**
     * Xóa toàn bộ các cache key đã đăng ký của cửa hàng
     */
    public static function clearStoreCache($storeOwnerAddress)
    {
        if (!$storeOwnerAddress) {
            return;
        }
        $storeOwnerAddress = strtolower($storeOwnerAddress);
        $keysKey = "store_cache_keys:{$storeOwnerAddress}";
        $keys = \Illuminate\Support\Facades\Cache::get($keysKey, []);
        foreach ($keys as $key) {
            \Illuminate\Support\Facades\Cache::forget($key);
        }
        \Illuminate\Support\Facades\Cache::forget($keysKey);
    }
}
