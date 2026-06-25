<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaxPeriod extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'store_owner_address',
        'period_type',
        'period_value',
        'period_year',
        'status',
        'revenue_amount',
        'expense_amount',
        'estimated_vat',
        'estimated_pit',
        'created_books_count',
    ];

    protected $casts = [
        'period_value' => 'integer',
        'period_year' => 'integer',
        'revenue_amount' => 'float',
        'expense_amount' => 'float',
        'estimated_vat' => 'float',
        'estimated_pit' => 'float',
        'created_books_count' => 'integer',
    ];

    protected static function booted()
    {
        // Tự động sinh UUID khi tạo mới
        static::creating(function ($period) {
            if (empty($period->id)) {
                $period->id = (string) Str::uuid7();
            }
        });
    }
}
