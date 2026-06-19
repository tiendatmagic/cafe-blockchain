<?php

namespace App\Http\Controllers;

use App\Domain\Entities\User;
use App\Domain\Entities\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class AdminController extends Controller
{
    /**
     * Lấy danh sách toàn bộ các quán (Chủ quán: store_owner_address là null)
     */
    public function indexTenants(Request $request)
    {
        $tenants = User::whereNull('store_owner_address')
            ->orderBy('created_at', 'desc')
            ->get();

        $result = [];
        foreach ($tenants as $tenant) {
            $wallet = strtolower($tenant->wallet_address);
            
            // Lấy tên cửa hàng từ bảng settings
            $storeNameSetting = DB::table('settings')
                ->where('store_owner_address', $wallet)
                ->where('key', 'store_name')
                ->first();
            
            $storeName = $storeNameSetting ? $storeNameSetting->value : 'Cafe Web3 POS';

            $result[] = [
                'id' => $tenant->id,
                'wallet_address' => $tenant->wallet_address,
                'store_name' => $storeName,
                'plan_code' => $tenant->plan_code ?: 'free',
                'subscription_expires_at' => $tenant->subscription_expires_at,
                'subscription_status' => $tenant->subscription_status ?: 'active',
                'created_at' => $tenant->created_at,
            ];
        }

        return response()->json($result);
    }

    /**
     * Cập nhật thông tin thuê bao của một quán
     */
    public function updateTenantSubscription(Request $request, $id)
    {
        $validated = $request->validate([
            'plan_code' => 'required|string|exists:subscription_plans,code',
            'subscription_expires_at' => 'nullable|date',
            'subscription_status' => 'required|string|in:active,suspended',
        ]);

        $tenant = User::whereNull('store_owner_address')->findOrFail($id);
        
        $tenant->plan_code = $validated['plan_code'];
        $tenant->subscription_expires_at = $validated['subscription_expires_at'];
        $tenant->subscription_status = $validated['subscription_status'];
        $tenant->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thuê bao quán thành công.',
            'tenant' => $tenant
        ]);
    }

    /**
     * Lấy danh sách toàn bộ các gói cước
     */
    public function indexPlans(Request $request)
    {
        $plans = SubscriptionPlan::orderBy('created_at', 'asc')->get();
        return response()->json($plans);
    }

    /**
     * Tạo một gói cước mới
     */
    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[a-z0-9_-]+$/|unique:subscription_plans,code',
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'features' => 'required|array',
            'features.max_products' => 'required|integer',
            'features.max_staffs' => 'required|integer',
            'features.enable_storefront' => 'required|boolean',
            'features.enable_reports' => 'required|boolean',
            'features.enable_excel_export' => 'required|boolean',
        ]);

        $plan = SubscriptionPlan::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'is_active' => $validated['is_active'],
            'features' => $validated['features']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo gói cước mới thành công.',
            'plan' => $plan
        ], 201);
    }

    /**
     * Cập nhật thông tin gói cước
     */
    public function updatePlan(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'features' => 'required|array',
            'features.max_products' => 'required|integer',
            'features.max_staffs' => 'required|integer',
            'features.enable_storefront' => 'required|boolean',
            'features.enable_reports' => 'required|boolean',
            'features.enable_excel_export' => 'required|boolean',
        ]);

        $plan->name = $validated['name'];
        $plan->is_active = $validated['is_active'];
        $plan->features = $validated['features'];
        $plan->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật gói cước thành công.',
            'plan' => $plan
        ]);
    }

    /**
     * Xóa gói cước (Không cho phép nếu có quán đang sử dụng)
     */
    public function destroyPlan($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);

        // Không cho phép xóa các gói mặc định free/pro/ultra
        if (in_array($plan->code, ['free', 'pro', 'ultra'])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa các gói cước hệ thống mặc định (free, pro, ultra).'
            ], 400);
        }

        // Kiểm tra xem có quán nào đang sử dụng gói này không
        $inUse = User::where('plan_code', $plan->code)->exists();
        if ($inUse) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa gói cước này vì đang có cửa hàng sử dụng.'
            ], 400);
        }

        $plan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa gói cước thành công.'
        ]);
    }

    /**
     * Lấy cấu hình hệ thống Super Admin
     */
    public function getSystemSettings()
    {
        $cleanupSetting = DB::table('system_settings')
            ->where('key', 'token_cleanup_days')
            ->first();

        $days = 7;
        if ($cleanupSetting) {
            $value = json_decode($cleanupSetting->value, true);
            $days = $value['days'] ?? 7;
        }

        return response()->json([
            'token_cleanup_days' => $days
        ]);
    }

    /**
     * Cập nhật cấu hình hệ thống Super Admin
     */
    public function updateSystemSettings(Request $request)
    {
        $validated = $request->validate([
            'token_cleanup_days' => 'required|integer|min:1|max:365',
        ]);

        DB::table('system_settings')
            ->updateOrInsert(
                ['key' => 'token_cleanup_days'],
                [
                    'value' => json_encode(['days' => (int)$validated['token_cleanup_days']]),
                    'updated_at' => now()
                ]
            );

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật cấu hình hệ thống thành công.'
        ]);
    }

    /**
     * API thực hiện dọn dẹp các Token hết hạn/cũ thủ công
     */
    public function cleanTokens()
    {
        $cleanupSetting = DB::table('system_settings')
            ->where('key', 'token_cleanup_days')
            ->first();

        $days = 7;
        if ($cleanupSetting) {
            $value = json_decode($cleanupSetting->value, true);
            $days = $value['days'] ?? 7;
        }

        // Xóa token cũ
        $deletedCount = PersonalAccessToken::where('last_used_at', '<', now()->subDays($days))
            ->orWhere(function ($query) use ($days) {
                $query->whereNull('last_used_at')
                      ->where('created_at', '<', now()->subDays($days));
            })->delete();

        return response()->json([
            'success' => true,
            'message' => "Đã dọn dẹp thành công {$deletedCount} token cũ hết hạn khỏi cơ sở dữ liệu."
        ]);
    }
}
