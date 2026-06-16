<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.'
            ], 401);
        }

        // Tách các module bằng dấu gạch đứng |
        $modules = explode('|', $module);
        
        foreach ($modules as $mod) {
            if ($user->hasPermission($mod)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'You do not have permission to access this function.'
        ], 403);
    }
}
