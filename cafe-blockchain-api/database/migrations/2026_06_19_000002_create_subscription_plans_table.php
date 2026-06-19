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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->boolean('is_active')->default(true)->index();
            $table->json('features')->nullable();
            $table->timestamps();
        });

        // Chèn sẵn 3 gói cước cơ bản
        DB::table('subscription_plans')->insert([
            [
                'code' => 'free',
                'name' => 'Gói Dùng thử (Free)',
                'is_active' => true,
                'features' => json_encode([
                    'max_products' => 20,
                    'max_staffs' => 2,
                    'enable_storefront' => false,
                    'enable_reports' => false,
                    'enable_excel_export' => false,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'pro',
                'name' => 'Gói Chuyên nghiệp (Pro)',
                'is_active' => true,
                'features' => json_encode([
                    'max_products' => 500,
                    'max_staffs' => 10,
                    'enable_storefront' => true,
                    'enable_reports' => true,
                    'enable_excel_export' => true,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'ultra',
                'name' => 'Gói Vô hạn (Ultra)',
                'is_active' => true,
                'features' => json_encode([
                    'max_products' => -1, // -1 nghĩa là không giới hạn
                    'max_staffs' => -1,
                    'enable_storefront' => true,
                    'enable_reports' => true,
                    'enable_excel_export' => true,
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
