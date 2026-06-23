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
        $startOfCurrentMonth = \Carbon\Carbon::now()->startOfMonth()->toDateTimeString();

        // 1. Lấy các ca làm việc thuộc tháng hiện tại từ DB (real-time)
        $currentMonthShifts = Shift::where('store_owner_address', $storeOwner)
            ->where('start_time', '>=', $startOfCurrentMonth)
            ->when($userId !== null, function ($q) use ($userId) {
                return $q->where('user_id', $userId);
            })
            ->with('user')
            ->get()
            ->toArray();

        // 2. Tìm danh sách các tháng trong quá khứ có ca làm việc
        $pastMonths = Shift::where('store_owner_address', $storeOwner)
            ->where('start_time', '<', $startOfCurrentMonth)
            ->when($userId !== null, function ($q) use ($userId) {
                return $q->where('user_id', $userId);
            })
            ->selectRaw("DATE_FORMAT(start_time, '%Y-%m') as month")
            ->groupBy('month')
            ->pluck('month');

        $pastShifts = [];
        $userIdStr = $userId ?? 'all';
        foreach ($pastMonths as $month) {
            $monthShifts = \Illuminate\Support\Facades\Cache::remember(
                "store_shifts_history:{$storeOwner}:{$userIdStr}:{$month}",
                604800,
                function () use ($storeOwner, $userId, $month) {
                    $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth()->toDateTimeString();
                    $end = \Carbon\Carbon::parse($month . '-01')->endOfMonth()->toDateTimeString();

                    return Shift::where('store_owner_address', $storeOwner)
                        ->whereBetween('start_time', [$start, $end])
                        ->when($userId !== null, function ($q) use ($userId) {
                            return $q->where('user_id', $userId);
                        })
                        ->with('user')
                        ->get()
                        ->toArray();
                }
            );
            $pastShifts = array_merge($pastShifts, $monthShifts);
        }

        // 3. Trộn toàn bộ ca làm việc
        $allShifts = array_merge($currentMonthShifts, $pastShifts);

        // 4. Sắp xếp lại theo start_time giảm dần và trả về mảng thô
        $collection = collect($allShifts);
        return $collection->sortByDesc('start_time')->values();
    }
}
