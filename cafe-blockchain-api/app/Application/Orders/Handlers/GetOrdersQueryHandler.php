<?php

namespace App\Application\Orders\Handlers;

use App\Application\Orders\Queries\GetOrdersQuery;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use Illuminate\Support\Collection;

class GetOrdersQueryHandler
{
    public function handle(GetOrdersQuery $query): Collection
    {
        $storeOwner = $query->storeOwner;
        $filters = $query->filters;

        $startOfCurrentMonth = \Carbon\Carbon::now()->startOfMonth();

        // 1. Lấy các đơn hàng thuộc tháng hiện tại từ DB (real-time)
        $currentMonthOrders = OrderModel::where('store_owner_address', $storeOwner)
            ->where('created_at', '>=', $startOfCurrentMonth)
            ->with(['customer', 'items.product', 'items.variant'])
            ->get()
            ->toArray();

        // 2. Tìm danh sách các tháng trong quá khứ có đơn hàng
        $pastMonths = OrderModel::where('store_owner_address', $storeOwner)
            ->where('created_at', '<', $startOfCurrentMonth)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month")
            ->groupBy('month')
            ->pluck('month');

        $pastOrders = [];
        foreach ($pastMonths as $month) {
            $monthOrders = \Illuminate\Support\Facades\Cache::remember("store_orders_history:{$storeOwner}:{$month}", 604800, function () use ($storeOwner, $month) {
                $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth();
                $end = \Carbon\Carbon::parse($month . '-01')->endOfMonth();
                return OrderModel::where('store_owner_address', $storeOwner)
                    ->whereBetween('created_at', [$start, $end])
                    ->with(['customer', 'items.product', 'items.variant'])
                    ->get()
                    ->toArray();
            });
            $pastOrders = array_merge($pastOrders, $monthOrders);
        }

        // 3. Trộn toàn bộ đơn hàng
        $allOrders = array_merge($currentMonthOrders, $pastOrders);

        // 4. Lọc dữ liệu qua Collection PHP theo bộ lọc
        $collection = collect($allOrders);

        if (isset($filters['status']) && $filters['status'] != 'all' && $filters['status'] != '') {
            $status = $filters['status'];
            $collection = $collection->filter(function ($item) use ($status) {
                return ($item['status'] ?? '') === $status;
            });
        }

        if (isset($filters['blockchain_status']) && $filters['blockchain_status'] != 'all' && $filters['blockchain_status'] != '') {
            $bcStatus = $filters['blockchain_status'];
            $collection = $collection->filter(function ($item) use ($bcStatus) {
                return ($item['blockchain_status'] ?? '') === $bcStatus;
            });
        }

        // 5. Sắp xếp lại theo thời gian giảm dần và trả về danh sách thô
        return $collection->sortByDesc('created_at')->values();
    }
}
