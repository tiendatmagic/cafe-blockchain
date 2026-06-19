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
        // Cập nhật các gói cước hiện tại với các giới hạn và tính năng mới
        $plans = DB::table('subscription_plans')->get();

        foreach ($plans as $plan) {
            $features = json_decode($plan->features, true) ?: [];

            // Thiết lập limits mặc định dựa trên gói
            if (!isset($features['max_customers'])) {
                $features['max_customers'] = $plan->code === 'free' ? 50 : ($plan->code === 'pro' ? 1000 : -1);
            }
            if (!isset($features['max_transactions'])) {
                $features['max_transactions'] = $plan->code === 'free' ? 100 : ($plan->code === 'pro' ? 5000 : -1);
            }
            if (!isset($features['max_debts'])) {
                $features['max_debts'] = $plan->code === 'free' ? 10 : ($plan->code === 'pro' ? 500 : -1);
            }

            // Thiết lập enable/disable các phân hệ tính năng
            $features['enable_dashboard'] = isset($features['enable_dashboard']) ? (bool)$features['enable_dashboard'] : true;
            $features['enable_pos']       = isset($features['enable_pos']) ? (bool)$features['enable_pos'] : true;
            $features['enable_orders']    = isset($features['enable_orders']) ? (bool)$features['enable_orders'] : true;
            $features['enable_tables']    = isset($features['enable_tables']) ? (bool)$features['enable_tables'] : true;
            $features['enable_shifts']    = isset($features['enable_shifts']) ? (bool)$features['enable_shifts'] : true;
            $features['enable_menu']      = isset($features['enable_menu']) ? (bool)$features['enable_menu'] : true;
            $features['enable_inventory'] = isset($features['enable_inventory']) ? (bool)$features['enable_inventory'] : ($plan->code !== 'free');
            $features['enable_customers'] = isset($features['enable_customers']) ? (bool)$features['enable_customers'] : true;
            $features['enable_debts']     = isset($features['enable_debts']) ? (bool)$features['enable_debts'] : ($plan->code !== 'free');
            $features['enable_financials']= isset($features['enable_financials']) ? (bool)$features['enable_financials'] : ($plan->code !== 'free');
            $features['enable_staffs']    = isset($features['enable_staffs']) ? (bool)$features['enable_staffs'] : true;

            // Các tính năng cũ được đồng nhất kiểu boolean
            $features['enable_storefront']   = isset($features['enable_storefront']) ? (bool)$features['enable_storefront'] : ($plan->code !== 'free');
            $features['enable_reports']      = isset($features['enable_reports']) ? (bool)$features['enable_reports'] : ($plan->code !== 'free');
            $features['enable_excel_export'] = isset($features['enable_excel_export']) ? (bool)$features['enable_excel_export'] : ($plan->code !== 'free');

            DB::table('subscription_plans')
                ->where('id', $plan->id)
                ->update(['features' => json_encode($features)]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Không cần đảo ngược vì đây chỉ là cập nhật dữ liệu JSON cấu hình
    }
};
