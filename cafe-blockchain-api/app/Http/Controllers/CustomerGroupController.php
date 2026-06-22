<?php

namespace App\Http\Controllers;

use App\Domain\Entities\CustomerGroup;
use Illuminate\Http\Request;

class CustomerGroupController extends Controller
{
    /**
     * Lấy danh sách nhóm khách hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $groups = \Illuminate\Support\Facades\Cache::remember("store_customer_groups:{$storeOwner}", 86400, function () use ($storeOwner) {
            return CustomerGroup::where('store_owner_address', $storeOwner)->withCount('customers')->orderBy('id', 'asc')->get()->toArray();
        });

        return response()->json($groups);
    }

    /**
     * Tạo nhóm khách hàng mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('customer_groups', 'name')->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
        ]);

        $group = CustomerGroup::create([
            'name' => $validated['name'],
            'store_owner_address' => $storeOwner,
        ]);

        \Illuminate\Support\Facades\Cache::forget("store_customer_groups:{$storeOwner}");

        $group->loadCount('customers');

        return response()->json([
            'message' => 'Customer group created successfully.',
            'group' => $group
        ], 201);
    }

    /**
     * Cập nhật nhóm khách hàng
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $group = CustomerGroup::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('customer_groups', 'name')
                    ->ignore($id)
                    ->where(function ($query) use ($storeOwner) {
                        return $query->where('store_owner_address', $storeOwner);
                    })
            ],
        ]);

        $group->update([
            'name' => $validated['name']
        ]);

        \Illuminate\Support\Facades\Cache::forget("store_customer_groups:{$storeOwner}");

        $group->loadCount('customers');

        return response()->json([
            'message' => 'Customer group updated successfully.',
            'group' => $group
        ]);
    }

    /**
     * Xóa nhóm khách hàng
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $group = CustomerGroup::where('store_owner_address', $storeOwner)->findOrFail($id);

        $group->delete();

        \Illuminate\Support\Facades\Cache::forget("store_customer_groups:{$storeOwner}");

        return response()->json([
            'message' => 'Customer group deleted successfully.'
        ]);
    }
}
