<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryRecordItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_record_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'price'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'float'
    ];

    /**
     * Mối quan hệ Nhiều-Một với InventoryRecord
     */
    public function record()
    {
        return $this->belongsTo(InventoryRecord::class, 'inventory_record_id');
    }

    /**
     * Mối quan hệ Nhiều-Một với Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    /**
     * Mối quan hệ Nhiều-Một với ProductVariant
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
