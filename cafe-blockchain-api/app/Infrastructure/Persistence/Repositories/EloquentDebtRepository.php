<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Entities\Customer;
use App\Domain\Entities\DebtLog;
use App\Domain\Entities\Transaction;
use App\Domain\Repositories\DebtRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EloquentDebtRepository implements DebtRepositoryInterface
{
    public function getCustomers(string $storeOwner, ?string $search = null, string $filter = 'all'): Collection
    {
        $query = Customer::where('store_owner_address', $storeOwner);

        if ($search) {
            $searchLower = strtolower(trim($search));
            $query->where(function($q) use ($searchLower) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(phone) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(customer_code) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        if ($filter === 'only_debt') {
            $query->where('debt_balance', '>', 0);
        } elseif ($filter === 'no_debt') {
            $query->where('debt_balance', '<=', 0);
        }

        return $query->orderBy('debt_balance', 'desc')->orderBy('id', 'desc')->get();
    }

    public function findCustomer(string $storeOwner, string $customerId): ?Customer
    {
        return Customer::where('store_owner_address', $storeOwner)->find($customerId);
    }

    public function getCustomerLogs(string $storeOwner, string $customerId): Collection
    {
        return DebtLog::with(['order', 'transaction'])
            ->where('customer_id', $customerId)
            ->where('store_owner_address', $storeOwner)
            ->orderBy('recorded_at', 'desc')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function createManualDebt(string $storeOwner, string $customerId, float $amount, ?string $note, string $recordedAt): DebtLog
    {
        return DB::transaction(function () use ($storeOwner, $customerId, $amount, $note, $recordedAt) {
            $customer = Customer::findOrFail($customerId);
            $customer->increment('debt_balance', $amount);

            return DebtLog::create([
                'store_owner_address' => $storeOwner,
                'customer_id' => $customer->id,
                'type' => 'debt',
                'amount' => $amount,
                'note' => $note ?? 'Manual debt entry',
                'recorded_at' => $recordedAt,
            ]);
        });
    }

    public function createDebtPayment(string $storeOwner, string $customerId, float $amount, string $paymentMethod, ?string $note, string $recordedAt): DebtLog
    {
        return DB::transaction(function () use ($storeOwner, $customerId, $amount, $paymentMethod, $note, $recordedAt) {
            $customer = Customer::findOrFail($customerId);

            $paymentMethodLabel = [
                'cash' => 'Cash',
                'bank_transfer' => 'Bank Transfer',
                'crypto' => 'Crypto',
                'e_wallet' => 'E-Wallet'
            ][$paymentMethod] ?? 'Cash';

            $noteStr = "Debt payment from customer " . $customer->name . " (" . $customer->customer_code . ")";
            if (!empty($note)) {
                $noteStr .= " - " . $note;
            }

            // Tạo giao dịch thu quỹ
            $transaction = Transaction::create([
                'type' => 'thu',
                'amount' => $amount,
                'category' => 'Thu nợ khách hàng',
                'description' => $noteStr . " (Method: " . $paymentMethodLabel . ")",
                'transaction_date' => $recordedAt,
                'store_owner_address' => $storeOwner,
                'blockchain_status' => 'none',
            ]);

            // Giảm dư nợ khách hàng
            $customer->decrement('debt_balance', $amount);

            // Tạo log trả nợ
            return DebtLog::create([
                'store_owner_address' => $storeOwner,
                'customer_id' => $customer->id,
                'transaction_id' => $transaction->id,
                'type' => 'payment',
                'amount' => $amount,
                'note' => $note ?? "Customer debt payment (Via " . $paymentMethodLabel . ")",
                'recorded_at' => $recordedAt,
            ]);
        });
    }

    public function findDebtLog(string $storeOwner, string $id): ?DebtLog
    {
        return DebtLog::where('store_owner_address', $storeOwner)->find($id);
    }

    public function deleteDebtLog(DebtLog $debtLog): bool
    {
        return DB::transaction(function () use ($debtLog) {
            $customer = Customer::findOrFail($debtLog->customer_id);

            if ($debtLog->type === 'debt') {
                $customer->decrement('debt_balance', $debtLog->amount);
            } else {
                $customer->increment('debt_balance', $debtLog->amount);
            }

            return (bool) $debtLog->delete();
        });
    }
}
