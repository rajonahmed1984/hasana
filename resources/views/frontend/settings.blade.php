@extends('frontend.layouts.app')

@section('title', 'Hasana - সেটিংস')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'settings'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">সেটিংস</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <div class="settings-group" data-default-arabic="{{ $defaultArabicFontSize }}" data-default-translation="{{ $defaultTranslationFontSize }}">
        <h2 class="settings-group-title">ফন্ট</h2>
        <div class="settings-list">
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="fa-solid fa-font"></i>
                    <span>আরবি ফন্ট সাইজ</span>
                </div>
                <div class="font-size-control">
                    <span class="font-size-value" id="arabic-font-value">{{ $defaultArabicFontSize }}</span>
                    <input type="range" min="20" max="40" value="{{ $defaultArabicFontSize }}" class="font-slider" id="arabic-font-slider">
                </div>
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="fa-solid fa-font"></i>
                    <span>অনুবাদ ফন্ট সাইজ</span>
                </div>
                <div class="font-size-control">
                    <span class="font-size-value" id="translation-font-value">{{ $defaultTranslationFontSize }}</span>
                    <input type="range" min="14" max="24" value="{{ $defaultTranslationFontSize }}" class="font-slider" id="translation-font-slider">
                </div>
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="fa-solid fa-language"></i>
                    <span>অনুবাদ দেখান</span>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="translation-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </div>

    <div class="settings-group">
        <h2 class="settings-group-title">অ্যাপ সম্পর্কে</h2>
        <div class="settings-list">
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>সংস্করণ</span>
                </div>
                <span>১.০.০</span>
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="fa-solid fa-book-open"></i>
                    <span>সম্পর্কে</span>
                </div>
                <a href="{{ route('hasana.about') }}" class="text-decoration-none">দেখুন</a>
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="fa-solid fa-moon"></i>
                    <span>ডার্ক মোড</span>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="dark-mode-toggle">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </div>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'settings'])
@endsection


