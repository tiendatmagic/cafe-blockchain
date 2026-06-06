<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'store_owner_address'];

    /**
     * Mối quan hệ Một-Nhiều với DiningTable
     */
    public function tables()
    {
        return $this->hasMany(DiningTable::class, 'area_id');
    }
}
