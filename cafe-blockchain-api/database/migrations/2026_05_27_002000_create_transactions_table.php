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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'thu' (thu nhập) hoặc 'chi' (chi phí)
            $table->decimal('amount', 15, 2); // Số tiền thu/chi
            $table->string('category'); // Hạng mục thu chi (ví dụ: Nguyên liệu, Tiền mặt, v.v.)
            $table->text('description')->nullable(); // Ghi chú
            $table->date('transaction_date'); // Ngày giao dịch
            $table->string('store_owner_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
