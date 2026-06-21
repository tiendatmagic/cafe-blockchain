<?php

namespace App\Http\Controllers;

use App\Domain\Entities\User;
use App\Domain\Entities\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class AdminController extends Controller
{
    /**
     * Lấy danh sách toàn bộ các quán (Chủ quán: store_owner_address là null)
     */
    public function indexTenants(Request $request)
    {
        $tenants = User::whereNull('store_owner_address')
            ->orderBy('created_at', 'desc')
            ->get();

        $result = [];
        foreach ($tenants as $tenant) {
            $wallet = strtolower($tenant->wallet_address);
            
            // Lấy tên cửa hàng từ bảng settings
            $storeNameSetting = DB::table('settings')
                ->where('store_owner_address', $wallet)
                ->where('key', 'store_name')
                ->first();
            
            $storeName = $storeNameSetting ? $storeNameSetting->value : 'Cafe Web3 POS';

            $result[] = [
                'id' => $tenant->id,
                'wallet_address' => $tenant->wallet_address,
                'store_name' => $storeName,
                'plan_code' => $tenant->plan_code ?: 'free',
                'subscription_expires_at' => $tenant->subscription_expires_at,
                'subscription_status' => $tenant->subscription_status ?: 'active',
                'created_at' => $tenant->created_at,
            ];
        }

        return response()->json($result);
    }

    /**
     * Cập nhật thông tin thuê bao của một quán
     */
    public function updateTenantSubscription(Request $request, $id)
    {
        $validated = $request->validate([
            'plan_code' => 'required|string|exists:subscription_plans,code',
            'subscription_expires_at' => 'required|date|after_or_equal:today',
            'subscription_status' => 'required|string|in:active,suspended',
            'store_name' => 'required|string|max:255',
        ]);

        $tenant = User::whereNull('store_owner_address')->findOrFail($id);
        
        $tenant->plan_code = $validated['plan_code'];
        $tenant->subscription_expires_at = $validated['subscription_expires_at'];
        $tenant->subscription_status = $validated['subscription_status'];
        $tenant->save();

        // Cập nhật tên cửa hàng vào bảng settings và xóa cache website storefront
        $wallet = strtolower($tenant->wallet_address);
        \App\Domain\Entities\Setting::setForStore('store_name', $validated['store_name'], $wallet);
        \App\Domain\Entities\Setting::clearStorefrontCache($wallet);

        return response()->json([
            'success' => true,
            'message' => 'Tenant subscription updated successfully.',
            'tenant' => $tenant
        ]);
    }

    /**
     * Lấy danh sách toàn bộ các gói cước
     */
    public function indexPlans(Request $request)
    {
        $plans = SubscriptionPlan::orderBy('created_at', 'asc')->get();
        return response()->json($plans);
    }

    /**
     * Tạo một gói cước mới
     */
    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|regex:/^[a-z0-9_-]+$/|unique:subscription_plans,code',
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'price_per_month' => 'required|numeric|min:0',
            'price_per_year' => 'required|numeric|min:0',
            'features' => 'required|array',
            'features.max_products' => 'required|integer',
            'features.max_staffs' => 'required|integer',
            'features.max_customers' => 'required|integer',
            'features.max_transactions' => 'required|integer',
            'features.max_debts' => 'required|integer',
            'features.enable_dashboard' => 'required|boolean',
            'features.enable_pos' => 'required|boolean',
            'features.enable_orders' => 'required|boolean',
            'features.enable_tables' => 'required|boolean',
            'features.enable_shifts' => 'required|boolean',
            'features.enable_menu' => 'required|boolean',
            'features.enable_inventory' => 'required|boolean',
            'features.enable_customers' => 'required|boolean',
            'features.enable_debts' => 'required|boolean',
            'features.enable_financials' => 'required|boolean',
            'features.enable_staffs' => 'required|boolean',
            'features.enable_storefront' => 'required|boolean',
            'features.enable_reports' => 'required|boolean',
            'features.enable_excel_export' => 'required|boolean',
        ]);

        $plan = SubscriptionPlan::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'is_active' => $validated['is_active'],
            'price_per_month' => $validated['price_per_month'],
            'price_per_year' => $validated['price_per_year'],
            'features' => $validated['features']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'New subscription plan created successfully.',
            'plan' => $plan
        ], 201);
    }

    /**
     * Cập nhật thông tin gói cước
     */
    public function updatePlan(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'required|boolean',
            'price_per_month' => 'required|numeric|min:0',
            'price_per_year' => 'required|numeric|min:0',
            'features' => 'required|array',
            'features.max_products' => 'required|integer',
            'features.max_staffs' => 'required|integer',
            'features.max_customers' => 'required|integer',
            'features.max_transactions' => 'required|integer',
            'features.max_debts' => 'required|integer',
            'features.enable_dashboard' => 'required|boolean',
            'features.enable_pos' => 'required|boolean',
            'features.enable_orders' => 'required|boolean',
            'features.enable_tables' => 'required|boolean',
            'features.enable_shifts' => 'required|boolean',
            'features.enable_menu' => 'required|boolean',
            'features.enable_inventory' => 'required|boolean',
            'features.enable_customers' => 'required|boolean',
            'features.enable_debts' => 'required|boolean',
            'features.enable_financials' => 'required|boolean',
            'features.enable_staffs' => 'required|boolean',
            'features.enable_storefront' => 'required|boolean',
            'features.enable_reports' => 'required|boolean',
            'features.enable_excel_export' => 'required|boolean',
        ]);

        $plan->name = $validated['name'];
        $plan->is_active = $validated['is_active'];
        $plan->price_per_month = $validated['price_per_month'];
        $plan->price_per_year = $validated['price_per_year'];
        $plan->features = $validated['features'];
        $plan->save();

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan updated successfully.',
            'plan' => $plan
        ]);
    }

    /**
     * Xóa gói cước (Không cho phép nếu có quán đang sử dụng)
     */
    public function destroyPlan($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);

        // Không cho phép xóa gói mặc định free
        if ($plan->code === 'free') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete default system subscription plan (free).'
            ], 400);
        }

        // Kiểm tra xem có quán nào đang sử dụng gói này không
        $inUse = User::where('plan_code', $plan->code)->exists();
        if ($inUse) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete this subscription plan because it is currently in use by stores.'
            ], 400);
        }

        $plan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan deleted successfully.'
        ]);
    }

    /**
     * Khôi phục 3 gói cước mặc định (free, pro, ultra) về trạng thái ban đầu.
     * Dùng updateOrInsert để bảo toàn ID gốc nếu còn tồn tại, hoặc tạo mới nếu đã bị xóa.
     */
    public function resetDefaultPlans()
    {
        $defaults = [
            [
                'code'      => 'free',
                'name'      => 'Gói Dùng Thử',
                'is_active' => true,
                'price_per_month' => 0,
                'price_per_year' => 0,
                'features'  => json_encode([
                    'max_products'        => 50,
                    'max_staffs'          => 0,
                    'max_customers'       => 50,
                    'max_transactions'    => 100,
                    'max_debts'           => 100,
                    'enable_dashboard'    => true,
                    'enable_pos'          => true,
                    'enable_orders'       => true,
                    'enable_tables'       => false,
                    'enable_shifts'       => false,
                    'enable_menu'         => true,
                    'enable_inventory'    => false,
                    'enable_customers'    => true,
                    'enable_debts'        => false,
                    'enable_financials'   => false,
                    'enable_staffs'       => false,
                    'enable_storefront'   => false,
                    'enable_reports'      => false,
                    'enable_excel_export' => false,
                ]),
            ],
            [
                'code'      => 'pro',
                'name'      => 'Gói Chuyên nghiệp (Pro)',
                'is_active' => true,
                'price_per_month' => 150000,
                'price_per_year' => 1500000,
                'features'  => json_encode([
                    'max_products'        => 500,
                    'max_staffs'          => 10,
                    'max_customers'       => 1000,
                    'max_transactions'    => 100000,
                    'max_debts'           => 100000,
                    'enable_dashboard'    => true,
                    'enable_pos'          => true,
                    'enable_orders'       => true,
                    'enable_tables'       => true,
                    'enable_shifts'       => true,
                    'enable_menu'         => true,
                    'enable_inventory'    => true,
                    'enable_customers'    => true,
                    'enable_debts'        => true,
                    'enable_financials'   => true,
                    'enable_staffs'       => true,
                    'enable_storefront'   => true,
                    'enable_reports'      => true,
                    'enable_excel_export' => false,
                ]),
            ],
            [
                'code'      => 'ultra',
                'name'      => 'Gói Vô hạn (Ultra)',
                'is_active' => true,
                'price_per_month' => 300000,
                'price_per_year' => 3000000,
                'features'  => json_encode([
                    'max_products'        => -1,
                    'max_staffs'          => -1,
                    'max_customers'       => -1,
                    'max_transactions'    => -1,
                    'max_debts'           => -1,
                    'enable_dashboard'    => true,
                    'enable_pos'          => true,
                    'enable_orders'       => true,
                    'enable_tables'       => true,
                    'enable_shifts'       => true,
                    'enable_menu'         => true,
                    'enable_inventory'    => true,
                    'enable_customers'    => true,
                    'enable_debts'        => true,
                    'enable_financials'   => true,
                    'enable_staffs'       => true,
                    'enable_storefront'   => true,
                    'enable_reports'      => true,
                    'enable_excel_export' => true,
                ]),
            ],
        ];

        foreach ($defaults as $data) {
            DB::table('subscription_plans')->updateOrInsert(
                ['code' => $data['code']],
                array_merge($data, [
                    'updated_at' => now(),
                    'created_at' => now(),
                ])
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Default subscription plans (free, pro, ultra) restored successfully.',
        ]);
    }

    /**
     * Lấy cấu hình hệ thống Super Admin
     */
    public function getSystemSettings()
    {
        $cleanupSetting = DB::table('system_settings')
            ->where('key', 'token_cleanup_days')
            ->first();

        $days = 7;
        if ($cleanupSetting) {
            $value = json_decode($cleanupSetting->value, true);
            $days = $value['days'] ?? 7;
        }

        $contactsSetting = DB::table('system_settings')
            ->where('key', 'system_contacts')
            ->first();

        $contacts = [];
        if ($contactsSetting) {
            $contacts = json_decode($contactsSetting->value, true) ?: [];
        }

        // Lấy cấu hình Turnstile
        $turnstileSetting = DB::table('system_settings')
            ->where('key', 'turnstile_enabled')
            ->first();
        $turnstileEnabled = false;
        if ($turnstileSetting) {
            $value = json_decode($turnstileSetting->value, true);
            $turnstileEnabled = (bool)($value['enabled'] ?? false);
        }

        // Chỉ tiết lộ có hay không có Secret Key (không tiết lộ giá trị thực)
        $hasSecretKey = !empty(config('services.turnstile.secret_key'));

        return response()->json([
            'token_cleanup_days'  => $days,
            'system_contacts'     => $contacts,
            'turnstile_enabled'   => $turnstileEnabled,
            'turnstile_has_key'   => $hasSecretKey,
        ]);
    }

    /**
     * Cập nhật cấu hình hệ thống Super Admin
     */
    public function updateSystemSettings(Request $request)
    {
        $validated = $request->validate([
            'token_cleanup_days'  => 'required|integer|min:1|max:365',
            'turnstile_enabled'   => 'nullable|boolean',
            'system_contacts'     => 'nullable|array',
            'system_contacts.*.name'     => 'required|string|max:255',
            'system_contacts.*.phone'    => 'required|string|regex:/^[0-9]+$/|max:20',
            'system_contacts.*.email'    => 'nullable|string|max:255',
            'system_contacts.*.zalo'     => 'nullable|string|max:20',
            'system_contacts.*.facebook' => 'nullable|string|max:255',
            'system_contacts.*.telegram' => 'nullable|string|max:255',
        ]);

        DB::table('system_settings')
            ->updateOrInsert(
                ['key' => 'token_cleanup_days'],
                [
                    'value'      => json_encode(['days' => (int)$validated['token_cleanup_days']]),
                    'updated_at' => now()
                ]
            );

        // Cập nhật toggle Turnstile nếu có truyền lên
        if (array_key_exists('turnstile_enabled', $validated)) {
            // Không cho phép bật nếu chưa cấu hình Secret Key trong .env
            if ($validated['turnstile_enabled'] && empty(config('services.turnstile.secret_key'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot enable Turnstile: TURNSTILE_SECRET_KEY is not configured in environment variables.'
                ], 400);
            }

            DB::table('system_settings')
                ->updateOrInsert(
                    ['key' => 'turnstile_enabled'],
                    [
                        'value'      => json_encode(['enabled' => (bool)$validated['turnstile_enabled']]),
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
        }

        if (array_key_exists('system_contacts', $validated)) {
            $contacts = $validated['system_contacts'] ?: [];
            DB::table('system_settings')
                ->updateOrInsert(
                    ['key' => 'system_contacts'],
                    [
                        'value'      => json_encode($contacts),
                        'updated_at' => now()
                    ]
                );
        }

        return response()->json([
            'success' => true,
            'message' => 'System configuration updated successfully.'
        ]);
    }

    /**
     * API thực hiện dọn dẹp các Token hết hạn/cũ thủ công
     */
    public function cleanTokens()
    {
        $cleanupSetting = DB::table('system_settings')
            ->where('key', 'token_cleanup_days')
            ->first();

        $days = 7;
        if ($cleanupSetting) {
            $value = json_decode($cleanupSetting->value, true);
            $days = $value['days'] ?? 7;
        }

        // Xóa token cũ
        $deletedCount = PersonalAccessToken::where('last_used_at', '<', now()->subDays($days))
            ->orWhere(function ($query) use ($days) {
                $query->whereNull('last_used_at')
                      ->where('created_at', '<', now()->subDays($days));
            })->delete();

        return response()->json([
            'success' => true,
            'message' => "Successfully cleaned up {$deletedCount} expired tokens from database."
        ]);
    }

    /**
     * API thực hiện xóa toàn bộ Sanctum tokens của mọi user, bao gồm cả super admin.
     * Khi gọi api này xong, toàn bộ người dùng sẽ lập tức bị logout.
     */
    public function cleanAllTokens()
    {
        $deletedCount = PersonalAccessToken::query()->delete();

        return response()->json([
            'success' => true,
            'message' => "Successfully cleared all {$deletedCount} login tokens. All accounts logged out."
        ]);
    }

    // =========================================================
    // SYSTEM INFO
    // =========================================================

    /**
     * Trả về toàn bộ thông tin hệ thống, môi trường server, cấu hình PHP và database.
     */
    public function getSystemInfo()
    {
        $dbDriver  = config('database.default');
        $dbConfig  = config("database.connections.{$dbDriver}");
        $dbVersion = 'N/A';

        try {
            $row = DB::selectOne('SELECT VERSION() as version');
            $dbVersion = $row->version ?? 'N/A';
        } catch (\Throwable $e) {}

        $serverIp = request()->server('SERVER_ADDR')
            ?? (function_exists('gethostbyname') ? gethostbyname(gethostname()) : 'N/A');

        // Tính dung lượng ứng dụng (Cache 24 giờ để tránh ảnh hưởng hiệu năng)
        $appSize = \Cache::remember('system_app_size', 86400, function () {
            try {
                $size = 0;
                $its = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator(base_path(), \FilesystemIterator::SKIP_DOTS)
                );
                foreach ($its as $file) {
                    $size += $file->getSize();
                }
                return number_format($size / 1024 / 1024, 2, ',', '.') . ' MB';
            } catch (\Throwable $e) {
                return 'N/A';
            }
        });

        // Lấy số lượng kết nối tối đa của Database
        $maxConnections = 'N/A';
        try {
            $rowVar = DB::selectOne("SHOW VARIABLES LIKE 'max_connections'");
            if ($rowVar) {
                $maxConnections = $rowVar->Value ?? $rowVar->value ?? 'N/A';
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'system_env' => [
                'app_name'         => config('app.name'),
                'laravel_version'  => app()->version(),
                'php_version'      => PHP_VERSION,
                'timezone'         => config('app.timezone'),
                'server_ip'        => $serverIp,
                'app_size'         => $appSize,
                'debug_mode'       => (bool) config('app.debug'),
                'storage_writable' => is_writable(storage_path()),
                'cache_writable'   => is_writable(storage_path('framework/cache')),
            ],
            'server_env' => [
                'php_version'      => PHP_VERSION,
                'opcache_enabled'  => function_exists('opcache_get_status') && @opcache_get_status() !== false,
                'memory_limit'     => ini_get('memory_limit'),
                'max_exec_time'    => ini_get('max_execution_time'),
                'server_software'  => request()->server('SERVER_SOFTWARE') ?? php_uname('s'),
                'server_os'        => php_uname(),
                'database'         => $dbDriver,
                'ssl_installed'    => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
                'cache_driver'     => config('cache.default'),
                'session_driver'   => config('session.driver'),
                'queue_connection' => config('queue.default'),
                'allow_url_fopen'  => (bool) ini_get('allow_url_fopen'),
                'ext_openssl'      => extension_loaded('openssl'),
                'ext_mbstring'     => extension_loaded('mbstring'),
                'ext_pdo'          => extension_loaded('pdo'),
                'ext_curl'         => extension_loaded('curl'),
                'ext_exif'         => extension_loaded('exif'),
                'ext_fileinfo'     => extension_loaded('fileinfo'),
                'ext_tokenizer'    => extension_loaded('tokenizer'),
                'ext_gd_imagick'   => extension_loaded('gd') || extension_loaded('imagick'),
                'ext_zip'          => extension_loaded('zip'),
                'ext_iconv'        => extension_loaded('iconv'),
                'ext_json'         => extension_loaded('json'),
            ],
            'database_info' => [
                'driver'          => $dbDriver,
                'name'            => $dbConfig['database'] ?? 'N/A',
                'version'         => $dbVersion,
                'max_connections' => $maxConnections,
                'charset'         => $dbConfig['charset'] ?? 'utf8mb4',
                'collation'       => $dbConfig['collation'] ?? 'utf8mb4_unicode_ci',
            ],
            'php_config' => [
                'post_max_size'      => ini_get('post_max_size'),
                'upload_max_size'    => ini_get('upload_max_filesize'),
                'max_file_uploads'   => ini_get('max_file_uploads'),
                'max_input_time'     => ini_get('max_input_time'),
                'max_input_vars'     => ini_get('max_input_vars'),
                'display_errors'     => (bool) ini_get('display_errors'),
                'error_reporting'    => ini_get('error_reporting'),
                'date_timezone'      => ini_get('date.timezone'),
            ],
        ]);
    }

    /**
     * Đọc các gói cước đã khai báo trong composer.json và trả về danh sách cùng version.
     */
    public function getPackages()
    {
        $jsonFile = base_path('composer.json');

        if (!file_exists($jsonFile)) {
            return response()->json(['packages' => [], 'message' => 'composer.json not found.']);
        }

        $data = json_decode(file_get_contents($jsonFile), true);
        $packages = [];

        if (isset($data['require'])) {
            foreach ($data['require'] as $name => $version) {
                if ($name === 'php') {
                    continue;
                }
                $packages[] = [
                    'name'    => $name,
                    'version' => $version,
                    'require' => [],
                ];
            }
        }

        if (isset($data['require-dev'])) {
            foreach ($data['require-dev'] as $name => $version) {
                $packages[] = [
                    'name'    => $name,
                    'version' => $version,
                    'require' => [],
                ];
            }
        }

        return response()->json(['packages' => $packages]);
    }

    // =========================================================
    // MAINTENANCE ACTIONS
    // =========================================================

    /** Xóa compiled Blade views */
    public function clearViews()
    {
        \Artisan::call('view:clear');
        return response()->json(['success' => true, 'message' => 'Compiled views cleared successfully.']);
    }

    /** Xóa config cache */
    public function clearConfig()
    {
        \Artisan::call('config:clear');
        return response()->json(['success' => true, 'message' => 'Config cache cleared successfully.']);
    }

    /** Xóa route cache */
    public function clearRoutes()
    {
        \Artisan::call('route:clear');
        return response()->json(['success' => true, 'message' => 'Route cache cleared successfully.']);
    }

    /** Xóa toàn bộ file .log trong storage/logs */
    public function clearLogs()
    {
        $logPath = storage_path('logs');
        $deleted = 0;

        foreach (glob("{$logPath}/*.log") as $file) {
            if (is_file($file)) {
                unlink($file);
                $deleted++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully deleted {$deleted} log files in storage/logs.",
        ]);
    }

    /** Tối ưu hóa hiệu năng: cache config, routes, views */
    public function optimize()
    {
        \Artisan::call('optimize');
        return response()->json(['success' => true, 'message' => 'System optimization completed successfully.']);
    }

    /** Xóa toàn bộ optimization cache */
    public function clearOptimize()
    {
        \Artisan::call('optimize:clear');
        return response()->json(['success' => true, 'message' => 'Optimization cache cleared successfully.']);
    }
}

