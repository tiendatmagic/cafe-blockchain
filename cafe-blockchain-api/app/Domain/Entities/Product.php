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
        'name',
        'price',
        'image',
        'status',
        'short_description',
        'description',
        'store_owner_address',
    ];

    protected $casts = [
        'price' => 'float',
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
}
