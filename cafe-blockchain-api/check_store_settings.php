<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$storeOwner = '0x75ad18ef47eda21baff837cac0f1563d0c355555';
$settings = App\Models\Setting::where('store_owner_address', $storeOwner)->get();

echo "=== CẤU HÌNH CỦA STORE {$storeOwner} ===\n";
foreach ($settings as $s) {
    echo "- {$s->key}: " . ($s->key === 'relayer_private_key' ? '[PROTECTED]' : $s->value) . "\n";
}
