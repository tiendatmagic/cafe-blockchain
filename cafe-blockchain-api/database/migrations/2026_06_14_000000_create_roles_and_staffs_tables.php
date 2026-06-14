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
        // 1. Bảng vai trò (roles)
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('store_owner_address')->index();
            $table->json('permissions')->nullable(); // Lưu trữ JSON config các quyền
            $table->timestamps();
        });

        // 2. Bảng nhân viên (staffs)
        Schema::create('staffs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('wallet_address')->unique(); // Địa chỉ ví duy nhất trên hệ thống
            $table->string('store_owner_address')->index(); // Địa chỉ ví admin của quán
            $table->foreignId('role_id')->constrained('roles')->onDelete('restrict'); // Chặn xóa vai trò đang gán cho nhân viên
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffs');
        Schema::dropIfExists('roles');
    }
};
