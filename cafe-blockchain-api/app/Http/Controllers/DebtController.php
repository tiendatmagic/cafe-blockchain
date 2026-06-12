<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Customer;
use App\Domain\Entities\DebtLog;
use App\Domain\Entities\Transaction;
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
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'customer_id' => 'required|integer|exists:customers,id',
            'amount' => 'required|numeric|min:0.01',
            'note' => 'nullable|string|max:500',
            'recorded_at' => 'required|date',
        ]);

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
                'note' => $validated['note'] ?? 'Ghi nợ thủ công',
                'recorded_at' => $validated['recorded_at'],
            ]);
        });

        return response()->json([
            'message' => 'Ghi nợ thành công.',
            'data' => $debtLog
        ], 201);
    }

    /**
     * Thu nợ khách hàng (Trả nợ bớt)
     */
    public function storePayment(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'customer_id' => 'required|integer|exists:customers,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|in:cash,bank_transfer,crypto,e_wallet',
            'note' => 'nullable|string|max:500',
            'recorded_at' => 'required|date',
        ]);

        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($validated['customer_id']);

        $debtLog = DB::transaction(function () use ($storeOwner, $validated, $customer) {
            // 1. Tạo giao dịch thu quỹ
            $paymentMethodLabel = [
                'cash' => 'Tiền mặt',
                'bank_transfer' => 'Chuyển khoản',
                'crypto' => 'Tiền mã hóa',
                'e_wallet' => 'Ví điện tử'
            ][$validated['payment_method']] ?? 'Tiền mặt';

            $noteStr = "Thu nợ từ khách hàng " . $customer->name . " (" . $customer->customer_code . ")";
            if (!empty($validated['note'])) {
                $noteStr .= " - " . $validated['note'];
            }

            $transaction = Transaction::create([
                'type' => 'thu',
                'amount' => $validated['amount'],
                'category' => 'Thu nợ khách hàng',
                'description' => $noteStr . " (Phương thức: " . $paymentMethodLabel . ")",
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
                'note' => $validated['note'] ?? "Thu nợ khách hàng (Qua " . $paymentMethodLabel . ")",
                'recorded_at' => $validated['recorded_at'],
            ]);
        });

        return response()->json([
            'message' => 'Thu nợ thành công và đã ghi nhận dòng tiền vào sổ quỹ.',
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
                'message' => 'Bản ghi nợ này liên kết với Đơn hàng POS. Vui lòng hủy đơn hàng đó tại mục Đơn hàng để hoàn tác công nợ!'
            ], 400);
        }

        // Nếu log là trả nợ (payment) và có liên kết với Transaction
        if ($debtLog->type === 'payment' && !empty($debtLog->transaction_id)) {
            $transaction = Transaction::find($debtLog->transaction_id);
            if ($transaction) {
                // Chặn xóa nếu transaction đã đồng bộ blockchain thành công
                if ($transaction->blockchain_status === 'success') {
                    return response()->json([
                        'message' => 'Giao dịch thu tiền tương ứng đã được đồng bộ lên Blockchain, không thể hủy bỏ khoản thu nợ này!'
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
            'message' => 'Đã hủy bản ghi công nợ và hoàn tác số dư nợ của khách hàng thành công.'
        ]);
    }
}
