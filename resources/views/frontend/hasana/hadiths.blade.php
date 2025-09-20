@extends('frontend.layouts.app')

@section('title', 'Hasana - হাদিস সংগ্রহ')

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
    @php($hasGroups = $hadithGroups->isNotEmpty())

    @if (!$hasGroups)
        <p class="no-results">হাদিস সংগ্রহ তৈরি করতে অ্যাডমিন প্যানেল থেকে একটি কালেকশন তৈরি করুন।</p>
    @else
        <div class="hadis-tabs" data-tab-group="hadith">
            @foreach ($hadithGroups as $group)
                <button
                    type="button"
                    class="tab-btn {{ $loop->first ? 'active' : '' }}"
                    data-tab-target="{{ $group['key'] }}"
                >
                    {{ $group['title'] }}
                </button>
            @endforeach
        </div>

        <div class="tab-panels" data-tab-panels="hadith">
            @foreach ($hadithGroups as $group)
                <section class="tab-panel {{ $loop->first ? 'active' : '' }}" data-tab-id="{{ $group['key'] }}">
                    @if (!empty($group['description']))
                        <p class="tab-description">{{ $group['description'] }}</p>
                    @endif
                    <div class="hadis-list">
                        @forelse ($group['items'] as $hadith)
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
                            <p class="no-results">এই সংগ্রহে এখনও কোনো হাদিস যোগ করা হয়নি।</p>
                        @endforelse
                    </div>
                </section>
            @endforeach
        </div>
    @endif
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'hadiths'])
@endsection
