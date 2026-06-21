<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Entities\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

$user = User::find(1); // User ID 1 is the owner
if (!$user) {
    die("User 1 not found\n");
}

// Giả lập login
auth()->login($user);

DB::enableQueryLog();

// Tạo request
$request = Request::create('/api/shifts/current', 'GET');
$request->headers->set('Accept', 'application/json');

echo "Dispatching GET /api/shifts/current...\n";
$start = microtime(true);
$response = $app->handle($request);
$end = microtime(true);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Duration: " . (($end - $start) * 1000) . " ms\n";

$queries = DB::getQueryLog();
echo "SQL QUERIES RUN:\n";
print_r($queries);
