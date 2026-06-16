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
use App\Http\Middleware\RequireOwner;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes for Authentication
Route::get('/auth/nonce', [AuthController::class, 'getNonce']);
Route::post('/auth/verify', [AuthController::class, 'verifySignature']);
Route::get('/vouchers/metadata/{code}', [\App\Http\Controllers\VoucherController::class, 'metadata']);
Route::post('/vouchers/submit-signature', [\App\Http\Controllers\VoucherController::class, 'submitSignature']);
Route::get('/settings/public', [SettingController::class, 'getPublicSettings']);
Route::get('/store/{slug}', [SettingController::class, 'getStoreDetailsBySlug']);
Route::post('/store/{slug}/orders', [SettingController::class, 'createStoreOrderBySlug']);

// Protected routes (require valid Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Dashboard API (Read-only, check permission:dashboard)
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('permission:dashboard');

    // Vouchers API
    Route::get('/vouchers', [\App\Http\Controllers\VoucherController::class, 'index']);
    Route::post('/vouchers/sync-ownership', [\App\Http\Controllers\VoucherController::class, 'syncOwnership']);
    Route::post('/vouchers/request-sign', [\App\Http\Controllers\VoucherController::class, 'requestSign']);
    Route::post('/vouchers/cancel-sign', [\App\Http\Controllers\VoucherController::class, 'cancelSign']);
    Route::get('/vouchers/check-signature/{orderCode}', [\App\Http\Controllers\VoucherController::class, 'checkSignature']);

    // Products API
    Route::get('/products', [ProductController::class, 'index'])->middleware('permission:pos|menu|inventory');
    
    // Categories API
    Route::get('/categories', [CategoryController::class, 'index'])->middleware('permission:pos|menu|inventory');

    // Orders API
    Route::get('/orders', [OrderController::class, 'index'])->middleware('permission:pos|orders');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('permission:pos|orders');
    Route::post('/orders', [OrderController::class, 'store'])->middleware('permission:pos'); // Tạo đơn ở POS
    Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('permission:pos|orders');
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware(RequireOwner::class);
    Route::put('/orders/{id}/sync', [OrderController::class, 'syncBlockchain'])->middleware(RequireOwner::class);
    Route::post('/orders/{id}/mint-voucher-manual', [OrderController::class, 'mintVoucherManual'])->middleware(RequireOwner::class);

    // API Versioning V1 & V2 cho Orders
    Route::prefix('v1')->group(function () {
        Route::get('/orders', [OrderController::class, 'index'])->middleware('permission:pos|orders');
        Route::get('/orders/{id}', [OrderController::class, 'show'])->middleware('permission:pos|orders');
        Route::post('/orders', [OrderController::class, 'store'])->middleware('permission:pos');
        Route::put('/orders/{id}', [OrderController::class, 'update'])->middleware('permission:pos|orders');
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware(RequireOwner::class);
        Route::put('/orders/{id}/sync', [OrderController::class, 'syncBlockchain'])->middleware(RequireOwner::class);
        Route::post('/orders/{id}/mint-voucher-manual', [OrderController::class, 'mintVoucherManual'])->middleware(RequireOwner::class);
    });

    Route::prefix('v2')->group(function () {
        // Cấu trúc API V2 sẵn sàng để mở rộng trong tương lai
        Route::get('/orders', function() {
            return response()->json(['message' => 'API Orders V2 is ready for development.']);
        });
    });

    // Settings API
    Route::get('/settings', [SettingController::class, 'index'])->middleware('permission:settings');

    // Menu Sync Logs API
    Route::get('/menu-sync-logs', [MenuSyncController::class, 'index'])->middleware('permission:settings|menu');
    Route::post('/menu-sync-logs', [MenuSyncController::class, 'store'])->middleware('permission:settings|menu');

    // Customers API
    Route::get('/customers', [CustomerController::class, 'index'])->middleware('permission:pos|customers|reports');
    Route::post('/customers', [CustomerController::class, 'store'])->middleware('permission:pos|customers');
    Route::put('/customers/{id}', [CustomerController::class, 'update'])->middleware('permission:pos|customers');
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->middleware('permission:customers');

    // Debts (Sổ nợ) API
    Route::get('/debts', [\App\Http\Controllers\DebtController::class, 'index'])->middleware('permission:debts');
    Route::get('/debts/customer/{id}', [\App\Http\Controllers\DebtController::class, 'show'])->middleware('permission:debts');
    Route::post('/debts', [\App\Http\Controllers\DebtController::class, 'store'])->middleware('permission:debts');
    Route::post('/debts/payment', [\App\Http\Controllers\DebtController::class, 'storePayment'])->middleware('permission:debts');
    Route::delete('/debts/{id}', [\App\Http\Controllers\DebtController::class, 'destroy'])->middleware('permission:debts');

    // Customer Groups API
    Route::get('/customer-groups', [CustomerGroupController::class, 'index'])->middleware('permission:customers');
    Route::post('/customer-groups', [CustomerGroupController::class, 'store'])->middleware('permission:customers');
    Route::put('/customer-groups/{id}', [CustomerGroupController::class, 'update'])->middleware('permission:customers');
    Route::delete('/customer-groups/{id}', [CustomerGroupController::class, 'destroy'])->middleware('permission:customers');

    // Transactions (Thu Chi) API
    Route::get('/transactions', [TransactionController::class, 'index'])->middleware('permission:financials');
    Route::post('/transactions', [TransactionController::class, 'store'])->middleware('permission:financials');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->middleware('permission:financials');
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])->middleware('permission:financials');
    Route::put('/transactions/{id}/sync', [TransactionController::class, 'syncBlockchain'])->middleware(RequireOwner::class);

    // Inventory (Kho hàng) API
    Route::get('/inventory', [InventoryController::class, 'index'])->middleware('permission:inventory');
    Route::post('/inventory', [InventoryController::class, 'store'])->middleware('permission:inventory');
    Route::delete('/inventory/{id}', [InventoryController::class, 'destroy'])->middleware('permission:inventory');

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

    // Shifts API (Ca làm việc & Két tiền)
    Route::get('/shifts/current', [ShiftController::class, 'current']);
    Route::get('/shifts/current/summary', [ShiftController::class, 'summary']);
    Route::post('/shifts/open', [ShiftController::class, 'open']);
    Route::post('/shifts/close', [ShiftController::class, 'close']);
    Route::get('/shifts', [ShiftController::class, 'index'])->middleware('permission:staffs|reports');

    // Staffs & Roles API (Chỉ truy cập khi có quyền staffs)
    Route::get('/staffs', [StaffController::class, 'index'])->middleware('permission:staffs');
    Route::post('/staffs', [StaffController::class, 'store'])->middleware('permission:staffs');
    Route::put('/staffs/{id}', [StaffController::class, 'update'])->middleware('permission:staffs');
    Route::delete('/staffs/{id}', [StaffController::class, 'destroy'])->middleware('permission:staffs');
    Route::get('/roles', [StaffController::class, 'indexRoles'])->middleware('permission:staffs');
    Route::post('/roles', [StaffController::class, 'storeRole'])->middleware('permission:staffs');
    Route::post('/roles/reset-default', [StaffController::class, 'resetDefaultRoles'])->middleware('permission:staffs');
    Route::put('/roles/{id}', [StaffController::class, 'updateRole'])->middleware('permission:staffs');
    Route::delete('/roles/{id}', [StaffController::class, 'destroyRole'])->middleware('permission:staffs');

    // Owner-only routes (require both Sanctum token and Owner role)
    Route::middleware(RequireOwner::class)->group(function () {
        Route::get('/reports', [ReportController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/settings', [SettingController::class, 'store']);
        Route::post('/auth/register-cashier', [AuthController::class, 'registerCashier']);
        Route::post('/auth/remove-cashier', [AuthController::class, 'removeCashier']);
    });
});
