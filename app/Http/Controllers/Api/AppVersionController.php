<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

/**
 * Latest Android app version, set from Admin → Settings. The app compares it with its own
 * build number and asks the user to update (or forces it below the minimum build).
 */
class AppVersionController extends Controller
{
    public const DEFAULT_STORE_URL = 'https://play.google.com/store/apps/details?id=com.hasanaa.app';

    public function show(): JsonResponse
    {
        return response()->json([
            'latest_version' => Setting::get('app_latest_version', '1.0'),
            'latest_build' => (int) Setting::get('app_latest_build', 1),
            'min_build' => (int) Setting::get('app_min_build', 1),
            'message' => Setting::get('app_update_message') ?: null,
            'store_url' => Setting::get('app_store_url') ?: self::DEFAULT_STORE_URL,
        ]);
    }
}
