<?php

namespace App\Http\Controllers;

use App\Infrastructure\Persistence\Eloquent\OrderModel as Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Lấy dữ liệu tổng quan
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        // Nhận bộ lọc thời gian từ query
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        if (empty($startDate) || empty($endDate)) {
            $startDate = Carbon::today()->subDays(6)->toDateString();
            $endDate = Carbon::today()->toDateString();
        }

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

        // 5. Biểu đồ doanh thu trong kỳ (theo start_date và end_date)
        $weeklyChart = [];
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $daysDiff = $start->diffInDays($end);

        // Giới hạn tối đa 60 ngày để tránh quá tải CPU/RAM
        $limitDays = min($daysDiff, 60);
        $queryEndDate = $start->copy()->addDays($limitDays)->toDateString();

        $dailyStats = DB::table('orders')
            ->where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $queryEndDate . ' 23:59:59'])
            ->selectRaw('
                DATE(created_at) as date,
                SUM(total_amount) as revenue,
                SUM(CASE WHEN payment_method = "crypto" THEN total_amount ELSE 0 END) as crypto_revenue
            ')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');

        for ($i = 0; $i <= $limitDays; $i++) {
            $date = $start->copy()->addDays($i);
            $dateStr = $date->format('Y-m-d');
            $dayName = $this->getVietnameseDayName($date->dayOfWeek);

            $dayData = $dailyStats->get($dateStr);
            $revenue = (float)($dayData->revenue ?? 0);
            $cryptoRevenue = (float)($dayData->crypto_revenue ?? 0);
            $fiatRevenue = $revenue - $cryptoRevenue;

            $weeklyChart[] = [
                'date' => $dateStr,
                'day_name' => $dayName,
                'revenue' => $revenue,
                'crypto_revenue' => $cryptoRevenue,
                'fiat_revenue' => $fiatRevenue
            ];
        }

        // 6. Giao dịch Blockchain mới (đơn hàng có sync blockchain)
        $latestBlockchainTransactions = Order::where('store_owner_address', $storeOwner)
            ->whereNotNull('tx_hash')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get(['id', 'table_number', 'total_amount', 'tx_hash', 'blockchain_status', 'updated_at']);

        // 7. Thống kê phương thức thanh toán trong khoảng thời gian được lọc
        $paymentMethodsStats = Order::where('store_owner_address', $storeOwner)
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
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

        // 8. Top 5 sản phẩm bán chạy nhất trong khoảng thời gian được lọc
        $bestSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->where('orders.store_owner_address', $storeOwner)
            ->where('orders.status', 'completed')
            ->whereBetween('orders.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->select(
                'products.name as name',
                'product_variants.variant_name as variant_name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'product_variants.id', 'product_variants.variant_name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        // 9. Tính toán cảnh báo tồn kho thấp (các sản phẩm có tồn kho <= 10)
        $products = \App\Domain\Entities\Product::where('store_owner_address', $storeOwner)->with('variants')->get();
        $inventoryRecords = \App\Domain\Entities\InventoryRecord::where('store_owner_address', $storeOwner)->with('items')->get();
        $completedOrders = Order::where('store_owner_address', $storeOwner)->where('status', 'completed')->with('items')->get();

        // Tiền xử lý (Pre-index) nhóm dữ liệu theo product_id và variant_id để đạt độ phức tạp O(1) khi truy xuất
        $recordsGrouped = [];
        foreach ($inventoryRecords as $r) {
            $rDate = Carbon::parse($r->record_date);
            foreach ($r->items as $item) {
                $key = $item->product_id . '-' . ($item->product_variant_id ?: '0');
                $recordsGrouped[$key][] = [
                    'type' => $r->type,
                    'date' => $rDate,
                    'quantity' => (int)$item->quantity
                ];
            }
        }

        $ordersGrouped = [];
        foreach ($completedOrders as $o) {
            $oDate = Carbon::parse($o->created_at);
            foreach ($o->items as $item) {
                $key = $item->product_id . '-' . ($item->product_variant_id ?: '0');
                $ordersGrouped[$key][] = [
                    'date' => $oDate,
                    'quantity' => (int)$item->quantity
                ];
            }
        }

        $lowStockAlerts = [];
        foreach ($products as $p) {
            $variants = $p->variants;
            if (count($variants) > 0) {
                foreach ($variants as $v) {
                    $key = $p->id . '-' . $v->id;
                    $stock = $this->calculateStockGrouped($key, $recordsGrouped, $ordersGrouped);
                    if ($stock <= 10) {
                        $lowStockAlerts[] = [
                            'product_name' => $p->name,
                            'variant_name' => $v->variant_name,
                            'sku' => $v->sku ?? $p->sku,
                            'stock' => $stock
                        ];
                    }
                }
            } else {
                $key = $p->id . '-0';
                $stock = $this->calculateStockGrouped($key, $recordsGrouped, $ordersGrouped);
                if ($stock <= 10) {
                    $lowStockAlerts[] = [
                        'product_name' => $p->name,
                        'variant_name' => null,
                        'sku' => $p->sku,
                        'stock' => $stock
                    ];
                }
            }
        }

        // 10. Trạng thái bàn ăn
        $totalTables = \App\Domain\Entities\DiningTable::where('store_owner_address', $storeOwner)->count();
        $occupiedTables = \App\Domain\Entities\DiningTable::where('store_owner_address', $storeOwner)->where('status', 'using')->count();

        // 11. Thống kê Voucher NFT từ bảng orders
        $totalVouchers = Order::where('store_owner_address', $storeOwner)->whereNotNull('gift_voucher_nft_token_id')->count();
        $usedVouchers = Order::where('store_owner_address', $storeOwner)->where('status', 'completed')->whereNotNull('voucher_nft_token_id')->count();
        $totalDiscount = (float)Order::where('store_owner_address', $storeOwner)->where('status', 'completed')->whereNotNull('voucher_nft_token_id')->sum('discount_amount');

        return response()->json([
            'today_revenue' => (float)$todayRevenue,
            'today_orders_count' => $todayOrdersCount,
            'total_revenue' => (float)$totalRevenue,
            'total_orders_count' => $totalOrdersCount,
            'web3_revenue' => (float)$web3Revenue,
            'pending_web3_count' => $pendingWeb3Count,
            'weekly_chart' => $weeklyChart,
            'latest_blockchain_transactions' => $latestBlockchainTransactions,
            'payment_methods_chart' => $paymentMethodsChart,
            'best_sellers' => $bestSellers,
            'low_stock_alerts' => $lowStockAlerts,
            'tables_occupancy' => [
                'total' => $totalTables,
                'occupied' => $occupiedTables,
                'vacant' => max(0, $totalTables - $occupiedTables)
            ],
            'voucher_activity' => [
                'total_minted' => $totalVouchers,
                'used' => $usedVouchers,
                'total_discount' => $totalDiscount
            ]
        ]);
    }

    /**
     * Thuật toán tính toán tồn kho đã được tối ưu dựa trên nhóm dữ liệu đã tiền xử lý
     */
    private function calculateStockGrouped($key, $recordsGrouped, $ordersGrouped)
    {
        $latestKiemDate = null;
        $latestKiemQty = 0;

        $pRecords = $recordsGrouped[$key] ?? [];
        $pOrders = $ordersGrouped[$key] ?? [];

        // Tìm phiếu kiểm kho gần nhất của riêng sản phẩm/biến thể này
        foreach ($pRecords as $r) {
            if ($r['type'] === 'kiem') {
                if ($latestKiemDate === null || $r['date']->gt($latestKiemDate)) {
                    $latestKiemDate = $r['date'];
                    $latestKiemQty = $r['quantity'];
                }
            }
        }

        $totalIn = 0;
        $totalOut = 0;
        $totalSold = 0;

        // Cộng các giao dịch nhập/xuất sau ngày kiểm kho
        foreach ($pRecords as $r) {
            if ($latestKiemDate === null || $r['date']->gt($latestKiemDate)) {
                if ($r['type'] === 'nhap') {
                    $totalIn += $r['quantity'];
                } elseif ($r['type'] === 'xuat') {
                    $totalOut += $r['quantity'];
                }
            }
        }

        // Trừ các sản phẩm bán ra từ đơn hàng hoàn thành sau ngày kiểm kho
        foreach ($pOrders as $o) {
            if ($latestKiemDate === null || $o['date']->gt($latestKiemDate)) {
                $totalSold += $o['quantity'];
            }
        }

        $baseQty = $latestKiemDate !== null ? $latestKiemQty : 0;
        return $baseQty + $totalIn - $totalOut - $totalSold;
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