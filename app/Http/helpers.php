<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Vite;

// Helper functions reserved for future Hasana-specific utilities.

if (!function_exists('setting')) {
    function setting(string $key, $default = null)
    {
        return Setting::get($key, $default);
    }
}

if (!function_exists('logo_url')) {
    function logo_url(): string
    {
        $logo = setting('logo');
        if (!empty($logo)) {
            return asset($logo);
        }
        return Vite::asset('resources/images/hasana/logo.svg');
    }
}
