<?php

namespace App\Http\Controllers;

use App\Infrastructure\Persistence\Eloquent\OrderModel as Order;
use App\Domain\Entities\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Lấy báo cáo tổng quan dành cho chủ quán
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        // Lọc theo mốc thời gian (mặc định 7 ngày qua)
        $startDate = $request->input('start_date', Carbon::now()->subDays(6)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        $startDateObj = Carbon::parse($startDate);
        $endDateObj = Carbon::parse($endDate);

        $isHistory = $endDateObj->isBefore(Carbon::today());
        $ttl = $isHistory ? 604800 : 120; // 1 tuần (lịch sử) hoặc 2 phút (ngày hôm nay / động)

        $cacheKey = "store_reports:{$storeOwner}:{$startDate}:{$endDate}";

        // Đăng ký cache key động của cửa hàng vào danh sách quản lý
        \App\Domain\Entities\Setting::registerCacheKey($storeOwner, $cacheKey);

        $data = \Illuminate\Support\Facades\Cache::remember($cacheKey, $ttl, function () use ($storeOwner, $startDate, $endDate) {
            // 1. Báo cáo Tài chính Lãi lỗ (Profit & Loss)
            // Doanh thu từ hóa đơn hoàn thành
            $revenue = (float)Order::where('store_owner_address', $storeOwner)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->sum('total_amount');

            // Giá vốn hàng bán (COGS)
            $cogsData = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.store_owner_address', $storeOwner)
                ->where('orders.status', 'completed')
                ->whereBetween('orders.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->selectRaw('SUM(COALESCE(order_items.cost_price, 0) * order_items.quantity) as total_cogs')
                ->first();
            $totalCogs = (float)($cogsData->total_cogs ?? 0);

            // Lợi nhuận gộp
            $grossProfit = $revenue - $totalCogs;

            // Chi phí vận hành từ các giao dịch chi
            $expenses = (float)Transaction::where('store_owner_address', $storeOwner)
                ->where('type', 'chi')
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->sum('amount');

            // Doanh thu khác từ các giao dịch thu
            $otherIncome = (float)Transaction::where('store_owner_address', $storeOwner)
                ->where('type', 'thu')
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->sum('amount');

            // Lợi nhuận ròng
            $netProfit = $grossProfit - $expenses + $otherIncome;

            // 2. Báo cáo Hàng hóa bán chạy
            $productReport = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->where('orders.store_owner_address', $storeOwner)
                ->where('orders.status', 'completed')
                ->whereBetween('orders.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->selectRaw('
                    products.name as product_name,
                    product_variants.variant_name as variant_name,
                    products.sku as sku,
                    SUM(order_items.quantity) as total_quantity,
                    SUM(order_items.price * order_items.quantity) as total_revenue,
                    SUM(COALESCE(order_items.cost_price, 0) * order_items.quantity) as total_cost
                ')
                ->groupBy('products.id', 'products.name', 'product_variants.id', 'product_variants.variant_name', 'products.sku')
                ->orderByDesc('total_quantity')
                ->get()
                ->map(function ($item) {
                    $item->total_quantity = (int)$item->total_quantity;
                    $item->total_revenue = (float)$item->total_revenue;
                    $item->total_cost = (float)$item->total_cost;
                    $item->gross_profit = $item->total_revenue - $item->total_cost;
                    return $item;
                });

            // 3. Báo cáo Khách hàng chi tiêu
            $customerReport = DB::table('orders')
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->where('orders.store_owner_address', $storeOwner)
                ->where('orders.status', 'completed')
                ->whereBetween('orders.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->selectRaw('
                    customers.name as customer_name,
                    customers.phone as customer_phone,
                    customers.wallet_address as wallet_address,
                    COUNT(orders.id) as orders_count,
                    SUM(orders.total_amount) as total_spent
                ')
                ->groupBy('customers.id', 'customers.name', 'customers.phone', 'customers.wallet_address')
                ->orderByDesc('total_spent')
                ->get()
                ->map(function ($item) {
                    $item->orders_count = (int)$item->orders_count;
                    $item->total_spent = (float)$item->total_spent;
                    $item->average_order_value = $item->orders_count > 0 ? ($item->total_spent / $item->orders_count) : 0;
                    return $item;
                });

            // 4. Biểu đồ xu hướng (Doanh thu & Chi phí theo ngày)
            $dailyRevenue = DB::table('orders')
                ->where('store_owner_address', $storeOwner)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->selectRaw('
                    DATE(created_at) as date,
                    SUM(total_amount) as revenue,
                    SUM(CASE WHEN payment_method = "crypto" THEN total_amount ELSE 0 END) as crypto_revenue,
                    SUM(CASE WHEN payment_method != "crypto" THEN total_amount ELSE 0 END) as fiat_revenue
                ')
                ->groupBy(DB::raw('DATE(created_at)'))
                ->get()
                ->keyBy('date');

            $dailyExpenses = DB::table('transactions')
                ->where('store_owner_address', $storeOwner)
                ->where('type', 'chi')
                ->whereBetween('transaction_date', [$startDate, $endDate])
                ->selectRaw('
                    transaction_date as date,
                    SUM(amount) as expense
                ')
                ->groupBy('transaction_date')
                ->get()
                ->keyBy('date');

            $trendChart = [];
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);

            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                $dateStr = $date->toDateString();
                $revenueData = $dailyRevenue->get($dateStr);
                $expenseData = $dailyExpenses->get($dateStr);

                $dayOfWeek = $date->dayOfWeek;
                $dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                $dayName = $dayNames[$dayOfWeek] . ' ' . $date->format('d/m');

                $trendChart[] = [
                    'date' => $dateStr,
                    'day_name' => $dayName,
                    'revenue' => (float)($revenueData->revenue ?? 0),
                    'crypto_revenue' => (float)($revenueData->crypto_revenue ?? 0),
                    'fiat_revenue' => (float)($revenueData->fiat_revenue ?? 0),
                    'expense' => (float)($expenseData->expense ?? 0),
                ];
            }

            // 5. Cơ cấu phương thức thanh toán
            $paymentMethods = DB::table('orders')
                ->where('store_owner_address', $storeOwner)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->selectRaw('
                    payment_method as method,
                    SUM(total_amount) as amount,
                    COUNT(id) as count
                ')
                ->groupBy('payment_method')
                ->get()
                ->map(function ($item) {
                    $item->amount = (float)$item->amount;
                    $item->count = (int)$item->count;
                    return $item;
                });

            return [
                'financials' => [
                    'revenue' => $revenue,
                    'cogs' => $totalCogs,
                    'gross_profit' => $grossProfit,
                    'expenses' => $expenses,
                    'other_income' => $otherIncome,
                    'net_profit' => $netProfit,
                ],
                'products' => $productReport,
                'customers' => $customerReport,
                'trend_chart' => $trendChart,
                'payment_methods' => $paymentMethods,
            ];
        });

        return response()->json($data);
    }
}
