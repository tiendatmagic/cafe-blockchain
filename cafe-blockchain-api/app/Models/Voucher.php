<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'customer_id',
        'wallet_address',
        'discount_amount',
        'min_order_amount',
        'status', // active, used, expired
        'tx_hash',
        'store_owner_address',
        'expired_at'
    ];

    protected $casts = [
        'expired_at' => 'datetime'
    ];

    /**
     * Mối quan hệ với Customer
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
