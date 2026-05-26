<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'amount',
        'category',
        'description',
        'transaction_date',
        'store_owner_address'
    ];

    protected $casts = [
        'amount' => 'float',
        'transaction_date' => 'date:Y-m-d'
    ];
}
