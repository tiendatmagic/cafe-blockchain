<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Customer;
use App\Domain\Entities\DebtLog;
use App\Domain\Entities\Transaction;
use App\Http\Requests\StoreDebtRequest;
use App\Http\Requests\StoreDebtPaymentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DebtController extends Controller
{
    protected $debtRepository;
    protected $transactionRepository;

    public function __construct(
        \App\Domain\Repositories\DebtRepositoryInterface $debtRepository,
        \App\Domain\Repositories\TransactionRepositoryInterface $transactionRepository
    ) {
        $this->debtRepository = $debtRepository;
        $this->transactionRepository = $transactionRepository;
    }

    /**
     * Lấy danh sách nợ khách hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $search = $request->query('search');
        $filter = $request->query('filter', 'all');
        $limit = (int)$request->query('limit', 10);

        $paginated = $this->debtRepository->getCustomers($storeOwner, $search, $filter, $limit);
        
        $totalDebtOutstanding = Customer::where('store_owner_address', $storeOwner)->sum('debt_balance');
        $totalDebtorsCount = Customer::where('store_owner_address', $storeOwner)->where('debt_balance', '>', 0)->count();

        return response()->json([
            'paginated' => $paginated,
            'total_debt_outstanding' => (float)$totalDebtOutstanding,
            'total_debtors_count' => (int)$totalDebtorsCount
        ]);
    }

    /**
     * Lấy chi tiết lịch sử nợ của một khách hàng
     */
    public function show(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        // Đảm bảo khách hàng thuộc cửa hàng này
        $customer = $this->debtRepository->findCustomer($storeOwner, $id);
        if (!$customer) {
            abort(404, 'Customer not found.');
        }

        $logs = $this->debtRepository->getCustomerLogs($storeOwner, $customer->id);

        return response()->json([
            'customer' => $customer,
            'logs' => $logs
        ]);
    }

    /**
     * Ghi nợ thủ công (nợ phát sinh ngoài POS)
     */
    public function store(StoreDebtRequest $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $validated = $request->validated();

        $customer = $this->debtRepository->findCustomer($storeOwner, $validated['customer_id']);
        if (!$customer) {
            abort(404, 'Customer not found.');
        }

        $debtLog = $this->debtRepository->createManualDebt(
            $storeOwner,
            $customer->id,
            $validated['amount'],
            $validated['note'] ?? null,
            $validated['recorded_at']
        );

        return response()->json([
            'message' => 'Manual debt recorded successfully.',
            'data' => $debtLog
        ], 201);
    }

    /**
     * Thu nợ khách hàng (Trả nợ bớt)
     */
    public function storePayment(StoreDebtPaymentRequest $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $validated = $request->validated();

        $customer = $this->debtRepository->findCustomer($storeOwner, $validated['customer_id']);
        if (!$customer) {
            abort(404, 'Customer not found.');
        }

        $debtLog = $this->debtRepository->createDebtPayment(
            $storeOwner,
            $customer->id,
            $validated['amount'],
            $validated['payment_method'],
            $validated['note'] ?? null,
            $validated['recorded_at']
        );

        return response()->json([
            'message' => 'Debt payment recorded successfully and cash flow updated.',
            'data' => $debtLog
        ], 201);
    }

    /**
     * Xóa một bản ghi công nợ
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $debtLog = $this->debtRepository->findDebtLog($storeOwner, $id);
        if (!$debtLog) {
            abort(404, 'Debt record not found.');
        }

        // Nếu log nợ này sinh ra từ Đơn hàng POS, ta không cho phép xóa tự do mà phải hủy đơn hàng ở mục Đơn hàng.
        if (!empty($debtLog->order_id)) {
            return response()->json([
                'message' => 'This debt record is linked to a POS Order. Please cancel that order under Orders to undo this debt!'
            ], 400);
        }

        // Nếu log là trả nợ (payment) và có liên kết với Transaction
        if ($debtLog->type === 'payment' && !empty($debtLog->transaction_id)) {
            $transaction = $this->transactionRepository->find($debtLog->transaction_id);
            if ($transaction) {
                // Chặn xóa nếu transaction đã đồng bộ blockchain thành công
                if ($transaction->blockchain_status === 'success') {
                    return response()->json([
                        'message' => 'The corresponding payment transaction has been synchronized to the blockchain, cannot cancel this debt payment!'
                    ], 400);
                }
                
                // Xóa transaction liên quan
                $this->transactionRepository->delete($transaction);
            }
        }

        $this->debtRepository->deleteDebtLog($debtLog);

        return response()->json([
            'message' => 'Debt record deleted and customer debt balance updated successfully.'
        ]);
    }
}
