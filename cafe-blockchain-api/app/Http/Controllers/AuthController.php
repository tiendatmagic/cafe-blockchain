<?php

namespace App\Http\Controllers;

use App\Domain\Entities\User;
use App\Domain\Entities\Staff;
use App\Domain\Entities\SystemPaymentMethod;
use App\Domain\Entities\SystemStaff;
use App\Domain\Entities\SubscriptionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
                // Populate profile từ staffs nếu ví đã được đăng ký là nhân viên
                if ($staff) {
                    $user->name  = $staff->name ?: null;
                    $user->phone = $staff->phone ?: null;
                }
                $user->save();
            } elseif ($staff) {
                // User đã tồn tại nhưng chưa có tên — đồng bộ từ staffs một lần
                if (empty($user->name) && !empty($staff->name)) {
                    $user->name = $staff->name;
                    $user->save();
                }
                if (empty($user->phone) && !empty($staff->phone)) {
                    $user->phone = $staff->phone;
                    $user->save();
                }
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

            $cookieDomain = config('session.domain', null);
            $sameSitePolicy = config('session.auth_cookie_same_site', 'Lax');
            $isSecure = strtolower($sameSitePolicy) === 'none' ? true : $request->secure();

            $cookie = cookie(
                'auth_token', 
                $token, 
                1440, // 24 tiếng = 1 ngày
                '/', 
                $cookieDomain, 
                $isSecure, 
                true, // httpOnly
                false, 
                $sameSitePolicy
            );

            $loggedCookie = cookie(
                'auth_logged_in', 
                'true', 
                1440, // 24 tiếng = 1 ngày
                '/', 
                $cookieDomain, 
                $isSecure, 
                false, // httpOnly = false -> JS có thể đọc
                false, 
                $sameSitePolicy
            );

            // Lấy thông tin gói cước (Dựa trên chủ quán)
            $ownerAddress = strtolower($user->store_owner_address ?: $user->wallet_address);
            $owner = User::where('wallet_address', $ownerAddress)->first();
            
            $planCode = $owner ? ($owner->plan_code ?: 'free') : 'free';
            $planExpiresAt = $owner ? $owner->subscription_expires_at : null;
            $planStatus = $owner ? ($owner->subscription_status ?: 'active') : 'active';
            
            $plan = \App\Domain\Entities\SubscriptionPlan::where('code', $planCode)->first();
            $planFeatures = $plan ? $plan->features : null;

            // Kiểm tra xem có phải là Super Admin hay Staff không
            $superAdminEnv = config('auth.super_admin_addresses', '');
            $superAdmins = array_map('trim', explode(',', $superAdminEnv));
            $superAdmins = array_map('strtolower', array_filter($superAdmins));
            $isSuperAdmin = in_array(strtolower($address), $superAdmins);

            $adminRole = null;
            if ($isSuperAdmin) {
                $adminRole = 'super_admin';
            } else {
                $staffMember = SystemStaff::where('wallet_address', $address)->where('is_active', true)->first();
                if ($staffMember) {
                    $adminRole = $staffMember->role; // 'staff', 'admin'
                }
            }

            $contactsSetting = DB::table('system_settings')->where('key', 'system_contacts')->first();
            $contacts = $contactsSetting ? json_decode($contactsSetting->value, true) : [];

            // Fallback: ưu tiên users table, dùng staffs nếu users còn trống
            $displayName  = $user->name  ?: ($staff?->name  ?? null);
            $displayPhone = $user->phone ?: ($staff?->phone ?? null);
            $displayEmail = $user->email ?? null;

            return response()->json([
                'success' => true,
                'token' => $token,
                'address' => $address,
                'role' => $roleName,
                'permissions' => $permissions,
                'is_super_admin' => $isSuperAdmin,
                'admin_role' => $adminRole,
                'name' => $displayName,
                'email' => $displayEmail,
                'phone' => $displayPhone,
                'subscription' => [
                    'plan_code' => $planCode,
                    'subscription_expires_at' => $planExpiresAt,
                    'subscription_status' => $planStatus,
                    'features' => $planFeatures
                ],
                'system_contacts' => $contacts
            ])->withCookie($cookie)->withCookie($loggedCookie);
        }

        return response()->json(['message' => 'Invalid signature.'], 401);
    }

    /**
     * Lấy thông tin subscription hiện tại của người dùng đang đăng nhập
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $address = strtolower($user->wallet_address);

        // Lấy thông tin gói cước dựa trên chủ quán
        $ownerAddress = strtolower($user->store_owner_address ?: $user->wallet_address);
        $owner = User::where('wallet_address', $ownerAddress)->first();

        $planCode = $owner ? ($owner->plan_code ?: 'free') : 'free';
        $planExpiresAt = $owner ? $owner->subscription_expires_at : null;
        $planStatus = $owner ? ($owner->subscription_status ?: 'active') : 'active';

        $plan = \App\Domain\Entities\SubscriptionPlan::where('code', $planCode)->first();
        $planFeatures = $plan ? $plan->features : null;

        // Kiểm tra xem có phải là Super Admin hay Staff không
        $superAdminEnv = config('auth.super_admin_addresses', '');
        $superAdmins = array_map('trim', explode(',', $superAdminEnv));
        $superAdmins = array_map('strtolower', array_filter($superAdmins));
        $isSuperAdmin = in_array($address, $superAdmins);

        $adminRole = null;
        if ($isSuperAdmin) {
            $adminRole = 'super_admin';
        } else {
            $staffMember = SystemStaff::where('wallet_address', $address)->where('is_active', true)->first();
            if ($staffMember) {
                $adminRole = $staffMember->role; // 'staff', 'admin'
            }
        }

        $contactsSetting = DB::table('system_settings')->where('key', 'system_contacts')->first();
        $contacts = $contactsSetting ? json_decode($contactsSetting->value, true) : [];

        // Fallback: nếu users.name/phone trống thì lấy từ staffs
        $staff = Staff::where('wallet_address', $address)->first();
        $displayName  = $user->name  ?: ($staff?->name  ?? null);
        $displayPhone = $user->phone ?: ($staff?->phone ?? null);
        $displayEmail = $user->email ?? null;

        return response()->json([
            'address' => $address,
            'is_super_admin' => $isSuperAdmin,
            'admin_role' => $adminRole,
            'name' => $displayName,
            'email' => $displayEmail,
            'phone' => $displayPhone,
            'subscription' => [
                'plan_code' => $planCode,
                'subscription_expires_at' => $planExpiresAt,
                'subscription_status' => $planStatus,
                'features' => $planFeatures
            ],
            'system_contacts' => $contacts
        ]);
    }

    /**
     * Lấy danh sách các gói cước đang hoạt động cho người dùng
     */
    public function getPublicPlans()
    {
        $plans = \App\Domain\Entities\SubscriptionPlan::where('is_active', true)
            ->orderBy('price_per_month', 'asc')
            ->get();
        return response()->json($plans);
    }

    /**
     * Nâng cấp gói cước cho cửa hàng qua Web3
     */
    public function upgradeSubscription(Request $request)
    {
        $validated = $request->validate([
            'plan_code' => 'required|string|exists:subscription_plans,code',
            'duration_months' => 'required|integer|in:1,3,6,12',
            'tx_hash' => 'required|string',
            'payment_method_details' => 'nullable|string',
        ]);

        $user = $request->user();
        
        // Chỉ cho phép chủ cửa hàng nâng cấp (store_owner_address là null)
        if ($user->store_owner_address !== null) {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ chủ cửa hàng mới có quyền thực hiện nâng cấp gói cước.'
            ], 403);
        }

        $planCode = $validated['plan_code'];
        $months = (int)$validated['duration_months'];

        // 1. Chặn tuyệt đối nâng cấp hoặc gia hạn về gói dùng thử (free)
        if ($planCode === 'free') {
            return response()->json([
                'success' => false,
                'message' => 'Trial plan cannot be purchased or renewed.'
            ], 400);
        }

        // 2. Kiểm tra xem có yêu cầu nào đang ở trạng thái pending không
        $hasPending = SubscriptionRequest::where('store_owner_address', $user->wallet_address)
            ->where('status', 'pending')
            ->exists();
        if ($hasPending) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã có một yêu cầu nâng cấp đang chờ phê duyệt. Vui lòng không gửi yêu cầu trùng lặp.'
            ], 400);
        }

        $currentExpiresAt = $user->subscription_expires_at;
        $isExpired = !$currentExpiresAt || now()->greaterThan($currentExpiresAt);

        // 3. Kiểm tra hạn gói cước và ràng buộc gói trả phí (để từ chối yêu cầu sai luật ngay lập tức)
        if (!$isExpired) {
            if ($user->plan_code !== 'free') {
                if ($planCode !== $user->plan_code) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You cannot change your subscription plan before the current one expires. You can only renew your active plan.'
                    ], 400);
                }
            }
        }

        // 4. Lấy thông tin giá tiền của gói cước để lưu vào yêu cầu
        $plan = \App\Domain\Entities\SubscriptionPlan::where('code', $planCode)->first();
        if (!$plan) {
            return response()->json([
                'success' => false,
                'message' => 'Plan not found.'
            ], 404);
        }

        $amount = 0;
        if ($months == 12) {
            $amount = $plan->price_per_year;
        } else {
            $amount = $plan->price_per_month * $months;
        }

        // 5. Tạo yêu cầu đăng ký thuê bao mới ở trạng thái pending
        SubscriptionRequest::create([
            'store_owner_address' => $user->wallet_address,
            'plan_code' => $planCode,
            'duration_months' => $months,
            'amount' => $amount,
            'payment_method_details' => $validated['payment_method_details'] ?? null,
            'tx_hash' => $validated['tx_hash'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Yêu cầu nâng cấp gói cước đã được gửi thành công. Vui lòng chờ Admin phê duyệt.'
        ]);
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
     * Update user profile information
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'] ?? null;
        $user->phone = $validated['phone'] ?? null;
        $user->save();

        // Sync with staffs table if this user is a staff member
        $staff = Staff::where('wallet_address', strtolower($user->wallet_address))->first();
        if ($staff) {
            $staff->name = $user->name;
            $staff->phone = $user->phone ?: '';
            $staff->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone
            ]
        ]);
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

    /**
     * Lấy danh sách các phương thức thanh toán đang hoạt động của hệ thống
     */
    public function getSystemPaymentMethods()
    {
        $methods = SystemPaymentMethod::where('is_active', true)
            ->orderBy('created_at', 'asc')
            ->get();
        return response()->json($methods);
    }
}
