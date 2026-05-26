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
        Schema::create('customer_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('store_owner_address')->nullable();
            $table->timestamps();
        });

        Schema::create('customer_customer_group', function (Blueprint $table) {
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_group_id')->constrained()->onDelete('cascade');
            $table->primary(['customer_id', 'customer_group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_customer_group');
        Schema::dropIfExists('customer_groups');
    }
};
