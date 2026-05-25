<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Lấy danh sách cấu hình
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        
        // Nếu chưa có cấu hình nào thì khởi tạo mặc định cho cửa hàng
        if (empty($settings)) {
            $defaultSettings = [
                'store_name' => 'Cafe Web3 POS',
                'primary_color' => '#f59e0b',
                'secondary_color' => '#10b981',
                'contract_address' => '',
                'rpc_url' => '',
                'chain_id' => '',
                'explorer_url' => '',
            ];
            
            foreach ($defaultSettings as $key => $value) {
                Setting::setForStore($key, $value, $storeOwner);
            }
            
            $settings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();
        }
        
        return response()->json($settings);
    }

    /**
     * Cập nhật danh sách cấu hình
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);
        
        $settingsData = $request->validate([
            'store_name' => 'nullable|string|max:255',
            'contract_address' => 'nullable|string|max:255',
            'rpc_url' => 'nullable|string|max:1000',
            'chain_id' => 'nullable|string|max:50',
            'explorer_url' => 'nullable|string|max:1000',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
        ]);

        foreach ($settingsData as $key => $value) {
            Setting::setForStore($key, $value, $storeOwner);
        }

        $updatedSettings = Setting::where('store_owner_address', $storeOwner)->pluck('value', 'key')->all();

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => $updatedSettings
        ]);
    }
}
