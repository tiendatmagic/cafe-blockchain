<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Lấy danh sách cấu hình
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Cập nhật danh sách cấu hình
     */
    public function store(Request $request)
    {
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
            Setting::set($key, $value);
        }

        return response()->json([
            'message' => 'Cập nhật cấu hình thành công!',
            'data' => Setting::all()->pluck('value', 'key')
        ]);
    }
}
