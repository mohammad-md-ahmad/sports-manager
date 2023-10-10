<?php

use App\Http\Controllers\UserController;
use App\Models\User;
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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('users')->group(function () {

    Route::post('/', [UserController::class, 'storeAdmin'])->name('users.create-admin');
    Route::get('/{uuid}', [UserController::class, 'get'])->name('users.get');
    Route::put('/{uuid}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/{uuid}', [UserController::class, 'delete'])->name('users.delete');
});

Route::get('/test', function () {
    return User::first()->uuid;
});
