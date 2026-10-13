<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CafeController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()->toISOString()]));

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth');
Route::post('auth/change-password', [AuthController::class, 'changePassword'])->middleware('auth');

Route::get('cafes/me', [CafeController::class, 'getMyCafe'])->middleware('auth');
Route::put('cafes/me', [CafeController::class, 'updateMyCafe'])->middleware('auth');

Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('cafes', [CafeController::class, 'index']);
    Route::post('cafes', [CafeController::class, 'store']);
    Route::get('cafes/{cafe}', [CafeController::class, 'show']);
    Route::put('cafes/{cafe}', [CafeController::class, 'update']);
    Route::delete('cafes/{cafe}', [CafeController::class, 'destroy']);

    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
});

Route::middleware(['auth', 'role:super_admin,cafe_admin'])->prefix('cafes/{cafe}')->group(function () {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/reorder', [CategoryController::class, 'reorder']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('dishes', [DishController::class, 'index']);
    Route::post('dishes', [DishController::class, 'store']);
    Route::put('dishes/reorder', [DishController::class, 'reorder']);
    Route::get('dishes/{dish}', [DishController::class, 'show']);
    Route::put('dishes/{dish}', [DishController::class, 'update']);
    Route::delete('dishes/{dish}', [DishController::class, 'destroy']);
});

Route::post('upload', [UploadController::class, 'store'])
    ->middleware(['auth', 'role:super_admin,cafe_admin']);

Route::get('menu/{cafeSlug}', [MenuController::class, 'getMenu']);