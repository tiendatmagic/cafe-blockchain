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

    /**
     * Xóa cache storefront của quán khi có thay đổi sản phẩm/danh mục/cấu hình
     */
    public static function clearStorefrontCache($storeOwnerAddress)
    {
        if (!$storeOwnerAddress) {
            return;
        }
        $slug = self::getForStore('website_slug', $storeOwnerAddress);
        if ($slug) {
            \Illuminate\Support\Facades\Cache::forget("store_details:{$slug}");
        }
    }
}
