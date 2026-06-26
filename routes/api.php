<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

// Auth (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Sites
    Route::apiResource('sites', SiteController::class);
    Route::post('/sites/{site}/check', [SiteController::class, 'checkNow']);

    // Check logs
    Route::get('/sites/{site}/logs', [CheckLogController::class, 'index']);
});
