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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_code')->nullable()->unique()->index()->after('id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->string('transaction_code')->nullable()->unique()->index()->after('id');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('customer_code')->nullable()->unique()->index()->after('id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->nullable()->unique()->index()->after('id');
        });

        Schema::table('inventory_records', function (Blueprint $table) {
            $table->string('record_code')->nullable()->unique()->index()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('order_code');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('transaction_code');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('customer_code');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sku');
        });

        Schema::table('inventory_records', function (Blueprint $table) {
            $table->dropColumn('record_code');
        });
    }
};
