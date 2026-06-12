<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DebtLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_owner_address',
        'customer_id',
        'order_id',
        'transaction_id',
        'type',
        'amount',
        'note',
        'recorded_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'recorded_at' => 'date:Y-m-d',
    ];

    /**
     * Mối quan hệ với Customer
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Mối quan hệ với Order
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Mối quan hệ với Transaction (Sổ quỹ)
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
