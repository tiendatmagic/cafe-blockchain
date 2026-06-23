<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\Transaction;
use Illuminate\Support\Collection;

interface TransactionRepositoryInterface
{
    /**
     * Tìm giao dịch thu chi theo ID
     */
    public function find(string $id): ?Transaction;

    /**
     * Tìm giao dịch theo tx hash
     */
    public function findByTxHash(string $txHash): ?Transaction;

    /**
     * Lấy danh sách giao dịch thu chi của cửa hàng theo bộ lọc và phân trang
     */
    public function getTransactions(string $storeOwner, ?string $type = null, ?string $category = null, int $perPage = 10, ?string $search = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

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
