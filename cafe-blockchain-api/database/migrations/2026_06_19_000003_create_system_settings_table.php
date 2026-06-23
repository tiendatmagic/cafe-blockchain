<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->string('key', 191)->primary();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        // Chèn sẵn cấu hình dọn dẹp token mặc định
        DB::table('system_settings')->insert([
            'key' => 'token_cleanup_days',
            'value' => json_encode(['days' => 7]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
