<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AyahController;
use App\Http\Controllers\Admin\SurahController;
use App\Http\Controllers\Frontend\HasanaController;

Route::get('/', [HasanaController::class, 'home'])->name('hasana.home');
Route::get('/surah/{surah}', [HasanaController::class, 'surah'])->name('hasana.surah');
Route::get('/quran', [HasanaController::class, 'quran'])->name('hasana.quran');

Route::get('/clear-cache', function () {
    Artisan::call('optimize');
    Artisan::call('view:clear');
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');

    return 'ok';
});

Auth::routes(['register' => false]);

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.surahs.index');
    })->name('dashboard');

    Route::resource('surahs', SurahController::class);
    Route::resource('surahs.ayahs', AyahController::class)->except(['show']);
});
