<?php

namespace App\Application\Vouchers\Queries;

use Illuminate\Support\Facades\DB;

class CheckSignatureQuery
{
    public function execute(string $orderCode): array
    {
        $sigRecord = DB::table('voucher_signatures')
            ->where('order_code', $orderCode)
            ->first();

        if (!$sigRecord) {
            return [
                'status' => 'not_found',
                'signature' => null
            ];
        }

        return [
            'status' => $sigRecord->status,
            'signature' => $sigRecord->signature
        ];
    }
}
