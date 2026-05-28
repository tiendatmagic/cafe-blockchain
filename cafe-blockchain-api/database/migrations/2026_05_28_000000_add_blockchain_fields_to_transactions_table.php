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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('tx_hash')->nullable()->after('store_owner_address');
            $table->string('blockchain_status')->default('none')->after('tx_hash'); // none, pending, success, failed
            $table->string('chain_id')->nullable()->after('blockchain_status');
            $table->string('verification_hash')->nullable()->after('chain_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['tx_hash', 'blockchain_status', 'chain_id', 'verification_hash']);
        });
    }
};
