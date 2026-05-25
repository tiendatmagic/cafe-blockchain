<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
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

    /**
     * Mối quan hệ Nhiều-Nhiều với Category
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
