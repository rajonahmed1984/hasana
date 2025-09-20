<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SurahController;

Route::get('/hasana/surahs', [SurahController::class, 'index'])->name('api.hasana.surahs.index');
