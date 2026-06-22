<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Entities\Transaction;
use App\Domain\Repositories\TransactionRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentTransactionRepository implements TransactionRepositoryInterface
{
    public function find(string $id): ?Transaction
    {
        return Transaction::find($id);
    }

    public function findByTxHash(string $txHash): ?Transaction
    {
        return Transaction::where('tx_hash', $txHash)->first();
    }

    public function getTransactions(string $storeOwner, ?string $type = null, ?string $category = null): Collection
    {
        $startOfCurrentMonth = \Carbon\Carbon::now()->startOfMonth()->toDateString();

        // 1. Lấy các giao dịch thuộc tháng hiện tại từ DB (real-time)
        $currentMonthTransactions = Transaction::where('store_owner_address', $storeOwner)
            ->where('transaction_date', '>=', $startOfCurrentMonth)
            ->get()
            ->toArray();

        // 2. Tìm danh sách các tháng trong quá khứ có giao dịch
        $pastMonths = Transaction::where('store_owner_address', $storeOwner)
            ->where('transaction_date', '<', $startOfCurrentMonth)
            ->selectRaw("DATE_FORMAT(transaction_date, '%Y-%m') as month")
            ->groupBy('month')
            ->pluck('month');

        $pastTransactions = [];
        foreach ($pastMonths as $month) {
            $monthTrans = \Illuminate\Support\Facades\Cache::remember("store_transactions_history:{$storeOwner}:{$month}", 604800, function () use ($storeOwner, $month) {
                $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth()->toDateString();
                $end = \Carbon\Carbon::parse($month . '-01')->endOfMonth()->toDateString();
                return Transaction::where('store_owner_address', $storeOwner)
                    ->whereBetween('transaction_date', [$start, $end])
                    ->get()
                    ->toArray();
            });
            $pastTransactions = array_merge($pastTransactions, $monthTrans);
        }

        // 3. Trộn toàn bộ giao dịch
        $allTransactions = array_merge($currentMonthTransactions, $pastTransactions);

        // 4. Lọc dữ liệu qua Collection PHP theo bộ lọc
        $collection = collect($allTransactions);

        if ($type && in_array($type, ['thu', 'chi'])) {
            $collection = $collection->filter(function ($item) use ($type) {
                return ($item['type'] ?? '') === $type;
            });
        }

        if ($category && !empty($category)) {
            $categoryLower = strtolower($category);
            $collection = $collection->filter(function ($item) use ($categoryLower) {
                return strpos(strtolower($item['category'] ?? ''), $categoryLower) !== false;
            });
        }

        // 5. Sắp xếp lại theo transaction_date giảm dần, id giảm dần
        $sorted = $collection->sort(function ($a, $b) {
            if ($a['transaction_date'] === $b['transaction_date']) {
                return $b['id'] <=> $a['id'];
            }
            return $b['transaction_date'] <=> $a['transaction_date'];
        })->values();

        // 6. Chuyển lại thành Eloquent Collection
        $models = $sorted->map(function ($attributes) {
            $transaction = new Transaction();
            $transaction->exists = true;
            $transaction->setRawAttributes($attributes, true);
            return $transaction;
        });

        return new Collection($models);
    }

    public function create(array $data): Transaction
    {
        return Transaction::create($data);
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        $transaction->update($data);
        return $transaction;
    }

    public function delete(Transaction $transaction): bool
    {
        return (bool) $transaction->delete();
    }
}
