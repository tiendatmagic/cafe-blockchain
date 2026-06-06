<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Lấy danh sách khách hàng của cửa hàng
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $query = Customer::where('store_owner_address', $storeOwner);
        
        $search = $request->query('search');
        if ($search) {
            $searchLower = strtolower(trim($search));
            $query->where(function($q) use ($searchLower) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(phone) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(customer_code) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(company_name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(representative_name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(wallet_address) LIKE ?', ["%{$searchLower}%"]);
            });
            $limit = $request->query('limit', 15);
            $customers = $query->with('groups')
                ->orderBy('id', 'desc')->limit($limit)->get();
        } else {
            $customers = $query->with('groups')
                ->orderBy('id', 'desc')->get();
        }
        
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
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('customers')->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
            'email' => [
                'nullable',
                'email',
                'max:100',
                Rule::unique('customers')->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'wallet_address' => [
                'nullable',
                'string',
                'max:42',
                'regex:/^0x[a-fA-F0-9]{40}$/',
                Rule::unique('customers')->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
            'group_ids' => 'nullable|array',
            'group_ids.*' => [
                'exists:customer_groups,id',
                Rule::exists('customer_groups', 'id')->where('store_owner_address', $storeOwner)
            ],
            'type' => 'nullable|string|in:individual,business',
            'company_name' => 'nullable|string|max:200',
            'tax_code' => 'nullable|string|max:50',
            'representative_name' => 'nullable|string|max:150',
            'website' => 'nullable|string|max:150',
            'business_status' => 'nullable|string|max:100',
        ], [
            'phone.unique' => 'Số điện thoại này đã tồn tại trong danh sách khách hàng của quán!',
            'email.unique' => 'Địa chỉ email này đã tồn tại trong danh sách khách hàng của quán!',
            'wallet_address.unique' => 'Địa chỉ ví Web3 này đã tồn tại trong danh sách khách hàng của quán!',
            'wallet_address.regex' => 'Địa chỉ ví Web3 không hợp lệ! Phải đúng 42 ký tự EVM (bắt đầu 0x + 40 ký tự hex).',
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
            'wallet_address' => $validated['wallet_address'] ?? null,
            'store_owner_address' => $storeOwner,
            'type' => $validated['type'] ?? 'individual',
            'company_name' => $validated['company_name'] ?? null,
            'tax_code' => $validated['tax_code'] ?? null,
            'representative_name' => $validated['representative_name'] ?? null,
            'website' => $validated['website'] ?? null,
            'business_status' => $validated['business_status'] ?? 'Đang hoạt động',
        ]);

        if (!empty($validated['group_ids'])) {
            $customer->groups()->sync($validated['group_ids']);
        }

        // Tải lại mối quan hệ nhóm
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
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('customers')->ignore($id)->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
            'email' => [
                'nullable',
                'email',
                'max:100',
                Rule::unique('customers')->ignore($id)->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'wallet_address' => [
                'nullable',
                'string',
                'max:42',
                'regex:/^0x[a-fA-F0-9]{40}$/',
                Rule::unique('customers')->ignore($id)->where(function ($query) use ($storeOwner) {
                    return $query->where('store_owner_address', $storeOwner);
                })
            ],
            'group_ids' => 'nullable|array',
            'group_ids.*' => [
                'exists:customer_groups,id',
                Rule::exists('customer_groups', 'id')->where('store_owner_address', $storeOwner)
            ],
            'type' => 'nullable|string|in:individual,business',
            'company_name' => 'nullable|string|max:200',
            'tax_code' => 'nullable|string|max:50',
            'representative_name' => 'nullable|string|max:150',
            'website' => 'nullable|string|max:150',
            'business_status' => 'nullable|string|max:100',
        ], [
            'phone.unique' => 'Số điện thoại này đã tồn tại trong danh sách khách hàng của quán!',
            'email.unique' => 'Địa chỉ email này đã tồn tại trong danh sách khách hàng của quán!',
            'wallet_address.unique' => 'Địa chỉ ví Web3 này đã tồn tại trong danh sách khách hàng của quán!',
            'wallet_address.regex' => 'Địa chỉ ví Web3 không hợp lệ! Phải đúng 42 ký tự EVM (bắt đầu 0x + 40 ký tự hex).',
        ]);

        $customer->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
            'wallet_address' => $validated['wallet_address'] ?? null,
            'type' => $validated['type'] ?? 'individual',
            'company_name' => $validated['company_name'] ?? null,
            'tax_code' => $validated['tax_code'] ?? null,
            'representative_name' => $validated['representative_name'] ?? null,
            'website' => $validated['website'] ?? null,
            'business_status' => $validated['business_status'] ?? 'Đang hoạt động',
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
