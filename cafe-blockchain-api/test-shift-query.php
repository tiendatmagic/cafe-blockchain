<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Entities\Shift;
use Illuminate\Support\Facades\DB;

DB::enableQueryLog();

$start = microtime(true);
$shifts = Shift::all();
$end = microtime(true);
echo "All shifts count: " . count($shifts) . " (took " . (($end - $start) * 1000) . " ms)\n";

$start = microtime(true);
$activeShift = Shift::where('status', 'open')->first();
$end = microtime(true);
echo "Active shift (any user): " . ($activeShift ? $activeShift->id : 'none') . " (took " . (($end - $start) * 1000) . " ms)\n";

$queries = DB::getQueryLog();
print_r($queries);
