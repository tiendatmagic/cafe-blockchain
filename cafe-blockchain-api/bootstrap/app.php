<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Loại bỏ CORS middleware mặc định của Laravel để tránh xung đột ghi đè headers
        $middleware->remove([
            \Illuminate\Http\Middleware\HandleCors::class,
            \Fruitcake\Cors\HandleCors::class
        ]);

        // Thêm custom CORS middleware toàn cục
        $middleware->append(\App\Http\Middleware\Cors::class);
        $middleware->append(\App\Http\Middleware\AuthenticateWithCookie::class);
        // $middleware->append(\App\Http\Middleware\RequireWalletAddress::class);

        // Đăng ký middleware alias để kiểm tra quyền truy cập module
        $middleware->alias([
            'permission' => \App\Http\Middleware\CheckPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'Tài nguyên yêu cầu không tồn tại!'
                ], 404);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'Đường dẫn API hoặc tài nguyên không tồn tại!'
                ], 404);
            }
        });
    })->create();
