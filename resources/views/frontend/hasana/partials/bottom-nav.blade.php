@php
    $activeNav = $active ?? '';
@endphp

<nav class="bottom-nav">
    <a href="{{ route('hasana.quran') }}" class="nav-item {{ in_array($activeNav, ['quran', 'surah']) ? 'active' : '' }}">
        <i class="fa-solid fa-quran"></i>
        <span>কুরআন</span>
    </a>
    <a href="{{ route('hasana.hadiths') }}" class="nav-item {{ $activeNav === 'hadiths' ? 'active' : '' }}">
        <i class="fa-solid fa-book-open"></i>
        <span>হাদিস</span>
    </a>
    <a href="{{ route('hasana.home') }}" class="nav-item {{ $activeNav === 'home' ? 'active' : '' }}">
        <i class="fa-solid fa-house"></i>
        <span>হোম</span>
    </a>
    <a href="{{ route('hasana.duas') }}" class="nav-item {{ $activeNav === 'duas' ? 'active' : '' }}">
        <i class="fa-solid fa-hands-praying"></i>
        <span>দোয়া</span>
    </a>
    <a href="{{ route('hasana.umrah') }}" class="nav-item {{ $activeNav === 'umrah' ? 'active' : '' }}">
        <i class="fa-solid fa-kaaba"></i>
        <span>উমরা গাইড</span>
    </a>
</nav>
