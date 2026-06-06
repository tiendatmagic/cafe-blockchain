<?php

namespace App\Http\Controllers;

use App\Application\Vouchers\Commands\RequestSignCommand;
use App\Application\Vouchers\Commands\CancelSignCommand;
use App\Application\Vouchers\Commands\SubmitSignatureCommand;
use App\Application\Vouchers\Queries\GetVoucherMetadataQuery;
use App\Application\Vouchers\Queries\CheckSignatureQuery;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Lấy danh sách voucher
     */
    public function index(Request $request)
    {
        return response()->json([]);
    }

    /**
     * Phục vụ JSON metadata chuẩn ERC-721 cho NFT Voucher
     */
    public function metadata($code, GetVoucherMetadataQuery $query)
    {
        $metadata = $query->execute($code);
        return response()->json($metadata);
    }

    /**
     * Hàm syncOwnership cũ
     */
    public function syncOwnership(Request $request)
    {
        return response()->json(['success' => true]);
    }

    /**
     * POS đăng ký yêu cầu ký ví của khách hàng di động
     */
    public function requestSign(Request $request, RequestSignCommand $command)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
            'token_id' => 'required|integer',
            'temp_order_data' => 'nullable|array',
        ]);

        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        $command->execute($storeOwner, $validated);

        return response()->json(['success' => true]);
    }

    /**
     * POS hủy bỏ yêu cầu ký ví
     */
    public function cancelSign(Request $request, CancelSignCommand $command)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
        ]);

        $command->execute($validated['order_code']);

        return response()->json(['success' => true]);
    }

    /**
     * Khách hàng gửi chữ ký số từ điện thoại di động
     */
    public function submitSignature(Request $request, SubmitSignatureCommand $command)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
            'signature' => 'required|string',
        ]);

        try {
            $command->execute($validated['order_code'], $validated['signature']);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            $code = $e->getCode() ?: 500;
            // Tránh code lỗi không hợp lệ cho HTTP response (như 404, 400 được chấp nhận, nhưng các mã lỗi exception tự phát sinh có thể là 0 hoặc chuỗi)
            if (!in_array($code, [400, 404, 403, 500])) {
                $code = 500;
            }
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $code);
        }
    }

    /**
     * POS kiểm tra trạng thái chữ ký số của hóa đơn (Polling)
     */
    public function checkSignature($orderCode, CheckSignatureQuery $query)
    {
        $result = $query->execute($orderCode);
        return response()->json($result);
    }
}
