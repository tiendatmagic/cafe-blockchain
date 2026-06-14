<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'store_owner_address', 'permissions'];

    /**
     * Cast attributes to Native types
     */
    protected $casts = [
        'permissions' => 'array', // Tự động convert JSON sang array PHP
    ];

    /**
     * Mối quan hệ Một-Nhiều với Nhân viên (Staff)
     */
    public function staffs()
    {
        return $this->hasMany(Staff::class, 'role_id');
    }
}
