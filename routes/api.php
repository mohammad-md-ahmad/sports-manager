<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyFacilityController;
use App\Http\Controllers\CompanyFacilityScheduleController;
use App\Http\Controllers\MiscController;
use App\Http\Controllers\RegisterController;
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

Route::prefix('register')->group(function () {
    Route::post('/company', [RegisterController::class, 'registerCompany'])->name('register.company');
    Route::post('/user', [RegisterController::class, 'registerUser'])->name('register.user');
});

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::prefix('companies')->group(function () {

        Route::post('/', [CompanyController::class, 'store'])->name('companies.create');
        Route::get('/', [CompanyController::class, 'getAll'])->middleware('prevent_if_production')->name('companies.get-all');
        Route::get('/{uuid}', [CompanyController::class, 'get'])->name('companies.get');
        Route::put('/{uuid}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/{uuid}', [CompanyController::class, 'delete'])->name('companies.delete');

        Route::prefix('{company}')->group(function () {
            Route::prefix('facilities')->group(function () {

                Route::post('/', [CompanyFacilityController::class, 'store'])->name('facilities.create');
                Route::get('/', [CompanyFacilityController::class, 'getAllByCompany'])->name('facilities.get-all-by-company');
                Route::get('/{uuid}', [CompanyFacilityController::class, 'get'])->name('facilities.get');
                // Route::put('/{uuid}', [CompanyController::class, 'update'])->name('companies.update');
                // Route::delete('/{uuid}', [CompanyController::class, 'delete'])->name('companies.delete');
            });
        });
    });

    Route::prefix('facilities')->group(function () {
        Route::get('/', [CompanyFacilityController::class, 'getAll'])->name('facilities.get-all');

        Route::prefix('{facility}')->group(function () {
            Route::prefix('schedules')->group(function () {

                Route::post('/', [CompanyFacilityScheduleController::class, 'store'])->name('schedules.create');
            });
        });
    });

    Route::prefix('users')->group(function () {

        Route::post('/', [UserController::class, 'storeAdmin'])->name('users.create-admin');
        Route::get('/{uuid}', [UserController::class, 'get'])->name('users.get');
        Route::put('/{uuid}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{uuid}', [UserController::class, 'delete'])->name('users.delete');
    });

    Route::get('/lists', [MiscController::class, 'lists'])->name('lists');
});

Route::get('/test', function () {
    return true;
});
