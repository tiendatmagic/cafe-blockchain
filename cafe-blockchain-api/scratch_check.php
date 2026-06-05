<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$storeOwner = '0x75ad18ef47eda21baff837cac0f1563d0c355555';
$encryptedKey = App\Models\Setting::getForStore('relayer_private_key', $storeOwner);
if ($encryptedKey) {
    try {
        $privateKey = \Illuminate\Support\Facades\Crypt::decryptString($encryptedKey);
        echo "Decrypted Relayer Private Key: " . $privateKey . "\n";
    } catch (\Exception $e) {
        echo "Error decrypting key: " . $e->getMessage() . "\n";
    }
} else {
    echo "No relayer key configured!\n";
}
