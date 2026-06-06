<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Lấy dữ liệu tổng quan Dashboard
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $today = Carbon::today();
        
        // 1. Doanh thu hôm nay (các đơn completed hôm nay)
        $todayOrders = Order::where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->whereDate('created_at', $today);
            
        $todayRevenue = $todayOrders->sum('total_amount');
        $todayOrdersCount = $todayOrders->count();

        // 2. Tổng doanh thu (tất cả các đơn completed)
        $totalOrders = Order::where('store_owner_address', $storeOwner)->where('status', 'completed');
        $totalRevenue = $totalOrders->sum('total_amount');
        $totalOrdersCount = $totalOrders->count();

        // 3. Doanh thu Web3 (các đơn completed và blockchain_status = success)
        $web3Orders = Order::where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->where('blockchain_status', 'success');
        $web3Revenue = $web3Orders->sum('total_amount');
        
        // 4. Đơn chờ Web3 (các đơn completed nhưng blockchain_status = none hoặc pending)
        $pendingWeb3Count = Order::where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->whereIn('blockchain_status', ['none', 'pending'])
            ->count();

        // 5. Biểu đồ doanh thu tuần này (7 ngày gần nhất)
        $weeklyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayName = $this->getVietnameseDayName($date->dayOfWeek);
            
            $revenue = Order::where('store_owner_address', $storeOwner)
                ->where('status', 'completed')
                ->whereDate('created_at', $date)
                ->sum('total_amount');

            $weeklyChart[] = [
                'date' => $date->format('Y-m-d'),
                'day_name' => $dayName,
                'revenue' => (float)$revenue
            ];
        }

        // 6. Giao dịch Blockchain mới (đơn hàng có sync blockchain)
        $latestBlockchainTransactions = Order::where('store_owner_address', $storeOwner)
            ->whereNotNull('tx_hash')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get(['id', 'table_number', 'total_amount', 'tx_hash', 'blockchain_status', 'updated_at']);

        // 7. Thống kê phương thức thanh toán để vẽ biểu đồ hình tròn (các đơn completed)
        $paymentMethodsStats = Order::where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->select('payment_method', DB::raw('count(*) as count'), DB::raw('sum(total_amount) as amount'))
            ->groupBy('payment_method')
            ->get()
            ->keyBy('payment_method');

        $paymentMethodsChart = [
            [
                'method' => 'cash',
                'name' => 'Tiền mặt',
                'count' => isset($paymentMethodsStats['cash']) ? (int)$paymentMethodsStats['cash']->count : 0,
                'amount' => isset($paymentMethodsStats['cash']) ? (float)$paymentMethodsStats['cash']->amount : 0.0
            ],
            [
                'method' => 'bank_transfer',
                'name' => 'Chuyển khoản',
                'count' => isset($paymentMethodsStats['bank_transfer']) ? (int)$paymentMethodsStats['bank_transfer']->count : 0,
                'amount' => isset($paymentMethodsStats['bank_transfer']) ? (float)$paymentMethodsStats['bank_transfer']->amount : 0.0
            ],
            [
                'method' => 'crypto',
                'name' => 'Crypto Web3',
                'count' => isset($paymentMethodsStats['crypto']) ? (int)$paymentMethodsStats['crypto']->count : 0,
                'amount' => isset($paymentMethodsStats['crypto']) ? (float)$paymentMethodsStats['crypto']->amount : 0.0
            ],
            [
                'method' => 'e_wallet',
                'name' => 'Ví điện tử',
                'count' => isset($paymentMethodsStats['e_wallet']) ? (int)$paymentMethodsStats['e_wallet']->count : 0,
                'amount' => isset($paymentMethodsStats['e_wallet']) ? (float)$paymentMethodsStats['e_wallet']->amount : 0.0
            ]
        ];

        return response()->json([
            'today_revenue' => (float)$todayRevenue,
            'today_orders_count' => $todayOrdersCount,
            'total_revenue' => (float)$totalRevenue,
            'total_orders_count' => $totalOrdersCount,
            'web3_revenue' => (float)$web3Revenue,
            'pending_web3_count' => $pendingWeb3Count,
            'weekly_chart' => $weeklyChart,
            'latest_blockchain_transactions' => $latestBlockchainTransactions,
            'payment_methods_chart' => $paymentMethodsChart
        ]);
    }

    /**
     * Helper chuyển thứ tiếng Anh sang tiếng Việt ngắn gọn
     */
    private function getVietnameseDayName($dayOfWeek)
    {
        $days = [
            Carbon::SUNDAY => 'CN',
            Carbon::MONDAY => 'T2',
            Carbon::TUESDAY => 'T3',
            Carbon::WEDNESDAY => 'T4',
            Carbon::THURSDAY => 'T5',
            Carbon::FRIDAY => 'T6',
            Carbon::SATURDAY => 'T7',
        ];

        return $days[$dayOfWeek] ?? '';
    }
}
