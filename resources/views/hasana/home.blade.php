@extends('hasana.layouts.app')

@section('title', 'Hasana - সূরা তালিকা')

@section('body')
<div class="offcanvas-overlay" id="offcanvas-overlay"></div>
<aside class="offcanvas-menu" id="offcanvas-menu">
    <div class="offcanvas-header">
        <img src="{{ Vite::asset('resources/hasana/img/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <h2 class="offcanvas-title">Hasana</h2>
        <button class="close-btn" id="close-menu-btn">&times;</button>
    </div>
    <nav class="offcanvas-nav">
        <a href="{{ route('hasana.home') }}" class="offcanvas-link active"><i class="bi bi-house-fill"></i> হোম</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-bookmark-fill"></i> বুকমার্কস <small class="text-muted ms-1">(শীঘ্রই)</small></a>
        <a href="#" class="offcanvas-link"><i class="bi bi-gear-fill"></i> সেটিংস</a>
        <a href="#" class="offcanvas-link"><i class="bi bi-info-circle-fill"></i> সম্পর্কে</a>
    </nav>
    <div class="offcanvas-footer">
        <p class="mb-0">ডার্ক মোড</p>
        <label class="toggle-switch">
            <input type="checkbox" disabled>
            <span class="slider"></span>
        </label>
    </div>
</aside>

<header class="app-header sticky-top">
    <div class="header-content">
        <button class="header-icon" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
        <img src="{{ Vite::asset('resources/hasana/img/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="greeting-card-container">
        <div class="greeting-card">
            <div class="greeting-text">
                <h2 class="mb-2">আসসালামু আলাইকুম</h2>
                <p class="mb-2">আজ {{ now()->format('l, d F Y') }}</p>
            </div>
            <div class="verse-of-the-day">
                <p class="mb-0">“পড় তোমার প্রভুর নামে যিনি সৃষ্টি করেছেন।” <span class="d-block">(সূরা আলাক ৯৬:১)</span></p>
            </div>
        </div>
    </section>

    <section class="surah-info-card-container">
        <div class="surah-info-card">
            <p class="surah-info-meta mb-2">মোট {{ $surahs->count() }} টি সূরা যুক্ত হয়েছে</p>
            <p class="surah-info-details mb-0">আপনি প্রত্যেকটি সূরার বিস্তারিত আয়াত দেখতে নিচের তালিকা থেকে নির্বাচন করতে পারেন।</p>
        </div>
    </section>

    <section class="mb-4">
        <div class="mb-3">
            <input type="search" class="search-bar" placeholder="সূরা খুঁজুন..." data-surah-search>
        </div>
        <div class="surah-list">
            @foreach ($surahs as $surah)
                <a href="{{ route('hasana.surah', $surah) }}" class="surah-card" data-surah-item data-search="{{ $surah->number }} {{ $surah->name_en }} {{ $surah->name_ar }}">
                    <div class="surah-card-info">
                        <div class="surah-number-bg">{{ $surah->number }}</div>
                        <div>
                            <p class="surah-name mb-1">{{ $surah->name_en }}</p>
                            <p class="surah-meaning mb-0">{{ $surah->name_ar }}</p>
                            <p class="surah-details mb-0">{{ ucfirst($surah->revelation_type ?? 'Unknown') }} · {{ $surah->ayahs_count }} আয়াত</p>
                        </div>
                    </div>
                    <div class="surah-arabic-name">{{ $surah->name_ar }}</div>
                </a>
            @endforeach
        </div>
    </section>
</main>

<nav class="bottom-nav">
    <a href="{{ route('hasana.home') }}" class="nav-item active">
        <i class="fa-solid fa-quran"></i>
        <span>কুরআন</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-book-open-reader"></i>
        <span>হাদিস</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-hands-praying"></i>
        <span>দোয়া</span>
    </a>
    <a href="#" class="nav-item">
        <i class="fa-solid fa-kaaba"></i>
        <span>উমরাহ</span>
    </a>
</nav>
@endsection

