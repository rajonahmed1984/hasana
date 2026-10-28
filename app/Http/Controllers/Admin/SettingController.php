<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\AppVersionController;
use App\Models\Setting;
use App\Services\PushBroadcaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $settings = [
            'site_name' => Setting::get('site_name', 'Hasana'),
            'site_title_bn' => Setting::get('site_title_bn', 'হাসানা'),
            'site_tagline' => Setting::get('site_tagline', 'পবিত্র কুরআন, হাদিস ও দোয়া'),
            'developer_name' => Setting::get('developer_name', 'Apptimatic'),
            'logo' => Setting::get('logo', 'storage/logo/logo.svg'),
        ] + $this->appVersionSettings();

        if ($request->expectsJson()) {
            return response()->json([
                'settings' => $settings,
                'logo_url' => logo_url(),
                'server_info' => [
                    'php_version' => PHP_VERSION,
                    'laravel_version' => app()->version(),
                    'app_env' => config('app.env'),
                ]
            ]);
        }

        return view('admin.spa');
    }

    public function update(Request $request)
    {
        $request->validate([
            'site_name' => 'nullable|string|max:255',
            'site_title_bn' => 'nullable|string|max:255',
            'site_tagline' => 'nullable|string|max:500',
            'developer_name' => 'nullable|string|max:255',
            'logo' => 'nullable|file|mimes:svg,png,jpg,jpeg,webp|max:3072',
            'app_latest_version' => 'nullable|string|max:20',
            'app_latest_build' => 'nullable|integer|min:1',
            'app_min_build' => 'nullable|integer|min:1|lte:app_latest_build',
            'app_update_message' => 'nullable|string|max:500',
            'app_store_url' => 'nullable|url|max:255',
            'notify_app_update' => 'nullable|boolean',
        ], [
            'app_min_build.lte' => 'ন্যূনতম বিল্ড নম্বর সর্বশেষ বিল্ড নম্বরের চেয়ে বড় হতে পারবে না।',
            'logo.mimes' => 'লোগো ফাইলটি অবশ্যই SVG, PNG, JPG, JPEG বা WEBP ফরম্যাটের হতে হবে।',
            'logo.max' => 'লোগো ফাইলের সাইজ সর্বোচ্চ 3 মেগাবাইট হতে পারবে।',
        ]);

        if ($request->has('site_name')) {
            Setting::set('site_name', $request->site_name ?: 'Hasana');
        }

        if ($request->has('site_title_bn')) {
            Setting::set('site_title_bn', $request->site_title_bn ?: 'হাসানা');
        }

        if ($request->has('site_tagline')) {
            Setting::set('site_tagline', $request->site_tagline ?: 'পবিত্র কুরআন, হাদিস ও দোয়া');
        }

        if ($request->has('developer_name')) {
            Setting::set('developer_name', $request->developer_name ?: 'Apptimatic');
        }

        $previousBuild = (int) Setting::get('app_latest_build', 1);
        foreach (['app_latest_version', 'app_latest_build', 'app_min_build', 'app_update_message', 'app_store_url'] as $key) {
            if ($request->has($key)) {
                Setting::set($key, (string) $request->input($key, ''));
            }
        }

        // A new build was published: tell app users (push is sent after the response, so saving stays fast)
        $newBuild = (int) Setting::get('app_latest_build', 1);
        if ($request->boolean('notify_app_update') && $newBuild > $previousBuild) {
            $version = Setting::get('app_latest_version', '');
            $storeUrl = Setting::get('app_store_url') ?: AppVersionController::DEFAULT_STORE_URL;
            dispatch(fn () => PushBroadcaster::send(
                'হাসানা অ্যাপের নতুন ভার্সন এসেছে 🎉',
                trim("ভার্সন {$version} এখন Play Store-এ পাওয়া যাচ্ছে। নতুন সুবিধা পেতে আপডেট করুন।"),
                $storeUrl,
                'android'
            ))->afterResponse();
        }

        if ($request->boolean('remove_logo')) {
            Setting::set('logo', 'images/logo.svg');
        } elseif ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $extension = $logo->getClientOriginalExtension() ?: 'png';
            $filename = 'logo_' . time() . '.' . $extension;

            // 1. Ensure storage/app/public/logo directory exists
            $storageDir = storage_path('app/public/logo');
            if (!File::isDirectory($storageDir)) {
                File::makeDirectory($storageDir, 0755, true, true);
            }

            // 2. Save file to storage
            $path = Storage::disk('public')->putFileAs('logo', $logo, $filename);

            // 3. Mirror directly into public/storage/logo and public/uploads/logo as safe fallback
            $publicUploadsDir = public_path('uploads/logo');
            if (!File::isDirectory($publicUploadsDir)) {
                File::makeDirectory($publicUploadsDir, 0755, true, true);
            }
            File::copy(storage_path('app/public/' . $path), $publicUploadsDir . '/' . $filename);

            $publicPath = 'storage/' . $path;
            Setting::set('logo', $publicPath);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'সকল সেটিংস এবং ব্র্যান্ড লোগো সফলভাবে সংরক্ষণ করা হয়েছে!',
                'logo_url' => logo_url(),
                'settings' => [
                    'site_name' => Setting::get('site_name', 'Hasana'),
                    'site_title_bn' => Setting::get('site_title_bn', 'হাসানা'),
                    'site_tagline' => Setting::get('site_tagline', 'পবিত্র কুরআন, হাদিস ও দোয়া'),
                    'developer_name' => Setting::get('developer_name', 'Apptimatic'),
                    'logo' => Setting::get('logo', 'storage/logo/logo.svg'),
                ] + $this->appVersionSettings(),
            ]);
        }

        return redirect()->route('admin.settings.index')
            ->with('success', 'সকল সেটিংস এবং ব্র্যান্ড লোগো সফলভাবে সংরক্ষণ করা হয়েছে!');
    }

    private function appVersionSettings(): array
    {
        return [
            'app_latest_version' => Setting::get('app_latest_version', '1.0'),
            'app_latest_build' => (int) Setting::get('app_latest_build', 1),
            'app_min_build' => (int) Setting::get('app_min_build', 1),
            'app_update_message' => Setting::get('app_update_message', ''),
            'app_store_url' => Setting::get('app_store_url') ?: AppVersionController::DEFAULT_STORE_URL,
        ];
    }
}
