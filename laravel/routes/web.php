<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'landing']);
Route::get('/portal', [PageController::class, 'portal'])->middleware('guest');
Route::get('/menu/{cafeSlug}', [PageController::class, 'menu']);

Route::middleware('auth')->group(function () {
    Route::get('/admin', [PageController::class, 'dashboard']);
    Route::get('/admin/cafes', [PageController::class, 'cafes']);
    Route::get('/admin/cafe', [PageController::class, 'cafe']);
    Route::get('/admin/categories', [PageController::class, 'categories']);
    Route::get('/admin/dishes', [PageController::class, 'dishes']);
    Route::get('/admin/users', [PageController::class, 'users']);
});