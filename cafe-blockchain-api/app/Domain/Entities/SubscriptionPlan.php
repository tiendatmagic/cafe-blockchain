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

    /**
     * Lấy thông tin gói cước theo code (có cache 24 giờ)
     */
    public static function getCachedPlan(string $code): ?array
    {
        return \Illuminate\Support\Facades\Cache::remember("subscription_plan:{$code}", 86400, function () use ($code) {
            $plan = self::where('code', $code)->first();
            return $plan ? $plan->toArray() : null;
        });
    }
}
