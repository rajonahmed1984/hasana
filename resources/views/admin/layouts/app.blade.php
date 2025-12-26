<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Hasana Admin')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    @vite(['resources/js/admin.js'])
    @stack('styles')
</head>
<body class="admin-body">
    <div class="admin-layout" data-admin-app>
        <aside class="admin-sidebar" data-admin-sidebar>
            <div class="sidebar-brand">
                <a href="{{ route('hasana.home', [], false) }}" class="brand-link">
                    <i class="bi bi-moon-stars"></i>
                    <span>Hasana</span>
                </a>
                <button class="sidebar-close" data-admin-sidebar-close aria-label="Close navigation">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            @php
                $navItems = [
                    [
                        'label' => 'Surahs',
                        'icon' => 'bi-book',
                        'route' => 'admin.surahs.index',
                        'active' => request()->routeIs('admin.surahs.*'),
                    ],
                    [
                        'label' => 'Hadith',
                        'icon' => 'bi-file-earmark-text',
                        'route' => 'admin.hadiths.index',
                        'active' => request()->routeIs('admin.hadiths.*'),
                    ],
                    [
                        'label' => 'Hadith Collections',
                        'icon' => 'bi-folder',
                        'route' => 'admin.hadith-categories.index',
                        'active' => request()->routeIs('admin.hadith-categories.*'),
                    ],
                    [
                        'label' => 'Duas',
                        'icon' => 'bi-heart',
                        'route' => 'admin.duas.index',
                        'active' => request()->routeIs('admin.duas.*'),
                    ],
                    [
                        'label' => 'Dua Categories',
                        'icon' => 'bi-tag',
                        'route' => 'admin.dua-categories.index',
                        'active' => request()->routeIs('admin.dua-categories.*'),
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
                                <i class="bi {{ $item['icon'] }}"></i>
                                <span>{{ $item['label'] }}</span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </nav>
            <div class="sidebar-footer">
                <a href="{{ route('hasana.home', [], false) }}" class="sidebar-footer-link" target="_blank" rel="noopener">
                    <i class="bi bi-box-arrow-up-right"></i>
                    <span>View Frontend</span>
                </a>
            </div>
        </aside>

        <div class="admin-main">
            <header class="admin-topbar">
                <div class="topbar-left">
                    <button class="sidebar-toggle" data-admin-sidebar-toggle aria-label="Open navigation">
                        <i class="bi bi-list"></i>
                    </button>
                    <div class="topbar-page-meta">
                        <h1 class="page-title">@yield('page_title', 'Dashboard')</h1>
                        <p class="page-subtitle">@yield('page_subtitle', 'Manage Hasana content with quick inline tools.')</p>
                    </div>
                </div>
                <div class="topbar-right">
                    <div class="user-chip">
                        <div class="user-avatar">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="user-meta">
                            <span class="user-name">{{ Auth::user()->name ?? 'Admin' }}</span>
                            <form action="{{ route('logout', [], false) }}" method="POST" class="logout-form">
                                @csrf
                                <button type="submit">Sign out</button>
                            </form>
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
