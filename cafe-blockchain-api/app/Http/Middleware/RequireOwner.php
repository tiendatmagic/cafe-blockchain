<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Entities\Setting;
use Illuminate\Support\Facades\Http;

class RequireOwner
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
        $storeOwner = $user->getStoreOwnerAddress();
        
        $contractAddress = Setting::getForStore('contract_address', $storeOwner);
        $rpcUrl = Setting::getForStore('rpc_url', $storeOwner, 'https://ethereum-sepolia.publicnode.com');

        // If no contract is set, any authenticated wallet acts as owner to configure it
        if (empty($contractAddress)) {
            return $next($request);
        }

        // Call RPC node to check isOwner(address)
        try {
            // Function selector for `isOwner(address)` is keccak256("isOwner(address)") -> 0x2f54bf6e
            // Address is padded to 32 bytes
            $paddedAddress = str_pad(substr($walletAddress, 2), 64, '0', STR_PAD_LEFT);
            $data = '0x2f54bf6e' . $paddedAddress;

            $payload = [
                'jsonrpc' => '2.0',
                'method' => 'eth_call',
                'params' => [
                    [
                        'to' => $contractAddress,
                        'data' => $data
                    ],
                    'latest'
                ],
                'id' => 1
            ];

            $response = Http::post($rpcUrl, $payload);
            
            if ($response->successful()) {
                $result = $response->json('result');
                // A true boolean is returned as 0x0000000000000000000000000000000000000000000000000000000000000001
                if ($result && str_ends_with($result, '1')) {
                    return $next($request);
                }
            }
        } catch (\Exception $e) {
            // Log error
        }

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. Your wallet is not an owner of the Smart Contract.'
        ], 403);
    }
}
