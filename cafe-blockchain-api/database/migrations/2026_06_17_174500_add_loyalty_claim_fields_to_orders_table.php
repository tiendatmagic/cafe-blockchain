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
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_points_claimed')->default(false)->after('shift_id');
            $table->integer('claim_attempts')->default(0)->after('is_points_claimed');
            $table->timestamp('last_claim_attempt_at')->nullable()->after('claim_attempts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['is_points_claimed', 'claim_attempts', 'last_claim_attempt_at']);
        });
    }
};
