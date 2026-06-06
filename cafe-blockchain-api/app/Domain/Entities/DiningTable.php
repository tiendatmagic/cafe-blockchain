<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiningTable extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'area_id',
        'status',
        'store_owner_address'
    ];

    /**
     * Mối quan hệ Nhiều-Một với Area
     */
    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
