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
        Schema::create('system_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'bank' hoặc 'wallet'
            $table->string('name'); // Ví dụ: 'Vietcombank', 'Momo'
            $table->string('account_number'); // Số tài khoản ngân hàng hoặc số điện thoại ví
            $table->string('account_holder'); // Tên chủ tài khoản
            $table->string('bank_code')->nullable(); // Mã ngân hàng phục vụ sinh QR VietQR (ví dụ: 'vcb', 'mb'...)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_payment_methods');
    }
};
