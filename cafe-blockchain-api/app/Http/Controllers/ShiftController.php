<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Shift;
use App\Infrastructure\Persistence\Eloquent\OrderModel as Order;
use App\Domain\Entities\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShiftController extends Controller
{
    /**
     * Lấy thông tin ca làm việc hiện tại của nhân viên đang đăng nhập
     */
    public function current(Request $request)
    {
        $user = $request->user();
        $shift = Shift::where('user_id', $user->id)
            ->where('status', 'open')
            ->first();

        return response()->json($shift);
    }

    /**
     * Mở ca trực mới
     */
    public function open(Request $request)
    {
        $user = $request->user();
        $storeOwner = strtolower($user->store_owner_address ?: $user->wallet_address);

        $validated = $request->validate([
            'initial_cash' => 'required|numeric|min:0',
        ]);

        // Kiểm tra xem nhân viên này có ca trực nào đang mở không
        $existingShift = Shift::where('user_id', $user->id)
            ->where('status', 'open')
            ->first();

        if ($existingShift) {
            return response()->json([
                'message' => 'You already have an active shift. Please close your current shift before opening a new one!'
            ], 400);
        }

        $shift = Shift::create([
            'store_owner_address' => $storeOwner,
            'user_id' => $user->id,
            'start_time' => now(),
            'initial_cash' => $validated['initial_cash'],
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Shift opened successfully!',
            'data' => $shift
        ], 201);
    }

    /**
     * Kết thúc ca trực, tính toán chênh lệch két tiền mặt và đối soát
     */
    public function close(Request $request)
    {
        $user = $request->user();
        $shift = Shift::where('user_id', $user->id)
            ->where('status', 'open')
            ->first();

        if (!$shift) {
            return response()->json([
                'message' => 'No active shift found!'
            ], 404);
        }

        $validated = $request->validate([
            'actual_cash' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

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
            $expectedCash = $shift->initial_cash + $totalFiatRevenue - $totalFiatExpenses;
            $actualCash = $validated['actual_cash'];

            $shift->update([
                'end_time' => now(),
                'actual_cash' => $actualCash,
                'expected_cash' => $expectedCash,
                'total_fiat_revenue' => $totalFiatRevenue,
                'total_bank_transfer_revenue' => $totalBankTransferRevenue,
                'total_crypto_revenue' => $totalCryptoRevenue,
                'total_fiat_expenses' => $totalFiatExpenses,
                'payment_revenues' => $paymentRevenues,
                'payment_expenses' => $paymentExpenses,
                'status' => 'closed',
                'note' => $validated['note'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Shift closed and drawer reconciled successfully!',
                'data' => $shift,
                'difference' => $actualCash - $expectedCash
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to close shift: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thống kê real-time của ca hiện tại (doanh thu, chi phí, tiền lý thuyết)
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        $shift = Shift::where('user_id', $user->id)
            ->where('status', 'open')
            ->first();

        if (!$shift) {
            return response()->json(null);
        }

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

        $totalFiatExpenses = (float)Transaction::where('shift_id', $shift->id)
            ->where('type', 'chi')
            ->where('payment_method', 'cash')
            ->sum('amount');

        $totalBankExpenses = (float)Transaction::where('shift_id', $shift->id)
            ->where('type', 'chi')
            ->where('payment_method', 'bank_transfer')
            ->sum('amount');

        $expectedCash = (float)$shift->initial_cash + $totalFiatRevenue - $totalFiatExpenses;

        return response()->json([
            'shift'                      => $shift,
            'payment_revenues'           => [
                'cash' => $totalFiatRevenue,
                'bank_transfer' => $totalBankTransferRevenue,
                'crypto' => $totalCryptoRevenue,
                'e_wallet' => $totalEWalletRevenue,
                'debt' => $totalDebtRevenue
            ],
            'payment_expenses'           => [
                'cash' => $totalFiatExpenses,
                'bank_transfer' => $totalBankExpenses
            ],
            'expected_cash'              => $expectedCash,
        ]);
    }

    /**
     * Lấy danh sách lịch sử ca làm việc (Cho Admin / Quản lý / Nhân viên)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $storeOwner = strtolower($user->store_owner_address ?: $user->wallet_address);
        
        $query = Shift::where('store_owner_address', $storeOwner)->with('user');

        // Phân quyền bảo mật: Nếu là nhân viên thông thường (không có quyền quản lý nhân sự staffs hoặc báo cáo reports)
        // thì chỉ cho phép họ nhìn thấy lịch sử ca trực của chính mình.
        $permissions = $user->role ? $user->role->permissions : null;
        if ($permissions !== null && !($permissions['staffs'] ?? false) && !($permissions['reports'] ?? false)) {
            $query->where('user_id', $user->id);
        }

        $shifts = $query->orderBy('start_time', 'desc')->get();

        return response()->json($shifts);
    }
}
