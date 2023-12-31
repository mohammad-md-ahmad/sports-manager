<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyFacilityController;
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

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::prefix('companies')->group(function () {

        Route::post('/', [CompanyController::class, 'store'])->name('companies.create');
        Route::get('/{uuid}', [CompanyController::class, 'get'])->name('companies.get');
        Route::put('/{uuid}', [CompanyController::class, 'update'])->name('companies.update');
        Route::delete('/{uuid}', [CompanyController::class, 'delete'])->name('companies.delete');

        Route::prefix('{company}')->group(function () {
            Route::prefix('facilities')->group(function () {

                Route::post('/', [CompanyFacilityController::class, 'store'])->name('facilities.create');
                // Route::get('/{uuid}', [CompanyController::class, 'get'])->name('companies.get');
                // Route::put('/{uuid}', [CompanyController::class, 'update'])->name('companies.update');
                // Route::delete('/{uuid}', [CompanyController::class, 'delete'])->name('companies.delete');
            });
        });
    });

    Route::prefix('users')->group(function () {

        Route::post('/', [UserController::class, 'storeAdmin'])->name('users.create-admin');
        Route::get('/{uuid}', [UserController::class, 'get'])->name('users.get');
        Route::put('/{uuid}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{uuid}', [UserController::class, 'delete'])->name('users.delete');
    });
});

Route::get('/test', function () {
    return true;
});
