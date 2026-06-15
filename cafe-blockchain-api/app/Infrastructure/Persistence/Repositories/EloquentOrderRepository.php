<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Entities\Order;
use App\Domain\Repositories\OrderRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Infrastructure\Persistence\Mappers\OrderMapper;

class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function find(string $id): ?Order
    {
        $model = OrderModel::find($id);
        return $model ? OrderMapper::toDomain($model) : null;
    }

    public function findByCode(string $code): ?Order
    {
        $model = OrderModel::where('order_code', $code)->first();
        return $model ? OrderMapper::toDomain($model) : null;
    }

    public function save(Order $order): Order
    {
        $data = OrderMapper::toPersistence($order);
        
        if (empty($data['id'])) {
            $data['id'] = (string) \Illuminate\Support\Str::uuid7();
        }
        if (empty($data['order_code'])) {
            $data['order_code'] = 'HD-' . strtoupper(bin2hex(random_bytes(3)));
        }

        // Tự động ký hash đối soát nếu đơn hàng hoàn tất
        if ($data['status'] === 'completed') {
            // Cần tạo thực thể tạm thời để sinh hash vì generateVerificationHash() là hàm nghiệp vụ của POPO Entity
            $tempEntity = new Order($data);
            $data['verification_hash'] = $tempEntity->generateVerificationHash();
        }

        $model = OrderModel::updateOrCreate(['id' => $data['id']], $data);
        
        return OrderMapper::toDomain($model);
    }

    public function delete(string $id): bool
    {
        return (bool) OrderModel::destroy($id);
    }

    public function paginate(string $storeOwner, array $filters, int $perPage): array
    {
        $query = OrderModel::where('store_owner_address', $storeOwner);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                  ->orWhere('table_number', 'like', "%{$search}%");
            });
        }

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $items = collect($paginator->items())->map(function ($model) {
            return OrderMapper::toDomain($model)->toArray();
        })->all();

        return [
            'data' => $items,
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
        ];
    }
}
