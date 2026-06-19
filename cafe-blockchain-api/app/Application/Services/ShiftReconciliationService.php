<?php

namespace App\Application\Services;

use App\Domain\Entities\Shift;
use App\Infrastructure\Persistence\Eloquent\OrderModel as Order;
use App\Domain\Entities\Transaction;

class ShiftReconciliationService
{
    /**
     * Tính toán số liệu đối soát ca trực
     *
     * @param Shift $shift
     * @return array
     */
    public function calculateReconciliation(Shift $shift): array
    {
        // 1. Tính tổng doanh thu theo từng phương thức thanh toán
        $totalFiatRevenue = (float)Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->where('payment_method', 'cash')
            ->sum('total_amount');

        $totalBankTransferRevenue = (float)Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->where('payment_method', 'bank_transfer')
            ->sum('total_amount');

        $totalCryptoRevenue = (float)Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->where('payment_method', 'crypto')
            ->sum('total_amount');

        $totalEWalletRevenue = (float)Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->where('payment_method', 'e_wallet')
            ->sum('total_amount');

        $totalDebtRevenue = (float)Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->where('payment_method', 'debt')
            ->sum('total_amount');

        $paymentRevenues = [
            'cash' => $totalFiatRevenue,
            'bank_transfer' => $totalBankTransferRevenue,
            'crypto' => $totalCryptoRevenue,
            'e_wallet' => $totalEWalletRevenue,
            'debt' => $totalDebtRevenue
        ];

        // 2. Tính chi phí theo từng phương thức thanh toán
        $totalFiatExpenses = (float)Transaction::where('shift_id', $shift->id)
            ->where('type', 'chi')
            ->where('payment_method', 'cash')
            ->sum('amount');

        $totalBankExpenses = (float)Transaction::where('shift_id', $shift->id)
            ->where('type', 'chi')
            ->where('payment_method', 'bank_transfer')
            ->sum('amount');

        $paymentExpenses = [
            'cash' => $totalFiatExpenses,
            'bank_transfer' => $totalBankExpenses
        ];

        // 3. Tính số tiền mặt lý thuyết trong két (chỉ liên quan tiền mặt vật lý)
        $expectedCash = (float)$shift->initial_cash + $totalFiatRevenue - $totalFiatExpenses;

        return [
            'total_fiat_revenue' => $totalFiatRevenue,
            'total_bank_transfer_revenue' => $totalBankTransferRevenue,
            'total_crypto_revenue' => $totalCryptoRevenue,
            'total_fiat_expenses' => $totalFiatExpenses,
            'payment_revenues' => $paymentRevenues,
            'payment_expenses' => $paymentExpenses,
            'expected_cash' => $expectedCash
        ];
    }
}
