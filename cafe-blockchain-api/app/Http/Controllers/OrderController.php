<?php

namespace App\Http\Controllers;

use App\Application\Common\Bus\CommandBus;
use App\Application\Orders\Commands\CreateOrderCommand;
use App\Application\Orders\Commands\UpdateOrderCommand;
use App\Application\Orders\Commands\UpdateOrderStatusCommand;
use App\Application\Orders\Commands\SyncBlockchainCommand;
use App\Application\Orders\Commands\MintVoucherManualCommand;
use App\Application\Orders\Queries\GetOrdersQuery;
use App\Application\Orders\Queries\GetOrderDetailQuery;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected CommandBus $bus;

    public function __construct(CommandBus $bus)
    {
        $this->bus = $bus;
    }

    /**
     * Lấy danh sách đơn hàng (Sử dụng CQRS Bus)
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $query = new GetOrdersQuery($storeOwner, $request->all());
        $orders = $this->bus->dispatch($query);
        
        return response()->json($orders);
    }

    /**
     * Lấy chi tiết đơn hàng (Sử dụng CQRS Bus)
     */
    public function show(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        try {
            $query = new GetOrderDetailQuery($storeOwner, $id);
            $order = $this->bus->dispatch($query);
            
            return response()->json($order);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found!'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching order details: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tạo đơn hàng mới (POS) (Sử dụng CQRS Bus)
     */
    public function store(Request $request)
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
            $command = new CreateOrderCommand($storeOwner, $validated);
            $order = $this->bus->dispatch($command);
            
            return response()->json([
                'message' => 'Order created successfully.',
                'data' => OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật đơn hàng (Inject trực tiếp cho tương thích ngược)
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
                'message' => 'Order updated successfully.',
                'data' => OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng (Inject trực tiếp cho tương thích ngược)
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
                'data' => OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating order status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đồng bộ blockchain (Inject trực tiếp cho tương thích ngược)
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
                'data' => OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Blockchain sync error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tặng lại Voucher NFT thủ công (Inject trực tiếp cho tương thích ngược)
     */
    public function mintVoucherManual(Request $request, $id, MintVoucherManualCommand $command)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        try {
            $order = $command->execute($storeOwner, $id);

            return response()->json([
                'message' => 'NFT Voucher gifted and minted successfully to the customer!',
                'data' => OrderModel::with(['customer', 'items.product', 'items.variant'])->find($order->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error gifting voucher: ' . $e->getMessage()
            ], 500);
        }
    }
}
