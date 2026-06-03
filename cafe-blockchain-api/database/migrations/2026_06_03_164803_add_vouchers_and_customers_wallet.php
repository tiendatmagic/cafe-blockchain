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
        // 1. Thêm wallet_address vào bảng customers
        Schema::table('customers', function (Blueprint $table) {
            $table->string('wallet_address')->nullable()->after('email');
        });

        // 2. Tạo bảng vouchers
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('cascade');
            $table->string('wallet_address')->nullable();
            $table->integer('discount_amount')->default(0);
            $table->integer('min_order_amount')->default(0);
            $table->string('status')->default('active'); // active, used, expired
            $table->string('tx_hash')->nullable();
            $table->string('store_owner_address')->nullable();
            $table->timestamps();
        });

        // 3. Thêm voucher_id và discount_amount vào bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('voucher_id')->nullable()->constrained('vouchers')->onDelete('set null');
            $table->integer('discount_amount')->default(0)->after('total_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['voucher_id']);
            $table->dropColumn(['voucher_id', 'discount_amount']);
        });

        Schema::dropIfExists('vouchers');

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('wallet_address');
        });
    }
};
