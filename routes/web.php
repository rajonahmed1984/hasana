<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AyahController;
use App\Http\Controllers\Admin\SurahController;
use App\Http\Controllers\Admin\HadithController;
use App\Http\Controllers\Admin\DuaController;
use App\Http\Controllers\Admin\HadithCategoryController;
use App\Http\Controllers\Admin\DuaCategoryController;
use App\Http\Controllers\Api\SurahController as ApiSurahController;
use App\Http\Controllers\Api\HadithController as ApiHadithController;
use App\Http\Controllers\Api\DuaController as ApiDuaController;
use App\Http\Controllers\Frontend\HasanaController;

Route::prefix('api')->name('api.')->group(function () {
    Route::get('/hasana/surahs', [ApiSurahController::class, 'index'])->name('hasana.surahs.index');
    Route::get('/hasana/surahs/{surah}', [ApiSurahController::class, 'show'])->name('hasana.surahs.show');
    Route::get('/hasana/hadith/categories', [ApiHadithController::class, 'categories'])->name('hasana.hadiths.categories');
    Route::get('/hasana/hadiths', [ApiHadithController::class, 'index'])->name('hasana.hadiths.index');
    Route::get('/hasana/dua/categories', [ApiDuaController::class, 'categories'])->name('hasana.duas.categories');
    Route::get('/hasana/duas', [ApiDuaController::class, 'index'])->name('hasana.duas.index');
});
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
    Route::resource('hadith-categories', HadithCategoryController::class)->except(['show']);
    Route::resource('dua-categories', DuaCategoryController::class)->except(['show']);
    Route::resource('surahs.ayahs', AyahController::class)->except(['show']);
});










