<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'note',
        'record_date',
        'store_owner_address'
    ];

    protected $casts = [
        'record_date' => 'datetime'
    ];

    /**
     * Mối quan hệ Một-Nhiều với InventoryRecordItem
     */
    public function items()
    {
        return $this->hasMany(InventoryRecordItem::class);
    }
}
