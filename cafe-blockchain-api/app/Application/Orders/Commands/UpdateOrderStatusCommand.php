<?php

namespace App\Application\Orders\Commands;

use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Infrastructure\Persistence\Mappers\OrderMapper;
use App\Domain\Entities\Customer;
use App\Domain\Entities\DebtLog;

class UpdateOrderStatusCommand
{
    public function execute(string $storeOwner, int|string $id, string $status): OrderModel
    {
        $order = OrderModel::where('store_owner_address', $storeOwner)->findOrFail($id);

        $oldStatus = $order->status;
        $order->status = $status;
        
        if ($status === 'cancelled') {
            $order->blockchain_status = 'none';
            $order->tx_hash = null;
            $order->verification_hash = null;
        }

        // Tự động sinh verification_hash khi đơn hàng hoàn tất để cho phép đồng bộ blockchain sau
        if ($status === 'completed') {
            $orderEntity = OrderMapper::toDomain($order);
            $order->verification_hash = $orderEntity->generateVerificationHash();
        }

        $order->save();

        // Nếu đơn hàng bị hủy và thanh toán bằng ghi nợ, thực hiện hoàn trả số dư nợ của khách
        if ($status === 'cancelled' && $oldStatus !== 'cancelled' && $order->payment_method === 'debt' && $order->customer_id) {
            $customer = Customer::find($order->customer_id);
            if ($customer) {
                $debtLogs = DebtLog::where('order_id', $order->id)->where('type', 'debt')->get();
                foreach ($debtLogs as $log) {
                    $customer->decrement('debt_balance', $log->amount);
                    $log->delete();
                }
            }
        }

        return $order;
    }
}
