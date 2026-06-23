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
        $ownerAddress = $user->getStoreOwnerAddress();
        
        // Bỏ qua kiểm tra nếu chủ quán là Super Admin
        $superAdminEnv = config('auth.super_admin_addresses', '');
        $superAdmins = array_map('trim', explode(',', $superAdminEnv));
        $superAdmins = array_map('strtolower', array_filter($superAdmins));
        if (in_array($ownerAddress, $superAdmins)) {
            return $next($request);
        }

        // Tìm tài khoản chủ quán
        $owner = User::getCachedOwner($ownerAddress);
        if ($owner) {
            // 1. Kiểm tra bị khóa (Suspended)
            if (($owner['subscription_status'] ?? 'active') === 'suspended') {
                return response()->json([
                    'success' => false,
                    'subscription_status' => 'suspended',
                    'message' => 'Your account has been suspended. Please contact support.'
                ], 403);
            }

            // 2. Kiểm tra hết hạn (Expired)
            $expiresAt = $owner['subscription_expires_at'] ?? null;
            if ($expiresAt !== null && now()->greaterThan(\Carbon\Carbon::parse($expiresAt))) {
                return response()->json([
                    'success' => false,
                    'subscription_status' => 'expired',
                    'subscription_expires_at' => $expiresAt,
                    'message' => 'Your subscription has expired. Please renew or upgrade to continue.'
                ], 402);
            }
        }

        return $next($request);
    }
}
