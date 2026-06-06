<?php

namespace App\Application\Vouchers\Commands;

use Illuminate\Support\Facades\DB;

class CancelSignCommand
{
    public function execute(string $orderCode): bool
    {
        DB::table('voucher_signatures')->where('order_code', $orderCode)->delete();
        return true;
    }
}
