<?php

namespace App\Application\Vouchers\Queries;

use Illuminate\Support\Facades\DB;

class GetVoucherMetadataQuery
{
    public function execute(string $code): array
    {
        $parts = explode('-', $code);
        
        $discountAmount = 5000;
        $minOrderAmount = 100000;

        if (count($parts) >= 3 && $parts[0] === 'NFT') {
            $discountAmount = (int)$parts[1];
            $minOrderAmount = (int)$parts[2];
        }

        $discountFormatted = number_format($discountAmount) . ' VND';
        $minOrderFormatted = number_format($minOrderAmount) . ' VND';

        $expirationTime = time() + (30 * 24 * 60 * 60);
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

        return [
            'name' => "Cafe Web3 NFT Voucher " . $discountFormatted,
            'description' => "NFT Discount Voucher worth {$discountFormatted} applicable for minimum invoices of {$minOrderFormatted} at Cafe Web3 POS.",
            'image' => url('/images/nft-voucher.png'),
            'attributes' => $attributes
        ];
    }
}
