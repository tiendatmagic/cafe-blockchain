<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Entities\Shift;
use App\Domain\Repositories\ShiftRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentShiftRepository implements ShiftRepositoryInterface
{
    public function find(int $id): ?Shift
    {
        return Shift::find($id);
    }

    public function findActiveByUserId(int $userId): ?Shift
    {
        return Shift::where('user_id', $userId)
            ->where('status', 'open')
            ->first();
    }

    public function create(array $data): Shift
    {
        return Shift::create($data);
    }

    public function update(Shift $shift, array $data): Shift
    {
        $shift->update($data);
        return $shift;
    }

    public function getHistory(string $storeOwner, ?int $userId = null, array $filters = [])
    {
        $perPage = isset($filters['limit']) ? (int)$filters['limit'] : 10;
        $startDate = isset($filters['start_date']) ? $filters['start_date'] : null;
        $endDate = isset($filters['end_date']) ? $filters['end_date'] : null;
        $status = isset($filters['status']) ? $filters['status'] : 'all';
        $search = isset($filters['search']) ? trim($filters['search']) : '';

        $query = Shift::where('store_owner_address', $storeOwner)
            ->when($userId !== null, function ($q) use ($userId) {
                return $q->where('user_id', $userId);
            })
            ->with('user');

        if ($startDate && $endDate) {
            $query->whereBetween('start_time', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        }

        if ($status !== 'all' && !empty($status)) {
            $query->where('status', $status);
        }

        if (!empty($search)) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('wallet_address', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('start_time', 'desc')->paginate($perPage);
    }
}
