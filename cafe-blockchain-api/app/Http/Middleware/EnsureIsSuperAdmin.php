<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsSuperAdmin
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

        $walletAddress = strtolower($user->wallet_address);
        
        // Lấy danh sách ví Super Admin từ cấu hình
        $superAdminEnv = config('auth.super_admin_addresses', '');
        $superAdmins = array_map('trim', explode(',', $superAdminEnv));
        $superAdmins = array_map('strtolower', array_filter($superAdmins));

        if (in_array($walletAddress, $superAdmins)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. This action requires Super Admin privileges.'
        ], 403);
    }
}
