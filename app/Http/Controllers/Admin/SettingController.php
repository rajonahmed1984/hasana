<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = [
            'site_name' => Setting::get('site_name', 'Hasana'),
            'logo' => Setting::get('logo', 'resources/images/hasana/logo.svg'),
        ];

        return view('admin.settings.index', compact('settings'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'site_name' => 'nullable|string|max:255',
            'logo' => 'nullable|file|mimetypes:image/svg+xml,image/png,image/jpeg|mimes:svg,png,jpg,jpeg|max:2048',
        ]);

        if ($request->filled('site_name')) {
            Setting::set('site_name', $request->site_name);
        }

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $filename = 'logo.' . $logo->getClientOriginalExtension();
            // Store in storage/app/public/logo/
            $path = Storage::disk('public')->putFileAs('logo', $logo, $filename);
            $publicPath = 'storage/' . $path;
            Setting::set('logo', $publicPath);
        }

        return redirect()->route('admin.settings.index')
            ->with('success', 'Settings updated successfully!');
    }
}
