<?php

use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::get('/images', [FileController::class, 'show']);
