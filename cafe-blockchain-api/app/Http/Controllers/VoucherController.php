<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoucherController extends Controller
{
    /**
     * Lấy danh sách voucher
     */
    public function index(Request $request)
    {
        // Trả về mảng trống vì đã chuyển sang lưu voucher on-chain phi tập trung hoàn toàn
        return response()->json([]);
    }

    /**
     * Phục vụ JSON metadata chuẩn ERC-721 cho NFT Voucher (Không dùng database)
     */
    public function metadata($code)
    {
        $parts = explode('-', $code);
        
        $discountAmount = 5000; // Mặc định
        $minOrderAmount = 100000; // Mặc định

        if (count($parts) >= 3 && $parts[0] === 'NFT') {
            $discountAmount = (int)$parts[1];
            $minOrderAmount = (int)$parts[2];
        }

        $discountFormatted = number_format($discountAmount) . 'đ';
        $minOrderFormatted = number_format($minOrderAmount) . 'đ';

        $attributes = [
            [
                'trait_type' => 'Discount Amount (VND)',
                'value' => $discountAmount,
                'display_type' => 'number'
            ],
            [
                'trait_type' => 'Min Order (VND)',
                'value' => $minOrderAmount,
                'display_type' => 'number'
            ],
            [
                'trait_type' => 'Voucher Code',
                'value' => $code
            ],
            [
                'trait_type' => 'Status',
                'value' => 'active'
            ],
            [
                'display_type' => 'date',
                'trait_type' => 'Expiration Date',
                'value' => time() + (30 * 24 * 60 * 60) // Hạn dùng 30 ngày
            ]
        ];

        return response()->json([
            'name' => "Cafe Web3 NFT Voucher " . $discountFormatted,
            'description' => "Mã giảm giá dạng NFT trị giá {$discountFormatted} áp dụng cho các hóa đơn tối thiểu {$minOrderFormatted} tại quán Cafe Web3 POS.",
            'image' => url('/images/nft-voucher.png'),
            'attributes' => $attributes
        ]);
    }

    /**
     * Hàm syncOwnership cũ (không cần đồng bộ do đã phi tập trung, giữ để tránh lỗi API)
     */
    public function syncOwnership(Request $request)
    {
        return response()->json(['success' => true]);
    }

    /**
     * POS đăng ký yêu cầu ký ví của khách hàng di động
     */
    public function requestSign(Request $request)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
            'token_id' => 'required|integer',
        ]);

        DB::table('voucher_signatures')->updateOrInsert(
            ['order_code' => $validated['order_code']],
            [
                'token_id' => $validated['token_id'],
                'signature' => null,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        return response()->json(['success' => true]);
    }

    /**
     * Khách hàng gửi chữ ký số từ điện thoại di động
     */
    public function submitSignature(Request $request)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
            'signature' => 'required|string',
        ]);

        $affected = DB::table('voucher_signatures')
            ->where('order_code', $validated['order_code'])
            ->update([
                'signature' => $validated['signature'],
                'status' => 'signed',
                'updated_at' => now()
            ]);

        if ($affected === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy yêu cầu ký số cho hóa đơn này hoặc chữ ký không hợp lệ!'
            ], 404);
        }

        return response()->json(['success' => true]);
    }

    /**
     * POS kiểm tra trạng thái chữ ký số của hóa đơn (Polling)
     */
    public function checkSignature($orderCode)
    {
        $sigRecord = DB::table('voucher_signatures')
            ->where('order_code', $orderCode)
            ->first();

        if (!$sigRecord) {
            return response()->json([
                'status' => 'not_found',
                'signature' => null
            ]);
        }

        return response()->json([
            'status' => $sigRecord->status,
            'signature' => $sigRecord->signature
        ]);
    }
}

