@extends('frontend.layouts.app')

@section('title', $surah->name_en . ' - Hasana')

@php
    $meta = $surah->meta ?? [];
    $digitsMap = ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯'];
    $formatDigits = fn ($value) => strtr((string) $value, $digitsMap);
    $nameBn = $meta['name_bn'] ?? $surah->name_en;
    $meaningBn = $meta['meaning_bn'] ?? ($meta['meaning'] ?? null);
    $revelationBn = match (strtolower($surah->revelation_type ?? '')) {
        'meccan' => 'মাক্কী',
        'medinan' => 'মাদানী',
        default => '—',
    };
    $revelationOrder = $meta['revelation_order'] ?? null;
    $summaryBn = $meta['summary_bn'] ?? ($meta['summary'] ?? $surah->summary);
@endphp

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
        <a href="{{ url()->previous() === url()->current() ? route('hasana.quran') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">{{ $nameBn }}</h1>
        <button class="header-icon" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
    </div>
</header>

<main class="main-container">
    <section class="surah-info-card-container">
        <div class="surah-info-card" id="surah-info-card">
            <h2>{{ $nameBn }}</h2>
            @if ($meaningBn)
                <p>"{{ $meaningBn }}"</p>
            @endif
            <div class="surah-info-divider"></div>
            <p class="surah-info-meta">
                {{ $revelationBn }}
                ● {{ $formatDigits($surah->ayahs->count()) }} আয়াত
                @if ($revelationOrder)
                    ● অবতীর্ণের ক্রম: {{ $formatDigits($revelationOrder) }}
                @endif
            </p>
            @if (!empty($summaryBn))
                <p class="surah-info-details">{{ $summaryBn }}</p>
            @endif
        </div>
    </section>

    <section id="ayah-container">
        @foreach ($surah->ayahs as $ayah)
            @php
                $ayahKey = $surah->number . ':' . $ayah->number;
                $translation = $ayah->text_en ?: $ayah->text_ar;
                $audioUrl = $ayah->audio_url;
            @endphp
            <article class="ayah-card" id="ayah-{{ $ayah->number }}">
                <div class="ayah-header">
                    <span class="ayah-number">{{ $formatDigits($ayahKey) }}</span>
                    <div class="ayah-actions">
                        @if ($audioUrl)
                            <a href="{{ $audioUrl }}" target="_blank" rel="noopener" class="play-btn" title="Play Audio">
                                <i class="bi bi-play-circle"></i>
                            </a>
                        @endif
                        <button type="button" class="bookmark-btn" data-ayah="{{ $ayahKey }}" title="Bookmark">
                            <i class="bi bi-bookmark"></i>
                        </button>
                        <button type="button" class="share-btn" data-ayah="{{ $ayahKey }}" title="Share">
                            <i class="bi bi-share"></i>
                        </button>
                    </div>
                </div>
                <div class="ayah-content">
                    <p class="ayah-arabic">{!! nl2br(e($ayah->text_ar)) !!}</p>
                    @if ($ayah->transliteration)
                        <p class="ayah-transliteration text-muted">{!! nl2br(e($ayah->transliteration)) !!}</p>
                    @endif
                    @if ($translation)
                        <p class="ayah-translation">{!! nl2br(e($translation)) !!}</p>
                    @endif
                    @if ($ayah->footnotes)
                        <p class="ayah-footnotes text-muted"><small>{!! nl2br(e($ayah->footnotes)) !!}</small></p>
                    @endif
                </div>
            </article>
        @endforeach
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
    <a href="{{ route('hasana.quran') }}" class="nav-item {{ request()->routeIs('hasana.quran') || request()->routeIs('hasana.surah') ? 'active' : '' }}">
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
