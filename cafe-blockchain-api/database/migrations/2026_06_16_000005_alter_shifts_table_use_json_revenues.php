<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            // Drop các cột doanh thu và chi phí tĩnh cũ
            $table->dropColumn([
                'total_fiat_revenue',
                'total_bank_transfer_revenue',
                'total_crypto_revenue',
                'total_fiat_expenses'
            ]);

            // Thêm các cột JSON mới để lưu trữ động
            $table->json('payment_revenues')->nullable();
            $table->json('payment_expenses')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropColumn(['payment_revenues', 'payment_expenses']);

            $table->decimal('total_fiat_revenue', 15, 2)->default(0);
            $table->decimal('total_bank_transfer_revenue', 15, 2)->default(0);
            $table->decimal('total_crypto_revenue', 15, 2)->default(0);
            $table->decimal('total_fiat_expenses', 15, 2)->default(0);
        });
    }
};
