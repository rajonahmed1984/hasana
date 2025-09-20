@extends('frontend.layouts.app')

@section('title', $surah->name_en . ' - Hasana')

@php
    $meta = $surah->meta ?? [];
    $nameBn = $meta['name_bn'] ?? $surah->name_en;
    $meaningBn = $meta['meaning_bn'] ?? ($meta['meaning'] ?? null);
    $summaryBn = $meta['summary_bn'] ?? ($meta['summary'] ?? $surah->summary);
    $ayahCount = $surah->ayah_count ?? $surah->ayahs()->count();
@endphp

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'quran'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.quran') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title" id="surah-header-title">{{ $nameBn }}</h1>
        <button class="header-icon" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
    </div>
</header>

<main class="main-container">
    <section id="surah-app"
        data-endpoint="{{ route('api.hasana.surahs.show', $surah) }}"
        data-surah-number="{{ $surah->number }}"
        data-surah-slug="{{ $surah->slug }}"
        data-per-page="20">
        <div class="surah-info-card-container">
            <div class="surah-info-card" id="surah-info-card">
                <h2 id="surah-name">{{ $nameBn }}</h2>
                @if ($meaningBn)
                    <p id="surah-meaning">"{{ $meaningBn }}"</p>
                @else
                    <p id="surah-meaning" class="text-muted d-none"></p>
                @endif
                <div class="surah-info-divider"></div>
                <p class="surah-info-meta" id="surah-meta">
                    মোট আয়াত {{ $ayahCount }}
                </p>
                <p class="surah-info-details" id="surah-summary">
                    {!! nl2br(e($summaryBn)) !!}
                </p>
            </div>
        </div>

        <div class="ayah-toolbar">
            <input type="search" class="ayah-search" data-ayah-search placeholder="আয়াত খুঁজুন...">
        </div>

        <div id="ayah-container" class="ayah-list">
            <article class="ayah-card loading-card">
                <div class="ayah-header">
                    <span class="ayah-number shimmer"></span>
                </div>
                <div class="ayah-content">
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                </div>
            </article>
        </div>
        <p class="no-results text-muted text-center d-none" id="ayah-empty">কোনও আয়াত পাওয়া যায়নি।</p>
        <div class="pagination-controls" id="surah-pagination"></div>
        <noscript>
            <p class="text-center text-danger mt-3">এই অংশ ব্যবহারের জন্য আপনার ব্রাউজারের জাভাস্ক্রিপ্ট চালু করুন।</p>
        </noscript>
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'surah'])
@endsection
