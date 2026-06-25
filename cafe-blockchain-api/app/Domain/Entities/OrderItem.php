<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'price',
        'cost_price',
        'note',
        'tax_rate',
        'tax_amount',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'product_variant_id' => 'integer',
        'price' => 'float',
        'cost_price' => 'float',
        'quantity' => 'integer',
        'tax_rate' => 'float',
        'tax_amount' => 'float',
    ];

    public function order()
    {
        return $this->belongsTo(\App\Infrastructure\Persistence\Eloquent\OrderModel::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
