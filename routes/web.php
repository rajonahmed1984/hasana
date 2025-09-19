<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AyahController;
use App\Http\Controllers\Admin\SurahController;
use App\Http\Controllers\Admin\HadithController;
use App\Http\Controllers\Admin\DuaController;
use App\Http\Controllers\Frontend\HasanaController;

Route::get('/', [HasanaController::class, 'home'])->name('hasana.home');
Route::get('/bookmarks', [HasanaController::class, 'bookmarks'])->name('hasana.bookmarks');
Route::get('/bookmarks/data', [HasanaController::class, 'bookmarkData'])->name('hasana.bookmarks.data');
Route::get('/settings', [HasanaController::class, 'settings'])->name('hasana.settings');
Route::get('/about', [HasanaController::class, 'about'])->name('hasana.about');
Route::get('/share', [HasanaController::class, 'share'])->name('hasana.share');
Route::get('/surah/{surah}', [HasanaController::class, 'surah'])->name('hasana.surah');
Route::get('/quran', [HasanaController::class, 'quran'])->name('hasana.quran');
Route::get('/hadith', [HasanaController::class, 'hadiths'])->name('hasana.hadiths');
Route::get('/duas', [HasanaController::class, 'duas'])->name('hasana.duas');
Route::get('/umrah-guide', [HasanaController::class, 'umrah'])->name('hasana.umrah');

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
    Route::resource('hadiths', HadithController::class);
    Route::resource('duas', DuaController::class);
    Route::resource('surahs.ayahs', AyahController::class)->except(['show']);
});





