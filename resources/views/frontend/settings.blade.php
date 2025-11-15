@extends('frontend.layouts.app')

@section('title', 'Hasana - ??????')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'settings'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">??????</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <div class="settings-group" data-default-arabic="{{ $defaultArabicFontSize }}" data-default-translation="{{ $defaultTranslationFontSize }}">
        <h2 class="settings-group-title">???</h2>
        <div class="settings-list">
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-fonts"></i>
                    <span>???? ???? ????</span>
                </div>
                <input type="range" min="20" max="40" value="{{ $defaultArabicFontSize }}" class="font-slider" id="arabic-font-slider">
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-fonts"></i>
                    <span>?????? ???? ????</span>
                </div>
                <input type="range" min="14" max="24" value="{{ $defaultTranslationFontSize }}" class="font-slider" id="translation-font-slider">
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-translate"></i>
                    <span>????? ??????</span>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="translation-toggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    </div>

    <div class="settings-group">
        <h2 class="settings-group-title">?????</h2>
        <div class="settings-list">
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-info-circle"></i>
                    <span>????????</span>
                </div>
                <span>?.?.?</span>
            </div>
            <div class="settings-item">
                <div class="settings-item-content">
                    <i class="bi bi-shield-check"></i>
                    <span>???????? ????</span>
                </div>
                <a href="#" class="text-decoration-none">?????</a>
            </div>
        </div>
    </div>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'home'])
@endsection
