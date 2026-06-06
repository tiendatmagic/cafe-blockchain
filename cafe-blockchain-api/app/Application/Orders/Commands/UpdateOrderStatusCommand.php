<?php

namespace App\Application\Orders\Commands;

use App\Domain\Entities\Order;

class UpdateOrderStatusCommand
{
    public function execute(string $storeOwner, int|string $id, string $status): Order
    {
        $order = Order::where('store_owner_address', $storeOwner)->findOrFail($id);

        $order->status = $status;
        
        if ($status === 'cancelled') {
            $order->blockchain_status = 'none';
            $order->tx_hash = null;
        }

        $order->save();

        return $order;
    }
}
