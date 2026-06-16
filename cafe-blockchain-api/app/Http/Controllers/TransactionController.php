<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
            'description' => 'nullable|string|max:500',
            'transaction_date' => 'required|date',
        ]);

        // Tự động tìm ca trực đang mở của nhân viên hiện tại
        $shiftId = null;
        $activeShift = \App\Domain\Entities\Shift::where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();
        if ($activeShift) {
            $shiftId = $activeShift->id;
        }

        $transaction = Transaction::create([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'payment_method' => $validated['payment_method'] ?? 'cash',
            'description' => $validated['description'] ?? null,
            'transaction_date' => $validated['transaction_date'],
            'store_owner_address' => $storeOwner,
            'blockchain_status' => 'none',
            'shift_id' => $shiftId,
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

        // Chặn sửa nếu đã đồng bộ Blockchain thành công
        if ($transaction->blockchain_status === 'success') {
            return response()->json([
                'message' => 'Transaction has been successfully recorded on the blockchain and cannot be edited!'
            ], 400);
        }

        $validated = $request->validate([
            'type' => 'required|string|in:thu,chi',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:100',
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
            'description' => 'nullable|string|max:500',
            'transaction_date' => 'required|date',
        ]);

        $transaction->update([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'payment_method' => $validated['payment_method'] ?? $transaction->payment_method ?? 'cash',
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

        // Chặn xóa nếu đã đồng bộ Blockchain thành công
        if ($transaction->blockchain_status === 'success') {
            return response()->json([
                'message' => 'Transaction has been successfully recorded on the blockchain and cannot be deleted!'
            ], 400);
        }

        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully.'
        ]);
    }

    /**
     * Đồng bộ blockchain (lưu Tx Hash và cập nhật trạng thái blockchain)
     */
    public function syncBlockchain(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $transaction = Transaction::where('store_owner_address', $storeOwner)->findOrFail($id);

        // Xác thực chữ ký bảo mật HMAC chống can thiệp trực tiếp vào DB MySQL
        $expectedHash = $transaction->generateVerificationHash();
        if (empty($transaction->verification_hash) || $transaction->verification_hash !== $expectedHash) {
            return response()->json([
                'message' => 'Transaction financial data has been tampered with or modified unauthorized! Sync denied.'
            ], 400);
        }

        $validated = $request->validate([
            'tx_hash' => 'required|string|max:255',
            'blockchain_status' => 'required|string|in:pending,success,failed',
            'chain_id' => 'nullable|string|max:50',
        ]);

        $txHash = $validated['tx_hash'];
        
        // Ngăn chặn sử dụng lại tx_hash cho giao dịch khác
        if (Transaction::where('tx_hash', $txHash)->where('id', '!=', $id)->exists()) {
            return response()->json(['message' => 'Transaction hash has already been used.'], 400);
        }

        // Chỉ kiểm tra chéo qua RPC nếu trạng thái đồng bộ được đặt là success
        if ($validated['blockchain_status'] === 'success') {
            $contractAddress = \App\Domain\Entities\Setting::getForStore('finance_contract_address', $storeOwner);
            $rpcUrl = \App\Domain\Entities\Setting::getForStore('rpc_url', $storeOwner, 'https://ethereum-sepolia.publicnode.com');
            
            if (!empty($contractAddress)) {
                try {
                    // Xác thực giao dịch thật qua TxReceipt của Blockchain RPC
                    $payload = [
                        'jsonrpc' => '2.0',
                        'method' => 'eth_getTransactionReceipt',
                        'params' => [$txHash],
                        'id' => 1
                    ];

                    $response = Http::post($rpcUrl, $payload);
                    if ($response->successful()) {
                        $result = $response->json('result');
                        
                        // Check if tx exists, is successful, and was sent to our finance contract
                        if (!$result || 
                            !isset($result['status']) || 
                            hexdec($result['status']) !== 1 ||
                            strtolower($result['to']) !== strtolower($contractAddress)) {
                            return response()->json(['message' => 'Invalid or failed transaction on the blockchain.'], 400);
                        }
                    } else {
                        // RPC error, cannot verify
                        return response()->json(['message' => 'Could not connect to the blockchain network node for verification.'], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Transaction verification error: ' . $e->getMessage()], 500);
                }
            }
        }

        $transaction->tx_hash = $txHash;
        $transaction->blockchain_status = $validated['blockchain_status'];
        if (isset($validated['chain_id'])) {
            $transaction->chain_id = $validated['chain_id'];
        }
        $transaction->save();

        return response()->json([
            'message' => 'Blockchain sync updated successfully.',
            'transaction' => $transaction
        ]);
    }
}
