<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_code',
        'name',
        'phone',
        'email',
        'wallet_address',
        'dob',
        'gender',
        'address',
        'store_owner_address',
        'type',
        'company_name',
        'tax_code',
        'representative_name',
        'website',
        'business_status'
    ];

    protected $appends = [
        'active_vouchers_count'
    ];

    protected static function booted()
    {
        // Tự động sinh mã khách hàng ngẫu nhiên 4 ký tự viết hoa/chữ số khi tạo mới
        static::creating(function ($customer) {
            if (empty($customer->customer_code)) {
                $customer->customer_code = 'KH-' . strtoupper(bin2hex(random_bytes(2)));
            }
        });
    }

    public function getActiveVouchersCountAttribute()
    {
        return 0;
    }

    /**
     * Mối quan hệ Nhiều-Nhiều với CustomerGroup
     */
    public function groups()
    {
        return $this->belongsToMany(CustomerGroup::class, 'customer_customer_group', 'customer_id', 'customer_group_id');
    }
}
