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
        default => 'অজানা',
    };
    $revelationOrder = $meta['revelation_order'] ?? null;
    $summaryBn = $meta['summary_bn'] ?? ($meta['summary'] ?? $surah->summary);
@endphp

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'quran'])

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
                {{ $revelationBn }} • আয়াত {{ $formatDigits($surah->ayahs->count()) }}
                @if ($revelationOrder)
                    • অবতরণের ধারায়: {{ $formatDigits($revelationOrder) }}
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
                $translation = trim($ayah->text_bn ?? '') ?: null;
                $pronunciation = trim($ayah->transliteration ?? '') ?: null;
                $audioUrl = $ayah->audio_url;
            @endphp
            <article class="ayah-card" id="ayah-{{ $ayah->number }}" data-ayah-key="{{ $ayahKey }}">
                <div class="ayah-header">
                    <span class="ayah-number">{{ $formatDigits($ayahKey) }}</span>
                    <div class="ayah-actions">
                        @if ($audioUrl)
                            <a href="{{ $audioUrl }}" target="_blank" rel="noopener" class="play-btn" title="অডিও শুনুন">
                                <i class="bi bi-play-circle"></i>
                            </a>
                        @endif
                        <button type="button" class="bookmark-btn" data-ayah="{{ $ayahKey }}" title="বুকমার্ক">
                            <i class="bi bi-bookmark"></i>
                        </button>
                        <button type="button" class="share-btn" data-ayah="{{ $ayahKey }}" title="শেয়ার">
                            <i class="bi bi-share"></i>
                        </button>
                    </div>
                </div>
                <div class="ayah-content">
                    @if ($translation)
                        <p class="ayah-translation">{!! nl2br(e($translation)) !!}</p>
                    @endif
                    @if ($pronunciation)
                        <p class="ayah-transliteration text-muted">{!! nl2br(e($pronunciation)) !!}</p>
                    @endif
                    <p class="ayah-arabic">{!! nl2br(e($ayah->text_ar)) !!}</p>
                    @if ($ayah->footnotes)
                        <p class="ayah-footnotes text-muted"><small>{!! nl2br(e($ayah->footnotes)) !!}</small></p>
                    @endif
                </div>
            </article>
        @endforeach
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'surah'])
@endsection
