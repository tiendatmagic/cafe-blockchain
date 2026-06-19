<?php

namespace App\Http\Controllers;

use App\Domain\Entities\User;
use App\Domain\Entities\Staff;
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

            // Tìm kiếm xem ví đăng nhập có phải là nhân viên hay không
            $staff = Staff::where('wallet_address', $address)->with('role')->first();

            // Find or create user
            $user = User::where('wallet_address', $address)->first();
            if (!$user) {
                $user = new User();
                $user->wallet_address = $address;
                $user->plan_code = 'free';
                $user->subscription_expires_at = now()->addDays(7);
                $user->subscription_status = 'active';
                $user->save();
            }

            $roleName = 'Chủ cửa hàng';
            $permissions = null;

            if ($staff) {
                // Nếu là nhân viên, đồng bộ store_owner_address của user với store_owner_address của quán
                $user->store_owner_address = strtolower($staff->store_owner_address);
                $user->save();

                $roleName = $staff->role->name;
                $permissions = $staff->role->permissions;
                if (is_string($permissions)) {
                    $permissions = json_decode($permissions, true);
                }
            } else {
                // Nếu là chủ quán, đảm bảo store_owner_address là null
                if ($user->store_owner_address !== null) {
                    $user->store_owner_address = null;
                    $user->save();
                }
            }

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

            // Lấy thông tin gói cước (Dựa trên chủ quán)
            $ownerAddress = strtolower($user->store_owner_address ?: $user->wallet_address);
            $owner = User::where('wallet_address', $ownerAddress)->first();
            
            $planCode = $owner ? ($owner->plan_code ?: 'free') : 'free';
            $planExpiresAt = $owner ? $owner->subscription_expires_at : null;
            $planStatus = $owner ? ($owner->subscription_status ?: 'active') : 'active';
            
            $plan = \App\Domain\Entities\SubscriptionPlan::where('code', $planCode)->first();
            $planFeatures = $plan ? $plan->features : null;

            // Kiểm tra xem có phải là Super Admin không
            $superAdminEnv = env('SUPER_ADMIN_ADDRESSES', '');
            $superAdmins = array_map('trim', explode(',', $superAdminEnv));
            $superAdmins = array_map('strtolower', array_filter($superAdmins));
            $isSuperAdmin = in_array(strtolower($address), $superAdmins);

            return response()->json([
                'success' => true,
                'token' => $token,
                'address' => $address,
                'role' => $roleName,
                'permissions' => $permissions,
                'is_super_admin' => $isSuperAdmin,
                'subscription' => [
                    'plan_code' => $planCode,
                    'subscription_expires_at' => $planExpiresAt,
                    'subscription_status' => $planStatus,
                    'features' => $planFeatures
                ]
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
