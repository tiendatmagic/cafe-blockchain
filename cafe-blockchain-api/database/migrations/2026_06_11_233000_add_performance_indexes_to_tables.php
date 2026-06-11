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
        // 1. Chỉ mục đơn cho store_owner_address trên các bảng tenancy
        Schema::table('users', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('customer_groups', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('inventory_records', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('areas', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('dining_tables', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        Schema::table('voucher_signatures', function (Blueprint $table) {
            $table->index('store_owner_address');
        });

        // 2. Chỉ mục hỗn hợp (Composite Index) cho các bảng query tần suất cao hoặc báo cáo
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['store_owner_address', 'status', 'created_at'], 'idx_orders_tenant_status_date');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->index(['store_owner_address', 'type', 'transaction_date'], 'idx_trans_tenant_type_date');
            $table->index('store_owner_address');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->index(['store_owner_address', 'phone'], 'idx_cust_tenant_phone');
            $table->index('store_owner_address');
        });

        // 3. Chỉ mục đơn cho cột category_id trong bảng pivot category_product
        Schema::table('category_product', function (Blueprint $table) {
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_product', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex('idx_cust_tenant_phone');
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('idx_trans_tenant_type_date');
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_tenant_status_date');
        });

        Schema::table('voucher_signatures', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('dining_tables', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('areas', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('inventory_records', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('customer_groups', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['store_owner_address']);
        });
    }
};
