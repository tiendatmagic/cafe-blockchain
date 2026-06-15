<?php

namespace App\Infrastructure\Persistence\Mappers;

use App\Domain\Entities\Order;
use App\Infrastructure\Persistence\Eloquent\OrderModel;

class OrderMapper
{
    /**
     * Map từ Eloquent Model sang Domain Entity
     */
    public static function toDomain(OrderModel $model): Order
    {
        return new Order([
            'id' => $model->id,
            'order_code' => $model->order_code,
            'table_number' => $model->table_number,
            'customer_id' => $model->customer_id,
            'total_amount' => $model->total_amount,
            'discount_amount' => $model->discount_amount,
            'voucher_nft_token_id' => $model->voucher_nft_token_id,
            'gift_voucher_nft_token_id' => $model->gift_voucher_nft_token_id,
            'payment_method' => $model->payment_method,
            'status' => $model->status,
            'tx_hash' => $model->tx_hash,
            'blockchain_status' => $model->blockchain_status,
            'chain_id' => $model->chain_id,
            'store_owner_address' => $model->store_owner_address,
            'verification_hash' => $model->verification_hash,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ]);
    }

    /**
     * Map từ Domain Entity sang mảng thuộc tính của Eloquent Model
     */
    public static function toPersistence(Order $entity): array
    {
        return [
            'id' => $entity->id,
            'order_code' => $entity->order_code,
            'table_number' => $entity->table_number,
            'customer_id' => $entity->customer_id,
            'total_amount' => $entity->total_amount,
            'discount_amount' => $entity->discount_amount,
            'voucher_nft_token_id' => $entity->voucher_nft_token_id,
            'gift_voucher_nft_token_id' => $entity->gift_voucher_nft_token_id,
            'payment_method' => $entity->payment_method,
            'status' => $entity->status,
            'tx_hash' => $entity->tx_hash,
            'blockchain_status' => $entity->blockchain_status,
            'chain_id' => $entity->chain_id,
            'store_owner_address' => $entity->store_owner_address,
            'verification_hash' => $entity->verification_hash,
        ];
    }
}
