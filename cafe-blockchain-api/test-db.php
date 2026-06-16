<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "SHIFTS:\n";
print_r(\App\Domain\Entities\Shift::all()->toArray());

echo "\nORDERS:\n";
print_r(\App\Infrastructure\Persistence\Eloquent\OrderModel::select('id', 'order_code', 'shift_id', 'status', 'payment_method', 'total_amount')->get()->toArray());
