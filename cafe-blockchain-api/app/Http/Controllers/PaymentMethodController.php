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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        
        $perPage = (int)$request->query('per_page', 10);
        $search = $request->query('search');

        $allMethods = collect(\Illuminate\Support\Facades\Cache::remember("store_payment_methods:{$storeOwner}", 86400, function () use ($storeOwner) {
            return PaymentMethod::where('store_owner_address', $storeOwner)->orderBy('id', 'desc')->get()->toArray();
        }));

        if (!empty($search)) {
            $searchLower = strtolower($search);
            $allMethods = $allMethods->filter(function ($item) use ($searchLower) {
                return strpos(strtolower($item['name'] ?? ''), $searchLower) !== false ||
                       strpos(strtolower($item['account_number'] ?? ''), $searchLower) !== false ||
                       strpos(strtolower($item['account_holder'] ?? ''), $searchLower) !== false;
            });
        }

        $total = $allMethods->count();
        $page = (int)$request->query('page', 1);
        $sliced = $allMethods->slice(($page - 1) * $perPage, $perPage)->values()->all();

        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $sliced,
            $total,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginated);
    }

    /**
     * Thêm phương thức thanh toán mới
     */
    public function store(Request $request)
    {
        $storeOwner = $request->user()->getStoreOwnerAddress();

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

        // Xóa cache phương thức thanh toán
        \Illuminate\Support\Facades\Cache::forget("store_payment_methods:{$storeOwner}");

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
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

        // Xóa cache phương thức thanh toán
        \Illuminate\Support\Facades\Cache::forget("store_payment_methods:{$storeOwner}");

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
        $storeOwner = $request->user()->getStoreOwnerAddress();
        $paymentMethod = PaymentMethod::where('store_owner_address', $storeOwner)->findOrFail($id);

        $paymentMethod->delete();

        // Xóa cache phương thức thanh toán
        \Illuminate\Support\Facades\Cache::forget("store_payment_methods:{$storeOwner}");

        // Xóa cache storefront công khai
        Setting::clearStorefrontCache($storeOwner);

        return response()->json([
            'message' => 'Payment method deleted successfully.'
        ]);
    }
}
