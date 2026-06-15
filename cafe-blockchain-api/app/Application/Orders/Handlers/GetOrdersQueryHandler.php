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

        $dbQuery = OrderModel::where('store_owner_address', $storeOwner)
            ->with(['customer', 'items.product', 'items.variant'])
            ->orderBy('created_at', 'desc');

        if (isset($filters['status']) && $filters['status'] != 'all' && $filters['status'] != '') {
            $dbQuery->where('status', $filters['status']);
        }

        if (isset($filters['blockchain_status']) && $filters['blockchain_status'] != 'all' && $filters['blockchain_status'] != '') {
            $dbQuery->where('blockchain_status', $filters['blockchain_status']);
        }

        return $dbQuery->get();
    }
}
