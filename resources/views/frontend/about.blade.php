@extends('frontend.layouts.app')

@section('title', 'Hasana - অ্যাপ সম্পর্কে')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'about'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ route('hasana.home') }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">অ্যাপ সম্পর্কে</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <div class="text-center">
        <div class="about-card">
            <img src="{{ asset('images/logo.svg') }}" alt="{{ setting('site_name', 'Hasana') }} Logo" class="about-logo" style="width: 160px; height: auto; margin-bottom: 16px;">
            <h2>Hasana | হাসানা</h2>
            <p class="app-tagline">কুরআন, হাদিস, দোয়া</p>
            <p class="app-description">
                হাসানা একটি ইসলামিক মোবাইল অ্যাপ্লিকেশন যেখানে আপনি কুরআন শরীফ, নির্বাচিত হাদীস, দোয়া পাঠের সহজ সুবিধা পাবেন। আপনি প্রতিদিন সকাল থেকে সন্ধ্যা পর্যন্ত নামাজের সময় জেনে নিতে পারবেন। এছাড়াও রয়েছে উমরাহ ও হজ্জের গাইডলাইন যা আপনার যাত্রা সহজ করবে।
            </p>
        </div>

        <div class="credits-card">
            <h3>কৃতজ্ঞতা</h3>
            <div class="credit-item">
                <h4>হাদিস</h4>
                <p>ইসলামিক ফাউন্ডেশন বাংলাদেশ</p>
                <small>(সহীহ বুখারী, সহীহ মুসলিম, সুন্নান তিরমিজি, সুন্নান আবু দাউদ, সুন্নান নাসাঈ, সুন্নান ইবনে মাযাহ)</small>
            </div>
            <div class="credit-item">
                <h4>আল কুরআন অনুবাদ</h4>
                <p>হাফেজ মুনির উদ্দীন আহমদ</p>
                <small>(কোরআন শরীফ: সহজ সরল বাংলা অনুবাদ)</small>
            </div>        
            <div class="credit-item">
                <h4>তত্ত্বাবধান ও পরিচালনা এবং ডেভেলপমেন্ট বাই</h4>
                <p><a href="https://apptimatic.com" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">Apptimatic</a></p>
            </div>
        </div>
    </div>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'home'])
@endsection


