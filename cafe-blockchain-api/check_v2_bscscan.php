<?php
$url = "https://api-testnet.bscscan.com/v2/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x4Bb6233AE796e910dC94d636F427Ea5f50660884";
echo "BscScan Testnet V2: " . file_get_contents($url) . "\n";
