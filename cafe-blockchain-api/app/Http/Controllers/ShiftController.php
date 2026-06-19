<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Shift;
use App\Http\Requests\OpenShiftRequest;
use App\Http\Requests\CloseShiftRequest;
use App\Application\Services\ShiftReconciliationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShiftController extends Controller
{
    protected $reconciliationService;
    protected $shiftRepository;

    public function __construct(
        ShiftReconciliationService $reconciliationService,
        \App\Domain\Repositories\ShiftRepositoryInterface $shiftRepository
    ) {
        $this->reconciliationService = $reconciliationService;
        $this->shiftRepository = $shiftRepository;
    }

    /**
     * Lấy thông tin ca làm việc hiện tại của nhân viên đang đăng nhập
     */
    public function current(Request $request)
    {
        $user = $request->user();
        $shift = $this->shiftRepository->findActiveByUserId($user->id);

        return response()->json($shift);
    }

    /**
     * Mở ca trực mới
     */
    public function open(OpenShiftRequest $request)
    {
        $user = $request->user();
        $storeOwner = strtolower($user->store_owner_address ?: $user->wallet_address);

        $validated = $request->validated();

        // Kiểm tra xem nhân viên này có ca trực nào đang mở không
        $existingShift = $this->shiftRepository->findActiveByUserId($user->id);

        if ($existingShift) {
            return response()->json([
                'message' => 'You already have an active shift. Please close your current shift before opening a new one!'
            ], 400);
        }

        $shift = $this->shiftRepository->create([
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
    public function close(CloseShiftRequest $request)
    {
        $user = $request->user();
        $shift = $this->shiftRepository->findActiveByUserId($user->id);

        if (!$shift) {
            return response()->json([
                'message' => 'No active shift found!'
            ], 404);
        }

        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $recon = $this->reconciliationService->calculateReconciliation($shift);
            $actualCash = $validated['actual_cash'];

            $this->shiftRepository->update($shift, [
                'end_time' => now(),
                'actual_cash' => $actualCash,
                'expected_cash' => $recon['expected_cash'],
                'total_fiat_revenue' => $recon['total_fiat_revenue'],
                'total_bank_transfer_revenue' => $recon['total_bank_transfer_revenue'],
                'total_crypto_revenue' => $recon['total_crypto_revenue'],
                'total_fiat_expenses' => $recon['total_fiat_expenses'],
                'payment_revenues' => $recon['payment_revenues'],
                'payment_expenses' => $recon['payment_expenses'],
                'status' => 'closed',
                'note' => $validated['note'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Shift closed and drawer reconciled successfully!',
                'data' => $shift,
                'difference' => $actualCash - $recon['expected_cash']
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
        $shift = $this->shiftRepository->findActiveByUserId($user->id);

        if (!$shift) {
            return response()->json(null);
        }

        $recon = $this->reconciliationService->calculateReconciliation($shift);

        return response()->json([
            'shift'                      => $shift,
            'payment_revenues'           => $recon['payment_revenues'],
            'payment_expenses'           => $recon['payment_expenses'],
            'expected_cash'              => $recon['expected_cash'],
        ]);
    }

    /**
     * Lấy danh sách lịch sử ca làm việc (Cho Admin / Quản lý / Nhân viên)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $storeOwner = strtolower($user->store_owner_address ?: $user->wallet_address);
        
        // Phân quyền bảo mật: Nếu là nhân viên thông thường (không có quyền quản lý nhân sự staffs hoặc báo cáo reports)
        // thì chỉ cho phép họ nhìn thấy lịch sử ca trực của chính mình.
        $permissions = $user->role ? $user->role->permissions : null;
        $userId = null;
        if ($permissions !== null && !($permissions['staffs'] ?? false) && !($permissions['reports'] ?? false)) {
            $userId = $user->id;
        }

        $shifts = $this->shiftRepository->getHistory($storeOwner, $userId);

        return response()->json($shifts);
    }
}
