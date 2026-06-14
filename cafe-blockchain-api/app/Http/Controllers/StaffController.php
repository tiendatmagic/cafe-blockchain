<?php

namespace App\Http\Controllers;

use App\Domain\Entities\Role;
use App\Domain\Entities\Staff;
use App\Domain\Entities\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    /**
     * Lấy danh sách nhân viên
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $staffs = Staff::where('store_owner_address', $storeOwner)
            ->with('role')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($staffs);
    }

    /**
     * Thêm nhân viên mới
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'wallet_address' => [
                'required',
                'string',
                'regex:/^0x[a-fA-F0-9]{40}$/i',
                'unique:staffs,wallet_address', // Không được trùng ví nhân viên khác trên toàn hệ thống
            ],
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id')->where('store_owner_address', $storeOwner) // Vai trò phải thuộc quán
            ]
        ]);

        $walletAddress = strtolower($validated['wallet_address']);

        // Kiểm tra xem ví có phải là chủ quán (của chính mình hoặc quán khác)
        $isStoreOwner = User::where('wallet_address', $walletAddress)
            ->whereNull('store_owner_address')
            ->exists();

        if ($isStoreOwner || $walletAddress === $storeOwner) {
            return response()->json([
                'success' => false,
                'message' => 'Địa chỉ ví này là của một chủ quán, không thể thêm làm nhân viên.'
            ], 422);
        }

        // Tạo nhân viên mới
        $staff = Staff::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'wallet_address' => $walletAddress,
            'store_owner_address' => $storeOwner,
            'role_id' => $validated['role_id']
        ]);

        // Đảm bảo đồng bộ vào bảng users để cho phép nhân viên đăng nhập ví
        $user = User::firstOrCreate(['wallet_address' => $walletAddress]);
        $user->store_owner_address = $storeOwner;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Thêm nhân viên thành công.',
            'data' => $staff->load('role')
        ], 201);
    }

    /**
     * Cập nhật thông tin nhân viên
     */
    public function update(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $staff = Staff::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'wallet_address' => [
                'required',
                'string',
                'regex:/^0x[a-fA-F0-9]{40}$/i',
                Rule::unique('staffs', 'wallet_address')->ignore($id),
            ],
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id')->where('store_owner_address', $storeOwner)
            ]
        ]);

        $oldWalletAddress = strtolower($staff->wallet_address);
        $newWalletAddress = strtolower($validated['wallet_address']);

        // Kiểm tra xem ví mới có phải là chủ quán (của chính mình hoặc quán khác)
        $isStoreOwner = User::where('wallet_address', $newWalletAddress)
            ->whereNull('store_owner_address')
            ->exists();

        if ($isStoreOwner || $newWalletAddress === $storeOwner) {
            return response()->json([
                'success' => false,
                'message' => 'Địa chỉ ví này là của một chủ quán, không thể thêm làm nhân viên.'
            ], 422);
        }

        $staff->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'wallet_address' => $newWalletAddress,
            'role_id' => $validated['role_id']
        ]);

        // Nếu thay đổi địa chỉ ví của nhân viên
        if ($oldWalletAddress !== $newWalletAddress) {
            // Gỡ bỏ liên kết store_owner_address ở ví cũ của user
            $oldUser = User::where('wallet_address', $oldWalletAddress)->first();
            if ($oldUser && $oldUser->store_owner_address === $storeOwner) {
                $oldUser->store_owner_address = null;
                $oldUser->save();
            }

            // Gán store_owner_address ở ví mới của user
            $newUser = User::firstOrCreate(['wallet_address' => $newWalletAddress]);
            $newUser->store_owner_address = $storeOwner;
            $newUser->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nhân viên thành công.',
            'data' => $staff->load('role')
        ]);
    }

    /**
     * Xóa nhân viên
     */
    public function destroy(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $staff = Staff::where('store_owner_address', $storeOwner)->findOrFail($id);
        $walletAddress = strtolower($staff->wallet_address);

        // Xóa liên kết store_owner_address ở bảng users để vô hiệu hóa quyền đăng nhập của ví này vào quán
        $user = User::where('wallet_address', $walletAddress)->first();
        if ($user && $user->store_owner_address === $storeOwner) {
            $user->store_owner_address = null;
            $user->save();
        }

        $staff->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa nhân viên thành công.'
        ]);
    }

    /**
     * Lấy danh sách vai trò (Tự động sinh vai trò mặc định nếu chưa có)
     */
    public function indexRoles(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $roles = Role::where('store_owner_address', $storeOwner)->get();

        // Nếu quán chưa cấu hình vai trò nào, tự động sinh 4 vai trò mặc định
        if ($roles->isEmpty()) {
            $defaultRoles = [
                [
                    'name' => 'Quản lý cửa hàng',
                    'permissions' => [
                        'dashboard' => true, 'pos' => true, 'menu' => true, 'orders' => true,
                        'financials' => true, 'customers' => true, 'inventory' => true, 'tables' => true,
                        'reports' => true, 'settings' => true, 'staffs' => true
                    ]
                ],
                [
                    'name' => 'Nhân viên thu ngân',
                    'permissions' => [
                        'dashboard' => false, 'pos' => true, 'menu' => false, 'orders' => true,
                        'financials' => false, 'customers' => true, 'inventory' => false, 'tables' => true,
                        'reports' => false, 'settings' => false, 'staffs' => false
                    ]
                ],
                [
                    'name' => 'Nhân viên kho',
                    'permissions' => [
                        'dashboard' => false, 'pos' => false, 'menu' => true, 'orders' => false,
                        'financials' => false, 'customers' => false, 'inventory' => true, 'tables' => false,
                        'reports' => false, 'settings' => false, 'staffs' => false
                    ]
                ],
                [
                    'name' => 'Nhân viên thu chi',
                    'permissions' => [
                        'dashboard' => false, 'pos' => false, 'menu' => false, 'orders' => false,
                        'financials' => true, 'customers' => false, 'inventory' => false, 'tables' => false,
                        'reports' => false, 'settings' => false, 'staffs' => false
                    ]
                ]
            ];

            foreach ($defaultRoles as $def) {
                Role::create([
                    'name' => $def['name'],
                    'store_owner_address' => $storeOwner,
                    'permissions' => $def['permissions']
                ]);
            }

            // Lấy lại danh sách vai trò sau khi tạo
            $roles = Role::where('store_owner_address', $storeOwner)->get();
        }

        return response()->json($roles);
    }

    /**
     * Thêm vai trò mới
     */
    public function storeRole(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array'
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'store_owner_address' => $storeOwner,
            'permissions' => $validated['permissions']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm vai trò thành công.',
            'data' => $role
        ], 201);
    }

    /**
     * Cập nhật vai trò
     */
    public function updateRole(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $role = Role::where('store_owner_address', $storeOwner)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array'
        ]);

        $role->update([
            'name' => $validated['name'],
            'permissions' => $validated['permissions']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật vai trò thành công.',
            'data' => $role
        ]);
    }

    /**
     * Xóa vai trò
     */
    public function destroyRole(Request $request, $id)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        $role = Role::where('store_owner_address', $storeOwner)->findOrFail($id);

        // Kiểm tra xem vai trò này có đang được gán cho nhân viên nào không
        $staffCount = Staff::where('role_id', $id)->count();
        if ($staffCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa vai trò này vì đang có nhân viên sử dụng.'
            ], 422);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa vai trò thành công.'
        ]);
    }
}
