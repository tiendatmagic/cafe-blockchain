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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $limit = (int)$request->query('limit', 10);
        $search = $request->query('search');

        // Nếu request yêu cầu phân trang rõ ràng
        if ($request->has('page') || $request->has('limit')) {
            $query = Customer::where('store_owner_address', $storeOwner)
                ->with('groups')
                ->orderBy('id', 'desc');

            if ($search) {
                $searchLower = trim($search);
                $query->where(function ($q) use ($searchLower) {
                    $q->where('name', 'like', "%{$searchLower}%")
                      ->orWhere('phone', 'like', "%{$searchLower}%")
                      ->orWhere('email', 'like', "%{$searchLower}%")
                      ->orWhere('customer_code', 'like', "%{$searchLower}%")
                      ->orWhere('company_name', 'like', "%{$searchLower}%")
                      ->orWhere('representative_name', 'like', "%{$searchLower}%")
                      ->orWhere('wallet_address', 'like', "%{$searchLower}%");
                });
            }

            // Lọc theo nhóm khách hàng nếu có
            $groupId = $request->query('group_id');
            if ($groupId) {
                $query->whereHas('groups', function($q) use ($groupId) {
                    $q->where('customer_groups.id', $groupId);
                });
            }

            $paginated = $query->paginate($limit);
            return response()->json($paginated);
        }

        // Fallback: Trả phẳng cho POS dùng cache
        $customers = \Illuminate\Support\Facades\Cache::remember("store_customers_pos:{$storeOwner}", 600, function () use ($storeOwner) {
            return Customer::where('store_owner_address', $storeOwner)
                ->with('groups')
                ->orderBy('id', 'desc')
                ->get()
                ->toArray();
        });

        $collection = collect($customers);

        if ($search) {
            $searchLower = strtolower(trim($search));
            $collection = $collection->filter(function ($item) use ($searchLower) {
                return str_contains(strtolower($item['name'] ?? ''), $searchLower) ||
                       str_contains(strtolower($item['phone'] ?? ''), $searchLower) ||
                       str_contains(strtolower($item['email'] ?? ''), $searchLower) ||
                       str_contains(strtolower($item['customer_code'] ?? ''), $searchLower) ||
                       str_contains(strtolower($item['company_name'] ?? ''), $searchLower) ||
                       str_contains(strtolower($item['representative_name'] ?? ''), $searchLower) ||
                       str_contains(strtolower($item['wallet_address'] ?? ''), $searchLower);
            });
            return response()->json($collection->take($limit)->values()->all());
        }

        return response()->json($collection->values()->all());
    }

    /**
     * Tạo khách hàng mới
     */
    public function store(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

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
            'phone.unique' => 'This phone number already exists in the store\'s customer list!',
            'email.unique' => 'This email address already exists in the store\'s customer list!',
            'wallet_address.unique' => 'This Web3 wallet address already exists in the store\'s customer list!',
            'wallet_address.regex' => 'Invalid Web3 wallet address! Must be a valid 42-character EVM address (starting with 0x + 40 hex characters).',
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
            'wallet_address' => !empty($validated['wallet_address']) ? strtolower($validated['wallet_address']) : null,
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

        // Xóa cache nhóm khách hàng và cache khách hàng POS
        \Illuminate\Support\Facades\Cache::forget("store_customer_groups:{$storeOwner}");
        \Illuminate\Support\Facades\Cache::forget("store_customers_pos:{$storeOwner}");

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
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
            'phone.unique' => 'This phone number already exists in the store\'s customer list!',
            'email.unique' => 'This email address already exists in the store\'s customer list!',
            'wallet_address.unique' => 'This Web3 wallet address already exists in the store\'s customer list!',
            'wallet_address.regex' => 'Invalid Web3 wallet address! Must be a valid 42-character EVM address (starting with 0x + 40 hex characters).',
        ]);

        $customer->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'dob' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'address' => $validated['address'] ?? null,
            'wallet_address' => !empty($validated['wallet_address']) ? strtolower($validated['wallet_address']) : null,
            'type' => $validated['type'] ?? 'individual',
            'company_name' => $validated['company_name'] ?? null,
            'tax_code' => $validated['tax_code'] ?? null,
            'representative_name' => $validated['representative_name'] ?? null,
            'website' => $validated['website'] ?? null,
            'business_status' => $validated['business_status'] ?? 'Đang hoạt động',
        ]);

        $customer->groups()->sync($validated['group_ids'] ?? []);

        $customer->load('groups');

        // Xóa cache nhóm khách hàng và cache khách hàng POS
        \Illuminate\Support\Facades\Cache::forget("store_customer_groups:{$storeOwner}");
        \Illuminate\Support\Facades\Cache::forget("store_customers_pos:{$storeOwner}");

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $customer = Customer::where('store_owner_address', $storeOwner)->findOrFail($id);

        $customer->delete();

        // Xóa cache nhóm khách hàng và cache khách hàng POS
        \Illuminate\Support\Facades\Cache::forget("store_customer_groups:{$storeOwner}");
        \Illuminate\Support\Facades\Cache::forget("store_customers_pos:{$storeOwner}");

        return response()->json([
            'message' => 'Customer deleted successfully.'
        ]);
    }
}
