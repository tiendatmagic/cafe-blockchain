<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Entities\User;
use Illuminate\Support\Facades\DB;

class CheckLimit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $resource): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.'
            ], 401);
        }

        // Xác định địa chỉ ví chủ quán
        $storeOwner = strtolower($user->store_owner_address ?: $user->wallet_address);

        $owner = User::where('wallet_address', $storeOwner)->first();
        if ($owner) {
            $planCode = $owner->plan_code ?: 'free';
            $plan = DB::table('subscription_plans')->where('code', $planCode)->first();
            
            $features = [];
            if ($plan) {
                $features = json_decode($plan->features, true) ?: [];
            }
            
            // Xác định key giới hạn và thực hiện đếm
            $limitKey = '';
            $currentCount = 0;
            $resourceName = '';
            
            switch ($resource) {
                case 'products':
                    $limitKey = 'max_products';
                    $currentCount = DB::table('products')->where('store_owner_address', $storeOwner)->whereNull('deleted_at')->count();
                    $resourceName = 'products';
                    break;
                case 'staffs':
                    $limitKey = 'max_staffs';
                    $currentCount = DB::table('staffs')->where('store_owner_address', $storeOwner)->count();
                    $resourceName = 'staff members';
                    break;
                case 'customers':
                    $limitKey = 'max_customers';
                    $currentCount = DB::table('customers')->where('store_owner_address', $storeOwner)->count();
                    $resourceName = 'customers';
                    break;
                case 'transactions':
                    $limitKey = 'max_transactions';
                    $currentCount = DB::table('transactions')->where('store_owner_address', $storeOwner)->count();
                    $resourceName = 'transactions';
                    break;
                case 'debts':
                    $limitKey = 'max_debts';
                    $currentCount = DB::table('debt_logs')->where('store_owner_address', $storeOwner)->where('type', 'debt')->count();
                    $resourceName = 'debt records';
                    break;
            }
            
            if ($limitKey) {
                // Fallback mặc định cho gói free nếu thiếu key cấu hình
                $limitVal = isset($features[$limitKey]) ? (int)$features[$limitKey] : -1;
                if (!isset($features[$limitKey]) && $planCode === 'free') {
                    if ($limitKey === 'max_products') $limitVal = 20;
                    if ($limitKey === 'max_staffs') $limitVal = 2;
                    if ($limitKey === 'max_customers') $limitVal = 50;
                    if ($limitKey === 'max_transactions') $limitVal = 100;
                    if ($limitKey === 'max_debts') $limitVal = 10;
                }
                
                if ($limitVal >= 0 && $currentCount >= $limitVal) {
                    return response()->json([
                        'success' => false,
                        'message' => "Your subscription plan has reached the maximum limit of {$limitVal} {$resourceName}. Please upgrade your plan to continue."
                    ], 200);
                }
            }
        }

        return $next($request);
    }
}
