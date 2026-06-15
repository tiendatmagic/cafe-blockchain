<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'product_variant_id',
        'ingredient_id',
        'quantity',
        'store_owner_address',
    ];

    protected $casts = [
        'quantity' => 'float',
    ];

    /**
     * Mối quan hệ với sản phẩm được chế biến
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Mối quan hệ với biến thể sản phẩm (nếu có)
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Mối quan hệ với nguyên vật liệu thô
     */
    public function ingredient()
    {
        return $this->belongsTo(Product::class, 'ingredient_id');
    }
}
