<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AyahController;
use App\Http\Controllers\Admin\SurahController;
use App\Http\Controllers\Admin\HadithController;
use App\Http\Controllers\Admin\DuaController;
use App\Http\Controllers\Admin\HadithCategoryController;
use App\Http\Controllers\Admin\DuaCategoryController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AppVersionController as ApiAppVersionController;
use App\Http\Controllers\Api\SurahController as ApiSurahController;
use App\Http\Controllers\Api\HadithController as ApiHadithController;
use App\Http\Controllers\Api\DuaController as ApiDuaController;
use App\Http\Controllers\Api\NotificationController as ApiNotificationController;
use App\Http\Controllers\Api\OfflineController as ApiOfflineController;
use App\Http\Controllers\Api\StudyController as ApiStudyController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Frontend\HasanaController;

Route::prefix('api')->name('api.')->middleware(['throttle:60,1'])->group(function () {
    Route::post('/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');
    Route::post('/notifications/register-token', [ApiNotificationController::class, 'registerToken'])->name('notifications.register');
    Route::get('/notifications/prayer-schedule', [ApiNotificationController::class, 'getPrayerSchedule'])->name('notifications.schedule');
    Route::get('/notifications/daily-ayah', [ApiNotificationController::class, 'getDailyAyah'])->name('notifications.daily_ayah');
    Route::get('/surahs', [ApiSurahController::class, 'index'])->name('hasana.surahs.index');
    Route::get('/surahs/{surah:slug}', [ApiSurahController::class, 'show'])->name('hasana.surahs.show');
    Route::get('/hadith/categories', [ApiHadithController::class, 'categories'])->name('hasana.hadiths.categories');
    Route::get('/hadiths', [ApiHadithController::class, 'index'])->name('hasana.hadiths.index');
    Route::get('/dua/categories', [ApiDuaController::class, 'categories'])->name('hasana.duas.categories');
    Route::get('/duas', [ApiDuaController::class, 'index'])->name('hasana.duas.index');
    Route::get('/app/version', [ApiAppVersionController::class, 'show'])->name('app.version');
    Route::get('/explore/topics', [ApiStudyController::class, 'topics'])->name('explore.topics');
    Route::get('/explore', [ApiStudyController::class, 'explore'])->middleware('throttle:20,1')->name('explore');
    Route::get('/quran/words/{surah}/{ayah}', [ApiStudyController::class, 'words'])->whereNumber(['surah', 'ayah'])->name('quran.words');
    Route::get('/quiz', [ApiStudyController::class, 'quiz'])->name('quiz');
});

// Offline data packs (large, one request each) — separate limit so a full download doesn't hit the API limit
Route::prefix('api/offline')->name('api.offline.')->middleware(['throttle:40,1'])->group(function () {
    Route::get('/quran', [ApiOfflineController::class, 'quran'])->name('quran');
    Route::get('/hadiths/{category}', [ApiOfflineController::class, 'hadiths'])->name('hadiths');
    Route::get('/duas', [ApiOfflineController::class, 'duas'])->name('duas');
});
Route::view('/', 'spa')->name('hasana.home');
Route::view('/quran', 'spa')->name('hasana.quran');
Route::get('/surah/{surah:slug}', fn() => view('spa'))->name('hasana.surah');
Route::view('/hadith', 'spa')->name('hasana.hadiths');
Route::view('/duas', 'spa')->name('hasana.duas');
Route::view('/umrah', 'spa')->name('hasana.umrah.short');
Route::view('/umrah-guide', 'spa')->name('hasana.umrah');
Route::view('/bookmarks', 'spa')->name('hasana.bookmarks');
Route::get('/bookmarks/data', [HasanaController::class, 'bookmarkData'])->name('hasana.bookmarks.data');
Route::view('/settings', 'spa')->name('hasana.settings');
Route::view('/about', 'spa')->name('hasana.about');
Route::view('/explore', 'spa')->name('hasana.explore');
Route::get('/share', [HasanaController::class, 'share'])->name('hasana.share');

// Admin login routes with rate limiting
Route::middleware(['throttle:5,1'])->group(function () {
    Route::get('/admin/login', [LoginController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [LoginController::class, 'login'])->name('admin.login.attempt');
});
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Protect clear-cache route - admin only
Route::middleware('auth')->get('/clear-cache', function () {
    Artisan::call('optimize');
    Artisan::call('view:clear');
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');

    return 'ok';
});

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/change-password', [ProfileController::class, 'editPassword'])->name('profile.change-password');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');

    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
    
    Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
    Route::resource('surahs', SurahController::class);
    Route::resource('hadiths', HadithController::class);
    Route::resource('duas', DuaController::class);
    Route::resource('hadith-categories', HadithCategoryController::class)->except(['show']);
    Route::resource('dua-categories', DuaCategoryController::class)->except(['show']);
    Route::resource('surahs.ayahs', AyahController::class)->except(['show']);

    // Catch-all fallback for Admin SPA routes
    Route::get('/{any}', fn() => view('admin.spa'))->where('any', '.*')->name('spa');
});










