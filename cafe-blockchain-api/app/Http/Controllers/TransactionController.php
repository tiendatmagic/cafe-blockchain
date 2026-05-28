<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
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
            'blockchain_status' => 'none',
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
                'message' => 'Giao dịch đã được ghi nhận thành công trên Blockchain, không thể chỉnh sửa!'
            ], 400);
        }

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

        // Chặn xóa nếu đã đồng bộ Blockchain thành công
        if ($transaction->blockchain_status === 'success') {
            return response()->json([
                'message' => 'Giao dịch đã được ghi nhận thành công trên Blockchain, không thể xóa!'
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
                'message' => 'Dữ liệu tài chính của giao dịch đã bị can thiệp và sửa đổi trái phép! Từ chối đối soát và ghi chuỗi.'
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
            $contractAddress = \App\Models\Setting::getForStore('finance_contract_address', $storeOwner);
            $rpcUrl = \App\Models\Setting::getForStore('rpc_url', $storeOwner, 'https://ethereum-sepolia.publicnode.com');
            
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
                            return response()->json(['message' => 'Giao dịch trên Blockchain không hợp lệ hoặc đã thất bại.'], 400);
                        }
                    } else {
                        // RPC error, cannot verify
                        return response()->json(['message' => 'Không thể kết nối để đối soát với nút mạng Blockchain.'], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Lỗi xác thực giao dịch: ' . $e->getMessage()], 500);
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
