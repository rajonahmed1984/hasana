@extends('frontend.layouts.app')

@section('title', 'Hasana - আল কুরআন')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'quran'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">আল কুরআন</h1>
        <button class="header-icon" id="search-toggle">
            <i class="fa-solid fa-magnifying-glass"></i>
        </button>
    </div>
    <div class="header-search-container" id="header-search-container">
        <input type="search" class="search-bar" placeholder="সূরা খুঁজুন (যেমন: ফাতিহা, fatiha)..." data-surah-search>
    </div>
</header>

<main class="main-container">
    <!-- Quran Info Card -->
    <section class="quran-info-card">
        <div class="quran-info-content">
            <i class="fa-solid fa-quran"></i>
            <div>
                <h3>পবিত্র কুরআন শরীফ</h3>
                <p>১১৪টি সূরা • ৬,২৩৬টি আয়াত</p>
            </div>
        </div>
    </section>

    <!-- Surah List -->
    <section class="quran-section" id="quran-app"
        data-endpoint="{{ route('api.hasana.surahs.index') }}"
        data-surah-url="{{ url('surah') }}"
        data-per-page="30">
        <div class="surah-list" id="quran-surah-list">
            <div class="surah-card loading-card">
                <div class="surah-card-info">
                    <div class="surah-number-bg shimmer"></div>
                    <div class="loading-lines">
                        <span class="line shimmer"></span>
                        <span class="line shimmer"></span>
                    </div>
                </div>
                <div class="surah-card-right">
                    <span class="line shimmer"></span>
                    <span class="line shimmer"></span>
                </div>
            </div>
            <div class="surah-card loading-card">
                <div class="surah-card-info">
                    <div class="surah-number-bg shimmer"></div>
                    <div class="loading-lines">
                        <span class="line shimmer"></span>
                        <span class="line shimmer"></span>
                    </div>
                </div>
                <div class="surah-card-right">
                    <span class="line shimmer"></span>
                    <span class="line shimmer"></span>
                </div>
            </div>
            <div class="surah-card loading-card">
                <div class="surah-card-info">
                    <div class="surah-number-bg shimmer"></div>
                    <div class="loading-lines">
                        <span class="line shimmer"></span>
                        <span class="line shimmer"></span>
                    </div>
                </div>
                <div class="surah-card-right">
                    <span class="line shimmer"></span>
                    <span class="line shimmer"></span>
                </div>
            </div>
        </div>
        <p class="no-results hidden" id="quran-empty-message">
            কোনো সূরা পাওয়া যায়নি
        </p>
        <div class="pagination-controls" id="quran-pagination"></div>
        <noscript>
            <p class="text-center text-danger mt-3">জাভাস্ক্রিপ্ট সক্রিয় করুন যাতে পূর্ণ কার্যকারিতা পাওয়া যায়</p>
        </noscript>
    </section>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'quran'])
@endsection


