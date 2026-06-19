<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $plan = DB::table('subscription_plans')->where('code', 'free')->first();
        if ($plan) {
            $features = json_decode($plan->features, true) ?: [];
            $features['enable_shifts'] = false;
            DB::table('subscription_plans')
                ->where('code', 'free')
                ->update(['features' => json_encode($features)]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $plan = DB::table('subscription_plans')->where('code', 'free')->first();
        if ($plan) {
            $features = json_decode($plan->features, true) ?: [];
            $features['enable_shifts'] = true;
            DB::table('subscription_plans')
                ->where('code', 'free')
                ->update(['features' => json_encode($features)]);
        }
    }
};
