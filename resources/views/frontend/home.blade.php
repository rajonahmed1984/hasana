@extends('frontend.layouts.app')

@section('title', 'Hasana')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'home'])

<header class="app-header sticky-top">
    <div class="header-content">
        <button class="header-icon" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
        <img src="{{ logo_url() }}" alt="{{ setting('site_name', 'Hasana') }}" class="offcanvas-logo">
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
                    <p id="verse-text-ar" class="arabic-text">{{ $verseOfDay['text_ar'] }}</p>
                    @if(!empty($verseOfDay['text_bn']))
                        <p id="verse-text-bn" class="translation-text">{{ $verseOfDay['text_bn'] }}</p>
                    @endif
                    @if(!empty($verseOfDay['transliteration']))
                        <p id="verse-transliteration" class="transliteration-text">{{ $verseOfDay['transliteration'] }}</p>
                    @endif
                    <p id="verse-reference">{{ $verseOfDay['reference'] }}</p>
                </div>
            </div>
        </section>
    @endif
</main>

@include('frontend.partials.bottom-nav', ['active' => 'home'])
@endsection
