<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Lấy danh sách voucher
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $query = Voucher::where('store_owner_address', $storeOwner);

        if ($request->has('customer_id') && !empty($request->customer_id)) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        $vouchers = $query->orderBy('id', 'desc')->get();

        return response()->json($vouchers);
    }

    /**
     * Phục vụ JSON metadata chuẩn ERC-721 cho NFT Voucher
     */
    public function metadata($code)
    {
        $voucher = Voucher::where('code', $code)->first();
        if (!$voucher) {
            return response()->json(['error' => 'Voucher metadata not found'], 404);
        }

        $discountFormatted = number_format($voucher->discount_amount) . 'đ';
        $minOrderFormatted = number_format($voucher->min_order_amount) . 'đ';

        return response()->json([
            'name' => "Cafe Web3 NFT Voucher " . $discountFormatted,
            'description' => "Mã giảm giá dạng NFT trị giá {$discountFormatted} áp dụng cho các hóa đơn tối thiểu {$minOrderFormatted} tại quán Cafe Web3 POS.",
            'image' => url('/images/nft-voucher.png'),
            'attributes' => [
                [
                    'trait_type' => 'Discount Amount (VND)',
                    'value' => (int)$voucher->discount_amount,
                    'display_type' => 'number'
                ],
                [
                    'trait_type' => 'Min Order (VND)',
                    'value' => (int)$voucher->min_order_amount,
                    'display_type' => 'number'
                ],
                [
                    'trait_type' => 'Voucher Code',
                    'value' => $voucher->code
                ],
                [
                    'trait_type' => 'Status',
                    'value' => $voucher->status
                ]
            ]
        ]);
    }
}
