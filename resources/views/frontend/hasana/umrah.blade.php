@extends('frontend.layouts.app')

@section('title', 'Hasana - ওমরাহ গাইড')

@section('body')
@include('frontend.hasana.partials.offcanvas', ['active' => 'umrah'])

<header class="app-header sticky-top">
    <div class="header-content">
        <a href="{{ url()->previous() === url()->current() ? route('hasana.home') : url()->previous() }}" class="header-icon">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h1 class="header-title">ওমরাহ গাইড</h1>
        <span class="header-icon-placeholder"></span>
    </div>
</header>

<main class="main-container">
    <section class="dua-list">
        <article class="dua-card">
            <h2 class="dua-title">ওমরাহর সংক্ষিপ্ত পরিচিতি</h2>
            <p class="hadis-text">ওমরাহর প্রধান রুকন হল তাওয়াফ, সায়ী এবং মাথা মুণ্ডন/চুল কাটা। যাত্রার আগে Ihram, নিয়ত এবং তাওয়াফের দোয়া মুখস্থ করে নিন।</p>
        </article>

        <article class="dua-card">
            <h2 class="dua-title">ভ্রমণের প্রস্তুতি</h2>
            <ul class="hadis-text">
                <li>পাসপোর্ট, ভিসা, সনদ ও চিকিৎসা সংক্রান্ত কাগজপত্র যাচাই করুন।</li>
                <li>যাত্রার আগে Ihram এর কাপড় এবং প্রয়োজনীয় সামগ্রী প্রস্তুত রাখুন।</li>
                <li>পরিবার ও আত্মীয়স্বজনের সাথে বিদায়কালে দোয়া করুন।</li>
            </ul>
        </article>

        <article class="dua-card">
            <h2 class="dua-title">ইহরাম ও নিয়ত</h2>
            <p class="dua-arabic">لَبَّيْكَ اللَّهُمَّ عُمْرَةً</p>
            <p class="dua-translation">লাব্বাইক আল্লাহুম্মা উমরাতান।</p>
            <p class="dua-translation">"হে আল্লাহ, আমি ওমরাহর জন্য হাযির।"</p>
            <hr class="dua-divider">
            <p class="hadis-text">মীকাত সীমান্তে পৌঁছে ইহরামের কাপড় পরিধান করুন, দুই রাকাত নফল সালাত আদায় করুন এবং নিয়ত করে তালবিয়া পড়তে থাকুন।</p>
            <p class="dua-arabic">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيْكَ لَكَ</p>
            <p class="dua-transliteration">লাব্বাইক আল্লাহুম্মা লাব্বাইক, লাব্বাইকা লা শারীকা লাকা লাব্বাইক, ইন্নাল হামদা ওয়ান নি'মাতা লাকা ওয়াল মুলক, লা শারীকা লাক।</p>
            <p class="dua-translation">"আমি হাযির, হে আল্লাহ আমি হাযির। তোমার কোনো শরীক নেই, আমি হাযির। निश्चयই সমস্ত প্রশংসা ও নেয়ামত তোমারই এবং রাজত্বও, তোমার কোনো শরীক নেই।"</p>
        </article>

        <article class="dua-card">
            <h2 class="dua-title">তাওয়াফের ধাপ</h2>
            <ol class="hadis-text">
                <li>হাজরে আসওয়াদের সমান্তরালে দাঁড়িয়ে তাওয়াফ শুরু করুন।</li>
                <li>সাতবার কাবা শরীফ প্রদক্ষিণ করুন; প্রথম তিন চক্কর দ্রুত, বাকি চার চক্কর স্বাভাবিক গতি।</li>
                <li>প্রতিটি চক্করে দোয়া করুন; দুয়া তালিকা মোবাইলে সংরক্ষণ করতে পারেন।</li>
                <li>তাওয়াফ শেষে মকামে ইবরাহিমের পিছনে দুই রাকাত সালাত আদায় করুন।</li>
            </ol>
            <hr class="dua-divider">
            <div class="dua-section">
                <h4>রুকনে ইয়ামানী ও হাজরে আসওয়াদের মাঝের দোয়া</h4>
                <p class="dua-arabic">رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</p>
                <p class="dua-transliteration">রব্বানা আতিনা ফিদ দুনইয়া হাসানাতাও ওয়া ফিল আখিরাতি হাসানাতাও ওয়াকিনা আযাবান্নার।</p>
                <p class="dua-translation">"হে আমাদের প্রতিপালক, আমাদের দুনিয়াতে কল্যাণ দান করুন এবং আখেরাতেও কল্যাণ দান করুন এবং আমাদের জাহান্নামের আগুন থেকে রক্ষা করুন।"</p>
            </div>
        </article>
        

        <article class="dua-card">
            <h2 class="dua-title">সায়ী ও সমাপ্তি</h2>
            <p class="hadis-text">সাফা পাহাড় থেকে শুরু করে মারওয়া পাহাড়ে সপ্তম চক্কর সম্পন্ন করুন। শেষ হলে হালক বা কাসর (মাথা মুণ্ডন/চুল ছোট করা) করুন এবং ইহরাম অবসান করুন।</p>
            <hr class="dua-divider">
            <div class="dua-section">
                <h4>সাফা ও মারওয়া পাহাড়ে পড়ার দোয়া</h4>
                <p class="dua-arabic">إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ</p>
                <p class="dua-transliteration">ইন্নাস সাফা ওয়াল মারওয়াতা মিন শা'আইরিল্লাহ।</p>
                <p class="dua-translation">"নিশ্চয়ই সাফা ও মারওয়া আল্লাহর নিদর্শনসমূহের অন্যতম।"</p>
            </div>
        </article>

        <article class="dua-card">
            <h2 class="dua-title">দোয়া ও শিষ্টাচার</h2>
            <ul class="hadis-text">
                <li>প্রতিটি ধাপে শান্ত ও নম্র আচরণ বজায় রাখুন।</li>
                <li>ফরজ ও সুন্নাহ নামাজ জামায়াতে পড়ার চেষ্টা করুন।</li>
                <li>কাবার সামনে বেশি বেশি দোয়া করুন ও ইবাদতে মনোনিবেশ করুন।</li>
            </ul>
        </article>
    </section>
</main>

@include('frontend.hasana.partials.bottom-nav', ['active' => 'umrah'])
@endsection

