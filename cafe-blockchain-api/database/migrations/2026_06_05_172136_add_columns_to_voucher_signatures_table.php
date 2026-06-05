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
        Schema::table('voucher_signatures', function (Blueprint $table) {
            $table->string('store_owner_address')->nullable()->after('token_id');
            $table->longText('temp_order_data')->nullable()->after('store_owner_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('voucher_signatures', function (Blueprint $table) {
            $table->dropColumn(['store_owner_address', 'temp_order_data']);
        });
    }
};
