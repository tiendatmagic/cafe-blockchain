<?php

namespace App\Application\Vouchers\Commands;

use Illuminate\Support\Facades\DB;

class RequestSignCommand
{
    public function execute(string $storeOwner, array $data): bool
    {
        // Dọn dẹp các yêu cầu ký số đã quá 1 giờ
        DB::table('voucher_signatures')->where('created_at', '<', now()->subHour())->delete();

        DB::table('voucher_signatures')->updateOrInsert(
            ['order_code' => $data['order_code']],
            [
                'token_id' => $data['token_id'],
                'store_owner_address' => $storeOwner,
                'temp_order_data' => isset($data['temp_order_data']) ? json_encode($data['temp_order_data'], JSON_UNESCAPED_UNICODE) : null,
                'signature' => null,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        return true;
    }
}
