<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Domain\Entities\Customer;
use App\Domain\Entities\OrderItem;
use App\Domain\Entities\DebtLog;

class OrderModel extends Model
{
    use HasFactory;

    protected $table = 'orders';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'order_code',
        'table_number',
        'customer_id',
        'total_amount',
        'discount_amount',
        'tax_amount',
        'voucher_nft_token_id',
        'gift_voucher_nft_token_id',
        'payment_method',
        'status',
        'tx_hash',
        'blockchain_status',
        'chain_id',
        'store_owner_address',
        'verification_hash',
        'shift_id',
        'is_points_claimed',
        'claim_attempts',
        'last_claim_attempt_at',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'discount_amount' => 'integer',
        'tax_amount' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function debtLogs()
    {
        return $this->hasMany(DebtLog::class, 'order_id');
    }

    public function shift()
    {
        return $this->belongsTo(\App\Domain\Entities\Shift::class, 'shift_id');
    }
}
