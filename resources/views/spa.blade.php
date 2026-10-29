<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>হাসানা — আল কুরআন, হাদিস, দোয়া ও নামাজের সময়</title>
    
    <!-- Google Search Console Verification -->
    <meta name="google-site-verification" content="5kgUXQeMYAaew7nh4HwINoLZMegSDH7cx66jQxFWVWw">

    <!-- Primary SEO Meta Tags -->
    <meta name="title" content="হাসানা — আল কুরআন, হাদিস, দোয়া ও নামাজের সময়">
    <meta name="description" content="হাসানা (Hasana) — আপনার প্রাত্যহিক ইসলামিক জীবনধারা ও উমরাহ সহায়িকা। নির্ভুল নামাজের সময়সূচী, আল-কুরআন বাংলা অনুবাদ ও অডিও, হাদিস সম্ভার, মাসনুন দোয়া এবং ডিজিটাল তাওয়াফ কাউন্টার।">
    <meta name="keywords" content="Hasana, হাসানা, কুরআন, আল-কুরআন, হাদিস, দোয়া, নামাজের সময়, আজান, উমরাহ গাইড, তাওয়াফ কাউন্টার, তাসবিহ, ইসলামিক অ্যাপ, Quran Bangla, Prayer Times">
    <meta name="author" content="Apptimatic">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://hasanaa.com">

    <!-- Open Graph / Facebook / WhatsApp Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://hasanaa.com/">
    <meta property="og:site_name" content="Hasana (হাসানা)">
    <meta property="og:title" content="হাসানা — আল কুরআন, হাদিস, দোয়া ও নামাজের সময়">
    <meta property="og:description" content="নির্ভুল নামাজের সময়সূচী, আল-কুরআন বাংলা অনুবাদ, সহিহ হাদিস, দৈনন্দিন দোয়া ও পূর্ণাঙ্গ ডিজিটাল উমরাহ সহায়িকা।">
    <meta property="og:image" content="{{ brand_assets()['og_image'] }}">
    <meta property="og:image:secure_url" content="{{ brand_assets()['og_image'] }}">
    <meta property="og:image:alt" content="Hasana Islamic App">
    <meta property="og:locale" content="bn_BD">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://hasanaa.com/">
    <meta name="twitter:title" content="হাসানা — আল কুরআন, হাদিস, দোয়া ও নামাজের সময়">
    <meta name="twitter:description" content="নির্ভুল নামাজের সময়সূচী, আল-কুরআন বাংলা অনুবাদ, সহিহ হাদিস, দৈনন্দিন দোয়া ও পূর্ণাঙ্গ ডিজিটাল উমরাহ সহায়িকা।">
    <meta name="twitter:image" content="{{ brand_assets()['og_image'] }}">

    <!-- Structured Data (JSON-LD) for Search Engines -->
    <script type="application/ld+json">
    {
      "@@context": "https://schema.org",
      "@@type": "WebApplication",
      "name": "Hasana (হাসানা)",
      "url": "https://hasanaa.com",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "All",
      "description": "হাসানা — আল কুরআন, হাদিস, দোয়া, নামাজের সময়সূচী ও ডিজিটাল উমরাহ সহায়িকা।",
      "image": "{{ asset('images/og-share-hasana.jpg') }}",
      "offers": {
        "@@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT"
      }
    }
    </script>
    
    <link rel="icon" href="{{ brand_assets()['favicon'] }}">
    <script>
        // Brand logo uploaded from Admin → Settings
        window.HasanaConfig = { brand: @json(brand_assets()) };
    </script>
    <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">
    <link rel="preload" href="{{ asset('images/hasana-app-logo.png') }}" as="image">
    <link rel="preload" href="{{ asset('images/apptimatic_logo.png') }}" as="image">

    <!-- PWA & Mobile Meta Tags -->
    <meta name="theme-color" content="#125e54">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="হাসানা">

    <!-- Early Theme Detection -->
    <script>
        (function() {
            try {
                const theme = localStorage.getItem('hasana-theme') || 
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
            background-color: #0d1715;
            color: #e4ebe9;
        }

        /* Native-style boot splash screen (same look as the Android launch splash) */
        .hs-splash-screen {
            position: fixed;
            inset: 0;
            height: 100vh;
            height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            background: radial-gradient(circle at 50% 36%, #177a6d 0%, #0f4a41 55%, #082a25 100%);
            color: #ffffff;
            z-index: 9999;
            text-align: center;
            padding: 48px 24px calc(36px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)));
            overflow: hidden;
        }
        .hs-splash-top { height: 10px; }
        .hs-splash-center {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .hs-splash-logo {
            width: 120px;
            height: 120px;
            margin-bottom: 20px;
            padding: 3px;
            border-radius: 28px;
            background: linear-gradient(135deg, #f6dc8f, #dfab3b, #b07a1c);
            box-shadow: 0 0 45px rgba(223, 171, 59, 0.4), 0 12px 30px rgba(0, 0, 0, 0.6);
            animation: hs-glow 2.4s ease-in-out infinite alternate;
        }
        .hs-splash-logo img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 25px;
        }
        @keyframes hs-glow {
            0% { box-shadow: 0 0 25px rgba(223, 171, 59, 0.3), 0 10px 24px rgba(0, 0, 0, 0.5); transform: scale(0.98); }
            100% { box-shadow: 0 0 50px rgba(246, 220, 143, 0.55), 0 14px 34px rgba(0, 0, 0, 0.7); transform: scale(1.02); }
        }
        .hs-splash-title {
            font-size: 2rem;
            font-weight: 700;
            line-height: 1.3;
            margin: 0;
            background: linear-gradient(180deg, #ffffff 25%, #f6dc8f 65%, #dfab3b 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hs-splash-subtitle {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            margin: 0.25rem 0 26px;
        }
        .hs-splash-loader {
            width: 130px;
            height: 4px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 9999px;
            overflow: hidden;
        }
        .hs-splash-bar {
            width: 40%;
            height: 100%;
            background: linear-gradient(90deg, #f6dc8f, #dfab3b);
            border-radius: 9999px;
            animation: hs-indeterminate 1.4s infinite ease-in-out;
        }
        @keyframes hs-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
        .hs-splash-bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .hs-splash-devby {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2.2px;
            color: rgba(255, 255, 255, 0.55);
        }
        .hs-splash-badge {
            display: flex;
            align-items: center;
            padding: 8px 22px;
            background: #ffffff;
            border-radius: 9999px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(29, 211, 151, 0.25);
        }
        .hs-splash-badge img {
            display: block;
            height: 24px;
            width: auto;
        }
    </style>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app/main.jsx'])
</head>
<body>
    <div id="root">
        <!-- Native-like initial splash while React loads -->
        <div class="hs-splash-screen" aria-label="হাসানা লোড হচ্ছে...">
            <div class="hs-splash-top"></div>
            <div class="hs-splash-center">
                <div class="hs-splash-logo">
                    <img src="{{ asset('images/hasana-app-logo.png') }}" alt="হাসানা">
                </div>
                <h1 class="hs-splash-title">হাসানা</h1>
                <p class="hs-splash-subtitle">পবিত্র কুরআন, হাদিস ও দোয়া</p>
                <div class="hs-splash-loader">
                    <div class="hs-splash-bar"></div>
                </div>
            </div>
            <div class="hs-splash-bottom">
                <div class="hs-splash-devby">DEVELOPED BY</div>
                <div class="hs-splash-badge">
                    <img src="{{ asset('images/apptimatic_logo.png') }}" alt="Apptimatic">
                </div>
            </div>
        </div>
    </div>
</body>
</html>
