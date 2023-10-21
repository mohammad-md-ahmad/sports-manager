<?php

namespace App\Providers;

use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\CompanyFacilityServiceInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\CompanyUserServiceInterface;
use App\Contracts\Services\GalleryServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Services\AddressService;
use App\Services\CompanyFacilityService;
use App\Services\CompanyService;
use App\Services\CompanyUserService;
use App\Services\GalleryService;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;
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
        $this->app->bind(CompanyUserServiceInterface::class, CompanyUserService::class);
        $this->app->bind(CompanyFacilityServiceInterface::class, CompanyFacilityService::class);
        $this->app->bind(GalleryServiceInterface::class, GalleryService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('base64image', function ($attribute, $value, $parameters, $validator) {
            // Decode the base64 image data
            $decodedData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $value));

            if (! $decodedData) {
                return false; // Invalid base64 data
            }

            // Check image size
            $maxSize = 2 * 1024 * 1024; // 2 MB in bytes
            if (strlen($decodedData) > $maxSize) {
                return false; // Image size exceeds the limit
            }

            // Detect the image format (JPEG, PNG)
            $imgFormat = finfo_buffer(finfo_open(), $decodedData, FILEINFO_MIME_TYPE);
            // Allowed extensions
            $allowedExtensions = ['image/jpeg', 'image/png'];

            return in_array($imgFormat, $allowedExtensions);
        }, message: __('image should be of type jpg, png and 2 MB size maximum.'));
    }
}
