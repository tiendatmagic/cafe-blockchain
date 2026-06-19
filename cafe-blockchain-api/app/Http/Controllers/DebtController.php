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
    /**
     * Lấy danh sách nợ khách hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $query = Customer::where('store_owner_address', $storeOwner);

        // Lọc theo từ khóa tìm kiếm (tên, SĐT, mã khách hàng)
        $search = $request->query('search');
        if ($search) {
            $searchLower = strtolower(trim($search));
            $query->where(function($q) use ($searchLower) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(phone) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(customer_code) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        // Lọc: 'only_debt' (chỉ những khách có dư nợ > 0), 'no_debt' (chỉ những khách dư nợ = 0)
        $filter = $request->query('filter', 'all');
        if ($filter === 'only_debt') {
            $query->where('debt_balance', '>', 0);
        } elseif ($filter === 'no_debt') {
            $query->where('debt_balance', '<=', 0);
        }

        $customers = $query->orderBy('debt_balance', 'desc')->orderBy('id', 'desc')->get();

        return response()->json($customers);
    }

    /**
     * Lấy chi tiết lịch sử nợ của một khách hàng
     */
    public function show(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        // Đảm bảo khách hàng thuộc cửa hàng này
        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($id);

        $logs = DebtLog::with(['order', 'transaction'])
            ->where('customer_id', $customer->id)
            ->where('store_owner_address', $storeOwner)
            ->orderBy('recorded_at', 'desc')
            ->orderBy('id', 'desc')
            ->get();

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

        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($validated['customer_id']);

        $debtLog = DB::transaction(function () use ($storeOwner, $validated, $customer) {
            // Tăng số dư nợ của khách
            $customer->increment('debt_balance', $validated['amount']);

            // Tạo log nợ
            return DebtLog::create([
                'store_owner_address' => $storeOwner,
                'customer_id' => $customer->id,
                'type' => 'debt',
                'amount' => $validated['amount'],
                'note' => $validated['note'] ?? 'Manual debt entry',
                'recorded_at' => $validated['recorded_at'],
            ]);
        });

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

        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($validated['customer_id']);

        $debtLog = DB::transaction(function () use ($storeOwner, $validated, $customer) {
            // 1. Tạo giao dịch thu quỹ
            $paymentMethodLabel = [
                'cash' => 'Cash',
                'bank_transfer' => 'Bank Transfer',
                'crypto' => 'Crypto',
                'e_wallet' => 'E-Wallet'
            ][$validated['payment_method']] ?? 'Cash';

            $noteStr = "Debt payment from customer " . $customer->name . " (" . $customer->customer_code . ")";
            if (!empty($validated['note'])) {
                $noteStr .= " - " . $validated['note'];
            }

            $transaction = Transaction::create([
                'type' => 'thu',
                'amount' => $validated['amount'],
                'category' => 'Thu nợ khách hàng',
                'description' => $noteStr . " (Method: " . $paymentMethodLabel . ")",
                'transaction_date' => $validated['recorded_at'],
                'store_owner_address' => $storeOwner,
                'blockchain_status' => 'none',
            ]);

            // 2. Giảm dư nợ khách hàng
            $customer->decrement('debt_balance', $validated['amount']);

            // 3. Tạo log trả nợ
            return DebtLog::create([
                'store_owner_address' => $storeOwner,
                'customer_id' => $customer->id,
                'transaction_id' => $transaction->id,
                'type' => 'payment',
                'amount' => $validated['amount'],
                'note' => $validated['note'] ?? "Customer debt payment (Via " . $paymentMethodLabel . ")",
                'recorded_at' => $validated['recorded_at'],
            ]);
        });

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
        $debtLog = DebtLog::where('store_owner_address', $storeOwner)->findOrFail($id);

        // Nếu log nợ này sinh ra từ Đơn hàng POS, ta không cho phép xóa tự do mà phải hủy đơn hàng ở mục Đơn hàng.
        if (!empty($debtLog->order_id)) {
            return response()->json([
                'message' => 'This debt record is linked to a POS Order. Please cancel that order under Orders to undo this debt!'
            ], 400);
        }

        // Nếu log là trả nợ (payment) và có liên kết với Transaction
        if ($debtLog->type === 'payment' && !empty($debtLog->transaction_id)) {
            $transaction = Transaction::find($debtLog->transaction_id);
            if ($transaction) {
                // Chặn xóa nếu transaction đã đồng bộ blockchain thành công
                if ($transaction->blockchain_status === 'success') {
                    return response()->json([
                        'message' => 'The corresponding payment transaction has been synchronized to the blockchain, cannot cancel this debt payment!'
                    ], 400);
                }
                
                // Xóa transaction liên quan
                $transaction->delete();
            }
        }

        DB::transaction(function () use ($debtLog) {
            $customer = Customer::findOrFail($debtLog->customer_id);

            // Hoàn tác số dư nợ của khách hàng
            if ($debtLog->type === 'debt') {
                // Hủy khoản ghi nợ thêm -> Giảm dư nợ của khách
                $customer->decrement('debt_balance', $debtLog->amount);
            } else {
                // Hủy khoản trả nợ -> Tăng lại dư nợ cho khách
                $customer->increment('debt_balance', $debtLog->amount);
            }

            $debtLog->delete();
        });

        return response()->json([
            'message' => 'Debt record deleted and customer debt balance updated successfully.'
        ]);
    }
}
