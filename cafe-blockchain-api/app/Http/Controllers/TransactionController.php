<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TransactionController extends Controller
{
    protected $transactionRepository;

    public function __construct(\App\Domain\Repositories\TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    /**
     * Lấy danh sách giao dịch thu chi của cửa hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $type = $request->query('type');
        $category = $request->query('category');
        $limit = (int)$request->query('limit', 10);
        $search = $request->query('search');

        $paginated = $this->transactionRepository->getTransactions($storeOwner, $type, $category, $limit, $search);
        
        // Tính tổng thu, chi tổng thể
        $totalIncome = Transaction::where('store_owner_address', $storeOwner)->where('type', 'thu')->sum('amount');
        $totalExpense = Transaction::where('store_owner_address', $storeOwner)->where('type', 'chi')->sum('amount');

        return response()->json([
            'paginated' => $paginated,
            'total_income' => (float)$totalIncome,
            'total_expense' => (float)$totalExpense
        ]);
    }

    /**
     * Tạo giao dịch thu chi mới
     */
    public function store(StoreTransactionRequest $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validated();

        // Tự động tìm ca trực đang mở của nhân viên hiện tại
        $shiftId = null;
        $activeShift = \App\Domain\Entities\Shift::where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();
        if ($activeShift) {
            $shiftId = $activeShift->id;
        }

        $transaction = $this->transactionRepository->create([
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

        $month = \Carbon\Carbon::parse($transaction->transaction_date)->format('Y-m');
        \Illuminate\Support\Facades\Cache::forget("store_transactions_history:{$storeOwner}:{$month}");

        return response()->json([
            'message' => 'Transaction created successfully.',
            'transaction' => $transaction
        ], 201);
    }

    /**
     * Cập nhật thông tin giao dịch thu chi
     */
    public function update(StoreTransactionRequest $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $transaction = $this->transactionRepository->find($id);

        if (!$transaction || $transaction->store_owner_address !== $storeOwner) {
            abort(404, 'Transaction not found.');
        }

        // Chặn sửa nếu đã đồng bộ Blockchain thành công
        if ($transaction->blockchain_status === 'success') {
            return response()->json([
                'message' => 'Transaction has been successfully recorded on the blockchain and cannot be edited!'
            ], 400);
        }

        $validated = $request->validated();

        $this->transactionRepository->update($transaction, [
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'payment_method' => $validated['payment_method'] ?? $transaction->payment_method ?? 'cash',
            'description' => $validated['description'] ?? null,
            'transaction_date' => $validated['transaction_date'],
        ]);

        $month = \Carbon\Carbon::parse($transaction->transaction_date)->format('Y-m');
        \Illuminate\Support\Facades\Cache::forget("store_transactions_history:{$storeOwner}:{$month}");

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
        $transaction = $this->transactionRepository->find($id);

        if (!$transaction || $transaction->store_owner_address !== $storeOwner) {
            abort(404, 'Transaction not found.');
        }

        // Chặn xóa nếu đã đồng bộ Blockchain thành công
        if ($transaction->blockchain_status === 'success') {
            return response()->json([
                'message' => 'Transaction has been successfully recorded on the blockchain and cannot be deleted!'
            ], 400);
        }

        $this->transactionRepository->delete($transaction);

        $month = \Carbon\Carbon::parse($transaction->transaction_date)->format('Y-m');
        \Illuminate\Support\Facades\Cache::forget("store_transactions_history:{$storeOwner}:{$month}");

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
        $transaction = $this->transactionRepository->find($id);

        if (!$transaction || $transaction->store_owner_address !== $storeOwner) {
            abort(404, 'Transaction not found.');
        }

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
        $existingTx = $this->transactionRepository->findByTxHash($txHash);
        if ($existingTx && $existingTx->id !== $transaction->id) {
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

        $this->transactionRepository->update($transaction, [
            'tx_hash' => $txHash,
            'blockchain_status' => $validated['blockchain_status'],
            'chain_id' => $validated['chain_id'] ?? $transaction->chain_id
        ]);

        if ($validated['blockchain_status'] === 'success') {
            \Illuminate\Support\Facades\Cache::forget("store_settings_admin:{$storeOwner}");
        }

        $month = \Carbon\Carbon::parse($transaction->transaction_date)->format('Y-m');
        \Illuminate\Support\Facades\Cache::forget("store_transactions_history:{$storeOwner}:{$month}");

        return response()->json([
            'message' => 'Blockchain sync updated successfully.',
            'transaction' => $transaction
        ]);
    }
}
