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
    // Images uploadable from Admin → Settings (see brand_assets() for how they fall back to each other)
    private const BRAND_KEYS = ['logo', 'logo_dark', 'app_logo', 'app_logo_dark', 'favicon', 'og_image'];

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
                'brand_assets' => brand_assets(),
                'brand_uploaded' => $this->brandUploaded(),
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
            'logo_dark' => 'nullable|file|mimes:svg,png,jpg,jpeg,webp|max:3072',
            'app_logo' => 'nullable|file|mimes:svg,png,jpg,jpeg,webp|max:3072',
            'app_logo_dark' => 'nullable|file|mimes:svg,png,jpg,jpeg,webp|max:3072',
            'favicon' => 'nullable|file|mimes:svg,png,ico,jpg,jpeg,webp|max:1024',
            'og_image' => 'nullable|file|mimes:png,jpg,jpeg,webp|max:5120',
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
            'logo_dark.mimes' => 'ডার্ক মোড লোগো অবশ্যই SVG, PNG, JPG বা WEBP হতে হবে।',
            'app_logo.mimes' => 'অ্যাপ লোগো অবশ্যই SVG, PNG, JPG বা WEBP হতে হবে।',
            'app_logo_dark.mimes' => 'অ্যাপের ডার্ক মোড লোগো অবশ্যই SVG, PNG, JPG বা WEBP হতে হবে।',
            'favicon.mimes' => 'ফেভিকন অবশ্যই ICO, SVG, PNG, JPG বা WEBP হতে হবে।',
            'favicon.max' => 'ফেভিকনের সাইজ সর্বোচ্চ 1 মেগাবাইট হতে পারবে।',
            'og_image.mimes' => 'OG ইমেজ অবশ্যই PNG, JPG বা WEBP হতে হবে।',
            'og_image.max' => 'OG ইমেজের সাইজ সর্বোচ্চ 5 মেগাবাইট হতে পারবে।',
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

        foreach (self::BRAND_KEYS as $key) {
            if ($request->boolean('remove_' . $key)) {
                Setting::set($key, '');
            } elseif ($request->hasFile($key)) {
                Setting::set($key, $this->storeBrandFile($request->file($key), $key));
            }
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'সকল সেটিংস এবং ব্র্যান্ড লোগো সফলভাবে সংরক্ষণ করা হয়েছে!',
                'logo_url' => logo_url(),
                'brand_assets' => brand_assets(),
                'brand_uploaded' => $this->brandUploaded(),
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

    private function storeBrandFile($file, string $key): string
    {
        $extension = $file->getClientOriginalExtension() ?: 'png';
        $filename = $key . '_' . time() . '.' . $extension;

        $storageDir = storage_path('app/public/logo');
        if (!File::isDirectory($storageDir)) {
            File::makeDirectory($storageDir, 0755, true, true);
        }
        $path = Storage::disk('public')->putFileAs('logo', $file, $filename);

        // Mirror into public/uploads/logo as a fallback when the storage symlink is missing
        $publicUploadsDir = public_path('uploads/logo');
        if (!File::isDirectory($publicUploadsDir)) {
            File::makeDirectory($publicUploadsDir, 0755, true, true);
        }
        File::copy(storage_path('app/public/' . $path), $publicUploadsDir . '/' . $filename);

        return 'storage/' . $path;
    }

    // Which brand images have their own upload (the rest show a fallback)
    private function brandUploaded(): array
    {
        return collect(self::BRAND_KEYS)->mapWithKeys(fn ($key) => [$key => brand_asset_url($key) !== null])->all();
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
