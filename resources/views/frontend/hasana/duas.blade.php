@extends('frontend.layouts.app')

@section('title', 'Hasana - দোয়ার সংগ্রহ')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'duas'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">দোয়ার তালিকা</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="dua-list">
        @forelse ($duas as $dua)
            <article class="dua-card">
                <h2 class="dua-title">{{ $dua->title }}</h2>
                @if ($dua->text_ar)
                    <p class="dua-arabic">{!! nl2br(e($dua->text_ar)) !!}</p>
                @endif
                @if ($dua->transliteration)
                    <p class="dua-translation">{!! nl2br(e($dua->transliteration)) !!}</p>
                @endif
                @if ($dua->text_bn)
                    <p class="hadis-text">{!! nl2br(e($dua->text_bn)) !!}</p>
                @endif
                @if ($dua->reference)
                    <p class="dua-ref">{{ $dua->reference }}</p>
                @endif
            </article>
        @empty
            <p class="text-center text-muted">কোনো দোয়া পাওয়া যায়নি।</p>
        @endforelse
    </section>

    @if ($duas->hasPages())
        <div class="mt-3">
            {{ $duas->links() }}
        </div>
    @endif
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'duas'])
@endsection
