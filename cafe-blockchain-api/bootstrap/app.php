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
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
