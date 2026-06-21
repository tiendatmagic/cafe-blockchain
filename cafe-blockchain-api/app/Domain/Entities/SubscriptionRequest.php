<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionRequest extends Model
{
    use HasFactory;

    protected $table = 'subscription_requests';

    protected $fillable = [
        'store_owner_address',
        'plan_code',
        'duration_months',
        'amount',
        'payment_method_details',
        'tx_hash',
        'status', // 'pending', 'approved', 'rejected'
        'rejected_reason',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'duration_months' => 'integer',
        'amount' => 'decimal:2',
        'approved_at' => 'datetime'
    ];
}
