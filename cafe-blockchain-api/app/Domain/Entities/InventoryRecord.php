<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'record_code',
        'type',
        'note',
        'record_date',
        'store_owner_address'
    ];

    protected $casts = [
        'record_date' => 'datetime'
    ];

    protected static function booted()
    {
        // Tự động sinh mã phiếu nhập xuất kho ngẫu nhiên khi tạo mới
        static::creating(function ($record) {
            if (empty($record->record_code)) {
                $prefix = $record->type === 'in' ? 'NK-' : 'XK-';
                $record->record_code = $prefix . strtoupper(bin2hex(random_bytes(3)));
            }
        });
    }

    /**
     * Mối quan hệ Một-Nhiều với InventoryRecordItem
     */
    public function items()
    {
        return $this->hasMany(InventoryRecordItem::class);
    }
}
