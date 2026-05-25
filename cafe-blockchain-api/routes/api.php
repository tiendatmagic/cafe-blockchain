<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
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

// Protected routes (require valid Sanctum token)
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard API (Read-only)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Products API
    Route::get('/products', [ProductController::class, 'index']);
    
    // Categories API
    Route::get('/categories', [CategoryController::class, 'index']);

    // Orders API
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']); // Create order doesn't require owner
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware(RequireOwner::class); // Update status requires owner
    Route::put('/orders/{id}/sync', [OrderController::class, 'syncBlockchain'])->middleware(RequireOwner::class); // Sync blockchain requires owner

    // Settings API
    Route::get('/settings', [SettingController::class, 'index']);

    // Owner-only routes (require both Sanctum token and Owner role)
    Route::middleware(RequireOwner::class)->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/settings', [SettingController::class, 'store']);
    });
});
