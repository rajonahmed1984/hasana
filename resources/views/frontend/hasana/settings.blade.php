@extends('frontend.layouts.app')

@section('title', 'Hasana - সেটিংস')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'settings'])

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
        <h2 class="settings-group-title">পাঠ</h2>
        <div class="settings-list">
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-fonts"></i>
                    <span>আরবি ফন্ট সাইজ</span>
                </div>
                <input type="range" min="20" max="40" value="{{ $defaultArabicFontSize }}" class="font-slider" id="arabic-font-slider">
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-fonts"></i>
                    <span>অনুবাদ ফন্ট সাইজ</span>
                </div>
                <input type="range" min="14" max="24" value="{{ $defaultTranslationFontSize }}" class="font-slider" id="translation-font-slider">
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-translate"></i>
                    <span>বাংলা অনুবাদ</span>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="translation-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </div>

    <div class="settings-group">
        <h2 class="settings-group-title">অ্যাপ</h2>
        <div class="settings-list">
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-info-circle"></i>
                    <span>হালনাগাদ</span>
                </div>
                <span>১.০.০</span>
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-shield-check"></i>
                    <span>গোপনীয়তা নীতি</span>
                </div>
                <a href="#" class="text-decoration-none">দেখুন</a>
            </div>
        </div>
    </div>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'home'])
@endsection
