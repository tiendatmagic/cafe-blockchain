<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('table_number')->nullable();
            $table->decimal('total_amount', 15, 2);
            $table->string('payment_method'); // cash, bank_transfer, crypto
            $table->string('status')->default('pending'); // pending, completed, cancelled
            $table->string('tx_hash')->nullable();
            $table->string('blockchain_status')->default('none'); // none, pending, success, failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
