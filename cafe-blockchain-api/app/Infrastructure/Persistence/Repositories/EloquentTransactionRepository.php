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
        $query = Transaction::where('store_owner_address', $storeOwner);

        if ($type && in_array($type, ['thu', 'chi'])) {
            $query->where('type', $type);
        }

        if ($category && !empty($category)) {
            $query->where('category', 'like', '%' . $category . '%');
        }

        return $query->orderBy('transaction_date', 'desc')->orderBy('id', 'desc')->get();
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
