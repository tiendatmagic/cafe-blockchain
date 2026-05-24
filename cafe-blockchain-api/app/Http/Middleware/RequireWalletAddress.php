<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireWalletAddress
{
    /**
     * Chặn các request POST, PUT, DELETE nếu không kết nối ví Web3 (thiếu hoặc sai header X-Wallet-Address).
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Chỉ áp dụng cho các request API thay đổi dữ liệu (POST, PUT, DELETE) gửi tới api/*
        if ($request->is('api/*') && in_array(strtoupper($request->method()), ['POST', 'PUT', 'DELETE'])) {
            $walletAddress = $request->header('X-Wallet-Address');

            if (empty($walletAddress)) {
                return response()->json([
                    'success' => false,
                    'message' => '[TRUY CẬP BỊ CHẶN] Bạn phải kết nối ví Web3 để thực hiện tác vụ này!'
                ], 403);
            }

            // Kiểm tra định dạng ví EVM (0x + 40 ký tự hex = 42 ký tự)
            if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $walletAddress)) {
                return response()->json([
                    'success' => false,
                    'message' => '[LỖI VÍ WEB3] Địa chỉ ví Web3 không hợp lệ!'
                ], 400);
            }
        }

        return $next($request);
    }
}
