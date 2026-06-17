<?php

namespace App\Http\Controllers;

use App\Application\Common\Interfaces\BlockchainRelayerServiceInterface;
use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Domain\Entities\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClaimController extends Controller
{
    protected BlockchainRelayerServiceInterface $relayer;

    public function __construct(BlockchainRelayerServiceInterface $relayer)
    {
        $this->relayer = $relayer;
    }

    /**
     * Xử lý yêu cầu tích điểm (claim points) từ hóa đơn POS
     */
    public function claimPoints(Request $request)
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50',
            'phone_last_5' => 'required|string|regex:/^[0-9]{5}$/',
            'wallet_address' => 'required|string|regex:/^0x[a-fA-F0-9]{40}$/i',
        ]);

        $orderCode = $validated['order_code'];
        $phoneLast5 = $validated['phone_last_5'];
        $walletAddress = strtolower($validated['wallet_address']);

        // 1. Tìm hóa đơn trong database
        $order = OrderModel::where('order_code', $orderCode)->first();
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy hóa đơn này trên hệ thống!'
            ], 404);
        }

        // 2. Kiểm tra trạng thái đơn hàng (phải là completed)
        if ($order->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể claim điểm cho hóa đơn đã hoàn thành thành công!'
            ], 400);
        }

        // 3. Kiểm tra xem hóa đơn đã được claim điểm chưa
        if ($order->is_points_claimed) {
            return response()->json([
                'success' => false,
                'message' => 'Hóa đơn này đã được tích điểm trước đó!'
            ], 400);
        }

        // 4. Chống Brute-force nhập sai số điện thoại
        $lockHours = 24;
        if ($order->claim_attempts >= 5) {
            $lastAttempt = $order->last_claim_attempt_at ? \Carbon\Carbon::parse($order->last_claim_attempt_at) : null;
            if ($lastAttempt && $lastAttempt->diffInHours(now()) < $lockHours) {
                $timeLeft = $lockHours - $lastAttempt->diffInHours(now());
                $timeLeftStr = $timeLeft > 0 ? ceil($timeLeft) . ' giờ' : 'vài phút';
                return response()->json([
                    'success' => false,
                    'message' => "Hóa đơn này đã bị khóa tính năng tích điểm do nhập sai số điện thoại quá nhiều lần. Vui lòng thử lại sau {$timeLeftStr} hoặc liên hệ cửa hàng."
                ], 429);
            }
        }

        // 5. Kiểm tra thông tin Khách hàng liên kết với đơn
        $customer = $order->customer;
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Hóa đơn này không được liên kết với bất kỳ thông tin khách hàng nào trên POS!'
            ], 400);
        }

        $customerPhone = $customer->phone;
        if (empty($customerPhone)) {
            return response()->json([
                'success' => false,
                'message' => 'Thông tin khách hàng của hóa đơn này không chứa số điện thoại để xác minh!'
            ], 400);
        }

        // 6. So khớp 5 số cuối số điện thoại (Chuẩn hóa số điện thoại trước)
        $normalizedPhone = preg_replace('/[^0-9]/', '', $customerPhone);
        $dbPhoneLast5 = substr($normalizedPhone, -5);

        if ($dbPhoneLast5 !== $phoneLast5) {
            // Tăng số lần thử nhập sai và lưu lại
            $order->claim_attempts += 1;
            $order->last_claim_attempt_at = now();
            $order->save();

            $attemptsLeft = 5 - $order->claim_attempts;
            $attemptsLeftMessage = $attemptsLeft > 0 
                ? "Bạn còn {$attemptsLeft} lần thử lại trước khi hóa đơn bị khóa." 
                : "Hóa đơn của bạn đã bị khóa tính năng tích điểm.";

            return response()->json([
                'success' => false,
                'message' => "Số điện thoại xác nhận không chính xác! {$attemptsLeftMessage}"
            ], 400);
        }

        // 7. Ghi nhận/Liên kết ví của khách hàng
        // Nếu ví khách hàng gửi lên khác với ví đã lưu của Customer, ta cập nhật ví mới
        if (empty($customer->wallet_address)) {
            $customer->wallet_address = $walletAddress;
            $customer->save();
        } else if ($customer->wallet_address !== $walletAddress) {
            // Nếu khách hàng đã có địa chỉ ví khác trong hệ thống, đảm bảo không có sự mâu thuẫn ví
            return response()->json([
                'success' => false,
                'message' => 'Khách hàng này đã được liên kết với một địa chỉ ví khác trên hệ thống!'
            ], 400);
        }

        // 8. Tính số lượng token nhận được (1000đ = 1 token $CAFE)
        $tokensAmount = floor($order->total_amount / 1000);
        if ($tokensAmount <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Giá trị hóa đơn quá nhỏ để được tích điểm (Tổng bill phải từ 1,000đ trở lên)!'
            ], 400);
        }

        // 9. Gọi blockchain gửi token $CAFE (Ví admin trả gas)
        try {
            $result = $this->relayer->sendLoyaltyTokens(
                $order->store_owner_address,
                $walletAddress,
                $tokensAmount
            );

            if (!$result['success']) {
                Log::error('Lỗi gửi token tích điểm $CAFE:', ['error' => $result['error'] ?? 'Lỗi không xác định']);
                return response()->json([
                    'success' => false,
                    'message' => 'Gặp lỗi trong quá trình gửi token tích điểm on-chain: ' . ($result['error'] ?? 'Lỗi kết nối RPC.')
                ], 500);
            }

            // 10. Đánh dấu hóa đơn đã claim điểm thành công
            $order->is_points_claimed = true;
            $order->claim_attempts = 0; // Reset số lần thử
            $order->save();

            return response()->json([
                'success' => true,
                'message' => "Tích điểm thành công! Bạn nhận được {$tokensAmount} token \$CAFE.",
                'txHash' => $result['txHash'],
                'amount' => $tokensAmount
            ]);

        } catch (\Exception $e) {
            Log::error('Lỗi Exception khi claim points:', ['exception' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống khi gửi transaction on-chain: ' . $e->getMessage()
            ], 500);
        }
    }
}
