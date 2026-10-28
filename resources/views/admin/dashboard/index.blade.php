@extends('admin.layouts.app')

@section('title', 'ড্যাশবোর্ড ও ভিজিটর অ্যানালিটিক্স | Hasana Admin')
@section('page_title', 'ভিজিটর ও ব্যবহার পরিসংখ্যান')
@section('page_subtitle', 'কুরআন, হাদিস ও দোয়ার রিয়েল-টাইম ব্যবহার, ভিজিটর সংখ্যা এবং বিস্তারিত ইতিহাস')

@section('content')
<div class="dashboard-wrapper">
    <!-- Islamic Welcome Banner -->
    <div class="islamic-welcome-banner">
        <div class="banner-content">
            <div class="bismillah-calligraphy">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
            <h2 class="welcome-title">
                আসসালামু আলাইকুম, <span>{{ Auth::user()->name ?? 'অ্যাডমিন' }}</span>!
            </h2>
            <p class="welcome-desc">
                হাসানা ইসলামিক অ্যাপের প্রাত্যহিক ভিজিটর কার্যক্রম, সূরা-হাদিস-দোয়া পাঠের সময়কাল এবং পূর্ণাঙ্গ ব্যবহারের ইতিহাস একনজরে দেখুন।
            </p>
        </div>
        <div class="banner-meta">
            <div class="time-chip">
                <i class="fa-solid fa-calendar-day text-gold"></i>
                <span>{{ \Carbon\Carbon::now()->locale('bn')->isoFormat('D MMMM, YYYY') }}</span>
            </div>
            <a href="{{ route('admin.dashboard') }}" class="btn-refresh" title="রিফ্রেশ করুন">
                <i class="fa-solid fa-arrows-rotate"></i>
                <span>হালনাগাদ</span>
            </a>
        </div>
    </div>

    <!-- 4 Key Stat Cards -->
    <div class="stats-overview-grid">
        <!-- Today Card -->
        <div class="metric-card card-today">
            <div class="metric-header">
                <div class="metric-icon-box">
                    <i class="fa-solid fa-sun"></i>
                </div>
                <span class="metric-badge">আজকের হিসাব</span>
            </div>
            <div class="metric-body">
                <div class="metric-number-group">
                    <h3 class="metric-value">{{ App\Models\VisitorLog::banglaDigits($todayVisitors) }} <small>জন</small></h3>
                    <span class="metric-sub">{{ App\Models\VisitorLog::banglaDigits($todayViews) }} বার পেজ ভিউ</span>
                </div>
                <div class="metric-footer-info">
                    <span class="info-label"><i class="fa-regular fa-clock"></i> গড় সময়:</span>
                    <strong class="info-val">{{ $todayAvgSec > 0 ? (new App\Models\VisitorLog(['duration_seconds' => $todayAvgSec]))->duration_formatted : '0 সেকেন্ড' }}</strong>
                </div>
            </div>
        </div>

        <!-- This Week Card -->
        <div class="metric-card card-week">
            <div class="metric-header">
                <div class="metric-icon-box">
                    <i class="fa-solid fa-chart-line"></i>
                </div>
                <span class="metric-badge">এই সপ্তাহ (7 দিন)</span>
            </div>
            <div class="metric-body">
                <div class="metric-number-group">
                    <h3 class="metric-value">{{ App\Models\VisitorLog::banglaDigits($weekVisitors) }} <small>জন</small></h3>
                    <span class="metric-sub">{{ App\Models\VisitorLog::banglaDigits($weekViews) }} বার পেজ ভিউ</span>
                </div>
                <div class="metric-footer-info">
                    <span class="info-label"><i class="fa-regular fa-clock"></i> গড় সময়:</span>
                    <strong class="info-val">{{ $weekAvgSec > 0 ? (new App\Models\VisitorLog(['duration_seconds' => $weekAvgSec]))->duration_formatted : '0 সেকেন্ড' }}</strong>
                </div>
            </div>
        </div>

        <!-- This Month Card -->
        <div class="metric-card card-month">
            <div class="metric-header">
                <div class="metric-icon-box">
                    <i class="fa-solid fa-calendar-check"></i>
                </div>
                <span class="metric-badge">এই মাস (30 দিন)</span>
            </div>
            <div class="metric-body">
                <div class="metric-number-group">
                    <h3 class="metric-value">{{ App\Models\VisitorLog::banglaDigits($monthVisitors) }} <small>জন</small></h3>
                    <span class="metric-sub">{{ App\Models\VisitorLog::banglaDigits($monthViews) }} বার পেজ ভিউ</span>
                </div>
                <div class="metric-footer-info">
                    <span class="info-label"><i class="fa-regular fa-clock"></i> গড় সময়:</span>
                    <strong class="info-val">{{ $monthAvgSec > 0 ? (new App\Models\VisitorLog(['duration_seconds' => $monthAvgSec]))->duration_formatted : '0 সেকেন্ড' }}</strong>
                </div>
            </div>
        </div>

        <!-- All-Time Card -->
        <div class="metric-card card-total">
            <div class="metric-header">
                <div class="metric-icon-box">
                    <i class="fa-solid fa-users-viewfinder"></i>
                </div>
                <span class="metric-badge">সর্বমোট ভিজিট</span>
            </div>
            <div class="metric-body">
                <div class="metric-number-group">
                    <h3 class="metric-value">{{ App\Models\VisitorLog::banglaDigits($totalVisitors) }} <small>জন</small></h3>
                    <span class="metric-sub">{{ App\Models\VisitorLog::banglaDigits($totalViews) }} বার পেজ ভিউ</span>
                </div>
                <div class="metric-footer-info">
                    <span class="info-label"><i class="fa-regular fa-hourglass-half"></i> মোট প্ল্যাটফর্ম সময়:</span>
                    <strong class="info-val">{{ App\Models\VisitorLog::banglaDigits($totalHours) }} ঘণ্টা</strong>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts & Category Split Section -->
    <div class="dashboard-analytics-row">
        <!-- 14-Day Trend Chart -->
        <div class="analytics-card trend-chart-card">
            <div class="card-header-styled">
                <div class="header-left">
                    <div class="header-icon-circle"><i class="fa-solid fa-chart-column"></i></div>
                    <div>
                        <h3 class="card-title-styled">দৈনিক ভিজিটর ও পেজ ভিউ ট্রেন্ড</h3>
                        <p class="card-sub-styled">বিগত 14 দিনের প্রতিদিনের ইউনিক ভিজিটর ও ভিউ সংখ্যা</p>
                    </div>
                </div>
                <div class="device-pills">
                    <span class="device-pill"><i class="fa-solid fa-mobile-screen"></i> মোবাইল {{ App\Models\VisitorLog::banglaDigits($mobileShare) }}%</span>
                    <span class="device-pill"><i class="fa-solid fa-laptop"></i> ডেস্কটপ {{ App\Models\VisitorLog::banglaDigits($desktopShare) }}%</span>
                </div>
            </div>

            <div class="chart-container-box">
                @php
                    $maxViews = max(array_map(fn($d) => $d['views'], $chartData));
                    $maxViews = $maxViews > 0 ? $maxViews : 1;
                @endphp
                <div class="custom-bar-chart">
                    @foreach($chartData as $d)
                        @php
                            $heightPercent = round(($d['views'] / $maxViews) * 100);
                            $heightPercent = max(10, $heightPercent);
                        @endphp
                        <div class="chart-bar-col" title="{{ $d['label'] }}: {{ $d['visitors'] }} জন ভিজিটর, {{ $d['views'] }} ভিউ">
                            <div class="bar-value-top">{{ App\Models\VisitorLog::banglaDigits($d['views']) }}</div>
                            <div class="bar-track">
                                <div class="bar-fill" style="height: {{ $heightPercent }}%;">
                                    <div class="bar-fill-visitors" style="height: {{ min(100, round(($d['visitors'] / ($d['views'] ?: 1)) * 100)) }}%;"></div>
                                </div>
                            </div>
                            <span class="bar-label">{{ $d['day_name'] }}<br><small>{{ $d['label'] }}</small></span>
                        </div>
                    @endforeach
                </div>
                <div class="chart-legend">
                    <div class="legend-item"><span class="legend-dot dot-views"></span><span>মোট পেজভিউ (Views)</span></div>
                    <div class="legend-item"><span class="legend-dot dot-visitors"></span><span>ইউনিক ভিজিটর (Visitors)</span></div>
                </div>
            </div>
        </div>

        <!-- Category Breakdown Card -->
        <div class="analytics-card category-share-card">
            <div class="card-header-styled">
                <div class="header-left">
                    <div class="header-icon-circle"><i class="fa-solid fa-pie-chart"></i></div>
                    <div>
                        <h3 class="card-title-styled">বিষয়ভিত্তিক ব্যবহারের অনুপাত</h3>
                        <p class="card-sub-styled">কোন সেকশনে ভিজিটররা বেশি সময় দিচ্ছেন</p>
                    </div>
                </div>
            </div>

            <div class="category-bars-list">
                @foreach($sections as $secKey => $sec)
                    <div class="category-bar-item">
                        <div class="cat-info">
                            <span class="cat-name">
                                <i class="{{ $sec['icon'] }}" style="color: {{ $sec['color'] }};"></i>
                                {{ $sec['label'] }}
                            </span>
                            <span class="cat-count">
                                <strong>{{ App\Models\VisitorLog::banglaDigits($sec['count']) }} বার</strong>
                                <small>({{ App\Models\VisitorLog::banglaDigits($sec['percentage']) }}%)</small>
                            </span>
                        </div>
                        <div class="cat-progress-track">
                            <div class="cat-progress-fill" style="width: {{ $sec['percentage'] }}%; background-color: {{ $sec['color'] }};"></div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="platform-counts-footer">
                <div class="platform-count-box">
                    <span class="count-num">{{ App\Models\VisitorLog::banglaDigits($totalSurahs) }}</span>
                    <span class="count-lbl">কুরআন সূরা</span>
                </div>
                <div class="platform-count-box">
                    <span class="count-num">{{ App\Models\VisitorLog::banglaDigits($totalHadiths) }}</span>
                    <span class="count-lbl">সহীহ হাদিস</span>
                </div>
                <div class="platform-count-box">
                    <span class="count-num">{{ App\Models\VisitorLog::banglaDigits($totalDuas) }}</span>
                    <span class="count-lbl">মাসনুন দোয়া</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Top Ranking Content Grid: Surahs, Hadiths, Duas -->
    <div class="top-content-grid">
        <!-- Top Surahs -->
        <div class="content-rank-card">
            <div class="rank-card-header">
                <div class="rank-header-icon bg-emerald-soft text-emerald"><i class="fa-solid fa-quran"></i></div>
                <div>
                    <h4 class="rank-card-title">সর্বাধিক পঠিত সূরা সমূহ</h4>
                    <span class="rank-card-sub">সবচেয়ে বেশি বার পড়া ও সময় দেওয়া সূরা</span>
                </div>
            </div>
            <div class="rank-items-list">
                @forelse($topSurahs as $idx => $surah)
                    <div class="rank-item-row">
                        <div class="rank-badge {{ $idx < 3 ? 'rank-top-'.$idx : '' }}">
                            {{ App\Models\VisitorLog::banglaDigits($idx + 1) }}
                        </div>
                        <div class="rank-details">
                            <div class="rank-title-line">
                                <strong class="rank-item-name">{{ $surah->item_name }}</strong>
                                <span class="rank-view-count">{{ App\Models\VisitorLog::banglaDigits($surah->views) }} ভিউ</span>
                            </div>
                            <div class="rank-progress-bar">
                                <div class="rank-progress-fill bg-emerald" style="width: {{ $surah->percentage }}%;"></div>
                            </div>
                            <div class="rank-meta-line">
                                <span><i class="fa-regular fa-clock"></i> গড় সময়: {{ $surah->avg_formatted }}</span>
                                <span class="rank-percent">{{ App\Models\VisitorLog::banglaDigits($surah->percentage) }}%</span>
                            </div>
                        </div>
                    </div>
                @empty
                    <p class="text-muted p-4 text-center">এখনও কোনো তথ্য পাওয়া যায়নি।</p>
                @endforelse
            </div>
        </div>

        <!-- Top Hadiths -->
        <div class="content-rank-card">
            <div class="rank-card-header">
                <div class="rank-header-icon bg-blue-soft text-blue"><i class="fa-solid fa-file-lines"></i></div>
                <div>
                    <h4 class="rank-card-title">সর্বাধিক পঠিত হাদিস সমূহ</h4>
                    <span class="rank-card-sub">বুখারী ও মুসলিমের সবচেয়ে জনপ্রিয় হাদিস বিষয়</span>
                </div>
            </div>
            <div class="rank-items-list">
                @forelse($topHadiths as $idx => $hadith)
                    <div class="rank-item-row">
                        <div class="rank-badge {{ $idx < 3 ? 'rank-top-'.$idx : '' }}">
                            {{ App\Models\VisitorLog::banglaDigits($idx + 1) }}
                        </div>
                        <div class="rank-details">
                            <div class="rank-title-line">
                                <strong class="rank-item-name">{{ $hadith->item_name }}</strong>
                                <span class="rank-view-count">{{ App\Models\VisitorLog::banglaDigits($hadith->views) }} ভিউ</span>
                            </div>
                            <div class="rank-progress-bar">
                                <div class="rank-progress-fill bg-blue" style="width: {{ $hadith->percentage }}%;"></div>
                            </div>
                            <div class="rank-meta-line">
                                <span><i class="fa-regular fa-clock"></i> গড় সময়: {{ $hadith->avg_formatted }}</span>
                                <span class="rank-percent">{{ App\Models\VisitorLog::banglaDigits($hadith->percentage) }}%</span>
                            </div>
                        </div>
                    </div>
                @empty
                    <p class="text-muted p-4 text-center">এখনও কোনো তথ্য পাওয়া যায়নি।</p>
                @endforelse
            </div>
        </div>

        <!-- Top Duas -->
        <div class="content-rank-card">
            <div class="rank-card-header">
                <div class="rank-header-icon bg-amber-soft text-amber"><i class="fa-solid fa-hands-praying"></i></div>
                <div>
                    <h4 class="rank-card-title">সর্বাধিক পঠিত দোয়া সমূহ</h4>
                    <span class="rank-card-sub">সবচেয়ে বেশি পাঠ করা মাসনুন দোয়া ও জিকির</span>
                </div>
            </div>
            <div class="rank-items-list">
                @forelse($topDuas as $idx => $dua)
                    <div class="rank-item-row">
                        <div class="rank-badge {{ $idx < 3 ? 'rank-top-'.$idx : '' }}">
                            {{ App\Models\VisitorLog::banglaDigits($idx + 1) }}
                        </div>
                        <div class="rank-details">
                            <div class="rank-title-line">
                                <strong class="rank-item-name">{{ $dua->item_name }}</strong>
                                <span class="rank-view-count">{{ App\Models\VisitorLog::banglaDigits($dua->views) }} ভিউ</span>
                            </div>
                            <div class="rank-progress-bar">
                                <div class="rank-progress-fill bg-amber" style="width: {{ $dua->percentage }}%;"></div>
                            </div>
                            <div class="rank-meta-line">
                                <span><i class="fa-regular fa-clock"></i> গড় সময়: {{ $dua->avg_formatted }}</span>
                                <span class="rank-percent">{{ App\Models\VisitorLog::banglaDigits($dua->percentage) }}%</span>
                            </div>
                        </div>
                    </div>
                @empty
                    <p class="text-muted p-4 text-center">এখনও কোনো তথ্য পাওয়া যায়নি।</p>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Proper & Sundor History Section (Detailed Logs) -->
    <div class="admin-card history-card" id="visitor-history">
        <div class="history-card-header">
            <div class="history-title-group">
                <div class="history-icon-circle"><i class="fa-solid fa-clock-rotate-left"></i></div>
                <div>
                    <h3 class="history-title">ভিজিটর ও ব্যবহারের পূর্ণাঙ্গ ইতিহাস</h3>
                    <p class="history-sub">কে কখন কোন সূরা, হাদিস বা দোয়া কতক্ষণ পড়েছেন তার সরাসরি লগ</p>
                </div>
            </div>

            <!-- Filter Controls -->
            <form method="GET" action="{{ route('admin.dashboard') }}#visitor-history" class="history-filters-form">
                <div class="filter-group-ranges">
                    <a href="{{ route('admin.dashboard', array_merge(request()->query(), ['range' => 'all'])) }}#visitor-history"
                       class="filter-chip {{ request('range', 'all') === 'all' ? 'active' : '' }}">সকল সময়</a>
                    <a href="{{ route('admin.dashboard', array_merge(request()->query(), ['range' => 'today'])) }}#visitor-history"
                       class="filter-chip {{ request('range') === 'today' ? 'active' : '' }}">আজ</a>
                    <a href="{{ route('admin.dashboard', array_merge(request()->query(), ['range' => 'week'])) }}#visitor-history"
                       class="filter-chip {{ request('range') === 'week' ? 'active' : '' }}">এই সপ্তাহ</a>
                    <a href="{{ route('admin.dashboard', array_merge(request()->query(), ['range' => 'month'])) }}#visitor-history"
                       class="filter-chip {{ request('range') === 'month' ? 'active' : '' }}">এই মাস</a>
                </div>

                <div class="filter-controls-right">
                    <select name="type" class="filter-select" onchange="this.form.submit()">
                        <option value="all" {{ request('type') == 'all' ? 'selected' : '' }}>সকল ক্যাটাগরি</option>
                        <option value="surah" {{ request('type') == 'surah' ? 'selected' : '' }}>কুরআন / সূরা</option>
                        <option value="hadith" {{ request('type') == 'hadith' ? 'selected' : '' }}>সহীহ হাদিস</option>
                        <option value="dua" {{ request('type') == 'dua' ? 'selected' : '' }}>মাসনুন দোয়া</option>
                        <option value="umrah" {{ request('type') == 'umrah' ? 'selected' : '' }}>উমরাহ গাইড</option>
                        <option value="home" {{ request('type') == 'home' ? 'selected' : '' }}>হোম পেজ</option>
                    </select>

                    <div class="history-search-box">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="search" name="q" value="{{ request('q') }}" placeholder="সার্চ (বিষয়, আইপি, ব্রাউজার)...">
                    </div>
                </div>
            </form>
        </div>

        <div class="table-wrapper">
            <table class="admin-table history-table">
                <thead>
                    <tr>
                        <th style="width: 170px;">তারিখ ও সময়</th>
                        <th>পঠিত বিষয় / পেজ</th>
                        <th>ক্যাটাগরি</th>
                        <th>ব্যবহারের সময়কাল</th>
                        <th>ডিভাইস ও ব্রাউজার</th>
                        <th>আইপি / সেশন</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($logs as $log)
                        @php
                            $catClass = match($log->page_type) {
                                'surah', 'quran' => 'badge-surah',
                                'hadith' => 'badge-hadith',
                                'dua' => 'badge-dua',
                                'umrah' => 'badge-umrah',
                                default => 'badge-general',
                            };
                            $catLabel = match($log->page_type) {
                                'surah' => 'সূরা পাঠ',
                                'quran' => 'কুরআন সূচি',
                                'hadith' => 'সহীহ হাদিস',
                                'dua' => 'দোয়া ও জিকির',
                                'umrah' => 'উমরাহ গাইড',
                                'home' => 'হোম পেজ',
                                default => 'অন্যান্য',
                            };
                            $deviceIcon = match(strtolower($log->device_type)) {
                                'mobile' => 'fa-solid fa-mobile-screen',
                                'tablet' => 'fa-solid fa-tablet-screen-button',
                                default => 'fa-solid fa-laptop',
                            };
                        @endphp
                        <tr>
                            <td class="history-time-col">
                                <span class="log-time">{{ $log->visited_at ? $log->visited_at->timezone('Asia/Dhaka')->format('h:i A') : '' }}</span>
                                <small class="log-date">{{ $log->visited_at ? $log->visited_at->timezone('Asia/Dhaka')->format('d M, Y') : '' }}</small>
                            </td>
                            <td class="history-item-col">
                                <div class="item-title-box">
                                    <strong class="item-title-text">{{ $log->item_name ?: $log->path }}</strong>
                                    <code class="item-path-text">{{ $log->path }}</code>
                                </div>
                            </td>
                            <td>
                                <span class="history-category-badge {{ $catClass }}">
                                    {{ $catLabel }}
                                </span>
                            </td>
                            <td>
                                <div class="duration-chip">
                                    <i class="fa-regular fa-clock"></i>
                                    <span>{{ $log->duration_formatted }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="device-cell">
                                    <i class="{{ $deviceIcon }} device-icon"></i>
                                    <div class="device-names">
                                        <span class="device-name">{{ $log->platform }}</span>
                                        <small class="browser-name">{{ $log->browser }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="ip-cell" title="Session: {{ $log->session_id }}">
                                    <span class="ip-text">{{ $log->ip_address ? substr($log->ip_address, 0, 7) . '***' : 'Local' }}</span>
                                    <code class="session-code">{{ substr($log->session_id, 0, 10) }}...</code>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center p-6 text-muted">
                                <i class="fa-regular fa-folder-open text-2xl mb-2 d-block"></i>
                                কোনো ভিজিটর ইতিহাস পাওয়া যায়নি।
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="table-footer">
            <div class="table-info">
                মোট <strong>{{ App\Models\VisitorLog::banglaDigits($logs->total()) }}</strong> টি রেকর্ডের মধ্যে 
                <strong>{{ App\Models\VisitorLog::banglaDigits($logs->firstItem() ?? 0) }}</strong> থেকে 
                <strong>{{ App\Models\VisitorLog::banglaDigits($logs->lastItem() ?? 0) }}</strong> দেখানো হচ্ছে
            </div>
            <div class="history-pagination">
                {{ $logs->links('admin.pagination.custom') }}
            </div>
        </div>
    </div>
</div>
@endsection
