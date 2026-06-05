<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tắt kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // ==========================================
        // XỬ LÝ BẢNG ORDERS VÀ ORDER_ITEMS
        // ==========================================
        
        // A. Thêm cột UUID tạm thời
        Schema::table('orders', function (Blueprint $table) {
            $table->char('uuid_id', 36)->nullable()->after('id');
        });
        Schema::table('order_items', function (Blueprint $table) {
            $table->char('uuid_order_id', 36)->nullable()->after('order_id');
        });

        // B. Sinh UUIDv7 cho các hóa đơn cũ và ánh xạ sang order_items
        $orders = DB::table('orders')->get();
        foreach ($orders as $order) {
            // Laravel 11+ hỗ trợ Str::uuid7()
            $uuid = (string) Str::uuid7();
            
            // Cập nhật uuid_id mới vào orders
            DB::table('orders')->where('id', $order->id)->update([
                'uuid_id' => $uuid
            ]);

            // Cập nhật uuid_order_id vào order_items liên kết
            DB::table('order_items')->where('order_id', $order->id)->update([
                'uuid_order_id' => $uuid
            ]);
        }

        // Đảm bảo không còn hàng nào null (nếu DB rỗng thì không sao)
        DB::table('orders')->whereNull('uuid_id')->update(['uuid_id' => DB::raw('(UUID())')]);

        // C. Xóa các khóa ngoại cũ, cột cũ và đổi tên cột mới
        Schema::table('order_items', function (Blueprint $table) {
            // Xóa khóa ngoại cũ
            $table->dropForeign(['order_id']);
            $table->dropColumn('order_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            // MySQL yêu cầu loại bỏ AUTO_INCREMENT trước khi drop primary key
            // Trong Laravel, cách đơn giản nhất là drop cột id cũ
            $table->dropColumn('id');
        });

        // D. Đổi tên cột tạm thời thành tên cột chính và đặt PRIMARY KEY / FOREIGN KEY
        Schema::table('orders', function (Blueprint $table) {
            $table->char('uuid_id', 36)->change();
            $table->renameColumn('uuid_id', 'id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->primary('id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->renameColumn('uuid_order_id', 'order_id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->char('order_id', 36)->change();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        // ==========================================
        // XỬ LÝ BẢNG TRANSACTIONS
        // ==========================================

        // A. Thêm cột UUID tạm thời
        Schema::table('transactions', function (Blueprint $table) {
            $table->char('uuid_id', 36)->nullable()->after('id');
        });

        // B. Sinh UUIDv7 cho các giao dịch cũ
        $transactions = DB::table('transactions')->get();
        foreach ($transactions as $tx) {
            $uuid = (string) Str::uuid7();
            DB::table('transactions')->where('id', $tx->id)->update([
                'uuid_id' => $uuid
            ]);
        }

        DB::table('transactions')->whereNull('uuid_id')->update(['uuid_id' => DB::raw('(UUID())')]);

        // C. Xóa cột id cũ và đổi tên
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->char('uuid_id', 36)->change();
            $table->renameColumn('uuid_id', 'id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->primary('id');
        });

        // 2. Bật lại kiểm tra khóa ngoại
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Không khuyến khích rollback vì UUID -> INT tự tăng sẽ làm mất liên kết dữ liệu cũ
        // Nhưng ta viết logic rollback tối thiểu bằng cách đổi lại kiểu dữ liệu sang BIGINT tự tăng
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Orders rollback
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropPrimary();
            $table->bigIncrements('temp_id')->first();
        });

        // Đồng bộ lại ID tạm thời cho order_items
        $orders = DB::table('orders')->get();
        foreach ($orders as $o) {
            DB::table('order_items')->where('order_id', $o->id)->update([
                'order_id' => (string) $o->temp_id
            ]);
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('temp_id', 'id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedBigInteger('temp_order_id')->nullable()->after('order_id');
        });

        // Update values
        $items = DB::table('order_items')->get();
        foreach ($items as $item) {
            DB::table('order_items')->where('id', $item->id)->update([
                'temp_order_id' => (int) $item->order_id
            ]);
        }

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('order_id');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->renameColumn('temp_order_id', 'order_id');
            $table->unsignedBigInteger('order_id')->nullable(false)->change();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        // Transactions rollback
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropPrimary();
            $table->bigIncrements('temp_id')->first();
            $table->dropColumn('id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->renameColumn('temp_id', 'id');
        });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
};
