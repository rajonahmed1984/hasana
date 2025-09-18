@extends('frontend.layouts.app')

@section('title', $surah->name_en . ' - Hasana')

@section('body')
<div class="offcanvas-overlay" id="offcanvas-overlay"></div>
<aside class="offcanvas-menu" id="offcanvas-menu">
    <div class="offcanvas-header">
        <img src="{{ Vite::asset('resources/images/hasana/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <h2 class="offcanvas-title">Hasana</h2>
        <button class="close-btn" id="close-menu-btn">&times;</button>
    </div>
    <nav class="offcanvas-nav">
        <a href="{{ route('hasana.home') }}" class="offcanvas-link"><i class="bi bi-house-fill"></i> ???</a>
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
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">{{ $surah->name_en }}</h1>
        <button class="header-icon" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
    </div>
</header>

<main class="main-container">
    <section class="surah-info-card-container">
        <div class="surah-info-card">
            <p class="surah-info-meta mb-2">???? {{ $surah->number }} • {{ ucfirst($surah->revelation_type ?? 'Unknown') }}</p>
            <h2 class="mb-1">{{ $surah->name_en }}</h2>
            <p class="surah-info-details mb-2">{{ $surah->name_ar }}</p>
            <p class="surah-info-details mb-0">??? {{ $surah->ayahs->count() }} ????</p>
        </div>
    </section>

    @foreach ($surah->ayahs as $ayah)
        <article class="ayah-card" id="ayah-{{ $ayah->number }}">
            <div class="ayah-header">
                <span class="ayah-number">????? {{ $ayah->number }}</span>
            </div>
            <div class="ayah-arabic">{!! nl2br(e($ayah->text_ar)) !!}</div>
            @if ($ayah->transliteration)
                <p class="ayah-translation text-muted">{!! nl2br(e($ayah->transliteration)) !!}</p>
            @endif
            @if ($ayah->text_en)
                <p class="ayah-translation">{!! nl2br(e($ayah->text_en)) !!}</p>
            @endif
            @if ($ayah->footnotes)
                <p class="ayah-translation text-muted"><small>{!! nl2br(e($ayah->footnotes)) !!}</small></p>
            @endif
        </article>
    @endforeach
</main>

<nav class="bottom-nav">
    <a href="{{ route('hasana.home') }}" class="nav-item {{ request()->routeIs('hasana.home') ? 'active' : '' }}">
        <i class="fa-solid fa-house"></i>
        <span>???</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-book-open"></i>
        <span>?????</span>
    </a>
    <a href="{{ route('hasana.quran') }}" class="nav-item {{ request()->routeIs('hasana.quran') || request()->routeIs('hasana.surah') ? 'active' : '' }}">
        <i class="fa-solid fa-quran"></i>
        <span>?????</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-hands-praying"></i>
        <span>????</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-kaaba"></i>
        <span>????? ????</span>
    </a>
</nav>
@endsection

