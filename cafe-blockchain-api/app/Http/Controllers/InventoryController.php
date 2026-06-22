<?php

namespace App\Http\Controllers;

use App\Domain\Entities\InventoryRecord;
use App\Domain\Entities\InventoryRecordItem;
use App\Domain\Entities\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Lấy danh sách phiếu kho hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $records = \Illuminate\Support\Facades\Cache::remember("store_inventory_history:{$storeOwner}", 86400, function () use ($storeOwner) {
            return InventoryRecord::where('store_owner_address', $storeOwner)
                ->with(['items.product', 'items.variant'])
                ->orderBy('id', 'desc')
                ->get()
                ->toArray();
        });

        $collection = collect($records);

        if ($request->has('type') && $request->type !== 'all') {
            $type = $request->type;
            $collection = $collection->filter(function ($r) use ($type) {
                return ($r['type'] ?? '') === $type;
            });
        }

        return response()->json($collection->values()->all());
    }

    /**
     * Tạo phiếu kho mới (Nhập/Xuất/Kiểm hàng)
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'type' => 'required|string|in:nhap,xuat,kiem',
            'note' => 'nullable|string|max:500',
            'record_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'nullable|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $inventoryRecord = InventoryRecord::create([
                'type' => $validated['type'],
                'note' => $validated['note'] ?? null,
                'record_date' => $validated['record_date'],
                'store_owner_address' => $storeOwner,
            ]);

            foreach ($validated['items'] as $item) {
                // Đảm bảo sản phẩm thuộc về cửa hàng này
                $product = Product::where('store_owner_address', $storeOwner)->findOrFail($item['product_id']);
                
                $variantId = $item['product_variant_id'] ?? null;
                if ($variantId) {
                    $variant = $product->variants()->where('id', $variantId)->first();
                    if (!$variant) {
                        throw new \Exception("Invalid product variant for item: " . $product->name);
                    }
                }

                InventoryRecordItem::create([
                    'inventory_record_id' => $inventoryRecord->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $variantId,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'] ?? 0,
                ]);
            }

            DB::commit();

            \Illuminate\Support\Facades\Cache::forget("store_inventory_history:{$storeOwner}");

            return response()->json([
                'message' => 'Inventory record created successfully.',
                'data' => InventoryRecord::with(['items.product', 'items.variant'])->find($inventoryRecord->id)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create inventory record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa phiếu kho
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $record = InventoryRecord::where('store_owner_address', $storeOwner)->findOrFail($id);

        $record->delete();

        \Illuminate\Support\Facades\Cache::forget("store_inventory_history:{$storeOwner}");

        return response()->json([
            'message' => 'Inventory record deleted successfully.'
        ]);
    }
}
