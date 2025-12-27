@extends('frontend.layouts.app')

@section('title', 'Hasana - উমরাহ গাইড')

@section('body')
@include('frontend.partials.offcanvas', ['active' => 'umrah'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">উমরাহ গাইড</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <!-- Umrah Info Card -->
    <section class="umrah-info-card">
        <div class="umrah-info-content">
            <i class="fa-solid fa-kaaba"></i>
            <div>
                <h3>উমরাহ পালনের নির্দেশনা</h3>
                <p>ধাপে ধাপে উমরাহ সম্পাদনের সম্পূর্ণ গাইড</p>
            </div>
        </div>
    </section>
    </section>

    <!-- Umrah Steps -->
    <section class="umrah-steps">
        <!-- Step 1: Preparation -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">১</div>
                <h2 class="step-title">প্রস্তুতি পর্ব</h2>
            </div>
            <div class="step-content">
                <ul class="step-list">
                    <li>মীকাতের আগে গোসল করুন (নফল গোসল)</li>
                    <li>নখ কাটা ও অপ্রয়োজনীয় লোম অপসারণ করুন</li>
                    <li>পুরুষরা ইহরামের আগে সুগন্ধি ব্যবহার করতে পারেন</li>
                    <li>নারীরা মুখ-ঢাকা ও দস্তানা এড়িয়ে চলবেন ইহরামের সময়</li>
                    <li>পরিচ্ছন্ন পোশাক পরিধান করুন</li>
                </ul>
            </div>
        </article>

        <!-- Step 2: Ihram -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">২</div>
                <h2 class="step-title">ইহরাম পরিধান ও নিয়ত</h2>
            </div>
            <div class="step-content">
                <p class="step-description">মীকাত থেকে ইহরাম বাঁধুন। পুরুষরা সেলাইবিহীন সাদা কাপড় (দুই টুকরা) এবং নারীরা শালীন পোশাক পরবেন।</p>
                <div class="dua-box">
                    <p class="dua-label">উমরাহর নিয়ত:</p>
                    <p class="dua-arabic">اللَّهُمَّ إِنِّي أُرِيدُ العُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي</p>
                    <p class="dua-transliteration">আল্লাহুম্মা ইন্নি উরিদুল উমরাতা ফাইয়াসসিরহা লি ওয়াতাক্বাব্বালহা মিন্নি</p>
                    <p class="dua-translation">হে আল্লাহ, আমি উমরাহ করতে চাই; তা আমার জন্য সহজ করে দিন এবং কবুল করুন।</p>
                </div>
            </div>
        </article>

        <!-- Step 3: Talbiyah -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৩</div>
                <h2 class="step-title">তালবিয়া পাঠ</h2>
            </div>
            <div class="step-content">
                <p class="step-description">ইহরাম বাঁধার পর থেকে তাওয়াফ শুরু পর্যন্ত বারবার তালবিয়া পড়ুন:</p>
                <div class="dua-box">
                    <p class="dua-arabic">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الحَمْدَ وَالنِّعْمَةَ لَكَ وَالمُلْكَ، لَا شَرِيكَ لَكَ</p>
                    <p class="dua-transliteration">লাব্বাইকা আল্লাহুম্মা লাব্বাইক, লাব্বাইকা লা শারীকালাকা লাব্বাইক, ইন্‌নাল হামদা ওয়ান্‌নি'মাতা লাকা ওয়াল্‌মুল্‌ক, লা শারীকালাক</p>
                    <p class="dua-translation">আমি হাজির, হে আল্লাহ, আমি হাজির। আপনার কোনো শরীক নেই; সব প্রশংসা, অনুগ্রহ ও রাজত্ব একমাত্র আপনারই।</p>
                </div>
            </div>
        </article>

        <!-- Step 4: Masjid al-Haram Entry -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৪</div>
                <h2 class="step-title">মসজিদুল হারামে প্রবেশ</h2>
            </div>
            <div class="step-content">
                <p class="step-description">ডান পা দিয়ে প্রবেশ করুন এবং এই দোয়া পড়ুন:</p>
                <div class="dua-box">
                    <p class="dua-arabic">بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ. اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ</p>
                    <p class="dua-transliteration">বিসমিল্লাহ, ওয়াস্‌সালাতু ওয়াস্‌সালামু 'আলা রাসূলিল্লাহ। আল্লাহুম্মাফ্‌তাহ্‌ লি আবওয়াবা রাহমাতিক</p>
                    <p class="dua-translation">আল্লাহর নামে, এবং আল্লাহর রাসুলের উপর শান্তি। হে আল্লাহ, আমার জন্য আপনার রহমতের দরজা খুলে দিন।</p>
                </div>
            </div>
        </article>

        <!-- Step 5: Tawaf -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৫</div>
                <h2 class="step-title">তাওয়াফ (৭ চক্কর)</h2>
            </div>
            <div class="step-content">
                <p class="step-description"><strong>হাজরে আসওয়াদ</strong> থেকে শুরু করে কাবাকে বাম দিকে রেখে ৭ চক্কর সম্পন্ন করুন:</p>
                <ul class="step-list">
                    <li>হাজরে আসওয়াদে ইশারা করে বলুন: <strong>بِسْمِ اللهِ، اللَّهُ أَكْبَرُ</strong></li>
                    <li>প্রথম ৩ চক্করে পুরুষরা দ্রুত হাঁটবেন (রমল)</li>
                    <li>রুকনে ইয়ামানি স্পর্শ করুন (সম্ভব হলে)</li>
                    <li>প্রতি চক্করে হাজরে আসওয়াদে তাকবির বলুন</li>
                </ul>
                <div class="dua-box">
                    <p class="dua-label">রুকনে ইয়ামানি ও হাজরে আসওয়াদের মধ্যে:</p>
                    <p class="dua-arabic">رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</p>
                    <p class="dua-transliteration">রব্বানা আতিনা ফিদ্‌দুনিয়া হাসানাতাওঁ ওয়া ফিল আখিরাতি হাসানাতাওঁ ওয়াকিনা আযাবান্নার</p>
                    <p class="dua-translation">হে আমাদের প্রতিপালক, দুনিয়াতে কল্যাণ দিন, আখিরাতে কল্যাণ দিন এবং জাহান্নামের শাস্তি থেকে রক্ষা করুন।</p>
                </div>
            </div>
        </article>

        <!-- Step 6: Salat after Tawaf -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৬</div>
                <h2 class="step-title">তাওয়াফের নামাজ</h2>
            </div>
            <div class="step-content">
                <p class="step-description">৭ চক্কর শেষে <strong>মাকামে ইবরাহিম</strong>ের পেছনে বা মসজিদের যেকোনো স্থানে দুই রাকাত নামাজ পড়ুন:</p>
                <ul class="step-list">
                    <li>১ম রাকাতে সূরা কাফিরুন পড়া মুস্তাহাব</li>
                    <li>২য় রাকাতে সূরা ইখলাস পড়া মুস্তাহাব</li>
                </ul>
            </div>
        </article>

        <!-- Step 7: Zamzam -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৭</div>
                <h2 class="step-title">যমযম পানি পান</h2>
            </div>
            <div class="step-content">
                <p class="step-description">কিবলামুখী হয়ে বসে যমযম পান করুন এবং দোয়া করুন:</p>
                <div class="dua-box">
                    <p class="dua-arabic">اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ</p>
                    <p class="dua-transliteration">আল্লাহুম্মা ইন্নি আস'আলুকা 'ইল্‌মান নাফি'আন, ওয়া রিজ্‌কান ওয়াসি'আন, ওয়া শিফা'আন মিন্‌ কুল্লি দা'ইন</p>
                    <p class="dua-translation">হে আল্লাহ, আমি উপকারী জ্ঞান, প্রশস্ত রিজিক এবং সব রোগ থেকে আরোগ্য প্রার্থনা করি।</p>
                </div>
            </div>
        </article>

        <!-- Step 8: Sa'i -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৮</div>
                <h2 class="step-title">সাঈ (সাফা-মারওয়া)</h2>
            </div>
            <div class="step-content">
                <p class="step-description">সাফা পাহাড় থেকে শুরু করে মারওয়া পর্যন্ত ৭ বার যাতায়াত করুন:</p>
                <ul class="step-list">
                    <li>সাফা → মারওয়া = ১ চক্কর</li>
                    <li>মারওয়া → সাফা = ২ চক্কর</li>
                    <li>এভাবে মারওয়ায় ৭ম চক্কর শেষ হবে</li>
                    <li>সবুজ বাতির মাঝে পুরুষরা দ্রুত হাঁটবেন</li>
                    <li>নারীরা স্বাভাবিক গতিতে হাঁটবেন</li>
                </ul>
                <div class="dua-box">
                    <p class="dua-label">সাফা ও মারওয়ায় উঠে:</p>
                    <p class="dua-arabic">إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ</p>
                    <p class="dua-translation">নিশ্চয়ই সাফা ও মারওয়া আল্লাহর নিদর্শনসমূহের অন্তর্ভুক্ত।</p>
                    <p class="dua-arabic">لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ</p>
                    <p class="dua-transliteration">লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকালাহ, লাহুল মুল্কু ওয়া লাহুল হামদু, ওয়া হুয়া 'আলা কুল্লি শাই'ইন কদীর</p>
                    <p class="dua-translation">আল্লাহ ছাড়া কোন ইলাহ নেই, তিনি এক, তাঁর কোন শরীক নেই; রাজত্ব ও প্রশংসা তাঁরই। (তিনবার পড়ুন)</p>
                </div>
            </div>
        </article>

        <!-- Step 9: Halq or Taqsir -->
        <article class="umrah-step-card">
            <div class="step-header">
                <div class="step-number">৯</div>
                <h2 class="step-title">চুল মুণ্ডন বা ছোট করা</h2>
            </div>
            <div class="step-content">
                <p class="step-description">সাঈ শেষে চুল মুণ্ডন বা ছোট করুন:</p>
                <ul class="step-list">
                    <li><strong>পুরুষ:</strong> মাথা মুণ্ডন করা (হালক) উত্তম, না হলে সমস্ত মাথার চুল ছোট করুন (তাকসির)</li>
                    <li><strong>নারী:</strong> এক আঙুল পরিমাণ (১-২ সেমি) চুলের ডগা সমানভাবে কাটুন</li>
                    <li>এরপর ইহরামের সকল নিষেধাজ্ঞা উঠে যাবে</li>
                    <li>আপনার উমরাহ সম্পন্ন হয়েছে, আলহামদুলিল্লাহ!</li>
                </ul>
            </div>
        </article>

        <!-- Important Tips -->
        <article class="umrah-step-card highlight-card">
            <div class="step-header">
                <div class="step-icon"><i class="fa-solid fa-circle-info"></i></div>
                <h2 class="step-title">গুরুত্বপূর্ণ পরামর্শ</h2>
            </div>
            <div class="step-content">
                <ul class="step-list">
                    <li>সর্বদা পরিচয়পত্র ও হোটেল ঠিকানা সাথে রাখুন</li>
                    <li>ভিড়ের সময় ধৈর্য ধরুন, কাউকে কষ্ট দেবেন না</li>
                    <li>নির্দিষ্ট দোয়া ছাড়াও নিজের ভাষায় দোয়া করুন</li>
                    <li>বেশি বেশি কুরআন তিলাওয়াত ও নফল নামাজ পড়ুন</li>
                    <li>পানি পান করুন এবং বিশ্রাম নিন</li>
                    <li>অসুস্থ হলে দ্রুত চিকিৎসা নিন</li>
                    <li>নামাজের সময় মসজিদে উপস্থিত থাকুন</li>
                </ul>
            </div>
        </article>

        <!-- Prohibited in Ihram -->
        <article class="umrah-step-card warning-card">
            <div class="step-header">
                <div class="step-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <h2 class="step-title">ইহরাম অবস্থায় নিষিদ্ধ বিষয়</h2>
            </div>
            <div class="step-content">
                <ul class="step-list">
                    <li>সুগন্ধি ব্যবহার করা</li>
                    <li>নখ ও চুল কাটা</li>
                    <li>পুরুষদের মাথা ঢাকা বা সেলাইযুক্ত কাপড় পরা</li>
                    <li>নারীদের মুখ ঢাকার জন্য নেকাব বা দস্তানা পরা</li>
                    <li>স্ত্রী-সহবাস ও যৌন উত্তেজক কাজ</li>
                    <li>ঝগড়া-বিবাদ ও অশ্লীল কথা</li>
                    <li>শিকার করা বা শিকারে সাহায্য করা</li>
                    <li>বিয়ে করা বা বিয়ের প্রস্তাব দেওয়া</li>
                </ul>
            </div>
        </article>
    </section>
</main>

@include('frontend.partials.bottom-nav', ['active' => 'umrah'])
@endsection


