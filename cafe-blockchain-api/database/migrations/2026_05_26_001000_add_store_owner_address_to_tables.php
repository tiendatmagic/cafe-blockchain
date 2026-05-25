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
        // 1. Bảng users
        Schema::table('users', function (Blueprint $table) {
            $table->string('store_owner_address')->nullable()->after('wallet_address');
        });

        // 2. Bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->string('store_owner_address')->nullable()->after('status');
        });

        // 3. Bảng categories
        Schema::table('categories', function (Blueprint $table) {
            $table->string('store_owner_address')->nullable()->after('name');
        });

        // 4. Bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->string('store_owner_address')->nullable()->after('blockchain_status');
        });

        // 5. Bảng settings (Xóa unique key_chain_id cũ và tạo composite unique mới)
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique('settings_key_chain_id_unique');
            $table->string('store_owner_address')->nullable()->after('value');
            $table->unique(['key', 'store_owner_address']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique('settings_key_store_owner_address_unique');
            $table->dropColumn('store_owner_address');
            $table->unique(['key', 'chain_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('store_owner_address');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('store_owner_address');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('store_owner_address');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('store_owner_address');
        });
    }
};
