<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Lấy ra một token hợp lệ gần nhất
$tokenRecord = DB::table('personal_access_tokens')->orderBy('id', 'desc')->first();

if (!$tokenRecord) {
    die("No tokens found in personal_access_tokens table!\n");
}

echo "Found token ID: {$tokenRecord->id} for tokenable_id: {$tokenRecord->tokenable_id}\n";

// Vì token trong DB đã được hash (sha256), chúng ta không thể lấy lại plain text token
// trừ khi chúng ta tạo mới một token để test!
// Hãy tạo một token mới cho User ID 1
$user = \App\Domain\Entities\User::find(1);
$tokenResult = $user->createToken('test-token');
$plainToken = $tokenResult->plainTextToken;

echo "Created test token: $plainToken\n";

DB::enableQueryLog();

// Tạo request giả lập gửi Bearer token
$request = Request::create('/api/shifts/current', 'GET');
$request->headers->set('Accept', 'application/json');
$request->headers->set('Authorization', 'Bearer ' . $plainToken);

echo "Dispatching GET /api/shifts/current with Bearer token...\n";
$start = microtime(true);
$response = $app->handle($request);
$end = microtime(true);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
echo "Duration: " . (($end - $start) * 1000) . " ms\n";

$queries = DB::getQueryLog();
echo "SQL QUERIES RUN:\n";
print_r($queries);

// Dọn dẹp token test
$tokenResult->accessToken->delete();
