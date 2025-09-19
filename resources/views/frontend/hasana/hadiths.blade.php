@extends('frontend.layouts.app')

@section('title', 'Hasana - à¦¹à¦¾à¦¦à¦¿à¦¸')

@section('body')
<div class="offcanvas-overlay" id="offcanvas-overlay"></div>
<aside class="offcanvas-menu" id="offcanvas-menu">
    <div class="offcanvas-header">
        <img src="{{ Vite::asset('resources/images/hasana/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <h2 class="offcanvas-title">Hasana</h2>
        <button class="close-btn" id="close-menu-btn">&times;</button>
    </div>
    <nav class="offcanvas-nav">
        <a href="{{ route('hasana.home') }}" class="offcanvas-link"><i class="bi bi-house-fill"></i> à¦¹à§‹à¦®</a>
        <a href="{{ route('hasana.quran') }}" class="offcanvas-link"><i class="bi bi-journal-text"></i> à¦•à§à¦°à¦†à¦¨</a>
        <a href="{{ route('hasana.hadiths') }}" class="offcanvas-link active"><i class="bi bi-book"></i> à¦¹à¦¾à¦¦à¦¿à¦¸</a>
        <a href="{{ route('hasana.duas') }}" class="offcanvas-link"><i class="bi bi-hurricane"></i> à¦¦à§‹à§Ÿà¦¾</a>
    </nav>
    <div class="offcanvas-footer">
        <p class="mb-0">à¦¥à¦¿à¦® à¦ªà¦°à¦¿à¦¬à¦°à§à¦¤à¦¨ à¦•à¦°à§à¦¨</p>
        <label class="toggle-switch">
            <input type="checkbox" id="dark-mode-toggle">
            <span class="slider"></span>
        </label>
    </div>
</aside>

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">à¦¹à¦¾à¦¦à¦¿à¦¸à¦¸à¦®à§‚à¦¹</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="hadis-list">
        @forelse ($hadiths as $hadith)
            <article class="hadis-card">
                <h2 class="dua-title">{{ $hadith->title }}</h2>
                @if ($hadith->text_ar)
                    <p class="dua-arabic">{!! nl2br(e($hadith->text_ar)) !!}</p>
                @endif
                @if ($hadith->text_bn)
                    <p class="hadis-text">{!! nl2br(e($hadith->text_bn)) !!}</p>
                @endif
                @if ($hadith->reference)
                    <p class="hadis-ref">{{ $hadith->reference }}</p>
                @endif
            </article>
        @empty
            <p class="text-center text-muted">à¦à¦‡ à¦®à§à¦¹à§‚à¦°à§à¦¤à§‡ à¦•à§‹à¦¨à§‹ à¦¹à¦¾à¦¦à¦¿à¦¸ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à§Ÿà¦¨à¦¿à¥¤</p>
        @endforelse
    </section>

    @if ($hadiths->hasPages())
        <div class="mt-3">
            {{ $hadiths->links() }}
        </div>
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





