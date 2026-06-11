<?php

namespace App\Http\Controllers;

use App\Domain\Entities\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use kornrunner\Keccak;
use Elliptic\EC;

class AuthController extends Controller
{
    /**
     * Generate a random nonce for a specific wallet address
     */
    public function getNonce(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i',
        ]);

        $address = strtolower($validated['address']);
        $nonce = Str::random(32);

        // Store nonce in cache for 5 minutes
        Cache::put('auth_nonce_' . $address, $nonce, now()->addMinutes(5));

        return response()->json([
            'nonce' => $nonce,
            'message' => "Sign in to Cafe Blockchain POS\nNonce: {$nonce}"
        ]);
    }

    /**
     * Verify the signature and issue a Sanctum token
     */
    public function verifySignature(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i',
            'signature' => 'required|string',
        ]);

        $address = strtolower($validated['address']);
        $signature = $validated['signature'];

        $nonce = Cache::get('auth_nonce_' . $address);
        if (!$nonce) {
            return response()->json(['message' => 'Nonce expired or invalid.'], 400);
        }

        $message = "Sign in to Cafe Blockchain POS\nNonce: {$nonce}";

        if ($this->verifyEthereumSignature($message, $signature, $address)) {
            // Valid signature, remove nonce
            Cache::forget('auth_nonce_' . $address);

            // Find or create user
            $user = User::firstOrCreate(['wallet_address' => $address]);

            // Create Sanctum token
            $token = $user->createToken('pos-access-token')->plainTextToken;

            $cookie = cookie(
                'auth_token', 
                $token, 
                1440, // 24 tiếng = 1 ngày
                '/', 
                null, 
                $request->secure(), 
                true, // httpOnly
                false, 
                $request->secure() ? 'None' : 'Lax'
            );

            $loggedCookie = cookie(
                'auth_logged_in', 
                'true', 
                1440, // 24 tiếng = 1 ngày
                '/', 
                null, 
                $request->secure(), 
                false, // httpOnly = false -> JS có thể đọc
                false, 
                $request->secure() ? 'None' : 'Lax'
            );

            return response()->json([
                'success' => true,
                'token' => $token,
                'address' => $address
            ])->withCookie($cookie)->withCookie($loggedCookie);
        }

        return response()->json(['message' => 'Invalid signature.'], 401);
    }

    /**
     * Đăng xuất, vô hiệu hóa token hiện tại và xóa cookie
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
        }

        $cookie = cookie()->forget('auth_token');
        $loggedCookie = cookie()->forget('auth_logged_in');

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ])->withCookie($cookie)->withCookie($loggedCookie);
    }

    /**
     * Verify Ethereum signature
     */
    private function verifyEthereumSignature(string $message, string $signature, string $address): bool
    {
        try {
            $msgLength = strlen($message);
            $hash = Keccak::hash("\x19Ethereum Signed Message:\n{$msgLength}{$message}", 256);
            
            $sign = [
                'r' => substr($signature, 2, 64),
                's' => substr($signature, 66, 64)
            ];
            $recId = ord(hex2bin(substr($signature, 130, 2))) - 27;

            if ($recId != ($recId & 1)) {
                return false;
            }

            $ec = new EC('secp256k1');
            $pubkey = $ec->recoverPubKey($hash, $sign, $recId);

            $derivedAddress = '0x' . substr(Keccak::hash(substr(hex2bin($pubkey->encode('hex')), 1), 256), 24);

            return strtolower($derivedAddress) === strtolower($address);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Register a new cashier wallet under this admin's store
     */
    public function registerCashier(Request $request)
    {
        $validated = $request->validate([
            'cashier_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i',
        ]);

        $cashierAddress = strtolower($validated['cashier_address']);
        $adminAddress = strtolower($request->user()->wallet_address);

        // Find or create cashier user
        $cashier = User::firstOrCreate(['wallet_address' => $cashierAddress]);
        $cashier->store_owner_address = $adminAddress;
        $cashier->save();

        return response()->json([
            'success' => true,
            'message' => 'Cashier registered successfully.',
            'cashier' => $cashier
        ]);
    }

    /**
     * Remove a cashier wallet from this admin's store
     */
    public function removeCashier(Request $request)
    {
        $validated = $request->validate([
            'cashier_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i',
        ]);

        $cashierAddress = strtolower($validated['cashier_address']);

        // Find cashier
        $cashier = User::where('wallet_address', $cashierAddress)->first();
        if ($cashier) {
            $cashier->store_owner_address = null;
            $cashier->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cashier removed successfully.'
        ]);
    }
}
