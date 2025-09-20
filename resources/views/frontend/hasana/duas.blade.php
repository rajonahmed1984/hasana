@extends('frontend.layouts.app')

@section('title', 'Hasana - ??? ? ?????')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'duas'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">??? ? ?????</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section id="dua-app"
        data-category-endpoint="{{ route('api.hasana.duas.categories') }}"
        data-dua-endpoint="{{ route('api.hasana.duas.index') }}"
        data-per-page="6">
        <div class="hadis-tabs" id="dua-tabs"></div>
        <p class="tab-description d-none" id="dua-description"></p>
        <div class="dua-list" id="dua-list">
            <article class="dua-card loading-card">
                <div class="dua-card-body">
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                </div>
            </article>
            <article class="dua-card loading-card">
                <div class="dua-card-body">
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                    <p class="line shimmer"></p>
                </div>
            </article>
        </div>
        <p class="no-results text-center text-muted d-none" id="dua-empty">??? ????????? ???? ???? ???????? ???????? ???? ????????? ????? ?????</p>
        <div class="pagination-controls d-none" id="dua-pagination"></div>
        <noscript>
            <p class="text-center text-danger mt-3">?? ??? ????????? ???? ????? ??????? ????</p>
        </noscript>
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'duas'])
@endsection