<?php

namespace App\Application\Orders\Queries;

use App\Domain\Entities\Order;
use Illuminate\Database\Eloquent\Collection;

class GetOrdersQuery
{
    public function execute(string $storeOwner, array $filters = []): Collection
    {
        $query = Order::where('store_owner_address', $storeOwner)
            ->with(['customer', 'items.product', 'items.variant'])
            ->orderBy('id', 'desc');

        if (isset($filters['status']) && $filters['status'] != 'all') {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['blockchain_status']) && $filters['blockchain_status'] != 'all') {
            $query->where('blockchain_status', $filters['blockchain_status']);
        }

        return $query->get();
    }
}
