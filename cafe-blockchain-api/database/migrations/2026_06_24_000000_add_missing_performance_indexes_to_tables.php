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
        // 1. Bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->index('tx_hash', 'idx_orders_tx_hash');
            $table->index(['store_owner_address', 'updated_at'], 'idx_orders_tenant_updated');
            $table->index(['store_owner_address', 'payment_method'], 'idx_orders_tenant_payment');
        });

        // 2. Bảng transactions
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('tx_hash', 'idx_trans_tx_hash');
            $table->index(['store_owner_address', 'transaction_date'], 'idx_trans_tenant_date');
        });

        // 3. Bảng shifts
        Schema::table('shifts', function (Blueprint $table) {
            $table->index(['store_owner_address', 'status', 'start_time'], 'idx_shifts_tenant_status_start');
            $table->index(['user_id', 'status'], 'idx_shifts_user_status');
        });

        // 4. Bảng customers
        Schema::table('customers', function (Blueprint $table) {
            $table->index(['store_owner_address', 'wallet_address'], 'idx_cust_tenant_wallet');
        });

        // 5. Bảng subscription_requests
        Schema::table('subscription_requests', function (Blueprint $table) {
            $table->index('store_owner_address', 'idx_sub_req_tenant');
            $table->index('status', 'idx_sub_req_status');
            $table->index('tx_hash', 'idx_sub_req_tx_hash');
        });

        // 6. Bảng menu_sync_logs
        Schema::table('menu_sync_logs', function (Blueprint $table) {
            $table->index('tx_hash', 'idx_menu_sync_tx_hash');
        });

        // 7. Bảng inventory_records
        Schema::table('inventory_records', function (Blueprint $table) {
            $table->index(['store_owner_address', 'type', 'record_date'], 'idx_inv_tenant_type_date');
        });

        // 8. Bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->index(['store_owner_address', 'status'], 'idx_prod_tenant_status');
            $table->index(['store_owner_address', 'type'], 'idx_prod_tenant_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_prod_tenant_type');
            $table->dropIndex('idx_prod_tenant_status');
        });

        Schema::table('inventory_records', function (Blueprint $table) {
            $table->dropIndex('idx_inv_tenant_type_date');
        });

        Schema::table('menu_sync_logs', function (Blueprint $table) {
            $table->dropIndex('idx_menu_sync_tx_hash');
        });

        Schema::table('subscription_requests', function (Blueprint $table) {
            $table->dropIndex('idx_sub_req_tx_hash');
            $table->dropIndex('idx_sub_req_status');
            $table->dropIndex('idx_sub_req_tenant');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex('idx_cust_tenant_wallet');
        });

        Schema::table('shifts', function (Blueprint $table) {
            $table->dropIndex('idx_shifts_user_status');
            $table->dropIndex('idx_shifts_tenant_status_start');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('idx_trans_tenant_date');
            $table->dropIndex('idx_trans_tx_hash');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_tenant_payment');
            $table->dropIndex('idx_orders_tenant_updated');
            $table->dropIndex('idx_orders_tx_hash');
        });
    }
};
