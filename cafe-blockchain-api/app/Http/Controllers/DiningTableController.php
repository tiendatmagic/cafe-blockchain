<?php

namespace App\Http\Controllers;

use App\Models\DiningTable;
use Illuminate\Http\Request;

class DiningTableController extends Controller
{
    /**
     * Lấy danh sách bàn ăn
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $tables = DiningTable::where('store_owner_address', $storeOwner)->with('area')->orderBy('id', 'asc')->get();
        return response()->json($tables);
    }

    /**
     * Tạo bàn mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

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
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
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
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $table = DiningTable::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:empty,using',
        ]);

        $table->update([
            'status' => $validated['status']
        ]);

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
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $table = DiningTable::where('store_owner_address', $storeOwner)->findOrFail($id);

        $table->delete();

        return response()->json([
            'message' => 'Dining table deleted successfully.'
        ]);
    }
}
