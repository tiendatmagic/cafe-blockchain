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
        $origin = $request->header('Origin') ?: '*';

        // Trả về response sớm đối với các preflight OPTIONS requests
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 204)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, X-Token-Auth, X-Wallet-Address');
            
            if ($origin !== '*') {
                $response->header('Access-Control-Allow-Credentials', 'true');
            }
            return $response;
        }

        $response = $next($request);

        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, X-Token-Auth, X-Wallet-Address');
        
        if ($origin !== '*') {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}
