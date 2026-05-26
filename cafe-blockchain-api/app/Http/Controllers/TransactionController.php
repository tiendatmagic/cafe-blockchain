<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Lấy danh sách giao dịch thu chi của cửa hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $query = Transaction::where('store_owner_address', $storeOwner);

        if ($request->has('type') && in_array($request->type, ['thu', 'chi'])) {
            $query->where('type', $request->type);
        }

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', 'like', '%' . $request->category . '%');
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->orderBy('id', 'desc')->get();
        
        return response()->json($transactions);
    }

    /**
     * Tạo giao dịch thu chi mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'type' => 'required|string|in:thu,chi',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'transaction_date' => 'required|date',
        ]);

        $transaction = Transaction::create([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'transaction_date' => $validated['transaction_date'],
            'store_owner_address' => $storeOwner,
        ]);

        return response()->json([
            'message' => 'Transaction created successfully.',
            'transaction' => $transaction
        ], 201);
    }

    /**
     * Cập nhật thông tin giao dịch thu chi
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $transaction = Transaction::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|in:thu,chi',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'transaction_date' => 'required|date',
        ]);

        $transaction->update([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'transaction_date' => $validated['transaction_date'],
        ]);

        return response()->json([
            'message' => 'Transaction updated successfully.',
            'transaction' => $transaction
        ]);
    }

    /**
     * Xóa giao dịch thu chi
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $transaction = Transaction::where('store_owner_address', $storeOwner)->findOrFail($id);

        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully.'
        ]);
    }
}
