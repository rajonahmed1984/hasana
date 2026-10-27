<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>হাসানা অ্যাডমিন পোর্টাল — Hasana Islamic Platform Control</title>

    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">

    <!-- Google Fonts: Amiri (Arabic) & Hind Siliguri (Bengali) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Theme detector -->
    <script>
        (function() {
            try {
                const theme = localStorage.getItem('hasana-admin-theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                }
            } catch (e) {}
        })();
    </script>

    <style>
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background-color: #f8f7f2;
            color: #14302b;
            font-family: 'Hind Siliguri', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }
        html.dark, html[data-theme='dark'], html[data-theme='dark'] body {
            background-color: #0b1413;
            color: #e4ebe9;
        }

        .admin-splash {
            position: fixed;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 70% 20%, #15665c, #0a2d27);
            color: #ffffff;
            z-index: 9999;
            text-align: center;
            padding: 24px;
        }
        .admin-splash-bismillah {
            font-family: 'Amiri', serif;
            font-size: 2.5rem;
            color: #dfab3b;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .admin-splash-title {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin: 0;
        }
        .admin-splash-sub {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 0.35rem;
        }
        .admin-splash-loader {
            width: 140px;
            height: 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 9999px;
            margin-top: 2rem;
            overflow: hidden;
            position: relative;
        }
        .admin-splash-bar {
            width: 45%;
            height: 100%;
            background: #dfab3b;
            border-radius: 9999px;
            animation: hs-indeterminate 1.4s infinite ease-in-out;
        }
        @keyframes hs-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
    </style>

    <script>
        window.AdminConfig = {
            user: @json(Auth::user()),
            csrfToken: "{{ csrf_token() }}",
            logoUrl: "{{ logo_url() }}",
            siteTitle: "{{ setting('site_title_bn', setting('site_name', 'হাসানা')) }}",
            siteTagline: "{{ setting('site_tagline', 'পবিত্র কুরআন, হাদিস ও দোয়া') }}",
            developerName: "{{ setting('developer_name', 'Apptimatic') }}",
            logoutUrl: "{{ route('logout', [], false) }}",
            appUrl: "{{ url('/') }}"
        };
    </script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/admin/main.jsx'])
</head>
<body>
    <div id="admin-root">
        <div class="admin-splash" aria-label="অ্যাডমিন পোর্টাল লোড হচ্ছে...">
            <div class="admin-splash-bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
            <h1 class="admin-splash-title">{{ setting('site_title_bn', 'হাসানা') }} অ্যাডমিন পোর্টাল</h1>
            <p class="admin-splash-sub">ইসলামিক প্ল্যাটফর্ম নিয়ন্ত্রণ ব্যবস্থা লোড হচ্ছে...</p>
            <div class="admin-splash-loader">
                <div class="admin-splash-bar"></div>
            </div>
        </div>
    </div>
</body>
</html>
