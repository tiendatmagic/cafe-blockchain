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


// Protected routes (require valid Sanctum token)
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard API (Read-only)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Vouchers API
    Route::get('/vouchers', [\App\Http\Controllers\VoucherController::class, 'index']);
    Route::post('/vouchers/sync-ownership', [\App\Http\Controllers\VoucherController::class, 'syncOwnership']);
    Route::post('/vouchers/request-sign', [\App\Http\Controllers\VoucherController::class, 'requestSign']);
    Route::get('/vouchers/check-signature/{orderCode}', [\App\Http\Controllers\VoucherController::class, 'checkSignature']);

    // Products API
    Route::get('/products', [ProductController::class, 'index']);
    
    // Categories API
    Route::get('/categories', [CategoryController::class, 'index']);

    // Orders API
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']); // Create order doesn't require owner
    Route::put('/orders/{id}', [OrderController::class, 'update']); // Edit order doesn't require owner
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware(RequireOwner::class); // Update status requires owner
    Route::put('/orders/{id}/sync', [OrderController::class, 'syncBlockchain'])->middleware(RequireOwner::class); // Sync blockchain requires owner
    Route::post('/orders/{id}/mint-voucher-manual', [OrderController::class, 'mintVoucherManual'])->middleware(RequireOwner::class); // Mint voucher manual requires owner

    // Settings API
    Route::get('/settings', [SettingController::class, 'index']);

    // Customers API
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

    // Customer Groups API
    Route::get('/customer-groups', [CustomerGroupController::class, 'index']);
    Route::post('/customer-groups', [CustomerGroupController::class, 'store']);
    Route::put('/customer-groups/{id}', [CustomerGroupController::class, 'update']);
    Route::delete('/customer-groups/{id}', [CustomerGroupController::class, 'destroy']);

    // Transactions (Thu Chi) API
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
    Route::put('/transactions/{id}/sync', [TransactionController::class, 'syncBlockchain'])->middleware(RequireOwner::class);

    // Inventory (Kho hàng) API
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);

    // Areas (Khu vực) API
    Route::get('/areas', [AreaController::class, 'index']);
    Route::post('/areas', [AreaController::class, 'store']);
    Route::put('/areas/{id}', [AreaController::class, 'update']);
    Route::delete('/areas/{id}', [AreaController::class, 'destroy']);

    // Dining Tables (Bàn ăn) API
    Route::get('/dining-tables', [DiningTableController::class, 'index']);
    Route::post('/dining-tables', [DiningTableController::class, 'store']);
    Route::put('/dining-tables/{id}', [DiningTableController::class, 'update']);
    Route::put('/dining-tables/{id}/status', [DiningTableController::class, 'updateStatus']);
    Route::delete('/dining-tables/{id}', [DiningTableController::class, 'destroy']);

    // Owner-only routes (require both Sanctum token and Owner role)
    Route::middleware(RequireOwner::class)->group(function () {
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
