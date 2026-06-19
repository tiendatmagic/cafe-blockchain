<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Entities\User;
use Illuminate\Support\Facades\DB;

class CheckFeature
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.'
            ], 401);
        }

        // Xác định địa chỉ ví chủ quán
        $ownerAddress = strtolower($user->store_owner_address ?: $user->wallet_address);

        // Tìm tài khoản chủ quán để lấy gói cước
        $owner = User::where('wallet_address', $ownerAddress)->first();
        if ($owner) {
            $planCode = $owner->plan_code ?: 'free';
            $plan = DB::table('subscription_plans')->where('code', $planCode)->first();
            
            $isFree = ($planCode === 'free');
            $features = [];
            
            if ($plan) {
                $features = json_decode($plan->features, true) ?: [];
            }
            
            $enabled = isset($features[$feature]) ? (bool)$features[$feature] : true;
            
            // Fallback cho gói free nếu thiếu key trong DB hoặc không tìm thấy plan
            if ($isFree) {
                $premiumFeatures = [
                    'enable_inventory',
                    'enable_debts',
                    'enable_financials',
                    'enable_storefront',
                    'enable_reports',
                    'enable_excel_export',
                    'enable_shifts'
                ];
                if (in_array($feature, $premiumFeatures)) {
                    $enabled = isset($features[$feature]) ? (bool)$features[$feature] : false;
                }
            }

            if (!$enabled) {
                return response()->json([
                    'success' => false,
                    'message' => 'This feature is not unlocked in your current subscription plan. Please upgrade your plan to use this feature.'
                ], 200);
            }
        }

        return $next($request);
    }
}
