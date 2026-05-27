<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'total_amount',
        'payment_method',
        'status',
        'tx_hash',
        'blockchain_status',
        'chain_id',
        'store_owner_address',
        'verification_hash',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    protected $appends = [
        'is_verified',
    ];

    /**
     * Thuộc tính ảo đối soát tính toàn vẹn của dữ liệu đơn hàng
     */
    public function getIsVerifiedAttribute(): bool
    {
        if ($this->status !== 'completed') {
            return true;
        }

        if (empty($this->verification_hash)) {
            return false;
        }

        return $this->verification_hash === $this->generateVerificationHash();
    }

    protected static function booted()
    {
        // Khi cập nhật đơn hàng hoặc khi lưu nếu trạng thái là completed và đã có ID
        static::saving(function ($order) {
            if ($order->status === 'completed' && $order->id) {
                $order->verification_hash = $order->generateVerificationHash();
            }
        });

        // Đề phòng trường hợp tạo mới đơn hàng ở trạng thái completed ngay lập tức (chưa có ID ở sự kiện saving)
        static::saved(function ($order) {
            if ($order->status === 'completed' && empty($order->verification_hash)) {
                $order->verification_hash = $order->generateVerificationHash();
                $order->saveQuietly();
            }
        });
    }

    /**
     * Sinh mã băm bảo mật HMAC-SHA256 chống sửa đổi dữ liệu đơn hàng trong cơ sở dữ liệu
     */
    public function generateVerificationHash(): string
    {
        $secretKey = env('ORDER_SECRET_KEY', 'default_secret_key_change_me');

        // Định dạng tiền tệ với 2 chữ số thập phân để đảm bảo tính đồng nhất
        $totalAmountFormatted = number_format((float)$this->total_amount, 2, '.', '');

        // Chuyển đổi created_at sang chuỗi ngày giờ
        $createdAtStr = '';
        if ($this->created_at) {
            if ($this->created_at instanceof \Carbon\Carbon || $this->created_at instanceof \DateTime) {
                $createdAtStr = $this->created_at->toDateTimeString();
            } else {
                $createdAtStr = (string)$this->created_at;
            }
        }

        // Tạo dữ liệu nhạy cảm cần ký (đã bao gồm phương thức thanh toán)
        $data = implode('|', [
            $this->id,
            $totalAmountFormatted,
            strtolower($this->payment_method ?? ''),
            $this->table_number ?? '',
            $createdAtStr,
            strtolower($this->store_owner_address ?? ''),
        ]);

        return hash_hmac('sha256', $data, $secretKey);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
