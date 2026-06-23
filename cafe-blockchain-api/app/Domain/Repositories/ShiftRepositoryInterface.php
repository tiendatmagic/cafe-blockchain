<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\Shift;
use Illuminate\Support\Collection;

interface ShiftRepositoryInterface
{
    /**
     * Tìm ca trực theo ID
     */
    public function find(int $id): ?Shift;

    /**
     * Tìm ca trực đang mở của nhân viên
     */
    public function findActiveByUserId(int $userId): ?Shift;

    /**
     * Tạo ca trực mới
     */
    public function create(array $data): Shift;

    /**
     * Cập nhật ca trực
     */
    public function update(Shift $shift, array $data): Shift;

    /**
     * Lấy lịch sử ca trực của cửa hàng
     */
    public function getHistory(string $storeOwner, ?int $userId = null, array $filters = []);
}
