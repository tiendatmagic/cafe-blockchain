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
        Schema::create('subscription_requests', function (Blueprint $table) {
            $table->id();
            $table->string('store_owner_address');
            $table->string('plan_code');
            $table->integer('duration_months');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('system_payment_method_id')->nullable();
            $table->foreign('system_payment_method_id')->references('id')->on('system_payment_methods')->onDelete('set null');
            $table->string('tx_hash')->nullable();
            $table->string('status')->default('pending'); // 'pending', 'approved', 'rejected'
            $table->text('rejected_reason')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_requests');
    }
};
