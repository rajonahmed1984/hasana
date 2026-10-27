@if ($paginator->hasPages())
    <nav class="pagination-custom" role="navigation" aria-label="Pagination Navigation">
        {{-- Previous Page Link --}}
        @if ($paginator->onFirstPage())
            <span class="page-btn disabled" aria-disabled="true" aria-label="Previous">&laquo;</span>
        @else
            <a href="{{ $paginator->previousPageUrl() }}" class="page-btn" rel="prev" aria-label="Previous">&laquo;</a>
        @endif

        {{-- Pagination Elements --}}
        @foreach ($elements as $element)
            {{-- "Three Dots" Separator --}}
            @if (is_string($element))
                <span class="page-btn disabled" aria-disabled="true">{{ $element }}</span>
            @endif

            {{-- Array Of Links --}}
            @if (is_array($element))
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <span class="page-btn active" aria-current="page">{{ App\Models\VisitorLog::banglaDigits($page) }}</span>
                    @else
                        <a href="{{ $url }}" class="page-btn">{{ App\Models\VisitorLog::banglaDigits($page) }}</a>
                    @endif
                @endforeach
            @endif
        @endforeach

        {{-- Next Page Link --}}
        @if ($paginator->hasMorePages())
            <a href="{{ $paginator->nextPageUrl() }}" class="page-btn" rel="next" aria-label="Next">&raquo;</a>
        @else
            <span class="page-btn disabled" aria-disabled="true" aria-label="Next">&raquo;</span>
        @endif
    </nav>
@endif
