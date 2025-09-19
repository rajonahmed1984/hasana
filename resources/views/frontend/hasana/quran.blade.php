@extends('frontend.layouts.app')

@section('title', 'Hasana - কুরআন সূচি')

@php
    $digitsMap = ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯'];
    $formatDigits = fn ($value) => strtr((string) $value, $digitsMap);
@endphp

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'quran'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="fa-solid fa-arrow-left"></i>
        </a>
        <h1 class="header-title">কুরআন সূচি</h1>
        <button class="header-icon" id="search-toggle">
            <i class="bi bi-search"></i>
        </button>
    </div>
    <div class="header-search-container" id="header-search-container">
        <input type="search" class="search-bar" placeholder="সূরা খুঁজুন..." data-surah-search>
    </div>
</header>

<main class="main-container">
    <section class="mb-4">
        <div class="surah-list">
            @foreach ($surahs as $surah)
                @php
                    $meta = $surah->meta ?? [];
                    $nameBn = $meta['name_bn'] ?? $surah->name_en;
                    $meaningBn = $meta['meaning_bn'] ?? ($meta['meaning'] ?? null);
                    $meaningText = $meaningBn ? 'অর্থ: ' . $meaningBn : null;
                    $searchText = trim(sprintf('%s %s %s %s',
                        $surah->number,
                        mb_strtolower($surah->name_en ?? ''),
                        mb_strtolower($surah->name_ar ?? ''),
                        mb_strtolower($nameBn ?? '')
                    ));
                @endphp
                <a href="{{ route('hasana.surah', $surah) }}" class="surah-card" data-surah-item data-search="{{ $searchText }}">
                    <div class="surah-card-info">
                        <div class="surah-number-bg">{{ $formatDigits($surah->number) }}</div>
                        <div>
                            <p class="surah-name">{{ $nameBn }}</p>
                            @if ($meaningText)
                                <p class="surah-meaning">{{ $meaningText }}</p>
                            @endif
                        </div>
                    </div>
                    <div class="surah-card-right">
                        <p class="surah-arabic-name">{{ $surah->name_ar }}</p>
                        <p class="surah-ayat-count">আয়াত {{ $formatDigits($surah->ayahs_count) }}</p>
                    </div>
                </a>
            @endforeach
        </div>
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'quran'])
@endsection
