<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Application\Common\Interfaces\BlockchainRelayerServiceInterface::class,
            \App\Infrastructure\Services\BlockchainRelayerService::class
        );

        $this->app->bind(
            \App\Domain\Repositories\OrderRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentOrderRepository::class
        );

        $this->app->bind(
            \App\Domain\Repositories\ShiftRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentShiftRepository::class
        );

        $this->app->bind(
            \App\Domain\Repositories\DebtRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentDebtRepository::class
        );

        $this->app->bind(
            \App\Domain\Repositories\TransactionRepositoryInterface::class,
            \App\Infrastructure\Persistence\Repositories\EloquentTransactionRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Event::listen(
            \App\Domain\Events\OrderCompletedEvent::class,
            \App\Domain\Listeners\MintVoucherGiftListener::class
        );

        // Định nghĩa các rate limiters toàn cục cho API
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

        // Giới hạn cho các endpoint đăng nhập Web3 nhạy cảm (Tối đa 5 request/phút dựa trên IP + địa chỉ ví)
        RateLimiter::for('auth_endpoints', function (Request $request) {
            $address = strtolower($request->input('address') ?: $request->query('address') ?: '');
            $key = $address ? $request->ip() . '|' . $address : $request->ip();
            return Limit::perMinute(7)->by($key);
        });

        // Giới hạn cho việc tạo đơn hàng công khai trên storefront (Tối đa 10 đơn hàng/phút)
        RateLimiter::for('public_orders', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
