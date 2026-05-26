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
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('store_owner_address')->nullable();
            $table->timestamps();
        });

        Schema::create('dining_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('area_id')->nullable()->constrained('areas')->onDelete('set null');
            $table->string('status')->default('empty'); // 'empty' (còn trống), 'using' (đang sử dụng)
            $table->string('store_owner_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dining_tables');
        Schema::dropIfExists('areas');
    }
};
