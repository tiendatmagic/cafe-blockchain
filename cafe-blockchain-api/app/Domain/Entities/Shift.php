<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_owner_address',
        'user_id',
        'start_time',
        'end_time',
        'initial_cash',
        'actual_cash',
        'expected_cash',
        'payment_revenues',
        'payment_expenses',
        'status',
        'note',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'initial_cash' => 'float',
        'actual_cash' => 'float',
        'expected_cash' => 'float',
        'payment_revenues' => 'array',
        'payment_expenses' => 'array',
    ];

    /**
     * Nhân viên trực ca
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Các đơn hàng phát sinh trong ca trực
     */
    public function orders()
    {
        return $this->hasMany(\App\Infrastructure\Persistence\Eloquent\OrderModel::class, 'shift_id');
    }

    /**
     * Giao dịch thu chi phát sinh trong ca trực
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'shift_id');
    }
}
