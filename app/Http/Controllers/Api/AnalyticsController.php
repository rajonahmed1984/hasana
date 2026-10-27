<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DuaCategory;
use App\Models\HadithCategory;
use App\Models\Surah;
use App\Models\VisitorLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|max:64',
            'path' => 'required|string|max:255',
            'page_type' => 'nullable|string|max:30',
            'item_id' => 'nullable|string|max:50',
            'item_name' => 'nullable|string|max:255',
            'duration_seconds' => 'nullable|integer|min:0|max:86400',
            'is_heartbeat' => 'nullable|boolean',
        ]);

        $path = $validated['path'];

        // Exclude admin panel visits from analytics
        if (str_starts_with($path, '/admin') || str_starts_with($path, '/clear-cache')) {
            return response()->json(['ignored' => true]);
        }

        $sessionId = $validated['session_id'];
        $durationSeconds = (int)($validated['duration_seconds'] ?? 15);
        $isHeartbeat = (bool)($validated['is_heartbeat'] ?? false);

        // If it's a heartbeat/update for current active session & path
        if ($isHeartbeat) {
            $recentLog = VisitorLog::where('session_id', $sessionId)
                ->where('path', $path)
                ->where('created_at', '>=', Carbon::now()->subMinutes(30))
                ->latest()
                ->first();

            if ($recentLog) {
                $recentLog->duration_seconds += $durationSeconds;
                $recentLog->save();
                return response()->json(['success' => true, 'updated' => true]);
            }
        }

        // Avoid duplicate initial entry if the user navigates or re-renders within 20 seconds
        $existingRecent = VisitorLog::where('session_id', $sessionId)
            ->where('path', $path)
            ->where('created_at', '>=', Carbon::now()->subSeconds(20))
            ->latest()
            ->first();

        if ($existingRecent) {
            $existingRecent->duration_seconds += 5;
            $existingRecent->save();
            return response()->json(['success' => true, 'updated' => true, 'id' => $existingRecent->id]);
        }

        // Resolve Page Type and Authentic Bengali Item Name from database
        $resolved = $this->resolveItemDetails($path, $validated['page_type'] ?? null, $validated['item_name'] ?? null);

        // Parse user agent
        $userAgent = $request->userAgent() ?? '';
        $deviceInfo = $this->parseUserAgent($userAgent);

        $log = VisitorLog::create([
            'session_id' => $sessionId,
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'device_type' => $deviceInfo['device_type'],
            'browser' => $deviceInfo['browser'],
            'platform' => $deviceInfo['platform'],
            'path' => $path,
            'page_type' => $resolved['page_type'],
            'item_id' => $resolved['item_id'] ?? $validated['item_id'] ?? null,
            'item_name' => $resolved['item_name'],
            'duration_seconds' => $durationSeconds,
            'visited_at' => Carbon::now(),
        ]);

        return response()->json(['success' => true, 'id' => $log->id]);
    }

    private function resolveItemDetails(string $path, ?string $pageType, ?string $itemName): array
    {
        $cleanPath = parse_url($path, PHP_URL_PATH) ?? $path;
        parse_str(parse_url($path, PHP_URL_QUERY) ?? '', $queryParams);

        // Surah
        if (str_starts_with($cleanPath, '/surah/')) {
            $slug = basename($cleanPath);
            $surah = Surah::where('slug', $slug)->orWhere('number', $slug)->first();
            if ($surah) {
                return [
                    'page_type' => 'surah',
                    'item_id' => (string)$surah->number,
                    'item_name' => "সূরা {$surah->name_bn} ({$surah->name_en})",
                ];
            }
            return [
                'page_type' => 'surah',
                'item_id' => $slug,
                'item_name' => "সূরা ({$slug})",
            ];
        }

        // Hadith
        if (str_starts_with($cleanPath, '/hadith')) {
            $cat = $queryParams['cat'] ?? null;
            if ($cat) {
                $category = HadithCategory::where('slug', $cat)->first();
                if ($category) {
                    return [
                        'page_type' => 'hadith',
                        'item_id' => $category->slug,
                        'item_name' => "সহীহ হাদিস: {$category->name_bn}",
                    ];
                }
                return [
                    'page_type' => 'hadith',
                    'item_id' => $cat,
                    'item_name' => "সহীহ হাদিস: {$cat}",
                ];
            }
            return [
                'page_type' => 'hadith',
                'item_id' => null,
                'item_name' => 'সহীহ হাদিস সংকলন',
            ];
        }

        // Duas
        if (str_starts_with($cleanPath, '/duas')) {
            $cat = $queryParams['cat'] ?? null;
            if ($cat) {
                $category = DuaCategory::where('slug', $cat)->first();
                if ($category) {
                    return [
                        'page_type' => 'dua',
                        'item_id' => $category->slug,
                        'item_name' => "মাসনুন দোয়া: {$category->name_bn}",
                    ];
                }
                return [
                    'page_type' => 'dua',
                    'item_id' => $cat,
                    'item_name' => "মাসনুন দোয়া: {$cat}",
                ];
            }
            return [
                'page_type' => 'dua',
                'item_id' => null,
                'item_name' => 'মাসনুন দোয়া ও জিকির',
            ];
        }

        // Umrah
        if (str_starts_with($cleanPath, '/umrah')) {
            return [
                'page_type' => 'umrah',
                'item_id' => null,
                'item_name' => 'উমরাহ পূর্ণাঙ্গ নির্দেশিকা',
            ];
        }

        // Home
        if ($cleanPath === '/' || empty($cleanPath)) {
            return [
                'page_type' => 'home',
                'item_id' => null,
                'item_name' => 'হাসানা হোমপেজ',
            ];
        }

        // Quran index
        if ($cleanPath === '/quran') {
            return [
                'page_type' => 'quran',
                'item_id' => null,
                'item_name' => 'পবিত্র কুরআন সূরা সূচিপত্র',
            ];
        }

        // Bookmarks
        if ($cleanPath === '/bookmarks') {
            return [
                'page_type' => 'bookmarks',
                'item_id' => null,
                'item_name' => 'সংরক্ষিত বুকমার্কস',
            ];
        }

        // Settings
        if ($cleanPath === '/settings') {
            return [
                'page_type' => 'settings',
                'item_id' => null,
                'item_name' => 'সেটিংস পেজ',
            ];
        }

        // About
        if ($cleanPath === '/about') {
            return [
                'page_type' => 'about',
                'item_id' => null,
                'item_name' => 'অ্যাপ পরিচিতি (About)',
            ];
        }

        return [
            'page_type' => $pageType ?: 'other',
            'item_id' => null,
            'item_name' => $itemName ?: 'অন্যান্য পেজ',
        ];
    }

    private function parseUserAgent(string $ua): array
    {
        $deviceType = 'desktop';
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) {
            $deviceType = 'tablet';
        } elseif (preg_match('/(mobi|iphone|ipod|blackberry|opera mini|iemobile|mobile)/i', $ua)) {
            $deviceType = 'mobile';
        }

        $platform = 'Other';
        if (stripos($ua, 'android') !== false) {
            $platform = 'Android';
        } elseif (stripos($ua, 'iphone') !== false || stripos($ua, 'ipad') !== false || stripos($ua, 'ipod') !== false) {
            $platform = 'iOS';
        } elseif (stripos($ua, 'windows') !== false) {
            $platform = 'Windows';
        } elseif (stripos($ua, 'macintosh') !== false || stripos($ua, 'mac os') !== false) {
            $platform = 'macOS';
        } elseif (stripos($ua, 'linux') !== false) {
            $platform = 'Linux';
        }

        $browser = 'Other';
        if (stripos($ua, 'edg') !== false) {
            $browser = 'Edge';
        } elseif (stripos($ua, 'chrome') !== false || stripos($ua, 'crios') !== false) {
            $browser = 'Chrome';
        } elseif (stripos($ua, 'safari') !== false && stripos($ua, 'chrome') === false) {
            $browser = 'Safari';
        } elseif (stripos($ua, 'firefox') !== false || stripos($ua, 'fxios') !== false) {
            $browser = 'Firefox';
        } elseif (stripos($ua, 'opera') !== false || stripos($ua, 'opr') !== false) {
            $browser = 'Opera';
        }

        return [
            'device_type' => $deviceType,
            'platform' => $platform,
            'browser' => $browser,
        ];
    }
}
