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

    public function getHistory(string $storeOwner, ?int $userId = null): Collection
    {
        $query = Shift::where('store_owner_address', $storeOwner)->with('user');

        if ($userId !== null) {
            $query->where('user_id', $userId);
        }

        return $query->orderBy('start_time', 'desc')->get();
    }
}
