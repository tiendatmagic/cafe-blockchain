<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemPaymentMethod extends Model
{
    use HasFactory;

    protected $table = 'system_payment_methods';

    protected $fillable = [
        'type',
        'name',
        'account_number',
        'account_holder',
        'bank_code',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
