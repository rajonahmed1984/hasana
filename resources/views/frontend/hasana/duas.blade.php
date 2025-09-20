@extends('frontend.layouts.app')

@section('title', 'Hasana - দোআ ও যিকির')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'duas'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">দোআ ও যিকির</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    @php($hasGroups = $duaGroups->isNotEmpty())

    @if (!$hasGroups)
        <p class="no-results">দোআ ক্যাটাগরি তৈরি করতে অ্যাডমিন প্যানেলে একটি ক্যাটাগরি যুক্ত করুন।</p>
    @else
        <div class="hadis-tabs" data-tab-group="dua">
            @foreach ($duaGroups as $group)
                <button
                    type="button"
                    class="tab-btn {{ $loop->first ? 'active' : '' }}"
                    data-tab-target="{{ $group['key'] }}"
                >
                    {{ $group['title'] }}
                </button>
            @endforeach
        </div>

        <div class="tab-panels" data-tab-panels="dua">
            @foreach ($duaGroups as $group)
                <section class="tab-panel {{ $loop->first ? 'active' : '' }}" data-tab-id="{{ $group['key'] }}">
                    @if (!empty($group['description']))
                        <p class="tab-description">{{ $group['description'] }}</p>
                    @endif
                    <div class="dua-list">
                        @forelse ($group['items'] as $dua)
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
                            <p class="no-results">এই ক্যাটাগরিতে এখনও কোনো দোআ যোগ করা হয়নি।</p>
                        @endforelse
                    </div>
                </section>
            @endforeach
        </div>
    @endif
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'duas'])
@endsection
