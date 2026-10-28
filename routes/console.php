<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Prayer time & daily ayah push notifications (needs a server cron: * * * * * php artisan schedule:run)
Schedule::command('notifications:dispatch')->everyMinute()->withoutOverlapping()->runInBackground();
