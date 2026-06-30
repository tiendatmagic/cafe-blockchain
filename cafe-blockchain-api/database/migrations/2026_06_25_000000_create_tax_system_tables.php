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
        // 1. Thêm các cột thuế vào các bảng hiện có
        if (!Schema::hasColumn('products', 'tax_rate')) {
            Schema::table('products', function (Blueprint $table) {
                $table->float('tax_rate')->nullable()->after('price'); // Thuế suất riêng của sản phẩm
            });
        }

        if (!Schema::hasColumn('orders', 'tax_amount')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->decimal('tax_amount', 15, 2)->default(0.00)->after('discount_amount'); // Tổng tiền thuế đơn hàng
            });
        }

        if (!Schema::hasColumn('order_items', 'tax_rate') || !Schema::hasColumn('order_items', 'tax_amount')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (!Schema::hasColumn('order_items', 'tax_rate')) {
                    $table->float('tax_rate')->nullable()->after('price'); // Thuế suất tại thời điểm mua
                }
                if (!Schema::hasColumn('order_items', 'tax_amount')) {
                    $table->decimal('tax_amount', 15, 2)->default(0.00)->after('price'); // Tiền thuế tại thời điểm mua
                }
            });
        }

        // 2. Tạo bảng tax_profiles (Hồ sơ khảo sát thuế của quán)
        if (!Schema::hasTable('tax_profiles')) {
            Schema::create('tax_profiles', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('store_owner_address', 50)->unique(); // Địa chỉ ví chủ quán
                $table->integer('business_group'); // Nhóm doanh thu năm (1, 2, 3, 4)
                $table->string('industry_type'); // Ngành nghề kinh doanh chính
                $table->boolean('is_multi_industry')->default(false); // Có kinh doanh nhiều ngành
                $table->json('industry_allocation')->nullable(); // Phân bổ tỷ lệ % doanh thu các ngành
                $table->string('tax_method'); // Phương pháp tính thuế TNCN
                $table->timestamps();
            });
        }
 
        // 3. Tạo bảng tax_periods (Kỳ kê khai thuế)
        if (!Schema::hasTable('tax_periods')) {
            Schema::create('tax_periods', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('store_owner_address', 50);
                $table->string('period_type', 20); // month, quarter, year
                $table->integer('period_value'); // tháng (1-12), quý (1-4), năm
                $table->integer('period_year'); // năm kê khai
                $table->string('status')->default('open'); // open, locked
                $table->decimal('revenue_amount', 15, 2)->default(0.00); // Doanh thu ghi nhận
                $table->decimal('expense_amount', 15, 2)->default(0.00); // Chi phí ghi nhận
                $table->decimal('estimated_vat', 15, 2)->default(0.00); // Thuế GTGT ước tính
                $table->decimal('estimated_pit', 15, 2)->default(0.00); // Thuế TNCN ước tính
                $table->timestamps();

                // Đánh index để truy vấn nhanh và tránh tạo trùng kỳ kê khai
                $table->index(['store_owner_address', 'period_year', 'period_type', 'period_value'], 'idx_tax_periods_owner_time');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_periods');
        Schema::dropIfExists('tax_profiles');

        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                $columns = [];
                if (Schema::hasColumn('order_items', 'tax_rate')) {
                    $columns[] = 'tax_rate';
                }
                if (Schema::hasColumn('order_items', 'tax_amount')) {
                    $columns[] = 'tax_amount';
                }
                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }

        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (Schema::hasColumn('orders', 'tax_amount')) {
                    $table->dropColumn('tax_amount');
                }
            });
        }

        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (Schema::hasColumn('products', 'tax_rate')) {
                    $table->dropColumn('tax_rate');
                }
            });
        }
    }
};
