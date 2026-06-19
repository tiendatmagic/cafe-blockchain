<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Entities\User;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
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
        
        // Bỏ qua kiểm tra nếu chủ quán là Super Admin
        $superAdminEnv = env('SUPER_ADMIN_ADDRESSES', '');
        $superAdmins = array_map('trim', explode(',', $superAdminEnv));
        $superAdmins = array_map('strtolower', array_filter($superAdmins));
        if (in_array($ownerAddress, $superAdmins)) {
            return $next($request);
        }

        // Tìm tài khoản chủ quán
        $owner = User::where('wallet_address', $ownerAddress)->first();
        if ($owner) {
            // 1. Kiểm tra bị khóa (Suspended)
            if ($owner->subscription_status === 'suspended') {
                return response()->json([
                    'success' => false,
                    'subscription_status' => 'suspended',
                    'message' => 'Your account has been suspended. Please contact support.'
                ], 403);
            }

            // 2. Kiểm tra hết hạn (Expired)
            if ($owner->subscription_expires_at !== null && now()->greaterThan($owner->subscription_expires_at)) {
                return response()->json([
                    'success' => false,
                    'subscription_status' => 'expired',
                    'subscription_expires_at' => $owner->subscription_expires_at,
                    'message' => 'Your subscription has expired. Please renew or upgrade to continue.'
                ], 402);
            }
        }

        return $next($request);
    }
}
