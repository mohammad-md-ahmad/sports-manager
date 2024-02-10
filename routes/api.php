<?php

use App\Http\Controllers\AdvertisementController;
use App\Http\Controllers\AppInfoController;
use App\Http\Controllers\AppListController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyCustomerController;
use App\Http\Controllers\CompanyFacilityController;
use App\Http\Controllers\CompanyFacilityScheduleController;
use App\Http\Controllers\CompanySurveyController;
use App\Http\Controllers\MiscController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PushNotificationController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/reset-password/send-link', [AuthController::class, 'sendPasswordResetLink'])->name('reset-password.send-link');

Route::prefix('register')->group(function () {
    Route::post('/company', [RegisterController::class, 'registerCompany'])->name('register.company');
    Route::post('/user', [RegisterController::class, 'registerUser'])->name('register.user');
});

Route::prefix('app-info')->group(function () {
    Route::get('/', [AppInfoController::class, 'get'])->name('app-info.get');
});

Route::get('/lists', [MiscController::class, 'lists'])->name('lists');

Route::prefix('advertisements')->group(function () {
    Route::get('/all', [AdvertisementController::class, 'getAll'])->name('advertisements.get-all');
});

Route::prefix('sports')->group(function () {
    Route::get('/all', [SportController::class, 'getAll'])->name('sports.get-all');
});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::prefix('companies')->group(function () {

        Route::post('/', [CompanyController::class, 'store'])->name('companies.create');
        Route::get('/', [CompanyController::class, 'getAll'])->name('companies.get-all');
        Route::get('/{uuid}', [CompanyController::class, 'get'])->name('companies.get');
        Route::put('/{uuid}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/{uuid}', [CompanyController::class, 'delete'])->name('companies.delete');

        Route::prefix('{company}')->group(function () {
            Route::prefix('facilities')->group(function () {

                Route::post('/', [CompanyFacilityController::class, 'store'])->name('facilities.create');
                Route::get('/', [CompanyFacilityController::class, 'getAllByCompany'])->name('facilities.get-all-by-company');
                Route::get('/{uuid}', [CompanyFacilityController::class, 'get'])->name('facilities.get');
                Route::put('/{facility}', [CompanyFacilityController::class, 'update'])->name('facilities.update');
                // Route::delete('/{uuid}', [CompanyController::class, 'delete'])->name('companies.delete');
            });

            Route::prefix('customers')->group(function () {

                Route::post('/', [CompanyCustomerController::class, 'store'])->name('company-customers.create');
                Route::get('/', [CompanyCustomerController::class, 'getAll'])->name('company-customers.get-all');
            });

            Route::prefix('bookings')->group(function () {

                Route::get('/customer/get-all', [BookingController::class, 'getAllByCustomer'])->name('bookings.get-all-by-customer');
            });

            Route::prefix('surveys')->group(function () {

                Route::post('/', [CompanySurveyController::class, 'store'])->name('company-surveys.create');
            });
        });
    });

    Route::prefix('surveys')->group(function () {

        Route::get('/{uuid}', [CompanySurveyController::class, 'get'])->name('company-surveys.get');
        Route::get('/get-all/company/{company}', [CompanySurveyController::class, 'getAllByCompany'])->name('company-surveys.get-all.company');
        Route::put('/{uuid}', [CompanySurveyController::class, 'update'])->name('company-surveys.update');
        Route::post('/{uuid}/user-response', [CompanySurveyController::class, 'userResponse'])->name('company-survey.user-response');
    });

    Route::prefix('facilities')->group(function () {
        Route::get('/', [CompanyFacilityController::class, 'getAll'])->name('facilities.get-all');

        Route::prefix('{facility}')->group(function () {
            Route::prefix('schedules')->group(function () {

                Route::post('/', [CompanyFacilityScheduleController::class, 'store'])->name('schedules.create');
                Route::post('/batch', [CompanyFacilityScheduleController::class, 'storeBatch'])->name('schedules.create-batch');
            });
        });
    });

    Route::prefix('company-customers')->group(function () {
        Route::get('/{companyCustomer}', [CompanyCustomerController::class, 'get'])->name('company-customers.get');
        Route::put('/{uuid}', [CompanyCustomerController::class, 'update'])->name('company-customers.update');
        Route::put('/{uuid}/toggle-auto-approve', [CompanyCustomerController::class, 'toggleAutoApprove'])->name('company-customers.toggle-auto-approve');
        Route::delete('/{uuid}', [CompanyCustomerController::class, 'delete'])->name('company-customers.delete');
    });

    Route::prefix('schedules')->group(function () {

        Route::get('/schedule', [CompanyFacilityScheduleController::class, 'getSchedule'])->name('schedules.schedule');
        Route::get('/company-schedule', [CompanyFacilityScheduleController::class, 'getCompanySchedule'])->name('schedules.company-schedule');
        Route::get('/facility-schedule', [CompanyFacilityScheduleController::class, 'getFacilitySchedule'])->name('schedules.facility-schedule');
        Route::put('/{uuid}', [CompanyFacilityScheduleController::class, 'update'])->name('schedules.update');
        Route::delete('/{uuid}', [CompanyFacilityScheduleController::class, 'delete'])->name('schedules.delete');
    });

    Route::prefix('bookings')->group(function () {

        Route::get('/', [BookingController::class, 'getAll'])->name('bookings.get-all');
        Route::post('/', [BookingController::class, 'store'])->name('bookings.store');
        Route::post('/{uuid}/approve', [BookingController::class, 'approve'])->name('bookings.approve');
        Route::post('/{uuid}/decline', [BookingController::class, 'decline'])->name('bookings.decline');
    });

    Route::prefix('users')->group(function () {

        Route::get('/', [UserController::class, 'getAll'])->name('users.get-all');
        Route::post('/', [UserController::class, 'storeAdmin'])->name('users.create-admin');
        Route::get('/{uuid}', [UserController::class, 'get'])->name('users.get');
        Route::put('/{uuid}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{uuid}', [UserController::class, 'delete'])->name('users.delete');
    });

    Route::prefix('push-notifications')->group(function () {
        Route::post('/send', [PushNotificationController::class, 'sendNotification'])->name('push-notifications.send');
    });

    Route::prefix('ratings')->group(function () {

        Route::post('/', [RatingController::class, 'store'])->name('ratings.store');
        Route::get('/entity-ratings', [RatingController::class, 'getEntityRatings'])->name('ratings.entity-ratings');
    });

    Route::prefix('company-list')->group(function () {

        Route::get('/{company}', [AppListController::class, 'get'])->name('company-list.get');
        Route::get('/get-all-app-lists', [AppListController::class, 'getAllAppLists'])->name('app-list.get-all-list');
        Route::post('/{company}', [AppListController::class, 'updateCompanyList'])->name('company-list.update');
    });

    Route::prefix('app-list')->group(function () {

        Route::get('/get-all', [AppListController::class, 'getAllAppLists'])->name('app-list.get-all');
        Route::get('/get-all/keys', [AppListController::class, 'getAllAppListKeys'])->name('app-list.get-all-keys');
    });

    Route::prefix('notifications')->group(function () {

        Route::get('/receiver/{receiver_uuid}/get-all', [NotificationController::class, 'getUserNotifications'])->name('notifications.user.get-all');
    });

    Route::prefix('reports')->group(function () {

        Route::get('/company/{company}', [ReportController::class, 'get'])->name('reports.get');
    });

    Route::prefix('advertisements')->group(function () {
        Route::get('/{uuid}', [AdvertisementController::class, 'get'])->name('advertisements.get');
        Route::post('/', [AdvertisementController::class, 'store'])->name('advertisements.store');
        Route::put('/{uuid}', [AdvertisementController::class, 'update'])->name('advertisements.update');
        Route::delete('/{uuid}', [AdvertisementController::class, 'delete'])->name('advertisements.delete');
    });

    Route::prefix('sports')->group(function () {
        Route::get('/{uuid}', [SportController::class, 'get'])->name('sports.get');
        Route::post('/', [SportController::class, 'store'])->name('sports.store');
        Route::put('/{uuid}', [SportController::class, 'update'])->name('sports.update');
        Route::delete('/{uuid}', [SportController::class, 'delete'])->name('sports.delete');
        Route::post('/{uuid}', [SportController::class, 'updateUserFavoriteSports'])->name('sports.update-user-favorite-sports');
    });
});

Route::get('/test', function () {
    return true;
});
