<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$order = App\Models\Order::where('order_code', 'HD-7FEB66')->first();
if ($order) {
    echo "=== ITEMS CỦA ĐƠN HD-7FEB66 ===\n";
    $items = $order->items()->with(['product', 'variant'])->get();
    foreach ($items as $item) {
        echo "Item ID: {$item->id}\n";
        echo "Product ID: " . ($item->product_id ?? 'NULL') . "\n";
        echo "Product: " . ($item->product ? $item->product->name : 'NULL') . "\n";
        echo "Variant ID: " . ($item->product_variant_id ?? 'NULL') . "\n";
        echo "Variant: " . ($item->variant ? $item->variant->variant_name : 'NULL') . "\n";
        echo "Quantity: {$item->quantity}\n";
        echo "Price: {$item->price}\n";
        echo "---------------------------\n";
    }
} else {
    echo "Không tìm thấy đơn hàng HD-7FEB66!\n";
}
