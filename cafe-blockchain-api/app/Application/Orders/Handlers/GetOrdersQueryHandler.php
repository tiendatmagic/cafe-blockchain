<?php

namespace App\Application\Orders\Handlers;

use App\Application\Orders\Queries\GetOrdersQuery;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetOrdersQueryHandler
{
    public function handle(GetOrdersQuery $query): LengthAwarePaginator
    {
        $storeOwner = $query->storeOwner;
        $filters = $query->filters;

        $perPage = isset($filters['limit']) ? (int)$filters['limit'] : 10;
        $search = isset($filters['search']) ? trim($filters['search']) : '';
        $status = isset($filters['status']) ? $filters['status'] : 'all';
        $bcStatus = isset($filters['blockchain_status']) ? $filters['blockchain_status'] : 'all';

        $queryBuilder = OrderModel::where('store_owner_address', $storeOwner)
            ->with(['customer', 'items.product', 'items.variant']);

        // Lọc trạng thái đơn hàng
        if ($status !== 'all' && !empty($status)) {
            if ($status === 'kds') {
                $queryBuilder->whereIn('status', ['pending', 'preparing', 'ready']);
            } elseif (is_array($status)) {
                $queryBuilder->whereIn('status', $status);
            } else {
                $queryBuilder->where('status', $status);
            }
        }

        // Lọc trạng thái blockchain
        if ($bcStatus !== 'all' && !empty($bcStatus)) {
            $queryBuilder->where('blockchain_status', $bcStatus);
        }

        // Tìm kiếm theo từ khóa (mã đơn, số bàn, tên khách, số điện thoại khách)
        if (!empty($search)) {
            $queryBuilder->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                  ->orWhere('table_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($custQuery) use ($search) {
                      $custQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        // Sắp xếp thời gian giảm dần và phân trang thực tế từ database
        return $queryBuilder->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
