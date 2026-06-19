<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
    }
}
