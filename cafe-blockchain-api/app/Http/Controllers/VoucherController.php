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

        $expirationTime = time() + (30 * 24 * 60 * 60); // Mặc định hạn dùng 30 ngày
        if (count($parts) >= 4) {
            $orderCodeParts = array_slice($parts, 3);
            $orderCode = implode('-', $orderCodeParts);
            $order = DB::table('orders')->where('order_code', $orderCode)->first();
            if ($order) {
                $expirationTime = strtotime($order->created_at) + (30 * 24 * 60 * 60);
            }
        }

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
                'value' => $expirationTime
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
            'temp_order_data' => 'nullable|array',
        ]);

        $storeOwner = strtolower($request->user()->store_owner_address ?: $request->user()->wallet_address);

        // Dọn dẹp các yêu cầu ký số đã quá 1 giờ (tránh rác database)
        DB::table('voucher_signatures')->where('created_at', '<', now()->subHour())->delete();

        DB::table('voucher_signatures')->updateOrInsert(
            ['order_code' => $validated['order_code']],
            [
                'token_id' => $validated['token_id'],
                'store_owner_address' => $storeOwner,
                'temp_order_data' => isset($validated['temp_order_data']) ? json_encode($validated['temp_order_data'], JSON_UNESCAPED_UNICODE) : null,
                'signature' => null,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        return response()->json(['success' => true]);
    }

    /**
     * POS hủy bỏ yêu cầu ký ví (khi thu ngân đóng modal QR)
     */
    public function cancelSign(Request $request)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
        ]);

        DB::table('voucher_signatures')->where('order_code', $validated['order_code'])->delete();

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

        $sigRecord = DB::table('voucher_signatures')
            ->where('order_code', $validated['order_code'])
            ->first();

        if (!$sigRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy yêu cầu ký số cho hóa đơn này hoặc chữ ký không hợp lệ!'
            ], 404);
        }

        if ($sigRecord->status === 'signed') {
            return response()->json([
                'success' => false,
                'message' => 'Hóa đơn này đã được ký số và chốt đơn trước đó!'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $storeOwner = strtolower($sigRecord->store_owner_address);
            $voucherNftTokenId = (int)$sigRecord->token_id;
            $orderCode = $sigRecord->order_code;
            $voucherNftSignature = $validated['signature'];

            // 1. Thực hiện quy đổi (burn) NFT Voucher trên Blockchain thông qua Relayer
            $relayerResult = \App\Services\BlockchainRelayerService::useVoucher(
                $storeOwner,
                $voucherNftTokenId,
                $orderCode,
                $voucherNftSignature
            );

            if (!$relayerResult['success']) {
                throw new \Exception("Không thể quy đổi NFT Voucher trên Blockchain: " . ($relayerResult['error'] ?? 'Lỗi không xác định'));
            }

            // 2. Tự động tạo đơn hàng chính thức từ temp_order_data
            $tempOrderData = !empty($sigRecord->temp_order_data) ? json_decode($sigRecord->temp_order_data, true) : null;
            if (empty($tempOrderData) || empty($tempOrderData['items'])) {
                throw new \Exception("Dữ liệu giỏ hàng tạm thời không hợp lệ hoặc đã bị xóa!");
            }

            $discountAmount = (int)($tempOrderData['discount_amount'] ?? 0);
            $finalTotalAmount = (float)($tempOrderData['final_amount'] ?? 0);

            // Tạo đơn hàng
            $order = \App\Models\Order::create([
                'order_code' => $orderCode,
                'table_number' => $tempOrderData['table_number'] ?? null,
                'customer_id' => $tempOrderData['customer_id'] ?? null,
                'total_amount' => $finalTotalAmount,
                'discount_amount' => $discountAmount,
                'voucher_nft_token_id' => $voucherNftTokenId,
                'payment_method' => $tempOrderData['payment_method'] ?? 'cash',
                'status' => 'pending', // Mặc định là đang chờ xác nhận
                'tx_hash' => $relayerResult['txHash'] ?? null,
                'blockchain_status' => 'none',
                'store_owner_address' => $storeOwner,
            ]);

            // Tạo các chi tiết món ăn
            foreach ($tempOrderData['items'] as $item) {
                \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'note' => $item['note'] ?? null,
                ]);
            }

            // 3. Cập nhật chữ ký số và chuyển trạng thái yêu cầu sang signed
            DB::table('voucher_signatures')
                ->where('order_code', $orderCode)
                ->update([
                    'signature' => $voucherNftSignature,
                    'status' => 'signed',
                    'updated_at' => now()
                ]);

            DB::commit();

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi chốt đơn hàng tự động: ' . $e->getMessage()
            ], 500);
        }
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

