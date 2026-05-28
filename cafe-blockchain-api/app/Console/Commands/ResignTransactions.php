<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class ResignTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:resign';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ký lại chữ ký số bảo mật (verification_hash) cho toàn bộ giao dịch thu chi tài chính (Dùng khi cập nhật hệ thống hoặc thay đổi TRANSACTION_SECRET_KEY)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Bat dau tien trinh ky lai chu ky so giao dich tai chinh (HMAC-SHA256) ===');

        $secretKey = env('TRANSACTION_SECRET_KEY');
        if (empty($secretKey)) {
            $this->warn('CANH BAO: Khong tim thay khoa TRANSACTION_SECRET_KEY trong file .env! He thong se su dung khoa mac dinh.');
        } else {
            $this->info('Tim thay khoa TRANSACTION_SECRET_KEY trong file .env. Bat dau xu ly...');
        }

        // Lay tat ca giao dich tai chinh
        $transactions = Transaction::all();
        $total = $transactions->count();

        if ($total === 0) {
            $this->info('Khong tim thay giao dich tai chinh nao can ky.');
            return self::SUCCESS;
        }

        $this->info("Tim thay {$total} giao dich tai chinh can cap nhat chu ky bao mat.");
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $updatedCount = 0;
        foreach ($transactions as $transaction) {
            try {
                // Tinh toan lai ma bam voi khoa moi
                $transaction->verification_hash = $transaction->generateVerificationHash();
                // Luu khong kich hoat event Eloquent de tranh bi lap
                $transaction->saveQuietly();
                $updatedCount++;
            } catch (\Exception $e) {
                $this->error("\nLoi khi ky giao dich ID {$transaction->id}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->info("\n");
        $this->info("=== HOAN THANH: Da ky lai thanh cong {$updatedCount}/{$total} giao dich tai chinh! ===");
        
        return self::SUCCESS;
    }
}
