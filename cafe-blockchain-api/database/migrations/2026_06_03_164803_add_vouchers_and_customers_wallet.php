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

        // 2. Thêm voucher_nft_token_id và discount_amount vào bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('voucher_nft_token_id')->nullable()->after('total_amount');
            $table->integer('discount_amount')->default(0)->after('total_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['voucher_nft_token_id', 'discount_amount']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('wallet_address');
        });
    }
};
