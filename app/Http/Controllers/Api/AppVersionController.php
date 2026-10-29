<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Latest Android app version. Checks Google Play Store automatically and also respects
 * Admin → Settings overrides.
 */
class AppVersionController extends Controller
{
    public const DEFAULT_STORE_URL = 'https://play.google.com/store/apps/details?id=com.hasanaa.app';

    public function show(): JsonResponse
    {
        $dbVersion = (string) Setting::get('app_latest_version', '1.3');
        $dbBuild = (int) Setting::get('app_latest_build', 4);
        $minBuild = (int) Setting::get('app_min_build', 1);
        $message = Setting::get('app_update_message') ?: null;
        $storeUrl = Setting::get('app_store_url') ?: self::DEFAULT_STORE_URL;

        // Auto-detect latest version from Google Play Store (cached for 30 minutes)
        $playStoreVersion = Cache::remember('play_store_latest_version', 1800, function () {
            try {
                $response = Http::timeout(6)
                    ->withOptions(['verify' => false])
                    ->withHeaders([
                        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    ])
                    ->get('https://play.google.com/store/apps/details?id=com.hasanaa.app&hl=en');

                if ($response->successful()) {
                    $html = $response->body();
                    if (preg_match('/\[\[\["([0-9]+\.[0-9]+(?:\.[0-9]+)*)"\]/', $html, $matches)) {
                        return $matches[1];
                    }
                }
            } catch (\Throwable $e) {
                // Silently fall back
            }
            return null;
        });

        // Use whichever version is newer: Play Store or Admin settings
        $latestVersion = $dbVersion;
        if ($playStoreVersion && version_compare($playStoreVersion, $latestVersion, '>=')) {
            $latestVersion = $playStoreVersion;
        }

        return response()->json([
            'latest_version' => $latestVersion,
            'latest_build' => $dbBuild,
            'min_build' => $minBuild,
            'play_store_version' => $playStoreVersion,
            'message' => $message,
            'store_url' => $storeUrl,
        ]);
    }
}
