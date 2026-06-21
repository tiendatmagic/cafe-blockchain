<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemStaff extends Model
{
    use HasFactory;

    protected $table = 'system_staffs';

    protected $fillable = [
        'wallet_address',
        'name',
        'role',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
