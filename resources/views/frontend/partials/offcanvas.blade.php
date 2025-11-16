@php
    $activeMenu = $active ?? '';
@endphp

<div class="offcanvas-overlay" id="offcanvas-overlay"></div>
<aside class="offcanvas-menu" id="offcanvas-menu">
    <div class="offcanvas-header">
        <img src="{{ asset('resources/images/hasana/logo.svg') }}" alt="Hasana" class="offcanvas-logo">
        <h2 class="offcanvas-title">Hasana</h2>
        <button class="close-btn" id="close-menu-btn">&times;</button>
    </div>
    <nav class="offcanvas-nav">
        <a href="{{ route('hasana.home') }}" class="offcanvas-link {{ $activeMenu === 'home' ? 'active' : '' }}">
            <i class="bi bi-house-fill"></i> হোম
        </a>
        <a href="{{ route('hasana.bookmarks') }}" class="offcanvas-link {{ $activeMenu === 'bookmarks' ? 'active' : '' }}">
            <i class="bi bi-bookmark-fill"></i> বুকমার্কস
        </a>
        <a href="{{ route('hasana.settings') }}" class="offcanvas-link {{ $activeMenu === 'settings' ? 'active' : '' }}">
            <i class="bi bi-gear-fill"></i> সেটিংস
        </a>
        <a href="{{ route('hasana.about') }}" class="offcanvas-link {{ $activeMenu === 'about' ? 'active' : '' }}">
            <i class="bi bi-info-circle-fill"></i> অ্যাপ সম্পর্কে
        </a>
    </nav>
    <div class="offcanvas-footer">
        <p class="mb-0">ডার্ক মোড</p>
        <label class="toggle-switch">
            <input type="checkbox" id="dark-mode-toggle">
            <span class="slider"></span>
        </label>
    </div>
</aside>
