<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Lấy danh sách khách hàng của cửa hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $customers = Customer::where('store_owner_address', $storeOwner)->with('groups')->orderBy('id', 'desc')->get();
        return response()->json($customers);
    }

    /**
     * Tạo khách hàng mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'group_ids' => 'nullable|array',
            'group_ids.*' => [
                'exists:customer_groups,id',
                \Illuminate\Validation\Rule::exists('customer_groups', 'id')->where('store_owner_address', $storeOwner)
            ],
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
            'store_owner_address' => $storeOwner,
        ]);

        if (!empty($validated['group_ids'])) {
            $customer->groups()->sync($validated['group_ids']);
        }

        // Tải lại mối quan hệ nhóm trước khi trả về
        $customer->load('groups');

        return response()->json([
            'message' => 'Customer created successfully.',
            'customer' => $customer
        ], 201);
    }

    /**
     * Cập nhật thông tin khách hàng
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'group_ids' => 'nullable|array',
            'group_ids.*' => [
                'exists:customer_groups,id',
                \Illuminate\Validation\Rule::exists('customer_groups', 'id')->where('store_owner_address', $storeOwner)
            ],
        ]);

        $customer->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        $customer->groups()->sync($validated['group_ids'] ?? []);

        $customer->load('groups');

        return response()->json([
            'message' => 'Customer updated successfully.',
            'customer' => $customer
        ]);
    }

    /**
     * Xóa khách hàng
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($id);

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.'
        ]);
    }
}
