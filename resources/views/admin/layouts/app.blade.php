<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'হাসানা অ্যাডমিন | Hasana Admin Portal')</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    
    <!-- Google Fonts: Baloo Da 2 for Bengali, Amiri for Arabic, Poppins for English -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Baloo+Da+2:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    @vite(['resources/js/admin.js'])
    @stack('styles')
</head>
<body class="admin-body">
    <div class="admin-layout" data-admin-app>
        <!-- Mobile Sidebar Backdrop -->
        <div class="sidebar-backdrop" data-admin-sidebar-backdrop></div>

        <!-- Islamic Sidebar -->
        <aside class="admin-sidebar" data-admin-sidebar>
            <div class="sidebar-brand">
                <a href="{{ route('admin.dashboard', [], false) }}" class="brand-link">
                    <div class="brand-icon-wrapper">
                        <img src="{{ logo_url() }}" alt="{{ setting('site_name', 'হাসানা') }}" class="brand-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                        <i class="fa-solid fa-moon" style="display: none;"></i>
                    </div>
                    <div class="brand-text-group">
                        <span class="brand-title">{{ setting('site_title_bn', setting('site_name', 'হাসানা')) }}</span>
                        <span class="brand-subtitle">ইসলামিক অ্যাডমিন পোর্টাল</span>
                    </div>
                </a>
                <button class="sidebar-close" data-admin-sidebar-close aria-label="Close navigation">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Bismillah decorative bar in sidebar -->
            <div class="sidebar-bismillah">
                <span>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
            </div>

            @php
                $navItems = [
                    [
                        'label' => 'ড্যাশবোর্ড',
                        'icon' => 'fa-solid fa-chart-pie',
                        'route' => 'admin.dashboard',
                        'active' => request()->routeIs('admin.dashboard'),
                    ],
                    [
                        'label' => 'কুরআন ও সূরা',
                        'icon' => 'fa-solid fa-quran',
                        'route' => 'admin.surahs.index',
                        'active' => request()->routeIs('admin.surahs.*'),
                    ],
                    [
                        'label' => 'সহীহ হাদিস',
                        'icon' => 'fa-solid fa-file-lines',
                        'route' => 'admin.hadiths.index',
                        'active' => request()->routeIs('admin.hadiths.*'),
                    ],
                    [
                        'label' => 'হাদিস ক্যাটাগরি',
                        'icon' => 'fa-solid fa-folder-open',
                        'route' => 'admin.hadith-categories.index',
                        'active' => request()->routeIs('admin.hadith-categories.*'),
                    ],
                    [
                        'label' => 'মাসনুন দোয়া',
                        'icon' => 'fa-solid fa-hands-praying',
                        'route' => 'admin.duas.index',
                        'active' => request()->routeIs('admin.duas.*'),
                    ],
                    [
                        'label' => 'দোয়া ক্যাটাগরি',
                        'icon' => 'fa-solid fa-tags',
                        'route' => 'admin.dua-categories.index',
                        'active' => request()->routeIs('admin.dua-categories.*'),
                    ],
                    [
                        'label' => 'ব্যবহারকারী',
                        'icon' => 'fa-solid fa-users',
                        'route' => 'admin.users.index',
                        'active' => request()->routeIs('admin.users.*'),
                    ],
                    [
                        'label' => 'সেটিংস',
                        'icon' => 'fa-solid fa-gear',
                        'route' => 'admin.settings.index',
                        'active' => request()->routeIs('admin.settings.*'),
                    ],
                ];
            @endphp
            <nav class="sidebar-nav">
                <ul>
                    @foreach ($navItems as $item)
                        @php
                            $hasParams = array_key_exists('params', $item);
                            $params = $hasParams ? $item['params'] : null;
                            $disabled = ($item['disabled'] ?? false);
                            $url = '#';

                            if (! $disabled) {
                                $url = $hasParams ? route($item['route'], $params, false) : route($item['route'], [], false);
                            }
                        @endphp
                        <li class="sidebar-item {{ $item['active'] ? 'active' : '' }} {{ $disabled ? 'disabled' : '' }}">
                            <a href="{{ $url }}" @class(['sidebar-link', 'disabled-link' => $disabled])>
                                <div class="sidebar-icon-wrap">
                                    <i class="{{ $item['icon'] }}"></i>
                                </div>
                                <span class="sidebar-link-text">{{ $item['label'] }}</span>
                                @if($item['active'])
                                    <span class="active-indicator"></span>
                                @endif
                            </a>
                        </li>
                    @endforeach
                </ul>
            </nav>

            <div class="sidebar-footer">
                <a href="{{ route('hasana.home', [], false) }}" class="sidebar-footer-link" target="_blank" rel="noopener">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>অ্যাপ ভিউ করুন</span>
                </a>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="admin-main">
            <header class="admin-topbar">
                <div class="topbar-left">
                    <button class="sidebar-toggle" data-admin-sidebar-toggle aria-label="Open navigation">
                        <i class="bi bi-list"></i>
                    </button>
                    <div class="topbar-page-meta">
                        <h1 class="page-title">@yield('page_title', 'ড্যাশবোর্ড')</h1>
                        <p class="page-subtitle">@yield('page_subtitle', 'হাসানা ইসলামিক প্ল্যাটফর্ম নিয়ন্ত্রণ ব্যবস্থা')</p>
                    </div>
                </div>

                <div class="topbar-center-bismillah">
                    <span>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                </div>

                <div class="topbar-right">
                    <a href="{{ route('hasana.home', [], false) }}" target="_blank" rel="noopener" class="topbar-btn-app" title="মূল অ্যাপ্লিকেশন দেখুন">
                        <i class="fa-solid fa-globe"></i>
                        <span class="d-none d-sm-inline">ভিউ অ্যাপ</span>
                    </a>

                    <div class="user-chip">
                        <div class="user-avatar">
                            <i class="fa-solid fa-circle-user"></i>
                        </div>
                        <div class="user-meta">
                            <span class="user-name">{{ Auth::user()->name ?? 'অ্যাডমিন' }}</span>
                            <div class="user-menu">
                                <div class="user-menu-header">
                                    <strong>{{ Auth::user()->name ?? 'অ্যাডমিন' }}</strong>
                                    <small>{{ Auth::user()->email ?? 'admin@hasana.app' }}</small>
                                </div>
                                <a href="{{ route('admin.profile.show') }}" class="user-menu-link">
                                    <i class="fa-solid fa-user-gear"></i>
                                    <span>প্রোফাইল সেটিংস</span>
                                </a>
                                <a href="{{ route('admin.settings.index') }}" class="user-menu-link">
                                    <i class="fa-solid fa-sliders"></i>
                                    <span>ওয়েবসাইট কনফিগ</span>
                                </a>
                                <form action="{{ route('logout', [], false) }}" method="POST" class="logout-form">
                                    @csrf
                                    <button type="submit">
                                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                        <span>লগআউট</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="admin-content">
                @yield('content')
            </main>
        </div>
    </div>

    <div id="admin-dialog-root"></div>
    <div id="admin-toast" class="admin-toast" role="status" aria-live="polite"></div>

    @stack('scripts')
</body>
</html>
