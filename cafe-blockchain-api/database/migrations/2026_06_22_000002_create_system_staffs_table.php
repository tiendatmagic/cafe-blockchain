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
        Schema::create('system_staffs', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address')->unique();
            $table->string('name');
            $table->string('role')->default('staff'); // 'staff', 'admin'
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_staffs');
    }
};
