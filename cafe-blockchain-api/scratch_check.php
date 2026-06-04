<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$order = App\Models\Order::where('order_code', 'HD-A31374')->first();
if ($order) {
    echo "=== ĐƠN HÀNG HD-A31374 ===\n";
    echo "ID: " . $order->id . "\n";
    echo "Order Code: " . $order->order_code . "\n";
    echo "Total Amount: " . $order->total_amount . "\n";
    echo "Discount Amount: " . $order->discount_amount . "\n";
    echo "Voucher ID: " . ($order->voucher_id ?? 'NULL') . "\n";
    echo "Customer ID: " . ($order->customer_id ?? 'NULL') . "\n";
    echo "Status: " . $order->status . "\n";
    
    if ($order->voucher_id) {
        $voucher = App\Models\Voucher::find($order->voucher_id);
        if ($voucher) {
            echo "\n=== VOUCHER ===\n";
            echo "Code: " . $voucher->code . "\n";
            echo "Discount: " . $voucher->discount_amount . "\n";
            echo "Min Order: " . $voucher->min_order_amount . "\n";
            echo "Status: " . $voucher->status . "\n";
        }
    }
} else {
    echo "Không tìm thấy đơn hàng HD-A31374!\n";
}
