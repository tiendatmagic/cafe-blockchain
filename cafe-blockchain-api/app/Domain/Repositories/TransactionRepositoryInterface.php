<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\Transaction;
use Illuminate\Support\Collection;

interface TransactionRepositoryInterface
{
    /**
     * Tìm giao dịch thu chi theo ID
     */
    public function find(int $id): ?Transaction;

    /**
     * Tìm giao dịch theo tx hash
     */
    public function findByTxHash(string $txHash): ?Transaction;

    /**
     * Lấy danh sách giao dịch thu chi của cửa hàng theo bộ lọc
     */
    public function getTransactions(string $storeOwner, ?string $type = null, ?string $category = null): Collection;

    /**
     * Tạo giao dịch mới
     */
    public function create(array $data): Transaction;

    /**
     * Cập nhật giao dịch
     */
    public function update(Transaction $transaction, array $data): Transaction;

    /**
     * Xóa giao dịch
     */
    public function delete(Transaction $transaction): bool;
}
