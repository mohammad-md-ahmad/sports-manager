<?php

namespace App\Providers;

use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Services\AddressService;
use App\Services\CompanyService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(CompanyServiceInterface::class, CompanyService::class);
        $this->app->bind(AddressServiceInterface::class, AddressService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
