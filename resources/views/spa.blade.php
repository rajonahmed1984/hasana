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
    <meta property="og:image" content="{{ asset('images/og-share-hasana.jpg') }}">
    <meta property="og:image:secure_url" content="{{ asset('images/og-share-hasana.jpg') }}">
    <meta property="og:image:width" content="1024">
    <meta property="og:image:height" content="500">
    <meta property="og:image:alt" content="Hasana Islamic App">
    <meta property="og:locale" content="bn_BD">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://hasanaa.com/">
    <meta name="twitter:title" content="হাসানা — আল কুরআন, হাদিস, দোয়া ও নামাজের সময়">
    <meta name="twitter:description" content="নির্ভুল নামাজের সময়সূচী, আল-কুরআন বাংলা অনুবাদ, সহিহ হাদিস, দৈনন্দিন দোয়া ও পূর্ণাঙ্গ ডিজিটাল উমরাহ সহায়িকা।">
    <meta name="twitter:image" content="{{ asset('images/og-share-hasana.jpg') }}">

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
    
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">

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

        /* Native-style boot splash screen */
        .hs-splash-screen {
            position: fixed;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 70% 20%, #177a6d, #0d3b34);
            color: #ffffff;
            z-index: 9999;
            text-align: center;
            padding: 20px;
        }
        .hs-splash-arabic {
            font-family: 'Amiri', serif;
            font-size: 5rem;
            color: #dfab3b;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 0.5rem;
            text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .hs-splash-title {
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin: 0;
        }
        .hs-splash-subtitle {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.75);
            margin-top: 0.25rem;
        }
        .hs-splash-loader {
            width: 120px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 9999px;
            margin-top: 2rem;
            overflow: hidden;
            position: relative;
        }
        .hs-splash-bar {
            width: 40%;
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

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app/main.jsx'])
</head>
<body>
    <div id="root">
        <!-- Native-like initial splash while React loads -->
        <div class="hs-splash-screen" aria-label="হাসানা লোড হচ্ছে...">
            <div class="hs-splash-arabic">حسنة</div>
            <h1 class="hs-splash-title">হাসানা</h1>
            <p class="hs-splash-subtitle">পবিত্র কুরআন, হাদিস ও দোয়া</p>
            <div class="hs-splash-loader">
                <div class="hs-splash-bar"></div>
            </div>
        </div>
    </div>
</body>
</html>
