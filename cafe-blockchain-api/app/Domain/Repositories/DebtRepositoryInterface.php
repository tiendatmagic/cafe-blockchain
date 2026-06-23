<?php

namespace App\Domain\Repositories;

use App\Domain\Entities\Customer;
use App\Domain\Entities\DebtLog;
use Illuminate\Support\Collection;

interface DebtRepositoryInterface
{
    /**
     * Lấy danh sách khách hàng và dư nợ
     */
    public function getCustomers(string $storeOwner, ?string $search = null, string $filter = 'all', int $perPage = 10): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

    /**
     * Tìm khách hàng của cửa hàng
     */
    public function findCustomer(string $storeOwner, string $customerId): ?Customer;

    /**
     * Lấy lịch sử log nợ của một khách hàng
     */
    public function getCustomerLogs(string $storeOwner, string $customerId): Collection;

    /**
     * Ghi nhận một khoản nợ thủ công
     */
    public function createManualDebt(string $storeOwner, string $customerId, float $amount, ?string $note, string $recordedAt): DebtLog;

    /**
     * Ghi nhận một khoản thanh toán trả nợ
     */
    public function createDebtPayment(string $storeOwner, string $customerId, float $amount, string $paymentMethod, ?string $note, string $recordedAt): DebtLog;

    /**
     * Tìm log nợ
     */
    public function findDebtLog(string $storeOwner, string $id): ?DebtLog;

    /**
     * Xóa log nợ và cập nhật lại số dư nợ của khách hàng
     */
    public function deleteDebtLog(DebtLog $debtLog): bool;
}
