<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng
     */
    public function index(Request $request)
    {
        $query = Order::with('items.product')->orderBy('id', 'desc');

        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('blockchain_status') && $request->blockchain_status != 'all') {
            $query->where('blockchain_status', $request->blockchain_status);
        }

        $orders = $query->get();
        return response()->json($orders);
    }

    /**
     * Lấy chi tiết đơn hàng
     */
    public function show($id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Tạo đơn hàng mới (POS)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'nullable|string|max:50',
            'payment_method' => 'required|string|in:cash,bank_transfer,crypto',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $itemsData = [];

            // Tính tổng tiền và lấy chi tiết món
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = $product->price;
                $quantity = $item['quantity'];
                $subTotal = $price * $quantity;
                $totalAmount += $subTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                ];
            }

            // Tạo đơn hàng
            $order = Order::create([
                'table_number' => $validated['table_number'] ?? null,
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'status' => 'pending', // Mặc định là đang chờ xác nhận
                'blockchain_status' => 'none',
            ]);

            // Tạo chi tiết đơn hàng
            foreach ($itemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                OrderItem::create($itemData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully.',
                'data' => Order::with('items.product')->find($order->id)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng (completed / cancelled)
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:completed,cancelled,pending',
        ]);

        $order->status = $validated['status'];
        
        // Nếu chuyển sang hủy, chuyển luôn blockchain_status thành none
        if ($validated['status'] === 'cancelled') {
            $order->blockchain_status = 'none';
            $order->tx_hash = null;
        }

        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully.',
            'data' => Order::with('items.product')->find($order->id)
        ]);
    }

    /**
     * Đồng bộ blockchain (lưu Tx Hash và cập nhật trạng thái blockchain)
     */
    public function syncBlockchain(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'tx_hash' => 'required|string|max:255',
            'blockchain_status' => 'required|string|in:pending,success,failed',
        ]);

        $txHash = $validated['tx_hash'];
        
        // Prevent reusing tx_hash
        if (Order::where('tx_hash', $txHash)->where('id', '!=', $id)->exists()) {
            return response()->json(['message' => 'Transaction hash has already been used.'], 400);
        }

        // Only verify if setting to success
        if ($validated['blockchain_status'] === 'success') {
            $contractAddress = \App\Models\Setting::get('contract_address');
            $rpcUrl = \App\Models\Setting::get('rpc_url', 'https://ethereum-sepolia.publicnode.com');
            
            if (!empty($contractAddress)) {
                try {
                    $payload = [
                        'jsonrpc' => '2.0',
                        'method' => 'eth_getTransactionReceipt',
                        'params' => [$txHash],
                        'id' => 1
                    ];

                    $response = \Illuminate\Support\Facades\Http::post($rpcUrl, $payload);
                    if ($response->successful()) {
                        $result = $response->json('result');
                        
                        // Check if tx exists, is successful, and was sent to our contract
                        if (!$result || 
                            !isset($result['status']) || 
                            hexdec($result['status']) !== 1 ||
                            strtolower($result['to']) !== strtolower($contractAddress)) {
                            return response()->json(['message' => 'Invalid or failed transaction on the blockchain.'], 400);
                        }
                    } else {
                        // RPC error, cannot verify
                        return response()->json(['message' => 'Could not verify transaction with the blockchain node.'], 500);
                    }
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Error verifying transaction.'], 500);
                }
            }
        }

        $order->tx_hash = $txHash;
        $order->blockchain_status = $validated['blockchain_status'];
        $order->save();

        return response()->json([
            'message' => 'Blockchain sync updated successfully.',
            'data' => Order::with('items.product')->find($order->id)
        ]);
    }
}
