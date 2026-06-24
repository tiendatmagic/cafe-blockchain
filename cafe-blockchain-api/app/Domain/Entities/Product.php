<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sku',
        'barcode',
        'unit',
        'type',
        'name',
        'price',
        'cost_price',
        'image',
        'status',
        'short_description',
        'description',
        'store_owner_address',
    ];

    protected $casts = [
        'price' => 'float',
        'cost_price' => 'float',
        'status' => 'boolean',
    ];

    protected static function booted()
    {
        // Tự động sinh mã SKU ngẫu nhiên nếu Admin bỏ trống khi tạo mới
        static::creating(function ($product) {
            if (empty($product->sku)) {
                $product->sku = 'SP-' . strtoupper(bin2hex(random_bytes(3)));
            }
        });
    }

    /**
     * Mối quan hệ Nhiều-Nhiều với Category
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Mối quan hệ 1-Nhiều với ProductVariant
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('price', 'asc');
    }

    /**
     * Mối quan hệ 1-Nhiều với Recipe (Công thức định lượng)
     */
    public function recipes()
    {
        return $this->hasMany(Recipe::class, 'product_id');
    }

    /**
     * Chuẩn hóa URL hình ảnh (sửa lỗi CORS, Mixed Content, domain localhost hoặc tương đối)
     */
    public static function normalizeImageUrl($imageUrl)
    {
        if (!$imageUrl) {
            return $imageUrl;
        }

        $request = request();
        $host = null;
        try {
            $host = $request ? $request->getHost() : null;
        } catch (\Exception $e) {
            // Bỏ qua nếu chạy console
        }

        // Nếu là link tuyệt đối nhưng bị lưu dạng localhost/127.0.0.1 (do dữ liệu cũ),
        // hoặc chứa host hiện tại của request, ta chuyển thành relative path để xử lý đồng bộ
        if (str_contains($imageUrl, '://localhost') || str_contains($imageUrl, '://127.0.0.1') || ($host && str_contains($imageUrl, '://' . $host))) {
            $imageUrl = preg_replace('/^https?:\/\/[^\/]+/', '', $imageUrl);
        }

        // Nếu là relative path, chuyển thành absolute URL
        if (!preg_match('/^https?:\/\//i', $imageUrl)) {
            if (!str_starts_with($imageUrl, '/')) {
                $imageUrl = '/' . $imageUrl;
            }

            // Phát hiện tiền tố thư mục public động bằng cách so khớp DOCUMENT_ROOT và public_path()
            $basePath = '';
            $documentRoot = $_SERVER['DOCUMENT_ROOT'] ?? ($request ? $request->server('DOCUMENT_ROOT') : null);
            if ($documentRoot) {
                $realDocRoot = realpath($documentRoot);
                $realPublicPath = realpath(public_path());
                if ($realDocRoot && $realPublicPath && str_starts_with($realPublicPath, $realDocRoot)) {
                    $relative = trim(substr($realPublicPath, strlen($realDocRoot)), DIRECTORY_SEPARATOR);
                    if ($relative) {
                        $basePath = '/' . str_replace(DIRECTORY_SEPARATOR, '/', $relative);
                    }
                }
            }

            // Fallback nếu không tính được qua DOCUMENT_ROOT
            if (!$basePath && $request) {
                $scriptName = $request->server('SCRIPT_NAME') ?? $_SERVER['SCRIPT_NAME'] ?? '';
                $basePath = str_contains($scriptName, '/public/') ? '/public' : $request->getBasePath();
            }

            // Nếu có basePath (như /public) và URL chưa chứa basePath này
            if ($basePath && !str_starts_with($imageUrl, $basePath)) {
                $imageUrl = '/' . ltrim($basePath, '/') . '/' . ltrim($imageUrl, '/');
            }

            if ($request) {
                $imageUrl = $request->getSchemeAndHttpHost() . '/' . ltrim($imageUrl, '/');
            } else {
                $imageUrl = url($imageUrl);
            }
        }

        // Tự động chuyển sang HTTPS nếu request là HTTPS hoặc đi qua HTTPS proxy
        if ($request) {
            if ($request->header('X-Forwarded-Proto') === 'https' || $request->secure() || str_contains($request->header('Origin', ''), 'https://')) {
                $imageUrl = str_replace('http://', 'https://', $imageUrl);
            }
        }

        return $imageUrl;
    }
}

