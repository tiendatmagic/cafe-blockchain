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
        // Dọn dẹp bảng nếu đã bị tạo dở dang ở lượt chạy lỗi trước đó
        Schema::dropIfExists('debt_logs');

        Schema::create('debt_logs', function (Blueprint $table) {
            $table->id();
            $table->string('store_owner_address')->index();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('order_id', 36)->nullable()->index(); // ID đơn hàng dùng UUIDv7 (string)
            $table->string('transaction_id', 36)->nullable()->index(); // ID giao dịch dùng UUIDv7 (string)
            $table->string('type'); // 'debt' (nợ thêm) hoặc 'payment' (trả bớt)
            $table->decimal('amount', 15, 2);
            $table->text('note')->nullable();
            $table->date('recorded_at');
            $table->timestamps();

            // Ràng buộc các khóa ngoại dùng UUIDv7
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debt_logs');
    }
};
