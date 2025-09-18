@extends('frontend.layouts.app')

@section('title', 'Hasana')

@section('body')
<div class="offcanvas-overlay" id="offcanvas-overlay"></div>
<aside class="offcanvas-menu" id="offcanvas-menu">
    <div class="offcanvas-header">
        <img src="{{ Vite::asset('resources/images/hasana/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <h2 class="offcanvas-title">Hasana</h2>
        <button class="close-btn" id="close-menu-btn">&times;</button>
    </div>
    <nav class="offcanvas-nav">
        <a href="{{ route('hasana.home') }}" class="offcanvas-link active"><i class="bi bi-house-fill"></i> ???</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-bookmark-fill"></i> ?????????</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-gear-fill"></i> ??????</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-info-circle-fill"></i> ????????</a>
    </nav>
    <div class="offcanvas-footer">
        <p class="mb-0">????? ???</p>
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
        <img src="{{ Vite::asset('resources/images/hasana/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="prayer-times-section">
        <div class="prayer-header">
            <div>
                <div class="location">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span id="location-text">????? ?????? ??? ?????…</span>
                </div>
                <h2 id="current-time">--:-- --</h2>
                <p id="current-date">{{ now()->format('l, d F Y') }}</p>
                <p id="islamic-date"></p>
            </div>
        </div>
        <div class="prayer-times-grid">
            <div class="prayer-time-card" id="fajr">
                <p>???</p>
                <i class="bi bi-brightness-alt-high"></i>
                <p class="time">--:--</p>
                <p class="end-time">??? ????: --:--</p>
            </div>
            <div class="prayer-time-card" id="dhuhr">
                <p>????</p>
                <i class="bi bi-brightness-high-fill"></i>
                <p class="time">--:--</p>
                <p class="end-time">??? ????: --:--</p>
            </div>
            <div class="prayer-time-card" id="asr">
                <p>???</p>
                <i class="bi bi-brightness-high"></i>
                <p class="time">--:--</p>
                <p class="end-time">??? ????: --:--</p>
            </div>
            <div class="prayer-time-card" id="maghrib">
                <p>??????</p>
                <i class="bi bi-sunset-fill"></i>
                <p class="time">--:--</p>
                <p class="end-time">??? ????: --:--</p>
            </div>
            <div class="prayer-time-card" id="isha">
                <p>???</p>
                <i class="bi bi-moon-stars-fill"></i>
                <p class="time">--:--</p>
                <p class="end-time">??? ????: --:--</p>
            </div>
        </div>
    </section>

    <section class="greeting-card-container">
        <div class="greeting-card">
            <div class="greeting-text">
                <h2 class="mb-1">???????? ???????</h2>
                <p class="mb-0">?? {{ now()->format('l, d F Y') }}</p>
            </div>
            <div class="verse-of-the-day" id="verse-text">
                <p class="mb-0">"?? ???? ?????? ???, ???? ???????? ?????? ????"</p>
                <span class="d-block">(???? ??-????? ??:?)</span>
            </div>
        </div>
    </section>

    <section class="quick-action-grid">
        <a href="{{ route('hasana.home') }}" class="quick-action-card">
            <i class="fa-solid fa-quran"></i>
            <div>
                <h3>???? ??????</h3>
                <p>?? ???? ?? ??????</p>
            </div>
        </a>
        <a href="#" class="quick-action-card">
            <i class="fa-solid fa-book-open-reader"></i>
            <div>
                <h3>???? ????</h3>
                <p>???????? ????? ??????</p>
            </div>
        </a>
        <a href="#" class="quick-action-card">
            <i class="fa-solid fa-kaaba"></i>
            <div>
                <h3>???? ? ??????</h3>
                <p>????? ???? ?????????</p>
            </div>
        </a>
    </section>

    <section class="mb-4">
        <div class="search-wrapper">
            <input type="search" class="search-bar" placeholder="???? ?????..." data-surah-search>
            <i class="bi bi-search"></i>
        </div>
        <div class="surah-list">
            @foreach ($surahs as $surah)
                <a href="{{ route('hasana.surah', $surah) }}" class="surah-card" data-surah-item data-search="{{ $surah->number }} {{ $surah->name_en }} {{ $surah->name_ar }}">
                    <div class="surah-card-info">
                        <div class="surah-number-bg">{{ $surah->number }}</div>
                        <div>
                            <p class="surah-name mb-1">{{ $surah->name_en }}</p>
                            <p class="surah-meaning mb-1">{{ $surah->name_ar }}</p>
                            <p class="surah-details mb-0">{{ ucfirst($surah->revelation_type ?? 'Unknown') }} • {{ $surah->ayahs_count }} ????</p>
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
    <a href="{{ route('hasana.home') }}" class="nav-item active">
        <i class="fa-solid fa-quran"></i>
        <span>?????</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-book-open-reader"></i>
        <span>?????????</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-hands-praying"></i>
        <span>????</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-kaaba"></i>
        <span>?????</span>
    </a>
</nav>
@endsection
