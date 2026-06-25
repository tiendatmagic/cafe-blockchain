<?php

namespace App\Domain\Entities;

class Order
{
    public ?string $id;
    public ?string $order_code;
    public ?string $table_number;
    public ?int $customer_id;
    public float $total_amount;
    public int $discount_amount;
    public float $tax_amount;
    public ?int $voucher_nft_token_id;
    public ?int $gift_voucher_nft_token_id;
    public string $payment_method;
    public string $status;
    public ?string $tx_hash;
    public string $blockchain_status;
    public ?string $chain_id;
    public string $store_owner_address;
    public ?string $verification_hash;
    public ?int $shift_id;
    public mixed $created_at;
    public mixed $updated_at;

    public function __construct(array $attributes = [])
    {
        $this->id = $attributes['id'] ?? null;
        $this->order_code = $attributes['order_code'] ?? null;
        $this->table_number = $attributes['table_number'] ?? null;
        $this->customer_id = $attributes['customer_id'] ?? null;
        $this->total_amount = (float)($attributes['total_amount'] ?? 0.0);
        $this->discount_amount = (int)($attributes['discount_amount'] ?? 0);
        $this->tax_amount = (float)($attributes['tax_amount'] ?? 0.0);
        $this->voucher_nft_token_id = isset($attributes['voucher_nft_token_id']) ? (int)$attributes['voucher_nft_token_id'] : null;
        $this->gift_voucher_nft_token_id = isset($attributes['gift_voucher_nft_token_id']) ? (int)$attributes['gift_voucher_nft_token_id'] : null;
        $this->payment_method = $attributes['payment_method'] ?? 'cash';
        $this->status = $attributes['status'] ?? 'pending';
        $this->tx_hash = $attributes['tx_hash'] ?? null;
        $this->blockchain_status = $attributes['blockchain_status'] ?? 'none';
        $this->chain_id = $attributes['chain_id'] ?? null;
        $this->store_owner_address = $attributes['store_owner_address'] ?? '';
        $this->verification_hash = $attributes['verification_hash'] ?? null;
        $this->shift_id = isset($attributes['shift_id']) ? (int)$attributes['shift_id'] : null;
        $this->created_at = $attributes['created_at'] ?? null;
        $this->updated_at = $attributes['updated_at'] ?? null;
    }

    /**
     * Sinh mã băm bảo mật HMAC-SHA256 chống sửa đổi dữ liệu đơn hàng trong cơ sở dữ liệu
     */
    public function generateVerificationHash(): string
    {
        $secretKey = config('app.order_secret_key', 'default_secret_key_change_me');

        // Định dạng tiền tệ với 2 chữ số thập phân để đảm bảo tính đồng nhất
        $totalAmountFormatted = number_format($this->total_amount, 2, '.', '');

        // Chuyển đổi created_at sang chuỗi ngày giờ
        $createdAtStr = '';
        if ($this->created_at) {
            if ($this->created_at instanceof \Carbon\Carbon || $this->created_at instanceof \DateTime) {
                $createdAtStr = $this->created_at->toDateTimeString();
            } else {
                $createdAtStr = (string)$this->created_at;
            }
        }

        // Tạo dữ liệu nhạy cảm cần ký
        $data = implode('|', [
            strtolower($this->order_code ?? ''),
            $totalAmountFormatted,
            $this->discount_amount,
            $this->voucher_nft_token_id ?? '',
            strtolower($this->payment_method),
            $this->table_number ?? '',
            $createdAtStr,
            strtolower($this->store_owner_address),
        ]);

        return hash_hmac('sha256', $data, $secretKey);
    }

    /**
     * Kiểm tra tính toàn vẹn của dữ liệu đơn hàng
     */
    public function isVerified(): bool
    {
        if ($this->status !== 'completed') {
            return true;
        }

        if (empty($this->verification_hash)) {
            return false;
        }

        return $this->verification_hash === $this->generateVerificationHash();
    }

    /**
     * Chuyển đổi Entity thành mảng
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'table_number' => $this->table_number,
            'customer_id' => $this->customer_id,
            'total_amount' => $this->total_amount,
            'discount_amount' => $this->discount_amount,
            'tax_amount' => $this->tax_amount,
            'voucher_nft_token_id' => $this->voucher_nft_token_id,
            'gift_voucher_nft_token_id' => $this->gift_voucher_nft_token_id,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'tx_hash' => $this->tx_hash,
            'blockchain_status' => $this->blockchain_status,
            'chain_id' => $this->chain_id,
            'store_owner_address' => $this->store_owner_address,
            'verification_hash' => $this->verification_hash,
            'shift_id' => $this->shift_id,
            'is_verified' => $this->isVerified(),
            'created_at' => $this->created_at ? (string)$this->created_at : null,
            'updated_at' => $this->updated_at ? (string)$this->updated_at : null,
        ];
    }
}
