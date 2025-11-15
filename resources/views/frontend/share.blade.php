@extends('frontend.layouts.app')

@section('title', 'Hasana - শেয়ার কার্ড')
@section('body_class', 'share-page-body')

@section('body')
<header class="app-header sticky-top">
    <div class="header-content">
        <a href="javascript:history.back()" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">শেয়ার</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <div class="share-card-container">
        <div class="share-card" id="share-card"
             data-text="{{ $shareText }}"
             data-reference="{{ $shareReference }}">
            <div class="share-text-content">
                <p id="share-ayah-text">{{ $shareText ? '“' . $shareText . '”' : 'আয়াত নির্বাচন করুন' }}</p>
                <p id="share-ayah-ref">{{ $shareReference ? '(' . $shareReference . ')' : '—' }}</p>
            </div>
        </div>
    </div>
    <div class="share-actions">
        <div id="social-share-section">
            <p class="share-instructions">শেয়ার করতে আপনার পছন্দের প্ল্যাটফর্ম নির্বাচন করুন</p>
            <div class="social-buttons">
                <button class="social-btn facebook" title="Share on Facebook"><i class="bi bi-facebook"></i></button>
                <button class="social-btn whatsapp" title="Share on WhatsApp"><i class="bi bi-whatsapp"></i></button>
                <button class="social-btn twitter" title="Share on X"><i class="bi bi-twitter-x"></i></button>
                <button class="social-btn telegram" title="Share on Telegram"><i class="bi bi-telegram"></i></button>
            </div>
        </div>
        <button id="download-btn" class="btn-secondary"><i class="bi bi-download"></i> কার্ড ডাউনলোড করুন</button>
    </div>
</main>
@endsection

@push('scripts')
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNa5lG0H9Yf0/TfMIuVX6udh88E+R0wS9cM/9w0CjCQMxuZ1cnk15msVt7UE6xNBVaFho5K+Jp9rk8p28+XZog==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const shareCard = document.getElementById('share-card');
        const textElem = document.getElementById('share-ayah-text');
        const refElem = document.getElementById('share-ayah-ref');
        const socialSection = document.getElementById('social-share-section');
        const buttons = document.querySelectorAll('.social-btn');
        const downloadBtn = document.getElementById('download-btn');

        const ayahText = (shareCard?.dataset.text || '').trim();
        const ayahRef = (shareCard?.dataset.reference || '').trim();

        if (ayahText) {
            textElem.textContent = `“${ayahText}”`;
        }
        if (ayahRef) {
            refElem.textContent = `(${ayahRef})`;
        }

        if (!navigator.share || !(navigator.canShare && navigator.canShare({ files: [] }))) {
            socialSection?.classList.add('hidden');
        }

        async function generateImageFile() {
            const target = document.getElementById('share-card');
            const canvas = await html2canvas(target, { scale: 2 });
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            return new File([blob], 'hasana-ayah.png', { type: 'image/png' });
        }

        async function shareImage() {
            try {
                const file = await generateImageFile();
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Hasana',
                        text: ayahText ? `“${ayahText}” - (${ayahRef})` : 'Hasana',
                    });
                } else {
                    alert('দুঃখিত, আপনার ডিভাইস সরাসরি শেয়ার সমর্থন করছে না।');
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error(error);
                    alert('শেয়ার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
                }
            }
        }

        buttons.forEach(button => button.addEventListener('click', shareImage));

        downloadBtn?.addEventListener('click', async () => {
            const target = document.getElementById('share-card');
            const canvas = await html2canvas(target, { scale: 2 });
            const link = document.createElement('a');
            link.download = 'hasana-ayah.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
</script>
@endpush
