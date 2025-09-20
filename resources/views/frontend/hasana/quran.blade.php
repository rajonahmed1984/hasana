@extends('frontend.layouts.app')

@section('title', 'Hasana - কুরআন সূচি')

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
        <input type="search" class="search-bar" placeholder="সুরা খুঁজুন..." data-surah-search>
    </div>
</header>

<main class="main-container">
    <section class="mb-4" id="quran-app"
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
        </div>
        <p class="no-results text-muted text-center d-none" id="quran-empty-message">
            কোনও ফলাফল পাওয়া যায়নি।
        </p>
        <div class="pagination-controls" id="quran-pagination"></div>
        <noscript>
            <p class="text-center text-danger mt-3">এই অংশ ব্যবহারের জন্য আপনার ব্রাউজারের জাভাস্ক্রিপ্ট চালু করুন।</p>
        </noscript>
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'quran'])
@endsection
