@extends('frontend.layouts.app')

@section('title', 'Hasana - কুরআন সূরা তালিকা')

@section('body')
<div class="offcanvas-overlay" id="offcanvas-overlay"></div>
<aside class="offcanvas-menu" id="offcanvas-menu">
    <div class="offcanvas-header">
        <img src="{{ Vite::asset('resources/images/hasana/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <h2 class="offcanvas-title">Hasana</h2>
        <button class="close-btn" id="close-menu-btn">&times;</button>
    </div>
    <nav class="offcanvas-nav">
        <a href="{{ route('hasana.home') }}" class="offcanvas-link"><i class="bi bi-house-fill"></i> হোম</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-bookmark-fill"></i> বুকমার্কস</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-gear-fill"></i> সেটিংস</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-info-circle-fill"></i> সম্পর্কে</a>
    </nav>
    <div class="offcanvas-footer">
        <p class="mb-0">ডার্ক মোড</p>
        <label class="toggle-switch">
            <input type="checkbox" id="dark-mode-toggle">
            <span class="slider"></span>
        </label>
    </div>
</aside>

<header class="app-header sticky-top">
    <div class="header-content">
        <button class="header-icon" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
        <h1 class="header-title">কুরআন সূরা তালিকা</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="mb-4">
        <div class="search-wrapper">
            <input type="search" class="search-bar" placeholder="সূরা অনুসন্ধান করুন..." data-surah-search autofocus>
            <i class="bi bi-search"></i>
        </div>
        <div class="surah-info-card mb-3">
            <p class="mb-0">মোট {{ $surahs->count() }} টি সূরা তালিকাভুক্ত</p>
        </div>
        <div class="surah-list">
            @foreach ($surahs as $surah)
                @php
                    $searchText = trim(sprintf('%s %s %s', $surah->number, mb_strtolower($surah->name_en ?? ''), mb_strtolower($surah->name_ar ?? '')));
                @endphp
                <a href="{{ route('hasana.surah', $surah) }}" class="surah-card" data-surah-item data-search="{{ $searchText }}">
                    <div class="surah-card-info">
                        <div class="surah-number-bg">{{ $surah->number }}</div>
                        <div>
                            <p class="surah-name mb-1">{{ $surah->name_en }}</p>
                            <p class="surah-meaning mb-1">{{ $surah->name_ar }}</p>
                            <p class="surah-details mb-0">{{ ucfirst($surah->revelation_type ?? 'Unknown') }} • {{ $surah->ayahs_count }} আয়াত</p>
                        </div>
                    </div>
                    <div class="surah-card-right">
                        <p class="surah-arabic-name">{{ $surah->name_ar }}</p>
                    </div>
                </a>
            @endforeach
        </div>
    </section>
</main>

<nav class="bottom-nav">
    <a href="{{ route('hasana.home') }}" class="nav-item {{ request()->routeIs('hasana.home') ? 'active' : '' }}">
        <i class="fa-solid fa-house"></i>
        <span>হোম</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-book-open"></i>
        <span>হাদিস</span>
    </a>
    <a href="{{ route('hasana.quran') }}" class="nav-item {{ request()->routeIs('hasana.quran') ? 'active' : '' }}">
        <i class="fa-solid fa-quran"></i>
        <span>কুরআন</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-hands-praying"></i>
        <span>দোয়া</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-kaaba"></i>
        <span>ওমরাহ গাইড</span>
    </a>
</nav>
@endsection
