@extends('frontend.layouts.app')

@section('title', 'Hasana - ইসলামিক অ্যাপ্লিকেশন')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'home'])

<header class="app-header sticky-top">
    <div class="header-content">
        <button class="header-icon" id="menu-toggle">
            <i class="fa-solid fa-bars"></i>
        </button>
        <h1 class="header-title">হাসানা</h1>
        <a href="{{ route('hasana.bookmarks') }}" class="header-icon">
            <i class="fa-solid fa-bookmark"></i>
        </a>
    </div>
</header>

<main class="main-container">
    <!-- Prayer Times Section -->
    <section class="prayer-times-section">
        <div class="prayer-header">
            <div>
                <div class="location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span id="location-text">ঢাকা, বাংলাদেশ</span>
                </div>
                <h2 id="current-time">--:-- --</h2>
                <p id="current-date">--</p>
                <p id="islamic-date">--</p>
            </div>
        </div>
        <div class="prayer-times-grid">
            <div class="prayer-time-card" id="fajr">
                <p>ফজর</p>
                <i class="fa-solid fa-cloud-sun"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="dhuhr">
                <p>যোহর</p>
                <i class="fa-solid fa-sun"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="asr">
                <p>আসর</p>
                <i class="fa-solid fa-sun"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="maghrib">
                <p>মাগরিব</p>
                <i class="fa-solid fa-cloud-moon"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
            <div class="prayer-time-card" id="isha">
                <p>ইশা</p>
                <i class="fa-solid fa-star-and-crescent"></i>
                <p class="time">--:--</p>
                <p class="end-time">--:--</p>
            </div>
        </div>
    </section>

    <!-- Verse of the Day -->
    @if (!empty($verseOfDay))
        <section class="greeting-card-container">
            <div class="greeting-card">
                <div class="greeting-text">
                    <h2 id="greeting-title">
                        <i class="fa-solid fa-bookmark-star"></i> {{ $verseOfDay['title'] }}
                    </h2>
                </div>
                <div class="verse-of-the-day">
                    <p id="verse-text-ar" class="arabic-text">{{ $verseOfDay['text_ar'] }}</p>
                    @if(!empty($verseOfDay['text_bn']))
                        <p id="verse-text-bn" class="translation-text">{{ $verseOfDay['text_bn'] }}</p>
                    @endif
                    @if(!empty($verseOfDay['transliteration']))
                        <p id="verse-transliteration" class="transliteration-text">{{ $verseOfDay['transliteration'] }}</p>
                    @endif
                    <p id="verse-reference" class="verse-reference">{{ $verseOfDay['reference'] }}</p>
                </div>
            </div>
        </section>
    @endif

    <!-- Quick Access Cards -->
    <section class="quick-access-section">
        <h3 class="section-title">দ্রুত অ্যাক্সেস</h3>
        <div class="quick-access-grid">
            <a href="{{ route('hasana.quran') }}" class="quick-card">
                <div class="quick-card-icon">
                    <i class="fa-solid fa-quran"></i>
                </div>
                <h4>আল-কুরআন</h4>
                <p>পবিত্র কুরআন শরীফ পড়ুন</p>
            </a>
            <a href="{{ route('hasana.hadiths') }}" class="quick-card">
                <div class="quick-card-icon">
                    <i class="fa-solid fa-book-open"></i>
                </div>
                <h4>হাদিস শরীফ</h4>
                <p>নির্বাচিত হাদিস পড়ুন</p>
            </a>
            <a href="{{ route('hasana.duas') }}" class="quick-card">
                <div class="quick-card-icon">
                    <i class="fa-solid fa-hands-praying"></i>
                </div>
                <h4>দোয়া সমূহ</h4>
                <p>দৈনন্দিন দোয়া শিখুন</p>
            </a>
            <a href="{{ route('hasana.umrah') }}" class="quick-card">
                <div class="quick-card-icon">
                    <i class="fa-solid fa-compass"></i>
                </div>
                <h4>উমরা গাইড</h4>
                <p>উমরার নিয়মাবলী জানুন</p>
            </a>
        </div>
    </section>

    <!-- Islamic Features -->
    <section class="features-section">
        <h3 class="section-title">বৈশিষ্ট্য সমূহ</h3>
        <div class="feature-list">
            <div class="feature-item">
                <i class="fa-solid fa-clock"></i>
                <div class="feature-content">
                    <h4>নামাজের সময়সূচী</h4>
                    <p>প্রতিদিন সঠিক সময়ে নামাজের তথ্য পান</p>
                </div>
            </div>
            <div class="feature-item">
                <i class="fa-solid fa-bookmark"></i>
                <div class="feature-content">
                    <h4>বুকমার্ক</h4>
                    <p>আপনার প্রিয় আয়াত সংরক্ষণ করুন</p>
                </div>
            </div>
            <div class="feature-item">
                <i class="fa-solid fa-share-nodes"></i>
                <div class="feature-content">
                    <h4>শেয়ার করুন</h4>
                    <p>আয়াত ও দোয়া শেয়ার করুন</p>
                </div>
            </div>
            <div class="feature-item">
                <i class="fa-solid fa-moon"></i>
                <div class="feature-content">
                    <h4>ডার্ক মোড</h4>
                    <p>রাতের জন্য আরামদায়ক ডার্ক মোড</p>
                </div>
            </div>
        </div>
    </section>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'home'])
@endsection


