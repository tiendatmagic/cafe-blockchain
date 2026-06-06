<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tạo bảng lưu lịch sử đồng bộ thực đơn lên Blockchain
     */
    public function up(): void
    {
        Schema::create('menu_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->string('store_owner_address', 42)->index();
            $table->string('synced_by', 42); // Địa chỉ ví wallet thực hiện đồng bộ
            $table->string('tx_hash', 100)->nullable(); // Transaction hash trên Blockchain
            $table->unsignedInteger('product_count')->default(0); // Số lượng sản phẩm đồng bộ
            $table->string('chain_id', 20)->nullable(); // Chain ID của mạng Blockchain
            $table->timestamps();
        });
    }

    /**
     * Rollback migration
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_sync_logs');
    }
};
