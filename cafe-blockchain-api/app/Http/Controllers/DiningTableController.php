<?php

namespace App\Http\Controllers;

use App\Domain\Entities\DiningTable;
use Illuminate\Http\Request;

class DiningTableController extends Controller
{
    /**
     * Lấy danh sách bàn ăn
     */
    public function index(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        $tables = \Illuminate\Support\Facades\Cache::remember("store_tables_with_areas:{$storeOwner}", 86400, function () use ($storeOwner) {
            return DiningTable::where('store_owner_address', $storeOwner)->with('area')->orderBy('id', 'asc')->get()->toArray();
        });

        return response()->json($tables);
    }

    private function clearTableAreaCache(string $storeOwner)
    {
        \Illuminate\Support\Facades\Cache::forget("store_areas_with_tables:{$storeOwner}");
        \Illuminate\Support\Facades\Cache::forget("store_tables_with_areas:{$storeOwner}");
    }

    /**
     * Tạo bàn mới
     */
    public function store(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('dining_tables', 'name')->where(function ($query) use ($storeOwner, $request) {
                    return $query->where('store_owner_address', $storeOwner)->where('area_id', $request->area_id);
                })
            ],
            'area_id' => [
                'required',
                \Illuminate\Validation\Rule::exists('areas', 'id')->where('store_owner_address', $storeOwner),
            ],
            'status' => 'nullable|string|in:empty,using',
        ]);

        $table = DiningTable::create([
            'name' => $validated['name'],
            'area_id' => $validated['area_id'],
            'status' => $validated['status'] ?? 'empty',
            'store_owner_address' => $storeOwner,
        ]);

        $this->clearTableAreaCache($storeOwner);

        return response()->json([
            'message' => 'Dining table created successfully.',
            'table' => $table
        ], 201);
    }

    /**
     * Cập nhật thông tin bàn
     */
    public function update(Request $request, $id)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $table = DiningTable::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('dining_tables', 'name')
                    ->ignore($id)
                    ->where(function ($query) use ($storeOwner, $request) {
                        return $query->where('store_owner_address', $storeOwner)->where('area_id', $request->area_id);
                    })
            ],
            'area_id' => [
                'required',
                \Illuminate\Validation\Rule::exists('areas', 'id')->where('store_owner_address', $storeOwner),
            ],
            'status' => 'nullable|string|in:empty,using',
        ]);

        $table->update([
            'name' => $validated['name'],
            'area_id' => $validated['area_id'],
            'status' => $validated['status'] ?? $table->status,
        ]);

        $this->clearTableAreaCache($storeOwner);

        return response()->json([
            'message' => 'Dining table updated successfully.',
            'table' => $table
        ]);
    }

    /**
     * Cập nhật trạng thái bàn (còn trống / đang sử dụng)
     */
    public function updateStatus(Request $request, $id)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $table = DiningTable::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:empty,using',
        ]);

        $table->update([
            'status' => $validated['status']
        ]);

        $this->clearTableAreaCache($storeOwner);

        return response()->json([
            'message' => 'Dining table status updated successfully.',
            'table' => $table
        ]);
    }

    /**
     * Xóa bàn ăn
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $table = DiningTable::where('store_owner_address', $storeOwner)->findOrFail($id);

        $table->delete();

        $this->clearTableAreaCache($storeOwner);

        return response()->json([
            'message' => 'Dining table deleted successfully.'
        ]);
    }
}
