<?php

namespace App\Application\Orders\Handlers;

use App\Application\Orders\Queries\GetOrdersQuery;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use Illuminate\Database\Eloquent\Collection;

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

        // 5. Sắp xếp lại theo thời gian giảm dần
        $sorted = $collection->sortByDesc('created_at')->values();

        // 6. Chuyển lại thành Eloquent Collection để tương thích kiểu trả về
        $models = $sorted->map(function ($attributes) {
            $order = new OrderModel();
            $order->exists = true;
            $order->setRawAttributes($attributes, true);
            
            // Re-hydrate relationships if any
            if (isset($attributes['customer']) && $attributes['customer']) {
                $customer = new \App\Domain\Entities\Customer();
                $customer->exists = true;
                $customer->setRawAttributes($attributes['customer'], true);
                $order->setRelation('customer', $customer);
            }
            
            if (isset($attributes['items']) && is_array($attributes['items'])) {
                $items = collect($attributes['items'])->map(function ($itemAttr) {
                    $item = new \App\Domain\Entities\OrderItem();
                    $item->exists = true;
                    $item->setRawAttributes($itemAttr, true);
                    
                    if (isset($itemAttr['product']) && $itemAttr['product']) {
                        $product = new \App\Domain\Entities\Product();
                        $product->exists = true;
                        $product->setRawAttributes($itemAttr['product'], true);
                        $item->setRelation('product', $product);
                    }
                    
                    if (isset($itemAttr['variant']) && $itemAttr['variant']) {
                        $variant = new \App\Domain\Entities\ProductVariant();
                        $variant->exists = true;
                        $variant->setRawAttributes($itemAttr['variant'], true);
                        $item->setRelation('variant', $variant);
                    }
                    
                    return $item;
                });
                $order->setRelation('items', new Collection($items));
            }

            return $order;
        });

        return new Collection($models);
    }
}
