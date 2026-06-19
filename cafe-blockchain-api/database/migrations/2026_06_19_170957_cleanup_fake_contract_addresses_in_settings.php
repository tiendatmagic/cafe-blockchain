<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Xóa các địa chỉ contract hardcode giả khỏi bảng settings.
     *
     * Những địa chỉ này được tự động chèn bởi ensureDefaultSettings() cũ,
     * gây hiển thị cảnh báo "Sai mạng kết nối" khi cửa hàng chưa deploy contract.
     *
     * Chỉ reset về rỗng nếu giá trị khớp đúng địa chỉ hardcode mặc định cũ.
     * Các địa chỉ đã được chủ quán chủ động cấu hình thì KHÔNG đụng vào.
     */
    public function up(): void
    {
        $fakeAddresses = [
            'contract_address'          => '0xC6b3fc5a2E5Aba0e5a0B6eD8FaCD412A76dC5D2A',
            'finance_contract_address'  => '0x7988500670EC631F7be36eD91E367760f380d6Af',
            'voucher_contract_address'  => '0xc6828e46E100B248173e28a33e8D92662Cd1A8c7',
        ];

        foreach ($fakeAddresses as $key => $fakeValue) {
            DB::table('settings')
                ->where('key', $key)
                ->where('value', $fakeValue)
                ->update(['value' => '']);
        }
    }

    public function down(): void
    {
        // Không rollback: không nên điền lại địa chỉ fake vào DB
    }
};
