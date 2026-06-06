<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * Lấy danh sách khu vực của quán
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $areas = Area::where('store_owner_address', $storeOwner)->with('tables')->orderBy('id', 'asc')->get();
        return response()->json($areas);
    }

    /**
     * Tạo khu vực mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('areas', 'name')->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
        ]);

        $area = Area::create([
            'name' => $validated['name'],
            'store_owner_address' => $storeOwner,
        ]);

        return response()->json([
            'message' => 'Area created successfully.',
            'area' => $area
        ], 201);
    }

    /**
     * Cập nhật khu vực
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $area = Area::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('areas', 'name')
                    ->ignore($id)
                    ->where(function ($query) use ($storeOwner) {
                        return $query->where('store_owner_address', $storeOwner);
                    })
            ],
        ]);

        $area->update([
            'name' => $validated['name']
        ]);

        return response()->json([
            'message' => 'Area updated successfully.',
            'area' => $area
        ]);
    }

    /**
     * Xóa khu vực
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $area = Area::where('store_owner_address', $storeOwner)->findOrFail($id);

        $area->delete();

        return response()->json([
            'message' => 'Area deleted successfully.'
        ]);
    }
}
