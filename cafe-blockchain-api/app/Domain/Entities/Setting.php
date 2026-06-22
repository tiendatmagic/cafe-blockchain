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
        return $setting ? $setting->value : $default;
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
        return $setting ? $setting->value : $default;
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
