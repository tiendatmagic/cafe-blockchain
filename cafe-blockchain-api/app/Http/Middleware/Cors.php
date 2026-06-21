<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Xử lý CORS headers cho các request API của Frontend Angular
     */
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->header('Origin');
        $allowedOrigins = array_filter(explode(',', env('ALLOWED_ORIGINS', 'http://localhost:4200,http://127.0.0.1:4200')));
        
        $isAllowed = false;
        if (empty($origin)) {
            $isAllowed = true;
            $originResponse = '*';
        } elseif (in_array($origin, $allowedOrigins)) {
            $isAllowed = true;
            $originResponse = $origin;
        } else {
            $originResponse = '';
        }

        $allowedHeaders = 'Content-Type, X-Requested-With, Authorization, X-Token-Auth, X-Wallet-Address, X-Cache-TTL, X-Bypass-Cache, X-Silent-Request';

        // Trả về response sớm đối với các preflight OPTIONS requests
        if ($request->isMethod('OPTIONS')) {
            if (!$isAllowed && !empty($origin)) {
                return response()->json(['message' => 'CORS Policy: Origin not allowed.'], 403);
            }

            $response = response('', 204)
                ->header('Access-Control-Allow-Origin', $originResponse)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', $allowedHeaders);
            
            if ($isAllowed && $originResponse !== '*') {
                $response->header('Access-Control-Allow-Credentials', 'true');
            }
            return $response;
        }

        if (!$isAllowed && !empty($origin)) {
            return response()->json(['message' => 'CORS Policy: Origin not allowed.'], 403);
        }

        $response = $next($request);

        $response->headers->set('Access-Control-Allow-Origin', $originResponse);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', $allowedHeaders);
        
        if ($isAllowed && $originResponse !== '*') {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}
