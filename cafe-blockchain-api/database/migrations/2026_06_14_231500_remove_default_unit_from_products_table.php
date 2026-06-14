<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('unit')->nullable()->default(null)->change();
        });

        // Cập nhật các sản phẩm đang có unit là 'Cái' về NULL
        DB::table('products')->where('unit', 'Cái')->update(['unit' => null]);
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('unit')->nullable()->default('Cái')->change();
        });
    }
};
