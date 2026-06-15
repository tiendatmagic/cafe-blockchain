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
                'message' => 'Bạn đã có một ca trực đang mở. Vui lòng kết ca cũ trước khi mở ca mới!'
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
            'message' => 'Mở ca trực thành công!',
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
                'message' => 'Không tìm thấy ca trực nào đang mở!'
            ], 404);
        }

        $validated = $request->validate([
            'actual_cash' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // 1. Tính tổng doanh thu tiền mặt thu được trong ca trực (Đơn hàng completed trong ca trực)
            $totalFiatRevenue = (float)Order::where('shift_id', $shift->id)
                ->where('status', 'completed')
                ->where('payment_method', 'cash')
                ->sum('total_amount');

            // 2. Tính doanh thu chuyển khoản ngân hàng trong ca trực
            $totalBankTransferRevenue = (float)Order::where('shift_id', $shift->id)
                ->where('status', 'completed')
                ->where('payment_method', 'bank_transfer')
                ->sum('total_amount');

            // 3. Tính doanh thu Crypto trong ca trực
            $totalCryptoRevenue = (float)Order::where('shift_id', $shift->id)
                ->where('status', 'completed')
                ->where('payment_method', 'crypto')
                ->sum('total_amount');

            // 4. Tính chi phí chi ra bằng tiền mặt phát sinh trong ca trực
            $totalFiatExpenses = (float)Transaction::where('shift_id', $shift->id)
                ->where('type', 'chi')
                ->where('payment_method', 'cash')
                ->sum('amount');

            // 5. Tính số tiền mặt lý thuyết trong két
            // Expected Cash = Tiền mặt ban đầu + Tiền mặt thu được - Tiền mặt chi ra
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
                'status' => 'closed',
                'note' => $validated['note'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Kết ca và đối soát két thành công!',
                'data' => $shift,
                'difference' => $actualCash - $expectedCash
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Kết ca trực thất bại: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách lịch sử ca làm việc (Cho Admin / Quản lý)
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $shifts = Shift::where('store_owner_address', $storeOwner)
            ->with('user')
            ->orderBy('start_time', 'desc')
            ->get();

        return response()->json($shifts);
    }
}
