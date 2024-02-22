<?php

namespace App\Providers;

use App\Contracts\Formatters\Money\DecimalMoneyFormatterInterface;
use App\Contracts\Parsers\Money\DecimalMoneyParserInterface;
use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\AdvertisementServiceInterface;
use App\Contracts\Services\AppInfoServiceInterface;
use App\Contracts\Services\AppListServiceInterface;
use App\Contracts\Services\BookingServiceInterface;
use App\Contracts\Services\CompanyCustomerServiceInterface;
use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Contracts\Services\CompanyFacilityServiceInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\CompanySurveyServiceInterface;
use App\Contracts\Services\CompanyUserServiceInterface;
use App\Contracts\Services\GalleryServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\Contracts\Services\PushNotificationServiceInterface;
use App\Contracts\Services\RatingServiceInterface;
use App\Contracts\Services\ReportServiceInterface;
use App\Contracts\Services\SportServiceInterface;
use App\Contracts\Services\SubscriptionPlanServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Core\Formatters\Money\DecimalMoneyFormatter;
use App\Core\Parsers\Money\DecimalMoneyParser;
use App\Models\Company;
use App\Models\CompanyFacility;
use App\Services\AddressService;
use App\Services\AdvertisementService;
use App\Services\AppInfoService;
use App\Services\AppListService;
use App\Services\BookingService;
use App\Services\CompanyCustomerService;
use App\Services\CompanyFacilityScheduleService;
use App\Services\CompanyFacilityService;
use App\Services\CompanyService;
use App\Services\CompanySurveyService;
use App\Services\CompanyUserService;
use App\Services\GalleryService;
use App\Services\NotificationService;
use App\Services\PushNotificationService;
use App\Services\RatingService;
use App\Services\ReportService;
use App\Services\SportService;
use App\Services\SubscriptionPlanService;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Spatie\LaravelData\Support\DataConfig;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(DecimalMoneyFormatterInterface::class, DecimalMoneyFormatter::class);
        $this->app->bind(DecimalMoneyParserInterface::class, DecimalMoneyParser::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(CompanyServiceInterface::class, CompanyService::class);
        $this->app->bind(AddressServiceInterface::class, AddressService::class);
        $this->app->bind(CompanyUserServiceInterface::class, CompanyUserService::class);
        $this->app->bind(CompanyFacilityServiceInterface::class, CompanyFacilityService::class);
        $this->app->bind(GalleryServiceInterface::class, GalleryService::class);
        $this->app->bind(CompanyFacilityScheduleServiceInterface::class, CompanyFacilityScheduleService::class);
        $this->app->bind(BookingServiceInterface::class, BookingService::class);
        $this->app->bind(RatingServiceInterface::class, RatingService::class);
        $this->app->bind(CompanyCustomerServiceInterface::class, CompanyCustomerService::class);
        $this->app->bind(AppInfoServiceInterface::class, AppInfoService::class);
        $this->app->bind(AppListServiceInterface::class, AppListService::class);
        $this->app->bind(NotificationServiceInterface::class, NotificationService::class);
        $this->app->bind(CompanySurveyServiceInterface::class, CompanySurveyService::class);
        $this->app->bind(ReportServiceInterface::class, ReportService::class);
        $this->app->bind(AdvertisementServiceInterface::class, AdvertisementService::class);
        $this->app->bind(SportServiceInterface::class, SportService::class);
        $this->app->bind(PushNotificationServiceInterface::class, PushNotificationService::class);
        $this->app->bind(SubscriptionPlanServiceInterface::class, SubscriptionPlanService::class);
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

        app(DataConfig::class)->enforceMorphMap([
            'company_model' => Company::class,
            'facility_model' => CompanyFacility::class,
        ]);
    }
}
