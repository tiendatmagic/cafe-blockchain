<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $table = 'payment_methods';

    protected $fillable = [
        'store_owner_address',
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
