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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        $areas = \Illuminate\Support\Facades\Cache::remember("store_areas_with_tables:{$storeOwner}", 86400, function () use ($storeOwner) {
            return Area::where('store_owner_address', $storeOwner)->with('tables')->orderBy('id', 'asc')->get()->toArray();
        });

        return response()->json($areas);
    }

    private function clearTableAreaCache(string $storeOwner)
    {
        \Illuminate\Support\Facades\Cache::forget("store_areas_with_tables:{$storeOwner}");
        \Illuminate\Support\Facades\Cache::forget("store_tables_with_areas:{$storeOwner}");
    }

    /**
     * Tạo khu vực mới
     */
    public function store(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

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

        $this->clearTableAreaCache($storeOwner);

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
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

        $this->clearTableAreaCache($storeOwner);

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $area = Area::where('store_owner_address', $storeOwner)->findOrFail($id);

        $area->delete();

        $this->clearTableAreaCache($storeOwner);

        return response()->json([
            'message' => 'Area deleted successfully.'
        ]);
    }
}
