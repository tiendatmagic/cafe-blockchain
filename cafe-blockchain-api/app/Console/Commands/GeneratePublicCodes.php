<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Transaction;
use App\Models\Customer;
use App\Models\Product;
use App\Models\InventoryRecord;
use Illuminate\Console\Command;

class GeneratePublicCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:generate-codes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sinh mã hiển thị ngẫu nhiên và ký lại bảo mật cho toàn bộ bản ghi cũ (orders, transactions, customers, products, inventory_records)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Bat dau tien trinh sinh ma hien thi va ky lai chu ky so bao mat ===');

        // 1. Cap nhat Products
        $products = Product::whereNull('sku')->orWhere('sku', '')->get();
        $totalProducts = $products->count();
        $this->info("Tim thay {$totalProducts} san pham can cap nhat SKU.");
        if ($totalProducts > 0) {
            $bar = $this->output->createProgressBar($totalProducts);
            $bar->start();
            foreach ($products as $product) {
                $product->sku = 'SP-' . str_pad($product->id, 6, '0', STR_PAD_LEFT);
                $product->saveQuietly();
                $bar->advance();
            }
            $bar->finish();
            $this->info("\n=== Hoan tat cap nhat Products ===");
        }

        // 2. Cap nhat Customers
        $customers = Customer::whereNull('customer_code')->orWhere('customer_code', '')->get();
        $totalCustomers = $customers->count();
        $this->info("Tim thay {$totalCustomers} khach hang can cap nhat ma.");
        if ($totalCustomers > 0) {
            $bar = $this->output->createProgressBar($totalCustomers);
            $bar->start();
            foreach ($customers as $customer) {
                $customer->customer_code = 'KH-' . str_pad($customer->id, 4, '0', STR_PAD_LEFT);
                $customer->saveQuietly();
                $bar->advance();
            }
            $bar->finish();
            $this->info("\n=== Hoan tat cap nhat Customers ===");
        }

        // 3. Cap nhat InventoryRecords
        $records = InventoryRecord::whereNull('record_code')->orWhere('record_code', '')->get();
        $totalRecords = $records->count();
        $this->info("Tim thay {$totalRecords} phieu kho can cap nhat ma.");
        if ($totalRecords > 0) {
            $bar = $this->output->createProgressBar($totalRecords);
            $bar->start();
            foreach ($records as $record) {
                $prefix = $record->type === 'in' ? 'NK-' : 'XK-';
                $record->record_code = $prefix . str_pad($record->id, 6, '0', STR_PAD_LEFT);
                $record->saveQuietly();
                $bar->advance();
            }
            $bar->finish();
            $this->info("\n=== Hoan tat cap nhat InventoryRecords ===");
        }

        // 4. Cap nhat Orders (co kem ky lai HMAC)
        $orders = Order::whereNull('order_code')->orWhere('order_code', '')->get();
        $totalOrders = $orders->count();
        $this->info("Tim thay {$totalOrders} don hang can cap nhat ma va chu ky HMAC.");
        if ($totalOrders > 0) {
            $bar = $this->output->createProgressBar($totalOrders);
            $bar->start();
            foreach ($orders as $order) {
                $order->order_code = 'HD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
                if ($order->status === 'completed') {
                    $order->verification_hash = $order->generateVerificationHash();
                }
                $order->saveQuietly();
                $bar->advance();
            }
            $bar->finish();
            $this->info("\n=== Hoan tat cap nhat Orders ===");
        } else {
            // Neu da co order_code nhung muon ky lai HMAC voi order_code moi cho dong bo
            $completedOrders = Order::where('status', 'completed')->get();
            $this->info("Dang ky lai chu ky HMAC cho tat ca " . $completedOrders->count() . " don hang completed de dam bao dong bo...");
            foreach ($completedOrders as $order) {
                if (empty($order->order_code)) {
                    $order->order_code = 'HD-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
                }
                $order->verification_hash = $order->generateVerificationHash();
                $order->saveQuietly();
            }
            $this->info("Hoan tat ky lai HMAC cho Orders.");
        }

        // 5. Cap nhat Transactions (co kem ky lai HMAC)
        $transactions = Transaction::whereNull('transaction_code')->orWhere('transaction_code', '')->get();
        $totalTransactions = $transactions->count();
        $this->info("Tim thay {$totalTransactions} giao dich tai chinh can cap nhat ma va chu ky HMAC.");
        if ($totalTransactions > 0) {
            $bar = $this->output->createProgressBar($totalTransactions);
            $bar->start();
            foreach ($transactions as $transaction) {
                $transaction->transaction_code = 'TC-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT);
                $transaction->verification_hash = $transaction->generateVerificationHash();
                $transaction->saveQuietly();
                $bar->advance();
            }
            $bar->finish();
            $this->info("\n=== Hoan tat cap nhat Transactions ===");
        } else {
            // Neu da co transaction_code nhung muon ky lai HMAC voi transaction_code moi
            $allTransactions = Transaction::all();
            $this->info("Dang ky lai chu ky HMAC cho tat ca " . $allTransactions->count() . " giao dich thu chi...");
            foreach ($allTransactions as $transaction) {
                if (empty($transaction->transaction_code)) {
                    $transaction->transaction_code = 'TC-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT);
                }
                $transaction->verification_hash = $transaction->generateVerificationHash();
                $transaction->saveQuietly();
            }
            $this->info("Hoan tat ky lai HMAC cho Transactions.");
        }

        $this->info('=== DA HOAN THANH TOAN BO TIEN TRINH CAP NHAT MA HIEN THI VA KY LAI DB ===');
        return self::SUCCESS;
    }
}
