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
        Schema::table('users', function (Blueprint $table) {
            $table->string('plan_code')->nullable()->default('free')->after('store_owner_address');
            $table->timestamp('subscription_expires_at')->nullable()->after('plan_code');
            $table->string('subscription_status')->default('active')->after('subscription_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['plan_code', 'subscription_expires_at', 'subscription_status']);
        });
    }
};
