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
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->decimal('price_per_month', 15, 2)->default(0)->after('is_active');
            $table->decimal('price_per_year', 15, 2)->default(0)->after('price_per_month');
        });

        // Cập nhật giá mặc định cho các gói hiện có
        DB::table('subscription_plans')->where('code', 'free')->update([
            'price_per_month' => 0,
            'price_per_year' => 0
        ]);

        DB::table('subscription_plans')->where('code', 'pro')->update([
            'price_per_month' => 150000, // 150.000 VND / tháng
            'price_per_year' => 1500000  // 1.500.000 VND / năm
        ]);

        DB::table('subscription_plans')->where('code', 'ultra')->update([
            'price_per_month' => 300000, // 300.000 VND / tháng
            'price_per_year' => 3000000  // 3.000.000 VND / năm
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn(['price_per_month', 'price_per_year']);
        });
    }
};
