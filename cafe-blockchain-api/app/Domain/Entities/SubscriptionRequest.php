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
        'system_payment_method_id',
        'tx_hash',
        'status', // 'pending', 'approved', 'rejected'
        'rejected_reason',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'duration_months' => 'integer',
        'amount' => 'decimal:2',
        'system_payment_method_id' => 'integer',
        'approved_at' => 'datetime'
    ];

    public function systemPaymentMethod()
    {
        return $this->belongsTo(SystemPaymentMethod::class, 'system_payment_method_id');
    }
}
