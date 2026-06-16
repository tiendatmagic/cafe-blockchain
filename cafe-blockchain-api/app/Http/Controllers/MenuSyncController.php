<?php

namespace App\Http\Controllers;

use App\Domain\Entities\MenuSyncLog;
use Illuminate\Http\Request;

class MenuSyncController extends Controller
{
    /**
     * Lấy danh sách lịch sử đồng bộ thực đơn lên Blockchain
     * Trả về 50 bản ghi gần nhất, sắp xếp theo thời gian mới nhất
     */
    public function index(Request $request)
    {
        $storeOwner = strtolower(
            $request->user()->store_owner_address ?: $request->user()->wallet_address
        );

        $logs = MenuSyncLog::where('store_owner_address', $storeOwner)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($log) {
                return [
                    'id'            => $log->id,
                    'synced_by'     => $log->synced_by,
                    'tx_hash'       => $log->tx_hash,
                    'product_count' => $log->product_count,
                    'chain_id'      => $log->chain_id,
                    'synced_at'     => $log->created_at?->toIso8601String(),
                ];
            });

        return response()->json($logs);
    }

    /**
     * Ghi nhận một lần đồng bộ thực đơn lên Blockchain
     */
    public function store(Request $request)
    {
        $storeOwner = strtolower(
            $request->user()->store_owner_address ?: $request->user()->wallet_address
        );

        $data = $request->validate([
            'synced_by'     => 'required|string|max:42',
            'tx_hash'       => 'nullable|string|max:100',
            'product_count' => 'required|integer|min:0',
            'chain_id'      => 'nullable|string|max:20',
        ]);

        $log = MenuSyncLog::create([
            'store_owner_address' => $storeOwner,
            'synced_by'           => strtolower($data['synced_by']),
            'tx_hash'             => $data['tx_hash'] ?? null,
            'product_count'       => $data['product_count'],
            'chain_id'            => $data['chain_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Menu synchronization logged successfully.',
            'data'    => [
                'id'            => $log->id,
                'synced_by'     => $log->synced_by,
                'tx_hash'       => $log->tx_hash,
                'product_count' => $log->product_count,
                'chain_id'      => $log->chain_id,
                'synced_at'     => $log->created_at?->toIso8601String(),
            ],
        ], 201);
    }
}
