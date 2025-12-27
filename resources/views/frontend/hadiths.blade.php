@extends('frontend.layouts.app')

@section('title', 'Hasana - হাদিস শরীফ')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'hadiths'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="fa-solid fa-arrow-left"></i>
        </a>
        <h1 class="header-title">হাদিস শরীফ</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <!-- Hadith Info Card -->
    <section class="hadith-info-card">
        <div class="hadith-info-content">
            <i class="fa-solid fa-book-open"></i>
            <div>
                <h3>হাদিস শরীফ</h3>
                <p>নির্বানিত হাদিস সংগ্রহ</p>
            </div>
        </div>
    </section>

    <section id="hadith-app"
        data-category-endpoint="{{ route('api.hasana.hadiths.categories') }}"
        data-hadith-endpoint="{{ route('api.hasana.hadiths.index') }}"
        data-per-page="6">
        <div class="hadis-tabs" id="hadith-tabs"></div>
        <p class="tab-description d-none" id="hadith-description"></p>
        <div class="hadis-list" id="hadith-list">
            <article class="hadis-card loading-card">
                <div class="hadis-card-header">
                    <span class="line shimmer"></span>
                </div>
                <div class="hadis-card-body">
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                </div>
            </article>
            <article class="hadis-card loading-card">
                <div class="hadis-card-header">
                    <span class="line shimmer"></span>
                </div>
                <div class="hadis-card-body">
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                </div>
            </article>
            <article class="hadis-card loading-card">
                <div class="hadis-card-header">
                    <span class="line shimmer"></span>
                </div>
                <div class="hadis-card-body">
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                </div>
            </article>
        </div>
        <p class="no-results hidden" id="hadith-empty">কোনো হাদিস পাওয়া যায়নি</p>
        <div class="pagination-controls d-none" id="hadith-pagination"></div>
        <noscript>
            <p class="text-center text-danger mt-3">জাভাস্ক্রিপ্ট সক্রিয় করুন যাতে পূর্ণ কার্যকারিতা পাওয়া যায়</p>
        </noscript>
    </section>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'hadiths'])
@endsection


