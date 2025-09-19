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
        <a href="{{ route('hasana.home') }}" class="offcanvas-link active"><i class="bi bi-house-fill"></i>  হোম </a>
        <a href="#" class="offcanvas-link"><i class="bi bi-bookmark-fill"></i> বুকমার্ক </a>
        <a href="#" class="offcanvas-link"><i class="bi bi-gear-fill"></i>  সেটিংস</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-info-circle-fill"></i>  আমাদের সম্পর্কে</a>
    </nav>
    <div class="offcanvas-footer">
        <p class="mb-0"> ডার্ক মোড</p>
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
                    <span id="location-text">--</span>
                </div>
                <h2 id="current-time">--:-- --</h2>
                <p id="current-date">--</p>
                <p id="islamic-date">--</p>
            </div>
        </div>
        <div class="prayer-times-grid">
            <div class="prayer-time-card" id="fajr">
                <p>ফজর</p>
                <i class="bi bi-brightness-alt-high"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="dhuhr">
                <p>যোহর</p>
                <i class="bi bi-brightness-high-fill"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="asr">
                <p>আসর</p>
                <i class="bi bi-brightness-high"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="maghrib">
                <p>মাগরিব</p>
                <i class="bi bi-sunset-fill"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="isha">
                <p>ইশা</p>
                <i class="bi bi-moon-stars-fill"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
        </div>
    </section>

    @if (!empty($verseOfDay))
        <section class="greeting-card-container">
            <div class="greeting-card">
                <div class="greeting-text">
                    <h2 id="greeting-title">{{ $verseOfDay['title'] }}</h2>
                </div>
                <div class="verse-of-the-day">
                    <p id="verse-text">{{ $verseOfDay['text'] }}</p>
                    <p id="verse-reference">{{ $verseOfDay['reference'] }}</p>
                </div>
            </div>
        </section>
    @endif
</main>

<nav class="bottom-nav">
    <a href="{{ route('hasana.quran') }}" class="nav-item {{ request()->routeIs('hasana.quran') || request()->routeIs('hasana.surah') ? 'active' : '' }}">
        <i class="fa-solid fa-quran"></i>
        <span>কুরআন</span>
    </a>
    <a href="{{ route('hasana.hadiths') }}" class="nav-item {{ request()->routeIs('hasana.hadiths') ? 'active' : '' }}">
        <i class="fa-solid fa-book-open"></i>
        <span>হাদিস</span>
    </a>
    <a href="{{ route('hasana.home') }}" class="nav-item {{ request()->routeIs('hasana.home') ? 'active' : '' }}">
        <i class="fa-solid fa-house"></i>
        <span>হোম</span>
    </a>
    <a href="{{ route('hasana.duas') }}" class="nav-item {{ request()->routeIs('hasana.duas') ? 'active' : '' }}">
        <i class="fa-solid fa-hands-praying"></i>
        <span>দোয়া</span>
    </a>
    <a href="{{ route('hasana.umrah') }}" class="nav-item {{ request()->routeIs('hasana.umrah') ? 'active' : '' }}">
        <i class="fa-solid fa-kaaba"></i>
        <span>ওমরাহ গাইড</span>
    </a>
</nav>
@endsection



