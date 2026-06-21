<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerGroupController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\DiningTableController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuSyncController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\RequireOwner;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes for Authentication
Route::get('/auth/nonce', [AuthController::class, 'getNonce'])->middleware('throttle:auth_endpoints');
Route::post('/auth/verify', [AuthController::class, 'verifySignature'])->middleware('throttle:auth_endpoints');
Route::get('/vouchers/metadata/{code}', [\App\Http\Controllers\VoucherController::class, 'metadata']);
Route::post('/vouchers/submit-signature', [\App\Http\Controllers\VoucherController::class, 'submitSignature']);
Route::get('/settings/public', [SettingController::class, 'getPublicSettings']);
Route::get('/store/{slug}', [SettingController::class, 'getStoreDetailsBySlug']);
Route::post('/store/{slug}/orders', [SettingController::class, 'createStoreOrderBySlug'])->middleware('throttle:public_orders');
Route::post('/orders/claim-points', [\App\Http\Controllers\ClaimController::class, 'claimPoints'])->middleware('throttle:auth_endpoints');

// Protected routes (require valid Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']); // Lấy thông tin subscription hiện tại
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']); // Cập nhật thông tin cá nhân
    Route::get('/auth/subscription/plans', [AuthController::class, 'getPublicPlans']); // Lấy danh sách gói cước để nâng cấp
    Route::post('/auth/subscription/upgrade', [AuthController::class, 'upgradeSubscription']);
    Route::get('/auth/system-payment-methods', [AuthController::class, 'getSystemPaymentMethods']);


    // System Admin & Staff Routes (Shared access)
    Route::middleware(\App\Http\Middleware\EnsureIsSystemAdmin::class)->prefix('admin')->group(function () {
        Route::get('/tenants', [AdminController::class, 'indexTenants']);
        Route::put('/tenants/{id}/subscription', [AdminController::class, 'updateTenantSubscription']);

        // Subscription Requests Approval API
        Route::get('/subscriptions', [AdminController::class, 'indexSubscriptionRequests']);
        Route::post('/subscriptions/{id}/approve', [AdminController::class, 'approveSubscriptionRequest']);
        Route::post('/subscriptions/{id}/reject', [AdminController::class, 'rejectSubscriptionRequest']);

        // System Info & Packages
        Route::get('/system-info', [AdminController::class, 'getSystemInfo']);
        Route::get('/packages', [AdminController::class, 'getPackages']);

        // Read-only access for admin role (view system staffs & payment methods)
        Route::get('/staffs', [AdminController::class, 'indexSystemStaffs']);
        Route::get('/payment-methods', [AdminController::class, 'indexPaymentMethods']);
    });

    // Super Admin Only Routes (Bypass CheckSubscription)
    Route::middleware(\App\Http\Middleware\EnsureIsSuperAdmin::class)->prefix('admin')->group(function () {
        Route::get('/plans', [AdminController::class, 'indexPlans']);
        Route::post('/plans', [AdminController::class, 'storePlan']);
        Route::post('/plans/reset-defaults', [AdminController::class, 'resetDefaultPlans']);
        Route::put('/plans/{id}', [AdminController::class, 'updatePlan']);
        Route::delete('/plans/{id}', [AdminController::class, 'destroyPlan']);
        
        Route::get('/system-settings', [AdminController::class, 'getSystemSettings']);
        Route::put('/system-settings', [AdminController::class, 'updateSystemSettings']);
        Route::post('/clean-tokens', [AdminController::class, 'cleanTokens']);
        Route::post('/clean-all-tokens', [AdminController::class, 'cleanAllTokens']);

        // System Staffs CRUD (write operations - Super Admin only)
        Route::post('/staffs', [AdminController::class, 'storeSystemStaff']);
        Route::put('/staffs/{id}', [AdminController::class, 'updateSystemStaff']);
        Route::delete('/staffs/{id}', [AdminController::class, 'destroySystemStaff']);

        // System Payment Methods CRUD (write operations - Super Admin only)
        Route::post('/payment-methods', [AdminController::class, 'storePaymentMethod']);
        Route::put('/payment-methods/{id}', [AdminController::class, 'updatePaymentMethod']);
        Route::delete('/payment-methods/{id}', [AdminController::class, 'destroyPaymentMethod']);

        // Maintenance Actions
        Route::post('/maintenance/clear-views', [AdminController::class, 'clearViews']);
        Route::post('/maintenance/clear-config', [AdminController::class, 'clearConfig']);
        Route::post('/maintenance/clear-routes', [AdminController::class, 'clearRoutes']);
        Route::post('/maintenance/clear-logs', [AdminController::class, 'clearLogs']);
        Route::post('/maintenance/optimize', [AdminController::class, 'optimize']);
        Route::post('/maintenance/clear-optimize', [AdminController::class, 'clearOptimize']);
    });

    // Business routes (protected by CheckSubscription)
    Route::middleware(\App\Http\Middleware\CheckSubscription::class)->group(function () {
        // Dashboard API (Read-only, check permission:dashboard)
        Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('permission:dashboard');

        // Vouchers API
        Route::get('/vouchers', [\App\Http\Controllers\VoucherController::class, 'index']);
        Route::post('/vouchers/sync-ownership', [\App\Http\Controllers\VoucherController::class, 'syncOwnership']);
        Route::post('/vouchers/request-sign', [\App\Http\Controllers\VoucherController::class, 'requestSign']);
        Route::post('/vouchers/cancel-sign', [\App\Http\Controllers\VoucherController::class, 'cancelSign']);
        Route::get('/vouchers/check-signature/{orderCode}', [\App\Http\Controllers\VoucherController::class, 'checkSignature']);

        // Products & Categories read API (Thực đơn)
        Route::middleware('feature:enable_menu')->group(function () {
            Route::get('/products', [ProductController::class, 'index'])->middleware('permission:pos|menu|inventory');
            Route::get('/categories', [CategoryController::class, 'index'])->middleware('permission:pos|menu|inventory');
        });

        // Orders (Đơn hàng & POS) API
        Route::middleware('feature:enable_orders')->group(function () {
            Route::get('/orders', [OrderController::class, 'index'])->middleware('permission:pos|orders');
            Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('permission:pos|orders');
            Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('permission:pos|orders');
            Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware(RequireOwner::class);
            Route::put('/orders/{id}/sync', [OrderController::class, 'syncBlockchain'])->middleware(RequireOwner::class);
            Route::post('/orders/{id}/mint-voucher-manual', [OrderController::class, 'mintVoucherManual'])->middleware(RequireOwner::class);
        });

        // API tạo đơn hàng POS mới
        Route::post('/orders', [OrderController::class, 'store'])->middleware(['permission:pos', 'feature:enable_pos']);

        // API Versioning V1 & V2 cho Orders
        Route::prefix('v1')->group(function () {
            Route::middleware('feature:enable_orders')->group(function () {
                Route::get('/orders', [OrderController::class, 'index'])->middleware('permission:pos|orders');
                Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('permission:pos|orders');
                Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('permission:pos|orders');
                Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware(RequireOwner::class);
                Route::put('/orders/{id}/sync', [OrderController::class, 'syncBlockchain'])->middleware(RequireOwner::class);
                Route::post('/orders/{id}/mint-voucher-manual', [OrderController::class, 'mintVoucherManual'])->middleware(RequireOwner::class);
            });
            Route::post('/orders', [OrderController::class, 'store'])->middleware(['permission:pos', 'feature:enable_pos']);
        });

        Route::prefix('v2')->group(function () {
            Route::get('/orders', function() {
                return response()->json(['message' => 'API Orders V2 is ready for development.']);
            });
        });

        // Settings API
        Route::get('/settings', [SettingController::class, 'index'])->middleware('permission:settings');

        // Payment Methods API
        Route::get('/payment-methods', [PaymentMethodController::class, 'index'])->middleware('permission:settings');
        Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->middleware('permission:settings');
        Route::put('/payment-methods/{id}', [PaymentMethodController::class, 'update'])->middleware('permission:settings');
        Route::delete('/payment-methods/{id}', [PaymentMethodController::class, 'destroy'])->middleware('permission:settings');

        // Menu Sync Logs API
        Route::get('/menu-sync-logs', [MenuSyncController::class, 'index'])->middleware('permission:settings|menu');
        Route::post('/menu-sync-logs', [MenuSyncController::class, 'store'])->middleware('permission:settings|menu');

        // Customers (Khách hàng) API
        Route::middleware('feature:enable_customers')->group(function () {
            Route::get('/customers', [CustomerController::class, 'index'])->middleware('permission:pos|customers|reports');
            Route::post('/customers', [CustomerController::class, 'store'])->middleware(['permission:pos|customers', 'limit:customers']);
            Route::put('/customers/{id}', [CustomerController::class, 'update'])->middleware('permission:pos|customers');
            Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->middleware('permission:customers');

            // Customer Groups API
            Route::get('/customer-groups', [CustomerGroupController::class, 'index'])->middleware('permission:customers');
            Route::post('/customer-groups', [CustomerGroupController::class, 'store'])->middleware('permission:customers');
            Route::put('/customer-groups/{id}', [CustomerGroupController::class, 'update'])->middleware('permission:customers');
            Route::delete('/customer-groups/{id}', [CustomerGroupController::class, 'destroy'])->middleware('permission:customers');
        });

        // Debts (Sổ nợ) API
        Route::middleware('feature:enable_debts')->group(function () {
            Route::get('/debts', [\App\Http\Controllers\DebtController::class, 'index'])->middleware('permission:debts');
            Route::get('/debts/customer/{id}', [\App\Http\Controllers\DebtController::class, 'show'])->middleware('permission:debts');
            Route::post('/debts', [\App\Http\Controllers\DebtController::class, 'store'])->middleware(['permission:debts', 'limit:debts']);
            Route::post('/debts/payment', [\App\Http\Controllers\DebtController::class, 'storePayment'])->middleware('permission:debts');
            Route::delete('/debts/{id}', [\App\Http\Controllers\DebtController::class, 'destroy'])->middleware('permission:debts');
        });

        // Transactions (Thu Chi) API
        Route::middleware('feature:enable_financials')->group(function () {
            Route::get('/transactions', [TransactionController::class, 'index'])->middleware('permission:financials');
            Route::post('/transactions', [TransactionController::class, 'store'])->middleware(['permission:financials', 'limit:transactions']);
            Route::put('/transactions/{id}', [TransactionController::class, 'update'])->middleware('permission:financials');
            Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->middleware('permission:financials');
            Route::put('/transactions/{id}/sync', [TransactionController::class, 'syncBlockchain'])->middleware(RequireOwner::class);
        });

        // Inventory (Kho hàng) API
        Route::middleware('feature:enable_inventory')->group(function () {
            Route::get('/inventory', [InventoryController::class, 'index'])->middleware('permission:inventory');
            Route::post('/inventory', [InventoryController::class, 'store'])->middleware('permission:inventory');
            Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->middleware('permission:inventory');
        });

        // Areas & Dining Tables (Sơ đồ bàn) API
        Route::middleware('feature:enable_tables')->group(function () {
            // Areas (Khu vực) API
            Route::get('/areas', [AreaController::class, 'index'])->middleware('permission:pos|tables');
            Route::post('/areas', [AreaController::class, 'store'])->middleware('permission:tables');
            Route::put('/areas/{id}', [AreaController::class, 'update'])->middleware('permission:tables');
            Route::delete('/areas/{id}', [AreaController::class, 'destroy'])->middleware('permission:tables');

            // Dining Tables (Bàn ăn) API
            Route::get('/dining-tables', [DiningTableController::class, 'index'])->middleware('permission:pos|tables');
            Route::post('/dining-tables', [DiningTableController::class, 'store'])->middleware('permission:tables');
            Route::put('/dining-tables/{id}', [DiningTableController::class, 'update'])->middleware('permission:tables');
            Route::put('/dining-tables/{id}/status', [DiningTableController::class, 'updateStatus'])->middleware('permission:pos|tables');
            Route::delete('/dining-tables/{id}', [DiningTableController::class, 'destroy'])->middleware('permission:tables');
        });

        // Shifts API (Ca làm việc & Két tiền)
        Route::middleware('feature:enable_shifts')->group(function () {
            Route::get('/shifts/current', [ShiftController::class, 'current']);
            Route::get('/shifts/current/summary', [ShiftController::class, 'summary']);
            Route::post('/shifts/open', [ShiftController::class, 'open']);
            Route::post('/shifts/close', [ShiftController::class, 'close']);
            Route::get('/shifts', [ShiftController::class, 'index'])->middleware('permission:staffs|reports|shifts');
        });

        // Staffs & Roles (Nhân viên) API
        Route::middleware('feature:enable_staffs')->group(function () {
            Route::get('/staffs', [StaffController::class, 'index'])->middleware('permission:staffs');
            Route::post('/staffs', [StaffController::class, 'store'])->middleware(['permission:staffs', 'limit:staffs']);
            Route::put('/staffs/{id}', [StaffController::class, 'update'])->middleware('permission:staffs');
            Route::delete('/staffs/{id}', [StaffController::class, 'destroy'])->middleware('permission:staffs');
            Route::get('/roles', [StaffController::class, 'indexRoles'])->middleware('permission:staffs');
            Route::post('/roles', [StaffController::class, 'storeRole'])->middleware('permission:staffs');
            Route::post('/roles/reset-default', [StaffController::class, 'resetDefaultRoles'])->middleware('permission:staffs');
            Route::put('/roles/{id}', [StaffController::class, 'updateRole'])->middleware('permission:staffs');
            Route::delete('/roles/{id}', [StaffController::class, 'destroyRole'])->middleware('permission:staffs');
        });

        // Owner-only routes
        Route::middleware(RequireOwner::class)->group(function () {
            Route::get('/reports', [ReportController::class, 'index'])->middleware('feature:enable_reports');
            Route::post('/auth/register-cashier', [AuthController::class, 'registerCashier']);
            Route::post('/auth/remove-cashier', [AuthController::class, 'removeCashier']);
            Route::post('/settings', [SettingController::class, 'store']);

            // Thực đơn (Menu)
            Route::middleware('feature:enable_menu')->group(function () {
                Route::post('/products', [ProductController::class, 'store'])->middleware('limit:products');
                Route::put('/products/{id}', [ProductController::class, 'update']);
                Route::delete('/products/{id}', [ProductController::class, 'destroy']);

                Route::post('/categories', [CategoryController::class, 'store']);
                Route::put('/categories/{id}', [CategoryController::class, 'update']);
                Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
            });
        });
    });
});

