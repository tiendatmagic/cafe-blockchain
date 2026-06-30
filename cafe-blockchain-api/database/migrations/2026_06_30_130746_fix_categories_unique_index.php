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
        Schema::table('categories', function (Blueprint $table) {
            // Xóa unique key cũ (categories_name_unique)
            $table->dropUnique('categories_name_unique');
            // Tạo composite unique key mới gồm tên và địa chỉ ví chủ quán
            $table->unique(['name', 'store_owner_address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropUnique(['name', 'store_owner_address']);
            $table->unique('name');
        });
    }
};
