@extends('frontend.layouts.app')

@section('title', 'Hasana - ?????????')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'bookmarks'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">?????????</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <div class="bookmark-list" id="bookmark-list"
         data-endpoint="{{ route('hasana.bookmarks.data') }}"
         data-share-base="{{ route('hasana.share') }}">
        <p class="no-results" data-empty>???? ???????? ??????? ??? ?????</p>
    </div>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'home'])
@endsection
