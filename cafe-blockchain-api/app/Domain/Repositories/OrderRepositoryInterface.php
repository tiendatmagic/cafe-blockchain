<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\Order;

interface OrderRepositoryInterface
{
    /**
     * Tìm đơn hàng theo ID
     */
    public function find(string $id): ?Order;

    /**
     * Tìm đơn hàng theo mã đơn hàng
     */
    public function findByCode(string $code): ?Order;

    /**
     * Lưu hoặc cập nhật đơn hàng
     */
    public function save(Order $order): Order;

    /**
     * Xóa đơn hàng theo ID
     */
    public function delete(string $id): bool;

    /**
     * Lấy danh sách đơn hàng phân trang theo bộ lọc
     */
    public function paginate(string $storeOwner, array $filters, int $perPage): array;
}
