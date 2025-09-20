@extends('frontend.layouts.app')

@section('title', 'Hasana - ????? ??????')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'hadiths'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">????? ??????</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
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
        </div>
        <p class="no-results text-center text-muted d-none" id="hadith-empty">????? ?????? ???? ????? ???? ?????</p>
        <div class="pagination-controls d-none" id="hadith-pagination"></div>
        <noscript>
            <p class="text-center text-danger mt-3">?? ??? ????????? ???? ????? ??????? ????</p>
        </noscript>
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'hadiths'])
@endsection