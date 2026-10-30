<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceToken;
use App\Services\DailyAyah;
use App\Services\IslamicDay;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Register or update a device FCM token.
     */
    public function registerToken(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string|max:500',
            'platform' => 'nullable|string|in:web,android,ios',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'city_name' => 'nullable|string|max:150',
            'timezone' => 'nullable|timezone',
            'prayer_enabled' => 'nullable|boolean',
            'ayah_enabled' => 'nullable|boolean',
            'prayer_prefs' => 'nullable|array',
            'prayer_prefs.*' => 'boolean',
        ]);

        try {
            // Only overwrite fields the client actually sent, so a partial sync keeps earlier values
            $attributes = collect($validated)
                ->only(['latitude', 'longitude', 'city_name', 'timezone', 'prayer_enabled', 'ayah_enabled', 'prayer_prefs'])
                ->all();

            $device = DeviceToken::updateOrCreate(
                ['token' => $validated['token']],
                array_merge($attributes, [
                    'platform' => $validated['platform'] ?? 'web',
                    'user_agent' => $request->userAgent(),
                    'ip_address' => $request->ip(),
                    'is_active' => true,
                    'last_active_at' => now(),
                ])
            );

            return response()->json([
                'success' => true,
                'message' => 'ডিভাইস ও লোকেশন নোটিফিকেশন সফলভাবে নিবন্ধিত হয়েছে।',
                'id' => $device->id,
                'city' => $device->city_name,
            ]);
        } catch (\Throwable $e) {
            Log::error('FCM Token Registration Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'টোকেন সংরক্ষণ করতে সমস্যা হয়েছে।',
            ], 500);
        }
    }

    /**
     * Get prayer notification schedule info.
     */
    public function getPrayerSchedule(): JsonResponse
    {
        $prayers = [
            [
                'id' => 'fajr',
                'name' => 'ফজর',
                'name_en' => 'Fajr',
                'approx_time' => '05:05',
                'message' => 'আস-সালাতু খাইরুম মিনান নাওম — ফজরের নামাজের সময় হয়েছে।',
            ],
            [
                'id' => 'dhuhr',
                'name' => 'যোহর',
                'name_en' => 'Dhuhr',
                'approx_time' => '12:05',
                'message' => 'যোহরের নামাজের সময় হয়েছে। আসুন নামাজ আদায় করি।',
            ],
            [
                'id' => 'asr',
                'name' => 'আসর',
                'name_en' => 'Asr',
                'approx_time' => '15:40',
                'message' => 'আসরের নামাজের সময় হয়েছে। আসুন নামাজ আদায় করি।',
            ],
            [
                'id' => 'maghrib',
                'name' => 'মাগরিব',
                'name_en' => 'Maghrib',
                'approx_time' => '17:15',
                'message' => 'মাগরিবের নামাজের সময় হয়েছে। আসুন নামাজ আদায় করি।',
            ],
            [
                'id' => 'isha',
                'name' => 'ইশা',
                'name_en' => 'Isha',
                'approx_time' => '18:25',
                'message' => 'ইশার নামাজের সময় হয়েছে। আসুন নামাজ আদায় করি।',
            ],
        ];

        return response()->json([
            'success' => true,
            'firebase_project' => 'apptimatic-f509c',
            'prayers' => $prayers,
        ]);
    }

    /**
     * Get Daily Ayah (আজকের দিনের আয়াত). Accepts an optional ?date=YYYY-MM-DD
     * so the native app can schedule the next few days in advance.
     */
    public function getDailyAyah(Request $request): JsonResponse
    {
        $date = now();
        if ($request->filled('date')) {
            try {
                $date = Carbon::createFromFormat('Y-m-d', (string) $request->query('date'))->startOfDay();
            } catch (\Throwable) {
                // Invalid date: fall back to today
            }
        }

        return response()->json([
            'success' => true,
            'date' => $date->format('Y-m-d'),
            'ayah' => DailyAyah::forDate($date),
            // Islamic day: occasion, hadith of the day and today's amal
            ...IslamicDay::forDate($date),
        ]);
    }
}
