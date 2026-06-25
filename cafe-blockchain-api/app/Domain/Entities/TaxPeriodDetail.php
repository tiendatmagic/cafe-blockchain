<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TaxPeriodDetail extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'tax_period_details';

    protected $fillable = [
        'id',
        'tax_period_id',
        'document_type',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    protected static function booted()
    {
        // Auto generate UUIDv7 on creation
        static::creating(function ($detail) {
            if (empty($detail->id)) {
                $detail->id = (string) Str::uuid7();
            }
        });
    }

    /**
     * Relation with TaxPeriod
     */
    public function period()
    {
        return $this->belongsTo(TaxPeriod::class, 'tax_period_id');
    }
}
