<?php

namespace App\Domain\Entities;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $table = 'subscription_plans';

    protected $fillable = [
        'code',
        'name',
        'is_active',
        'price_per_month',
        'price_per_year',
        'features',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price_per_month' => 'double',
        'price_per_year' => 'double',
        'features' => 'array',
    ];
}
