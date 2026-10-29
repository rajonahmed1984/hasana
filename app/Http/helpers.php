<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Vite;

// Helper functions reserved for Hasana-specific utilities.

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
        if ($path === '') {
            return null;
        }

        // 1. Direct check in public/
        if (file_exists(public_path($path))) {
            return asset($path) . '?v=' . filemtime(public_path($path));
        }

        // 2. Fallback to public/uploads/ if storage symlink is missing on cPanel
        if (str_starts_with($path, 'storage/')) {
            $uploadsPath = 'uploads/' . substr($path, 8);
            if (file_exists(public_path($uploadsPath))) {
                return asset($uploadsPath) . '?v=' . filemtime(public_path($uploadsPath));
            }

            // 3. Auto-mirror from storage/app/public/ to public/uploads/
            $realStoragePath = storage_path('app/public/' . substr($path, 8));
            if (file_exists($realStoragePath)) {
                $destDir = dirname(public_path($uploadsPath));
                if (!is_dir($destDir)) {
                    @mkdir($destDir, 0755, true);
                }
                @copy($realStoragePath, public_path($uploadsPath));
                if (file_exists(public_path($uploadsPath))) {
                    return asset($uploadsPath) . '?v=' . filemtime(public_path($uploadsPath));
                }
            }
        }

        return null;
    }
}

if (!function_exists('brand_assets')) {
    // Every brand image with its fallback: dark falls back to light, app falls back to website
    function brand_assets(): array
    {
        $logo = brand_asset_url('logo');
        $logoDark = brand_asset_url('logo_dark') ?? $logo;
        $appLogo = brand_asset_url('app_logo') ?? $logo ?? asset('images/hasana-app-logo.png');

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
        $brand = brand_assets();
        if (!empty($brand['logo'])) {
            return $brand['logo'];
        }
        if (file_exists(public_path('images/hasana-app-logo.png'))) {
            return asset('images/hasana-app-logo.png') . '?v=' . filemtime(public_path('images/hasana-app-logo.png'));
        }
        if (file_exists(public_path('images/logo.svg'))) {
            return asset('images/logo.svg') . '?v=' . filemtime(public_path('images/logo.svg'));
        }
        return asset('favicon.png');
    }
}
