<?php

namespace App\Console\Commands;

use App\Infrastructure\Persistence\Eloquent\OrderModel;
use App\Infrastructure\Persistence\Mappers\OrderMapper;
use Illuminate\Console\Command;

class ResignOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:resign';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ký lại chữ ký số bảo mật (verification_hash) cho toàn bộ đơn hàng đã hoàn thành (Dùng khi cập nhật hệ thống hoặc thay đổi ORDER_SECRET_KEY)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Bat dau tien trinh ky lai chu ky so don hang (HMAC-SHA256) ===');

        $secretKey = config('app.order_secret_key');
        if (empty($secretKey)) {
            $this->warn('CANH BAO: Khong tim thay khoa ORDER_SECRET_KEY trong file .env! He thong se su dung khoa mac dinh.');
        } else {
            $this->info('Tim thay khoa ORDER_SECRET_KEY trong file .env. Bat dau xu ly...');
        }

        // Lay tat ca don hang da hoan thanh
        $orders = OrderModel::where('status', 'completed')->get();
        $total = $orders->count();

        if ($total === 0) {
            $this->info('Khong tim thay don hang nao o trang thai hoan thanh (completed) can ky.');
            return self::SUCCESS;
        }

        $this->info("Tim thay {$total} don hang can cap nhat chu ky bao mat.");
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $updatedCount = 0;
        foreach ($orders as $order) {
            try {
                // Tinh toan lai ma bam voi khoa moi
                $orderEntity = OrderMapper::toDomain($order);
                $order->verification_hash = $orderEntity->generateVerificationHash();
                // Luu khong kich hoat event Eloquent de tranh bi lap vo han
                $order->saveQuietly();
                $updatedCount++;
            } catch (\Exception $e) {
                $this->error("\nLoi khi ky don hang ID {$order->id}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->info("\n");
        $this->info("=== HOAN THANH: Da ky lai thanh cong {$updatedCount}/{$total} don hang! ===");
        
        return self::SUCCESS;
    }
}
