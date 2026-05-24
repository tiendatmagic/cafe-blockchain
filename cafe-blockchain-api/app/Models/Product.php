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
        'category',
        'image',
        'status',
        'short_description',
        'description',
    ];

    protected $casts = [
        'price' => 'float',
        'status' => 'boolean',
    ];
}
