<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaxProfile extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'store_owner_address',
        'business_group',
        'industry_type',
        'is_multi_industry',
        'industry_allocation',
        'tax_method',
    ];

    protected $casts = [
        'is_multi_industry' => 'boolean',
        'industry_allocation' => 'array',
    ];

    protected static function booted()
    {
        // Tự động sinh UUID khi tạo mới
        static::creating(function ($profile) {
            if (empty($profile->id)) {
                $profile->id = (string) Str::uuid7();
            }
        });
    }
}
