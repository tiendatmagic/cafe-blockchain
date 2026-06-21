<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Entities\SystemStaff;

class EnsureIsSystemAdmin
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
        
        // 1. Kiểm tra ví Super Admin gốc từ env
        $superAdminEnv = config('auth.super_admin_addresses', '');
        $superAdmins = array_map('trim', explode(',', $superAdminEnv));
        $superAdmins = array_map('strtolower', array_filter($superAdmins));

        if (in_array($walletAddress, $superAdmins)) {
            return $next($request);
        }

        // 2. Kiểm tra ví Staff từ database system_staffs
        $isStaff = SystemStaff::where('wallet_address', $walletAddress)
            ->where('is_active', true)
            ->exists();

        if ($isStaff) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. This action requires System Admin or Staff privileges.'
        ], 403);
    }
}
