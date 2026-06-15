<?php

namespace App\Application\Orders\Handlers;

use App\Application\Orders\Queries\GetOrderDetailQuery;
use App\Infrastructure\Persistence\Eloquent\OrderModel;

class GetOrderDetailQueryHandler
{
    public function handle(GetOrderDetailQuery $query): OrderModel
    {
        return OrderModel::where('store_owner_address', $query->storeOwner)
            ->with(['customer', 'items.product', 'items.variant'])
            ->findOrFail($query->id);
    }
}
