@extends('frontend.layouts.app')

@section('title', 'Hasana - অ্যাপ সম্পর্কে')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'about'])

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
    <div class="about-card">
        <img src="{{ Vite::asset('resources/images/hasana/logo.svg') }}" alt="Hasana Logo" class="about-logo">
        <h2>Hasana | হাসানা</h2>
        <p class="app-tagline">কুরআন, হাদিস, দোয়া</p>
        <p class="app-description">
            হাসানা একটি আধুনিক ইসলামী প্ল্যাটফর্ম যেখানে কুরআনের আয়াত, প্রামাণিক হাদিস, দোয়া, নামাজের সময়সূচি এবং উমরা গাইড একসঙ্গে পাওয়া যায়। বাংলাভাষী ব্যবহারকারীদের জন্য তৈরী এই অ্যাপটি সহজ পাঠ ও অনুবাদের অভিজ্ঞতা নিশ্চিত করতে তৈরি করা হয়েছে।
        </p>
    </div>

    <div class="credits-card">
        <h3>স্বীকৃতি</h3>
        <div class="credit-item">
            <h4>উদ্যোগ</h4>
            <p>হাসানা রিসার্চ ফাউন্ডেশন</p>
        </div>
        <div class="credit-item">
            <h4>প্রযুক্তি সহযোগী</h4>
            <p>RD Network BD</p>
        </div>
    </div>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'home'])
@endsection
