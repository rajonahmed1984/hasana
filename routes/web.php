<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Frontend\HasanaController;
use App\Http\Controllers\Admin\SurahController as AdminSurahController;
use App\Http\Controllers\Admin\AyahController as AdminAyahController;

Route::get('/', function () {
    return redirect()->route('hasana.home');
});

Route::prefix('hasana')->name('hasana.')->group(function () {
    Route::get('/', [HasanaController::class, 'home'])->name('home');
    Route::get('/surah/{surah}', [HasanaController::class, 'surah'])->name('surah');
});

Route::get('/clear-cache', function () {
    Artisan::call('optimize');
    Artisan::call('view:clear');
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');

    return 'ok';
});

Auth::routes();

Route::middleware('auth')->group(function () {
    Route::prefix('admin/hasana')->name('admin.hasana.')->group(function () {
        Route::resource('surahs', AdminSurahController::class);
        Route::resource('surahs.ayahs', AdminAyahController::class)->except(['show']);
    });
});
