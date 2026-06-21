<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Entities\Shift;
use App\Domain\Entities\User;

$users = User::all();
echo "Users count: " . count($users) . "\n";
foreach ($users as $user) {
    $start = microtime(true);
    $shift = Shift::where('user_id', $user->id)->where('status', 'open')->first();
    $end = microtime(true);
    echo "User ID {$user->id} ({$user->wallet_address}): " . ($shift ? "Shift ID " . $shift->id : "no active shift") . " (took " . (($end - $start) * 1000) . " ms)\n";
}
