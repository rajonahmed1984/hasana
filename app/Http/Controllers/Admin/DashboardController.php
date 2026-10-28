<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dua;
use App\Models\Hadith;
use App\Models\Surah;
use App\Models\VisitorLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $now = Carbon::now();

        // 1. Key Metrics: Unique Visitors & Total Page Views
        $todayVisitors = VisitorLog::today()->distinct('session_id')->count('session_id');
        $todayViews = VisitorLog::today()->count();
        $todayAvgSec = (int) (VisitorLog::today()->avg('duration_seconds') ?? 0);
        $todayTotalSec = (int) (VisitorLog::today()->sum('duration_seconds') ?? 0);

        $weekVisitors = VisitorLog::thisWeek()->distinct('session_id')->count('session_id');
        $weekViews = VisitorLog::thisWeek()->count();
        $weekAvgSec = (int) (VisitorLog::thisWeek()->avg('duration_seconds') ?? 0);

        $monthVisitors = VisitorLog::thisMonth()->distinct('session_id')->count('session_id');
        $monthViews = VisitorLog::thisMonth()->count();
        $monthAvgSec = (int) (VisitorLog::thisMonth()->avg('duration_seconds') ?? 0);

        $totalVisitors = VisitorLog::distinct('session_id')->count('session_id');
        $totalViews = VisitorLog::count();
        $totalHours = round((VisitorLog::sum('duration_seconds') ?? 0) / 3600, 1);
        $totalAvgSec = (int) (VisitorLog::avg('duration_seconds') ?? 0);

        // 2. Content counts
        $totalSurahs = Surah::count();
        $totalHadiths = Hadith::count();
        $totalDuas = Dua::count();

        // 3. Most Read / Used Surahs (Top 7)
        $totalSurahViews = VisitorLog::where('page_type', 'surah')->count();
        $topSurahs = VisitorLog::where('page_type', 'surah')
            ->whereNotNull('item_name')
            ->select('item_name', DB::raw('count(*) as views'), DB::raw('avg(duration_seconds) as avg_sec'))
            ->groupBy('item_name')
            ->orderByDesc('views')
            ->take(7)
            ->get()
            ->map(function ($item) use ($totalSurahViews) {
                $item->percentage = $totalSurahViews > 0 ? round(($item->views / $totalSurahViews) * 100, 1) : 0;
                $item->avg_formatted = $this->formatSeconds((int)$item->avg_sec);
                return $item;
            });

        // 4. Most Read / Used Hadiths (Top 6)
        $totalHadithViews = VisitorLog::where('page_type', 'hadith')->count();
        $topHadiths = VisitorLog::where('page_type', 'hadith')
            ->whereNotNull('item_name')
            ->select('item_name', DB::raw('count(*) as views'), DB::raw('avg(duration_seconds) as avg_sec'))
            ->groupBy('item_name')
            ->orderByDesc('views')
            ->take(6)
            ->get()
            ->map(function ($item) use ($totalHadithViews) {
                $item->percentage = $totalHadithViews > 0 ? round(($item->views / $totalHadithViews) * 100, 1) : 0;
                $item->avg_formatted = $this->formatSeconds((int)$item->avg_sec);
                return $item;
            });

        // 5. Most Read / Used Duas (Top 6)
        $totalDuaViews = VisitorLog::where('page_type', 'dua')->count();
        $topDuas = VisitorLog::where('page_type', 'dua')
            ->whereNotNull('item_name')
            ->select('item_name', DB::raw('count(*) as views'), DB::raw('avg(duration_seconds) as avg_sec'))
            ->groupBy('item_name')
            ->orderByDesc('views')
            ->take(6)
            ->get()
            ->map(function ($item) use ($totalDuaViews) {
                $item->percentage = $totalDuaViews > 0 ? round(($item->views / $totalDuaViews) * 100, 1) : 0;
                $item->avg_formatted = $this->formatSeconds((int)$item->avg_sec);
                return $item;
            });

        // 6. Section Breakdown (Quran, Hadith, Dua, Umrah, Home, Other)
        $categoryBreakdown = VisitorLog::select('page_type', DB::raw('count(*) as count'))
            ->groupBy('page_type')
            ->get()
            ->pluck('count', 'page_type')
            ->toArray();

        $sections = [
            'quran' => [
                'label' => 'কুরআন ও সূরা',
                'count' => ($categoryBreakdown['surah'] ?? 0) + ($categoryBreakdown['quran'] ?? 0),
                'color' => '#10b981',
                'icon' => 'fa-solid fa-quran',
            ],
            'hadith' => [
                'label' => 'সহীহ হাদিস',
                'count' => $categoryBreakdown['hadith'] ?? 0,
                'color' => '#3b82f6',
                'icon' => 'fa-solid fa-file-lines',
            ],
            'dua' => [
                'label' => 'দোয়া ও জিকির',
                'count' => $categoryBreakdown['dua'] ?? 0,
                'color' => '#f59e0b',
                'icon' => 'fa-solid fa-hands-praying',
            ],
            'umrah' => [
                'label' => 'উমরাহ গাইড',
                'count' => $categoryBreakdown['umrah'] ?? 0,
                'color' => '#8b5cf6',
                'icon' => 'fa-solid fa-kaaba',
            ],
            'home' => [
                'label' => 'হোম ও অন্যান্য',
                'count' => ($categoryBreakdown['home'] ?? 0) + ($categoryBreakdown['other'] ?? 0) + ($categoryBreakdown['about'] ?? 0) + ($categoryBreakdown['settings'] ?? 0),
                'color' => '#64748b',
                'icon' => 'fa-solid fa-house',
            ],
        ];

        $totalSectionVisits = array_sum(array_column($sections, 'count'));
        foreach ($sections as $k => $s) {
            $sections[$k]['percentage'] = $totalSectionVisits > 0 ? round(($s['count'] / $totalSectionVisits) * 100, 1) : 0;
        }

        // 7. Last 14 Days Visitor & View Trends for Visual Chart
        $chartDates = [];
        for ($i = 13; $i >= 0; $i--) {
            $d = (clone $now)->subDays($i);
            $dateStr = $d->format('Y-m-d');
            $chartDates[$dateStr] = [
                'date' => $dateStr,
                'day_name' => $this->getBanglaDay($d->format('D')),
                'label' => $this->banglaDigits($d->format('j')) . ' ' . $this->getBanglaMonthShort($d->format('M')),
                'visitors' => 0,
                'views' => 0,
            ];
        }

        $dailyStats = VisitorLog::where('visited_at', '>=', Carbon::now()->subDays(14)->startOfDay())
            ->select(
                DB::raw('DATE(visited_at) as log_date'),
                DB::raw('count(distinct session_id) as visitors'),
                DB::raw('count(*) as views')
            )
            ->groupBy('log_date')
            ->get();

        foreach ($dailyStats as $stat) {
            if (isset($chartDates[$stat->log_date])) {
                $chartDates[$stat->log_date]['visitors'] = (int)$stat->visitors;
                $chartDates[$stat->log_date]['views'] = (int)$stat->views;
            }
        }
        $chartData = array_values($chartDates);

        // 8. Device & Browser Share
        $deviceBreakdown = VisitorLog::select('device_type', DB::raw('count(*) as total'))
            ->groupBy('device_type')
            ->get()
            ->pluck('total', 'device_type')
            ->toArray();
        $totalDevices = array_sum($deviceBreakdown);
        $mobileShare = $totalDevices > 0 ? round((($deviceBreakdown['mobile'] ?? 0) / $totalDevices) * 100, 1) : 0;
        $desktopShare = $totalDevices > 0 ? round((($deviceBreakdown['desktop'] ?? 0) / $totalDevices) * 100, 1) : 0;
        $tabletShare = $totalDevices > 0 ? round((($deviceBreakdown['tablet'] ?? 0) / $totalDevices) * 100, 1) : 0;

        // 9. Detailed Visitor History Query (Proper & Sundor History)
        $historyQuery = VisitorLog::query()->latest('visited_at');

        // Filter: Time Range
        $range = $request->get('range', 'all');
        if ($range === 'today') {
            $historyQuery->today();
        } elseif ($range === 'week') {
            $historyQuery->thisWeek();
        } elseif ($range === 'month') {
            $historyQuery->thisMonth();
        }

        // Filter: Type
        $type = $request->get('type', 'all');
        if ($type !== 'all' && in_array($type, ['surah', 'hadith', 'dua', 'umrah', 'home', 'other'])) {
            $historyQuery->where('page_type', $type);
        }

        // Search: Keyword
        if ($q = $request->get('q')) {
            $historyQuery->where(function ($query) use ($q) {
                $query->where('item_name', 'like', "%{$q}%")
                    ->orWhere('path', 'like', "%{$q}%")
                    ->orWhere('ip_address', 'like', "%{$q}%")
                    ->orWhere('browser', 'like', "%{$q}%")
                    ->orWhere('platform', 'like', "%{$q}%");
            });
        }

        $logs = $historyQuery->paginate(15)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json([
                'metrics' => [
                    'todayVisitors' => $todayVisitors,
                    'todayViews' => $todayViews,
                    'todayAvgSec' => $todayAvgSec,
                    'todayTotalSec' => $todayTotalSec,
                    'weekVisitors' => $weekVisitors,
                    'weekViews' => $weekViews,
                    'weekAvgSec' => $weekAvgSec,
                    'monthVisitors' => $monthVisitors,
                    'monthViews' => $monthViews,
                    'monthAvgSec' => $monthAvgSec,
                    'totalVisitors' => $totalVisitors,
                    'totalViews' => $totalViews,
                    'totalHours' => $totalHours,
                    'totalAvgSec' => $totalAvgSec,
                    'totalSurahs' => $totalSurahs,
                    'totalHadiths' => $totalHadiths,
                    'totalDuas' => $totalDuas,
                ],
                'topSurahs' => $topSurahs,
                'topHadiths' => $topHadiths,
                'topDuas' => $topDuas,
                'sections' => $sections,
                'chartData' => $chartData,
                'deviceShare' => [
                    'mobile' => $mobileShare,
                    'desktop' => $desktopShare,
                    'tablet' => $tabletShare,
                ],
                'logs' => $logs,
                'range' => $range,
                'type' => $type,
            ]);
        }

        return view('admin.spa');
    }

    private function formatSeconds(int $sec): string
    {
        if ($sec < 60) {
            return $this->banglaDigits($sec) . ' সেকেন্ড';
        }
        $min = floor($sec / 60);
        $rem = $sec % 60;
        if ($rem === 0) {
            return $this->banglaDigits($min) . ' মিনিট';
        }
        return $this->banglaDigits($min) . ' মি. ' . $this->banglaDigits($rem) . ' সে.';
    }

    private function banglaDigits($number): string
    {
        $bn = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return str_replace($en, $bn, (string)$number);
    }

    private function getBanglaDay(string $day): string
    {
        $days = [
            'Sat' => 'শনি',
            'Sun' => 'রবি',
            'Mon' => 'সোম',
            'Tue' => 'মঙ্গল',
            'Wed' => 'বুধ',
            'Thu' => 'বৃহঃ',
            'Fri' => 'শুক্র',
        ];
        return $days[$day] ?? $day;
    }

    private function getBanglaMonthShort(string $month): string
    {
        $months = [
            'Jan' => 'জানু',
            'Feb' => 'ফেব্রু',
            'Mar' => 'মার্চ',
            'Apr' => 'এপ্রিল',
            'May' => 'মে',
            'Jun' => 'জুন',
            'Jul' => 'জুলাই',
            'Aug' => 'আগস্ট',
            'Sep' => 'সেপ্টে',
            'Oct' => 'অক্টো',
            'Nov' => 'নভে',
            'Dec' => 'ডিসে',
        ];
        return $months[$month] ?? $month;
    }
}
