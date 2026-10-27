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
            if (str_starts_with($logo, 'http://') || str_starts_with($logo, 'https://')) {
                return $logo;
            }
            $cleanPath = ltrim($logo, '/\\');
            if (file_exists(public_path($cleanPath))) {
                return asset($cleanPath) . '?v=' . filemtime(public_path($cleanPath));
            }
        }
        if (file_exists(public_path('images/logo.svg'))) {
            return asset('images/logo.svg') . '?v=' . filemtime(public_path('images/logo.svg'));
        }
        return asset('favicon.png');
    }
}
