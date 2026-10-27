<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceToken;
use App\Models\Ayah;
use App\Models\Surah;
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
            'timezone' => 'nullable|string|max:50',
        ]);

        try {
            $device = DeviceToken::updateOrCreate(
                ['token' => $validated['token']],
                [
                    'platform' => $validated['platform'] ?? 'web',
                    'user_agent' => $request->userAgent(),
                    'ip_address' => $request->ip(),
                    'latitude' => $validated['latitude'] ?? null,
                    'longitude' => $validated['longitude'] ?? null,
                    'city_name' => $validated['city_name'] ?? null,
                    'timezone' => $validated['timezone'] ?? null,
                    'is_active' => true,
                    'last_active_at' => now(),
                ]
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
     * Get Daily Ayah (আজকের দিনের আয়াত)
     */
    public function getDailyAyah(): JsonResponse
    {
        $today = now()->format('Y-m-d');
        $dayOfYear = (int) now()->format('z');

        // Selection of well-known spiritual, inspiring Quranic verses [surah_number, ayah_number]
        $featuredAyahs = [
            [1, 1], [1, 2], [1, 5], [1, 6], // Al-Fatihah
            [2, 152], [2, 186], [2, 255], [2, 286], // Al-Baqarah (including Ayat al-Kursi)
            [3, 139], [3, 159], [3, 200], // Ali 'Imran
            [4, 135], // An-Nisa
            [9, 128], [9, 129], // At-Tawbah
            [13, 28], // Ar-Ra'd
            [14, 7],  // Ibrahim
            [17, 24], [17, 82], // Al-Isra
            [21, 87], // Al-Anbiya (Dua Yunus)
            [24, 35], // An-Nur
            [25, 74], // Al-Furqan
            [39, 53], // Az-Zumar
            [55, 13], [55, 60], // Ar-Rahman
            [59, 22], [59, 23], [59, 24], // Al-Hashr
            [65, 2], [65, 3], // At-Talaq
            [93, 3], [93, 4], [93, 5], // Ad-Duha
            [94, 5], [94, 6], // Ash-Sharh
            [103, 1], [103, 2], [103, 3], // Al-'Asr
            [112, 1], [112, 2], [112, 3], [112, 4], // Al-Ikhlas
        ];

        $picked = $featuredAyahs[$dayOfYear % count($featuredAyahs)];

        $surah = Surah::where('number', $picked[0])->first();
        $ayah = null;

        if ($surah) {
            $ayah = Ayah::where('surah_id', $surah->id)
                ->where('number', $picked[1])
                ->where('is_active', true)
                ->first();
        }

        if (!$ayah) {
            $ayah = Ayah::with('surah')->where('is_active', true)->first();
            $surah = $ayah?->surah;
        }

        $surahNameBn = $surah?->meta['name_bn'] ?? $surah?->name_en ?? 'সূরা';

        return response()->json([
            'success' => true,
            'date' => $today,
            'ayah' => [
                'id' => $ayah?->id,
                'surah_number' => $surah?->number,
                'surah_name' => $surahNameBn,
                'surah_name_ar' => $surah?->name_ar,
                'surah_slug' => $surah?->slug,
                'ayah_number' => $ayah?->number,
                'text_ar' => $ayah?->text_ar,
                'text_bn' => $ayah?->text_bn,
                'transliteration' => $ayah?->transliteration,
                'reference' => "সূরা {$surahNameBn}, {$surah?->number}:{$ayah?->number}",
                'deep_link' => "/surah/{$surah?->slug}?ayah={$ayah?->number}",
            ],
        ]);
    }
}
