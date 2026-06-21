<?php

namespace App\Domain\Entities;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

#[Fillable(['wallet_address', 'store_owner_address', 'name', 'email', 'phone'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mối quan hệ với Nhân viên (Staff) thông qua wallet_address
     */
    public function staff()
    {
        return $this->hasOne(Staff::class, 'wallet_address', 'wallet_address');
    }

    /**
     * Kiểm tra quyền truy cập module
     */
    public function hasPermission(string $module): bool
    {
        // Nếu không có store_owner_address, đây là Chủ quán (Admin) -> mặc định full quyền
        if (empty($this->store_owner_address)) {
            return true;
        }

        // Tìm kiếm thông tin nhân viên đăng nhập
        $staff = $this->staff;
        if (!$staff || !$staff->role) {
            return false;
        }

        $permissions = $staff->role->permissions;
        if (is_string($permissions)) {
            $permissions = json_decode($permissions, true);
        }

        return !empty($permissions[$module]);
    }
}
