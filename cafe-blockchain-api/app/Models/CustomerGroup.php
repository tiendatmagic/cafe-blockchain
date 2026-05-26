<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerGroup extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'store_owner_address'];

    /**
     * Mối quan hệ Nhiều-Nhiều với Customer
     */
    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_customer_group', 'customer_group_id', 'customer_id');
    }
}
