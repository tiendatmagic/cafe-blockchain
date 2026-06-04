<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'table_number',
        'customer_id',
        'total_amount',
        'discount_amount',
        'voucher_id',
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
        'discount_amount' => 'integer',
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
        // Tự động sinh mã đơn hàng ngẫu nhiên 6 ký tự viết hoa/chữ số khi tạo mới
        static::creating(function ($order) {
            if (empty($order->order_code)) {
                $order->order_code = 'HD-' . strtoupper(bin2hex(random_bytes(3)));
            }
        });

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

            if ($order->status === 'completed') {
                // 1. Đánh dấu voucher áp dụng là đã sử dụng
                if ($order->voucher_id) {
                    $voucher = \App\Models\Voucher::where('id', $order->voucher_id)
                        ->where('status', 'active')
                        ->first();
                    if ($voucher) {
                        $voucher->update(['status' => 'used']);
                    }
                }

                // 2. Tự động tặng voucher nếu đủ điều kiện
                if (($order->wasChanged('status') || $order->wasRecentlyCreated) && $order->customer_id) {
                    $storeOwner = $order->store_owner_address;
                    $minGiftAmount = (int)\App\Models\Setting::getForStore('voucher_gift_min_amount', $storeOwner, 100000);
                    $originalTotal = $order->total_amount + $order->discount_amount;
                    
                    if ($originalTotal >= $minGiftAmount) {
                        $giftDiscount = (int)\App\Models\Setting::getForStore('voucher_discount_amount', $storeOwner, 5000);
                        $useMinAmount = (int)\App\Models\Setting::getForStore('voucher_use_min_amount', $storeOwner, 100000);
                        
                        $customer = \App\Models\Customer::find($order->customer_id);
                        $customerWallet = $customer ? $customer->wallet_address : null;
                        $voucherContract = \App\Models\Setting::getForStore('voucher_contract_address', $storeOwner);

                        if (!empty($customerWallet) && !empty($voucherContract)) {
                            // Tạo mã voucher ngẫu nhiên để làm tokenUri và code định danh
                            $voucherCode = 'NFT-' . strtoupper(\Illuminate\Support\Str::random(8));
                            $tokenUri = url("/api/vouchers/metadata/{$voucherCode}");

                            // Gọi Relayer thực hiện đúc (mint) NFT trên Blockchain
                            $relayerResult = \App\Services\BlockchainRelayerService::mintVoucher(
                                $storeOwner,
                                $customerWallet,
                                $tokenUri,
                                $giftDiscount,
                                $useMinAmount
                            );

                            if ($relayerResult['success']) {
                                // Đúc thành công, tạo bản ghi voucher NFT thật
                                \App\Models\Voucher::create([
                                    'code' => $voucherCode,
                                    'customer_id' => $order->customer_id,
                                    'wallet_address' => $customerWallet,
                                    'discount_amount' => $giftDiscount,
                                    'min_order_amount' => $useMinAmount,
                                    'status' => 'active',
                                    'tx_hash' => $relayerResult['txHash'] ?? null,
                                    'store_owner_address' => $storeOwner
                                ]);
                            } else {
                                // Fallback off-chain voucher nếu mint blockchain lỗi
                                \Illuminate\Support\Facades\Log::warning("Mint NFT Voucher that bai: " . ($relayerResult['error'] ?? 'Lỗi không xác định') . ". Fallback sang voucher off-chain.");
                                self::createOffChainVoucher($order, $customerWallet, $giftDiscount, $useMinAmount, $storeOwner);
                            }
                        } else {
                            // Tạo voucher off-chain thông thường
                            self::createOffChainVoucher($order, $customerWallet, $giftDiscount, $useMinAmount, $storeOwner);
                        }
                    }
                }
            }
        });
    }

    /**
     * Tạo voucher off-chain thông thường (fallback)
     */
    private static function createOffChainVoucher($order, $walletAddress, $discount, $minOrder, $storeOwner)
    {
        \App\Models\Voucher::create([
            'code' => 'NFT-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'customer_id' => $order->customer_id,
            'wallet_address' => $walletAddress,
            'discount_amount' => $discount,
            'min_order_amount' => $minOrder,
            'status' => 'active',
            'store_owner_address' => $storeOwner
        ]);
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

        // Tạo dữ liệu nhạy cảm cần ký (đã bao gồm phương thức thanh toán và thông tin giảm giá)
        $data = implode('|', [
            strtolower($this->order_code ?? ''),
            $totalAmountFormatted,
            (int)$this->discount_amount,
            $this->voucher_id ?? '',
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

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
