<?php

namespace App\Http\Controllers;

use App\Application\Orders\Commands\CreateOrderCommand;
use App\Application\Orders\Commands\UpdateOrderCommand;
use App\Application\Orders\Commands\UpdateOrderStatusCommand;
use App\Application\Orders\Commands\SyncBlockchainCommand;
use App\Application\Orders\Commands\MintVoucherManualCommand;
use App\Application\Orders\Queries\GetOrdersQuery;
use App\Application\Orders\Queries\GetOrderDetailQuery;
use App\Domain\Entities\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng
     */
    public function index(Request $request, GetOrdersQuery $query)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $orders = $query->execute($storeOwner, $request->all());
        return response()->json($orders);
    }

    /**
     * Lấy chi tiết đơn hàng
     */
    public function show(Request $request, $id, GetOrderDetailQuery $query)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        try {
            $order = $query->execute($storeOwner, $id);
            return response()->json($order);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng tương ứng!'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi lấy chi tiết đơn hàng: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tạo đơn hàng mới (POS)
     */
    public function store(Request $request, CreateOrderCommand $command)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'order_code' => 'nullable|string|max:50|unique:orders,order_code',
            'table_number' => 'nullable|string|max:50',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'payment_method' => 'required|string|in:cash,bank_transfer,crypto,e_wallet,debt',
            'voucher_nft_token_id' => 'nullable|integer',
            'voucher_nft_signature' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:255',
        ]);

        try {
            $order = $command->execute($storeOwner, $validated);
            
            return response()->json([
                'message' => 'Order created successfully.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật đơn hàng
     */
    public function update(Request $request, $id, UpdateOrderCommand $command)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'table_number' => 'nullable|string|max:50',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'payment_method' => 'required|string|in:cash,bank_transfer,crypto,e_wallet,debt',
            'voucher_nft_token_id' => 'nullable|integer',
            'voucher_nft_signature' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.note' => 'nullable|string|max:255',
        ]);

        try {
            $order = $command->execute($storeOwner, $id, $validated);

            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi cập nhật đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, $id, UpdateOrderStatusCommand $command)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'status' => 'required|string|in:completed,cancelled,pending,preparing',
        ]);

        try {
            $order = $command->execute($storeOwner, $id, $validated['status']);

            return response()->json([
                'message' => 'Order status updated successfully.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi cập nhật trạng thái đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đồng bộ blockchain
     */
    public function syncBlockchain(Request $request, $id, SyncBlockchainCommand $command)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'tx_hash' => 'required|string|max:255',
            'blockchain_status' => 'required|string|in:pending,success,failed',
            'chain_id' => 'nullable|string|max:50',
        ]);

        try {
            $order = $command->execute($storeOwner, $id, $validated);

            return response()->json([
                'message' => 'Blockchain sync updated successfully.',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi đồng bộ blockchain: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tặng lại Voucher NFT thủ công
     */
    public function mintVoucherManual(Request $request, $id, MintVoucherManualCommand $command)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        try {
            $order = $command->execute($storeOwner, $id);

            return response()->json([
                'message' => 'Tặng và đúc thành công Voucher NFT cho khách hàng!',
                'data' => Order::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi tặng voucher: ' . $e->getMessage()
            ], 500);
        }
    }
}
