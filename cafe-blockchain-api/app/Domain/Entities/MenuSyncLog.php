<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuSyncLog extends Model
{
    use HasFactory;

    protected $table = 'menu_sync_logs';

    protected $fillable = [
        'store_owner_address',
        'synced_by',
        'tx_hash',
        'product_count',
        'chain_id',
    ];

    protected $casts = [
        'product_count' => 'integer',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];
}
