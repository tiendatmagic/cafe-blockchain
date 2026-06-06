<?php

namespace App\Application\Orders\Queries;

use App\Domain\Entities\Order;

class GetOrderDetailQuery
{
    public function execute(string $storeOwner, int|string $id): Order
    {
        return Order::where('store_owner_address', $storeOwner)
            ->with(['customer', 'items.product', 'items.variant'])
            ->findOrFail($id);
    }
}
