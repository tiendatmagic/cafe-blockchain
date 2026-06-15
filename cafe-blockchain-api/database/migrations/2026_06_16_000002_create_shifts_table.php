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
        // 1. Tạo bảng shifts
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('store_owner_address')->index();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->decimal('initial_cash', 15, 2);
            $table->decimal('actual_cash', 15, 2)->nullable();
            $table->decimal('expected_cash', 15, 2)->nullable();
            $table->decimal('total_fiat_revenue', 15, 2)->default(0);
            $table->decimal('total_bank_transfer_revenue', 15, 2)->default(0);
            $table->decimal('total_crypto_revenue', 15, 2)->default(0);
            $table->decimal('total_fiat_expenses', 15, 2)->default(0);
            $table->string('status')->default('open')->index(); // 'open', 'closed'
            $table->text('note')->nullable();
            $table->timestamps();
        });

        // 2. Thêm cột shift_id vào bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->onDelete('set null');
        });

        // 3. Thêm cột shift_id vào bảng transactions (sổ thu chi)
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropColumn('shift_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropColumn('shift_id');
        });

        Schema::dropIfExists('shifts');
    }
};
