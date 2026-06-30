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
        Schema::table('products', function (Blueprint $table) {
            // Xóa index unique cũ của cột sku
            $table->dropUnique('products_sku_unique');
            // Tạo composite unique index mới gồm mã SKU và địa chỉ ví chủ quán
            $table->unique(['sku', 'store_owner_address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['sku', 'store_owner_address']);
            $table->unique('sku');
        });
    }
};
