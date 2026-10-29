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

if (!function_exists('brand_asset_url')) {
    // Versioned URL of an image uploaded from Admin → Settings, or null when none is set
    function brand_asset_url(string $key): ?string
    {
        $path = ltrim((string) setting($key), '/\\');
        if ($path === '' || !file_exists(public_path($path))) {
            return null;
        }
        return asset($path) . '?v=' . filemtime(public_path($path));
    }
}

if (!function_exists('brand_assets')) {
    // Every brand image with its fallback: dark falls back to light, app falls back to website
    function brand_assets(): array
    {
        $logo = brand_asset_url('logo');
        $logoDark = brand_asset_url('logo_dark') ?? $logo;
        $appLogo = brand_asset_url('app_logo') ?? $logo;

        return [
            'logo' => $logo,
            'logo_dark' => $logoDark,
            'app_logo' => $appLogo,
            'app_logo_dark' => brand_asset_url('app_logo_dark') ?? brand_asset_url('logo_dark') ?? $appLogo,
            'favicon' => brand_asset_url('favicon') ?? asset('images/app-icon.svg'),
            'og_image' => brand_asset_url('og_image') ?? asset('images/og-share-hasana.jpg'),
        ];
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
