@extends('frontend.layouts.app')

@section('title', 'Hasana - অ্যাপ সম্পর্কে')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'about'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="fa-solid fa-arrow-left"></i>
        </a>
        <h1 class="header-title">অ্যাপ সম্পর্কে</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <div class="about-card">
        <img src="{{ logo_url() }}" alt="{{ setting('site_name', 'Hasana') }} Logo" class="about-logo">
        <h2>Hasana | হাসানা</h2>
        <p class="app-tagline">কুরআন, হাদিস, দোয়া</p>
        <p class="app-description">
            হাসানা একটি ইসলামিক মোবাইল অ্যাপ্লিকেশন যেখানে আপনি কুরআন শরীফ, নির্বাচিত হাদীস, দোয়া, তাসবীহ পাঠের সহজ সুবিধা পাবেন। আপনি প্রতিদিন সকাল থেকে সন্ধ্যা পর্যন্ত নামাজের সময় জেনে নিতে পারবেন। এছাড়াও রয়েছে উমরাহ ও হজ্জের গাইডলাইন যা আপনার যাত্রা সহজ করবে।
        </p>
    </div>

    <div class="credits-card">
        <h3>কৃতজ্ঞতা</h3>
        <div class="credit-item">
            <h4>ডেটা</h4>
            <p>কুরআন অনুবাদ ইসলামিক ফাউন্ডেশন বাংলাদেশ</p>
        </div>
        <div class="credit-item">
            <h4>তত্ত্বাবধান ও পরিচালনা</h4>
            <p>RD Network BD</p>
        </div>
        <div class="credit-item">
            <h4>ডেভেলপমেন্ট</h4>
            <p>Developed by <a href="https://apptimatic.com" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">Apptimatic</a></p>
        </div>
    </div>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'home'])
@endsection


