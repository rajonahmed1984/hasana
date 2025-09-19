@extends('frontend.layouts.app')

@section('title', 'Hasana - হাদিস তালিকা')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'hadiths'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">হাদিস সংগ্রহ</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="hadis-list">
        @forelse ($hadiths as $hadith)
            <article class="hadis-card">
                <h2 class="dua-title">{{ $hadith->title }}</h2>
                @if ($hadith->text_ar)
                    <p class="dua-arabic">{!! nl2br(e($hadith->text_ar)) !!}</p>
                @endif
                @if ($hadith->text_bn)
                    <p class="hadis-text">{!! nl2br(e($hadith->text_bn)) !!}</p>
                @endif
                @if ($hadith->reference)
                    <p class="hadis-ref">{{ $hadith->reference }}</p>
                @endif
            </article>
        @empty
            <p class="text-center text-muted">কোনো হাদিস পাওয়া যায়নি।</p>
        @endforelse
    </section>

    @if ($hadiths->hasPages())
        <div class="mt-3">
            {{ $hadiths->links() }}
        </div>
    @endif
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'hadiths'])
@endsection
