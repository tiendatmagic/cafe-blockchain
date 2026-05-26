<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'dob',
        'gender',
        'address',
        'store_owner_address'
    ];

    /**
     * Mối quan hệ Nhiều-Nhiều với CustomerGroup
     */
    public function groups()
    {
        return $this->belongsToMany(CustomerGroup::class, 'customer_customer_group', 'customer_id', 'customer_group_id');
    }
}
