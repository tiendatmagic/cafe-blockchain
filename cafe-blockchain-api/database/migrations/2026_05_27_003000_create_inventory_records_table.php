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
        Schema::create('inventory_records', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'nhap' (nhập kho), 'xuat' (xuất kho), 'kiem' (kiểm hàng)
            $table->text('note')->nullable(); // Ghi chú
            $table->dateTime('record_date'); // Ngày lập phiếu
            $table->string('store_owner_address')->nullable();
            $table->timestamps();
        });

        Schema::create('inventory_record_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_record_id')->constrained('inventory_records')->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_variant_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('quantity'); // Số lượng
            $table->decimal('price', 15, 2)->default(0); // Đơn giá nhập/xuất (nếu có, ví dụ 0 đối với kiểm hàng)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_record_items');
        Schema::dropIfExists('inventory_records');
    }
};
