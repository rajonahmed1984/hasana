<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers as CN;
use App\Http\Controllers\Admin\AyahController as AdminAyahController;
use App\Http\Controllers\Admin\SurahController as AdminSurahController;
use App\Http\Controllers\Hasana\HasanaController;



Route::get('/', function () {
    return view('welcome');
});

Route::prefix('hasana')->name('hasana.')->group(function () {
    Route::get('/', [HasanaController::class, 'home'])->name('home');
    Route::get('/surah/{surah}', [HasanaController::class, 'surah'])->name('surah');
});

Route::get('/clear-cache', function(){
    Artisan::call('optimize'); 
    Artisan::call('view:clear'); 
    Artisan::call('cache:clear'); 
    Artisan::call('config:clear'); 
    Artisan::call('config:cache'); 
    Artisan::call('route:clear'); 
     
     dd('ok');
});

  
Auth::routes();
  
  
Route::group(['middleware' => ['auth']], function() {
    Route::get('/dashboard', [CN\HomeController::class, 'dashboard'])->name('dashboard');
    Route::resource('roles', CN\RoleController::class);
    Route::resource('permissions', CN\PermissionController::class);
    Route::resource('user', CN\UserController::class,['names' => 'users']);
    Route::resource('brand', CN\BrandController::class,['names' => 'brands']);
    Route::resource('unit', CN\UnitController::class,['names' => 'units']);
    Route::resource('category', CN\CategoryController::class,['names' => 'categories']);
    Route::resource('product', CN\ProductController::class,['names' => 'products']);
    Route::resource('pos', CN\PosController::class);
    Route::resource('sells', CN\SellController::class);
    Route::resource('purchases', CN\PurchaseController::class);
    Route::resource('setting', CN\SettingController::class,['names' => 'settings']);
    Route::resource('locations', CN\LocationController::class);
    Route::resource('contact', CN\ContactController::class,['names' => 'contacts']); 
    Route::resource('accounts', CN\AccountController::class); 
    Route::resource('discounts', CN\DiscountController::class); 
    Route::resource('reward-settings', CN\RewardSettingController::class); 

    Route::get('/pos-product', [CN\PosController::class, 'getPosProduct'])->name('getPosProduct');
    Route::get('/sell-product', [CN\PosController::class, 'getSellProduct'])->name('getSellProduct');
    Route::get('/sell-product-entry', [CN\PosController::class, 'sellProductEntry'])->name('sellProductEntry');
    Route::get('/sell-print/{id}', [CN\SellController::class, 'sellPrint'])->name('sellPrint');


    Route::get('/category-status', [CN\CategoryController::class, 'categoryStatus'])->name('categoryStatus');
    Route::get('/brand-status', [CN\BrandController::class, 'brandStatus'])->name('brandStatus');

    Route::get('/purchase-product', [CN\PurchaseController::class, 'getPurchaseProduct'])->name('getPurchaseProduct');
    Route::get('/purchase-entry-product', [CN\PurchaseController::class, 'purchaseProductEntry'])->name('purchaseProductEntry');

    Route::get('lang', [CN\SettingController::class, 'change'])->name("change.lang");
    
    Route::controller(CN\UserController::class)->group(function(){
        
        Route::get('/user-profile','userProfile')->name('userProfile');
        Route::post('/user-profile-update','userProfileUpdate')->name('userProfileUpdate');
        Route::post('/user-password-update','userPasswordUpdate')->name('userPasswordUpdate');
        
    });

    Route::controller(CN\ContactController::class)->group(function(){
        
        Route::get('/get-customers','getCustomer')->name('getCustomer');
        Route::get('/customer-search','customerSearch')->name('customer.search');
        Route::get('/customer-entry','customerEntry')->name('customer.entry');

        
    });

    Route::controller(CN\AccountController::class)->group(function(){
        
        Route::get('/accounting-hub','accountingHub')->name('accountingHub');
        Route::get('/journal','journal')->name('journal');
        Route::get('/ledger','ledger')->name('ledger');
        Route::get('/chart','chart')->name('chart');
        Route::get('/trail-balance','trailBalance')->name('trailBalance');

        
    });

    


    Route::controller(CN\ReportController::class)->group(function(){
        Route::group(['prefix' => 'reports','as'=>'reports.'], function() {
            Route::get('/product-stock','productStock')->name('productStock');
            Route::get('/hub','hub')->name('hub');
            Route::get('/sells','sells')->name('sells');
            Route::get('/due-sells','dueSells')->name('dueSells');
            Route::get('/profit-loss','profitLoss')->name('profitLoss');
            Route::get('/expire-products','expireProducts')->name('expireProducts');


        });
        
    });

    Route::controller(CN\ProductController::class)->group(function(){
  
        Route::get('/product-update','productUpdate')->name('productUpdate');
        Route::get('/product-import','productImport')->name('productImport');
        Route::post('/product-import-store','productImportStore')->name('productImportStore');
        
    });


    Route::controller(CN\UserController::class)->group(function(){
  
        Route::post('/vandor-update','vandorUpdate')->name('vandorUpdate');
        
    });

    Route::prefix('admin/hasana')->name('admin.hasana.')->group(function () {
        Route::resource('surahs', AdminSurahController::class);
        Route::resource('surahs.ayahs', AdminAyahController::class)->except(['show']);
    });

});

