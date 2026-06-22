<?php

namespace App\Http\Controllers;

use App\Domain\Entities\User;
use App\Domain\Entities\SubscriptionPlan;
use App\Domain\Entities\SystemPaymentMethod;
use App\Domain\Entities\SystemStaff;
use App\Domain\Entities\SubscriptionRequest;
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

        // Tính dung lượng đóng gói của Angular frontend (Cache 5 phút)
        $webBuildSize = \Cache::remember('system_web_build_size', 300, function () {
            try {
                $distPath = base_path('../cafe-blockchain-web/dist');
                if (!file_exists($distPath) || !is_dir($distPath)) {
                    return 'N/A (Deploy độc lập)';
                }
                $size = 0;
                $its = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator($distPath, \FilesystemIterator::SKIP_DOTS)
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
                'web_build_size'   => $webBuildSize,
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
            'redis_info' => $this->getRedisSystemInfo(),
        ]);
    }

    /**
     * Thu thập thông tin Redis của hệ thống
     */
    private function getRedisSystemInfo()
    {
        $redisEnabled = extension_loaded('redis') || class_exists('Redis');
        $redisStatus = 'Không hoạt động';
        $redisVersion = 'N/A';
        $redisHost = config('database.redis.default.host', '127.0.0.1');
        $redisPort = config('database.redis.default.port', '6379');
        $redisClient = config('database.redis.client', 'phpredis');

        if ($redisEnabled) {
            try {
                $redis = \Illuminate\Support\Facades\Redis::connection();
                $response = $redis->ping();
                
                if ($response === true || $response === 'PONG' || $response === '+PONG' || (is_object($response) && method_exists($response, 'getPayload') && $response->getPayload() === 'PONG')) {
                    $redisStatus = 'Đang hoạt động';
                    try {
                        $info = $redis->info();
                        if (isset($info['redis_version'])) {
                            $redisVersion = $info['redis_version'];
                        } elseif (isset($info['Server']['redis_version'])) {
                            $redisVersion = $info['Server']['redis_version'];
                        }
                    } catch (\Throwable $e) {
                        $redisVersion = 'Đang chạy (Không lấy được version)';
                    }
                } else {
                    $redisStatus = 'Không phản hồi (Ping fail)';
                }
            } catch (\Throwable $e) {
                $redisStatus = 'Không kết nối được: ' . $e->getMessage();
            }
        } else {
            $redisStatus = 'PHP Extension redis chưa được cài đặt';
        }

        return [
            'enabled'      => $redisEnabled,
            'status'       => $redisStatus,
            'version'      => $redisVersion,
            'client'       => $redisClient,
            'host'         => $redisHost,
            'port'         => $redisPort,
            'is_cache'     => config('cache.default') === 'redis',
            'is_session'   => config('session.driver') === 'redis',
            'is_queue'     => config('queue.default') === 'redis',
        ];
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

    /**
     * Lấy danh sách các phương thức thanh toán của hệ thống
     */
    public function indexPaymentMethods(Request $request)
    {
        $search = $request->query('search', '');
        $perPage = (int)$request->query('per_page', 10);

        $query = SystemPaymentMethod::query();

        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%")
                  ->orWhere('account_holder', 'like', "%{$search}%");
            });
        }

        $paymentMethods = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $paymentMethods->items(),
            'total' => $paymentMethods->total(),
            'current_page' => $paymentMethods->currentPage(),
            'per_page' => $paymentMethods->perPage(),
        ]);
    }

    /**
     * Thêm phương thức thanh toán hệ thống mới
     */
    public function storePaymentMethod(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:bank,wallet',
            'name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_holder' => 'required|string|max:255',
            'bank_code' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $paymentMethod = SystemPaymentMethod::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'System payment method created successfully.',
            'data' => $paymentMethod
        ]);
    }

    /**
     * Cập nhật phương thức thanh toán hệ thống
     */
    public function updatePaymentMethod(Request $request, $id)
    {
        $paymentMethod = SystemPaymentMethod::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|in:bank,wallet',
            'name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_holder' => 'required|string|max:255',
            'bank_code' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $paymentMethod->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'System payment method updated successfully.',
            'data' => $paymentMethod
        ]);
    }

    /**
     * Xóa phương thức thanh toán hệ thống
     */
    public function destroyPaymentMethod($id)
    {
        $paymentMethod = SystemPaymentMethod::findOrFail($id);
        $paymentMethod->delete();

        return response()->json([
            'success' => true,
            'message' => 'System payment method deleted successfully.'
        ]);
    }

    // =========================================================
    // SYSTEM STAFFS MANAGEMENT (Chỉ dành cho Super Admin)
    // =========================================================

    public function indexSystemStaffs(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');

        $query = SystemStaff::query();

        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('wallet_address', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
            });
        }

        $staffs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $staffs->items(),
            'total' => $staffs->total(),
            'current_page' => $staffs->currentPage(),
            'per_page' => $staffs->perPage(),
        ]);
    }

    public function storeSystemStaff(Request $request)
    {
        $validated = $request->validate([
            'wallet_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i|unique:system_staffs,wallet_address',
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:staff,admin',
            'is_active' => 'required|boolean',
        ]);

        $validated['wallet_address'] = strtolower($validated['wallet_address']);

        $staff = SystemStaff::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Nhân viên hệ thống đã được thêm thành công.',
            'data' => $staff
        ]);
    }

    public function updateSystemStaff(Request $request, $id)
    {
        $staff = SystemStaff::findOrFail($id);

        $validated = $request->validate([
            'wallet_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i|unique:system_staffs,wallet_address,' . $id,
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:staff,admin',
            'is_active' => 'required|boolean',
        ]);

        $validated['wallet_address'] = strtolower($validated['wallet_address']);

        $staff->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Nhân viên hệ thống đã được cập nhật thành công.',
            'data' => $staff
        ]);
    }

    public function destroySystemStaff($id)
    {
        $staff = SystemStaff::findOrFail($id);
        $staff->delete();

        return response()->json([
            'success' => true,
            'message' => 'Nhân viên hệ thống đã được xóa thành công.'
        ]);
    }

    // =========================================================
    // SUBSCRIPTION REQUESTS MANAGEMENT (Super Admin & Staff)
    // =========================================================

    public function indexSubscriptionRequests(Request $request)
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');
        $perPage = (int)$request->query('per_page', 10);

        $query = SubscriptionRequest::with('systemPaymentMethod');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('store_owner_address', 'like', "%{$search}%")
                  ->orWhere('plan_code', 'like', "%{$search}%");
            });
        }

        $requests = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Map thêm thông tin tên store và gói hiện tại cho từng yêu cầu
        $items = $requests->items();
        foreach ($items as $item) {
            $storeNameSetting = DB::table('settings')
                ->where('store_owner_address', strtolower($item->store_owner_address))
                ->where('key', 'store_name')
                ->first();
            $item->store_name = $storeNameSetting ? $storeNameSetting->value : 'Cafe Web3 POS';

            $user = User::where('wallet_address', strtolower($item->store_owner_address))->first();
            if ($user) {
                $item->current_plan_code = $user->plan_code;
                $item->current_subscription_expires_at = $user->subscription_expires_at;
                $item->current_subscription_status = $user->subscription_status;
            } else {
                $item->current_plan_code = 'free';
                $item->current_subscription_expires_at = null;
                $item->current_subscription_status = 'active';
            }

            // Map payment_method_details động từ system_payment_method_id
            $paymentMethod = $item->systemPaymentMethod;
            if ($paymentMethod) {
                $item->payment_method_details = "{$paymentMethod->name} - {$paymentMethod->account_number} ({$paymentMethod->account_holder})";
            } else {
                $item->payment_method_details = $item->system_payment_method_id 
                    ? "Phương thức đã bị xóa (ID: {$item->system_payment_method_id})" 
                    : 'N/A';
            }
        }

        return response()->json([
            'data' => $items,
            'total' => $requests->total(),
            'current_page' => $requests->currentPage(),
            'per_page' => $requests->perPage(),
        ]);
    }

    public function approveSubscriptionRequest(Request $request, $id)
    {
        $subRequest = SubscriptionRequest::findOrFail($id);

        if ($subRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Yêu cầu này đã được xử lý từ trước.'
            ], 400);
        }

        $user = User::where('wallet_address', strtolower($subRequest->store_owner_address))->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tài khoản chủ cửa hàng liên kết với yêu cầu này.'
            ], 404);
        }

        // Thực hiện cập nhật thời hạn thuê bao trên tài khoản User chủ quán
        $currentExpiresAt = $user->subscription_expires_at;
        $isExpired = !$currentExpiresAt || now()->greaterThan($currentExpiresAt);
        $months = $subRequest->duration_months;

        if (!$isExpired && $user->plan_code !== 'free') {
            // Cộng nối tiếp vào ngày hết hạn cũ
            $newExpiresAt = \Carbon\Carbon::parse($currentExpiresAt)->addMonths($months);
        } else {
            // Tính từ ngày hôm nay
            $newExpiresAt = now()->addMonths($months);
        }

        $user->plan_code = $subRequest->plan_code;
        $user->subscription_expires_at = $newExpiresAt;
        $user->subscription_status = 'active';
        $user->save();

        // Cập nhật trạng thái yêu cầu
        $adminUser = $request->user();
        $subRequest->status = 'approved';
        $subRequest->approved_by = $adminUser->wallet_address;
        $subRequest->approved_at = now();
        $subRequest->save();

        // Ghi log giao dịch nâng cấp vào system_settings (để tương thích ngược với log cũ)
        DB::table('system_settings')->updateOrInsert(
            ['key' => 'last_upgrade_tx_' . strtolower($user->wallet_address)],
            [
                'value' => json_encode([
                    'plan_code' => $subRequest->plan_code,
                    'months' => $months,
                    'tx_hash' => $subRequest->tx_hash,
                    'timestamp' => now()->toIso8601String()
                ]),
                'updated_at' => now()
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Đã phê duyệt yêu cầu nâng cấp gói cước và kích hoạt thuê bao thành công!'
        ]);
    }

    public function rejectSubscriptionRequest(Request $request, $id)
    {
        $subRequest = SubscriptionRequest::findOrFail($id);

        if ($subRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Yêu cầu này đã được xử lý từ trước.'
            ], 400);
        }

        $validated = $request->validate([
            'rejected_reason' => 'required|string|max:500',
        ]);

        $adminUser = $request->user();
        $subRequest->status = 'rejected';
        $subRequest->rejected_reason = $validated['rejected_reason'];
        $subRequest->approved_by = $adminUser->wallet_address;
        $subRequest->approved_at = now();
        $subRequest->save();

        return response()->json([
            'success' => true,
            'message' => 'Đã từ chối yêu cầu nâng cấp gói cước.'
        ]);
    }
}

