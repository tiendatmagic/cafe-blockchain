<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$order = App\Models\Order::where('order_code', 'HD-117517')->first();
if ($order) {
    echo "=== ĐƠN HÀNG HD-117517 ===\n";
    echo "ID: " . $order->id . "\n";
    echo "Order Code: " . $order->order_code . "\n";
    echo "Customer ID: " . ($order->customer_id ?? 'NULL') . "\n";
    echo "Total Amount: " . $order->total_amount . "\n";
    echo "Blockchain Status: " . $order->blockchain_status . "\n";
    echo "Blockchain Tx: " . ($order->blockchain_tx ?? $order->tx_hash ?? 'NULL') . "\n";
    echo "Voucher NFT Token ID (in order): " . ($order->voucher_nft_token_id ?? 'NULL') . "\n";

    if ($order->customer_id) {
        $customer = App\Models\Customer::find($order->customer_id);
        echo "\n=== KHÁCH HÀNG ===\n";
        echo "Tên: " . $customer->name . "\n";
        echo "Ví: " . $customer->wallet_address . "\n";
        
        // Truy vấn tất cả voucher được tặng cho khách hàng này
        $vouchers = App\Models\Voucher::where('customer_id', $order->customer_id)->get();
        echo "\n=== DANH SÁCH VOUCHER CỦA KHÁCH HÀNG TRONG DB ===\n";
        if ($vouchers->count() > 0) {
            foreach ($vouchers as $v) {
                echo "- Code: " . $v->code . " | Discount: " . $v->discount_amount . " | Status: " . $v->status . " | Token ID: " . ($v->token_id ?? 'NULL') . " | TxHash: " . ($v->mint_tx_hash ?? 'NULL') . "\n";
            }
        } else {
            echo "Không có voucher nào trong DB cho khách hàng này.\n";
        }
    }
} else {
    echo "Không tìm thấy đơn hàng HD-117517!\n";
}
