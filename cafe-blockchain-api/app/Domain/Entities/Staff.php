<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staffs'; // Tên bảng tùy chỉnh

    protected $fillable = [
        'name',
        'phone',
        'wallet_address',
        'store_owner_address',
        'role_id'
    ];

    /**
     * Boot function to normalize wallet address to lowercase
     */
    protected static function booted()
    {
        static::saving(function ($staff) {
            if (!empty($staff->wallet_address)) {
                $staff->wallet_address = strtolower($staff->wallet_address);
            }
            if (!empty($staff->store_owner_address)) {
                $staff->store_owner_address = strtolower($staff->store_owner_address);
            }
        });
    }

    /**
     * Mối quan hệ Nhiều-Một với Vai trò (Role)
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}
