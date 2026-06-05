<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transaction_code',
        'type',
        'amount',
        'category',
        'description',
        'transaction_date',
        'store_owner_address',
        'tx_hash',
        'blockchain_status',
        'chain_id',
        'verification_hash',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    protected $appends = [
        'is_verified',
    ];

    /**
     * Thuộc tính ảo đối soát tính toàn vẹn của dữ liệu giao dịch thu chi
     */
    public function getIsVerifiedAttribute(): bool
    {
        if (empty($this->verification_hash)) {
            return false;
        }

        return $this->verification_hash === $this->generateVerificationHash();
    }

    protected static function booted()
    {
        // Tự động sinh mã giao dịch ngẫu nhiên 6 ký tự viết hoa/chữ số và UUIDv7 khi tạo mới
        static::creating(function ($transaction) {
            if (empty($transaction->id)) {
                $transaction->id = (string) \Illuminate\Support\Str::uuid7();
            }
            if (empty($transaction->transaction_code)) {
                $transaction->transaction_code = 'TC-' . strtoupper(bin2hex(random_bytes(3)));
            }
        });

        // Khi cập nhật giao dịch
        static::saving(function ($transaction) {
            if ($transaction->id) {
                $transaction->verification_hash = $transaction->generateVerificationHash();
            }
        });

        // Đề phòng trường hợp tạo mới giao dịch (chưa có ID ở sự kiện saving)
        static::saved(function ($transaction) {
            if (empty($transaction->verification_hash)) {
                $transaction->verification_hash = $transaction->generateVerificationHash();
                $transaction->saveQuietly();
            }
        });
    }

    /**
     * Sinh mã băm bảo mật HMAC-SHA256 chống sửa đổi dữ liệu giao dịch trong cơ sở dữ liệu
     */
    public function generateVerificationHash(): string
    {
        $secretKey = env('TRANSACTION_SECRET_KEY', 'default_transaction_secret_key_change_me');

        // Định dạng tiền tệ với 2 chữ số thập phân
        $amountFormatted = number_format((float)$this->amount, 2, '.', '');

        // Chuyển đổi transaction_date sang chuỗi ngày
        $txDateStr = '';
        if ($this->transaction_date) {
            if ($this->transaction_date instanceof \Carbon\Carbon || $this->transaction_date instanceof \DateTime) {
                $txDateStr = $this->transaction_date->toDateString();
            } else {
                $txDateStr = substr((string)$this->transaction_date, 0, 10);
            }
        }

        // Tạo dữ liệu nhạy cảm cần ký
        $data = implode('|', [
            strtolower($this->transaction_code ?? ''),
            $this->type ?? '',
            $amountFormatted,
            $this->category ?? '',
            $this->description ?? '',
            $txDateStr,
            strtolower($this->store_owner_address ?? ''),
        ]);

        return hash_hmac('sha256', $data, $secretKey);
    }
}
