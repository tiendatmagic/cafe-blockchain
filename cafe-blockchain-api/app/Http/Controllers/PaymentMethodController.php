<?php

namespace App\Http\Controllers;

use App\Domain\Entities\PaymentMethod;
use App\Domain\Entities\Setting;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * Lấy danh sách phương thức thanh toán có phân trang
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search');

        $query = PaymentMethod::where('store_owner_address', $storeOwner);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%")
                  ->orWhere('account_holder', 'like', "%{$search}%");
            });
        }

        $paymentMethods = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json($paymentMethods);
    }

    /**
     * Thêm phương thức thanh toán mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'type' => 'required|string|in:bank,wallet',
            'name' => 'required|string|max:100',
            'account_number' => 'required|string|max:50',
            'account_holder' => 'required|string|max:100',
            'bank_code' => 'nullable|required_if:type,bank|string|max:20',
            'is_active' => 'nullable|boolean'
        ]);

        $paymentMethod = PaymentMethod::create([
            'store_owner_address' => $storeOwner,
            'type' => $validated['type'],
            'name' => $validated['name'],
            'account_number' => $validated['account_number'],
            'account_holder' => $validated['account_holder'],
            'bank_code' => $validated['bank_code'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Xóa cache storefront công khai để cập nhật dữ liệu mới nhất
        Setting::clearStorefrontCache($storeOwner);

        return response()->json([
            'message' => 'Payment method created successfully.',
            'payment_method' => $paymentMethod
        ], 201);
    }

    /**
     * Cập nhật phương thức thanh toán
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $paymentMethod = PaymentMethod::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|in:bank,wallet',
            'name' => 'required|string|max:100',
            'account_number' => 'required|string|max:50',
            'account_holder' => 'required|string|max:100',
            'bank_code' => 'nullable|required_if:type,bank|string|max:20',
            'is_active' => 'nullable|boolean'
        ]);

        $paymentMethod->update([
            'type' => $validated['type'],
            'name' => $validated['name'],
            'account_number' => $validated['account_number'],
            'account_holder' => $validated['account_holder'],
            'bank_code' => $validated['bank_code'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Xóa cache storefront công khai
        Setting::clearStorefrontCache($storeOwner);

        return response()->json([
            'message' => 'Payment method updated successfully.',
            'payment_method' => $paymentMethod
        ]);
    }

    /**
     * Xóa phương thức thanh toán
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $paymentMethod = PaymentMethod::where('store_owner_address', $storeOwner)->findOrFail($id);

        $paymentMethod->delete();

        // Xóa cache storefront công khai
        Setting::clearStorefrontCache($storeOwner);

        return response()->json([
            'message' => 'Payment method deleted successfully.'
        ]);
    }
}
