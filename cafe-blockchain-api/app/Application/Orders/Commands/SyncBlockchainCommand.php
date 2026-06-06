<?php

namespace App\Application\Orders\Commands;

use App\Domain\Entities\Order;
use App\Domain\Entities\Setting;
use Illuminate\Support\Facades\Http;

class SyncBlockchainCommand
{
    public function execute(string $storeOwner, int|string $id, array $data): Order
    {
        $order = Order::where('store_owner_address', $storeOwner)->findOrFail($id);

        if ($order->status === 'completed') {
            $expectedHash = $order->generateVerificationHash();
            if (empty($order->verification_hash) || $order->verification_hash !== $expectedHash) {
                throw new \Exception("Dữ liệu tài chính của đơn hàng đã bị can thiệp và sửa đổi trái phép! Từ chối đối soát và ghi chuỗi.");
            }
        }

        $txHash = $data['tx_hash'];
        
        if (Order::where('tx_hash', $txHash)->where('id', '!=', $id)->exists()) {
            throw new \Exception("Transaction hash has already been used.");
        }

        if ($data['blockchain_status'] === 'success') {
            $contractAddress = Setting::getForStore('contract_address', $storeOwner);
            $rpcUrl = Setting::getForStore('rpc_url', $storeOwner, 'https://ethereum-sepolia.publicnode.com');
            
            if (!empty($contractAddress)) {
                $payload = [
                    'jsonrpc' => '2.0',
                    'method' => 'eth_getTransactionReceipt',
                    'params' => [$txHash],
                    'id' => 1
                ];

                $response = Http::post($rpcUrl, $payload);
                if ($response->successful()) {
                    $result = $response->json('result');
                    
                    if (!$result || 
                        !isset($result['status']) || 
                        hexdec($result['status']) !== 1 ||
                        strtolower($result['to']) !== strtolower($contractAddress)) {
                        throw new \Exception("Invalid or failed transaction on the blockchain.");
                    }
                } else {
                    throw new \Exception("Could not verify transaction with the blockchain node.");
                }
            }
        }

        $order->tx_hash = $txHash;
        $order->blockchain_status = $data['blockchain_status'];
        if (isset($data['chain_id'])) {
            $order->chain_id = $data['chain_id'];
        }
        $order->save();

        return $order;
    }
}
