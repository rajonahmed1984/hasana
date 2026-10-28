import React, { useState, useEffect } from 'react';
import { 
    CheckCircle2, 
    AlertCircle, 
    Compass, 
    MapPin, 
    RotateCcw, 
    Sparkles, 
    Clock, 
    ArrowRight, 
    ArrowLeft, 
    Check, 
    Copy, 
    ChevronRight, 
    Info, 
    ListCheck, 
    Footprints, 
    BookOpen, 
    HelpCircle,
    ChevronDown,
    Layers,
    ShieldAlert
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { hapticImpact, nativeShare } from '../native';

// 6 Core Steps with Detailed Instructions & Images
const umrahSteps = [
    {
        step: 1,
        title: 'ইহরাম পরিধান ও মীকাতের প্রস্তুতি',
        subtitle: 'পবিত্রতার সংকল্প ও আনুষ্ঠানিক সূচনা',
        image: '/images/umrah/ihram.webp',
        badge: '1ম ফরজ (রুকন)',
        desc: 'উমরার প্রথম কাজ হলো মীকাত অতিক্রম করার পূর্বেই ইহরামের পোশাক পরিধান করা এবং মানসিকভাবে পবিত্রতা ও বিনম্রতার সর্বোচ্চ প্রস্তুতি গ্রহণ করা।',
        details: [
            'শারীরিক পরিচ্ছন্নতা: নখ কাটা, অতিরিক্ত পশম পরিষ্কার করা এবং সুন্দরভাবে গোসল (বা ওজু) করা সুন্নত।',
            'পোশাক (পুরুষ): সেলাইবিহীন দুটি সাদা সুতি চাদর— একটি নিম্নাঙ্গে পরিধানের জন্য (ইজার) এবং অপরটি কাঁধে জড়ানোর জন্য (রিদা)। পায়ের পাতার উপরিভাগ ও গোড়ালি খোলা থাকে এমন স্যান্ডেল পরা।',
            'পোশাক (নারী): নারীদের জন্য কোনো নির্দিষ্ট রঙের বাধ্যবাধকতা নেই; শালীন ঢিলেঢালা সাধারণ পোশাক পরবেন। মুখমণ্ডল ও দুই হাতের কবজি উন্মুক্ত রাখতে হবে (পরপুরুষের সামনে ওড়না বা ঘোমটা ঝুলিয়ে পর্দা করবেন)।',
            'নফল নামাজ: মাকরুহ ওয়াক্ত না হলে ইহরামের কাপড়ে দুই রাকাত নফল নামাজ আদায় করা মোস্তাহাব (প্রথম রাকাতে সূরা কাফিরুন ও দ্বিতীয় রাকাতে সূরা ইখলাস)।',
        ],
        points: [
            'বিমানে ভ্রমণের ক্ষেত্রে মীকাত অতিক্রমের আগেই বিমানে বা বোর্ডিংয়ের পূর্বে ইহরাম বাঁধা ওয়াজিব।',
            'ইহরাম বাঁধার পর থেকেই সুগন্ধি ব্যবহার, নখ-চুল কাটা ইত্যাদি নিষিদ্ধ হয়ে যায়।',
        ],
    },
    {
        step: 2,
        title: 'উমরার নিয়ত ও তালবিয়া পাঠ',
        subtitle: 'আল্লাহর ডাকে সাড়া দিয়ে হাজির হওয়ার ঘোষণা',
        image: '/images/umrah/kaaba.webp',
        badge: 'ওয়াজিব আমল',
        desc: 'মীকাতে পৌঁছে বা অতিক্রম করার প্রাক্কালে অন্তরে উমরার সুনির্দিষ্ট নিয়ত করে মুখে উচ্চারণের মাধ্যমে তালবিয়া পাঠ শুরু করা।',
        arNiyyah: 'اللَّهُمَّ إِنِّي أُرِيدُ العُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي',
        transNiyyah: 'আল্লাহুম্মা ইন্নী উরীদুল ‘উমরাতা ফায়াসসিরহা লী ওয়া তাকাব্বালহা মিন্নী',
        meaningNiyyah: 'হে আল্লাহ! আমি উমরার ইচ্ছা ও সংকল্প করছি, আপনি আমার জন্য তা সহজ করে দিন এবং আমার পক্ষ থেকে তা কবুল করে নিন।',
        arTalbiyah: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        transTalbiyah: 'লাব্বাইকাল্লাহুম্মা লাব্বাইক, লাব্বাইকা লা শারীকা লাকা লাব্বাইক, ইন্নাল হামদা ওয়ান নি‘মাতা লাকা ওয়াল মুল্ক, লা শারীকা লাক',
        meaningTalbiyah: 'আমি হাজির হে আল্লাহ! আমি হাজির। আপনার কোনো অংশীদার নেই, আমি হাজির। নিশ্চয়ই সমস্ত প্রশংসা, নিয়ামত ও রাজত্ব একমাত্র আপনারই, আপনার কোনো অংশীদার নেই।',
        details: [
            'নিয়ত ও তালবিয়া পাঠের সাথে সাথেই ব্যক্তি আনুষ্ঠানিকভাবে ইহরামের মধ্যে প্রবেশ করেন।',
            'পুরুষরা মাঝারি উচ্চস্বরে এবং নারীরা নিচু স্বরে একাকী তালবিয়া পাঠ করবেন।',
            'মক্কা শরীফে পৌঁছে কাবার তাওয়াফ শুরু করা পর্যন্ত চলতে-ফিরতে, উঠতে-বসতে বেশি বেশি তালবিয়া পাঠ করা সুন্নত।',
        ],
        points: [
            'কাবা শরীফে পৌঁছে প্রথম তাওয়াফে হাজরে আসওয়াদে পৌঁছার সাথে সাথেই তালবিয়া পাঠ সমাপ্ত করতে হয়।',
        ],
    },
    {
        step: 3,
        title: 'কাবা শরীফের তাওয়াফ (7 চক্কর)',
        subtitle: 'কাবার চারপাশ ঘড়ির কাঁটার বিপরীত দিকে 7 চক্কর প্রদক্ষিণ',
        image: '/images/umrah/kaaba.webp',
        badge: '2য় ফরজ (রুকন)',
        desc: 'মসজিদে হারামে ডান পা দিয়ে প্রবেশের পর হাজরে আসওয়াদ থেকে শুরু করে কাবা শরীফকে বামে রেখে পূর্ণ 7 চক্কর তাওয়াফ সম্পন্ন করা।',
        arTawafStart: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ',
        transTawafStart: 'বিসমিল্লাহি ওয়াল্লাহু আকবার',
        meaningTawafStart: 'আল্লাহর নামে শুরু করছি এবং আল্লাহ সর্বশ্রেষ্ঠ।',
        arYemeniDua: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transYemeniDua: 'রাব্বানা আতিনা ফিদ-দুনইয়া হাসানাতাও ওয়া ফিল-আখিরাতি হাসানাতাও ওয়া কিনা আযাবান নার',
        meaningYemeniDua: 'হে আমাদের পালনকর্তা! আমাদের দুনিয়াতেও কল্যাণ দিন, আখিরাতেও কল্যাণ দিন এবং আমাদের জাহান্নামের শাস্তি থেকে রক্ষা করুন।',
        details: [
            'পবিত্রতা: তাওয়াফের জন্য পূর্ণ অজু ও পাক-পবিত্র থাকা শর্ত।',
            'ইজতিবা (পুরুষদের): তাওয়াফ শুরুর পূর্বে গায়ের চাদরটির ডান বগলের নিচ দিয়ে নিয়ে বাম কাঁধের ওপর তুলে দেওয়া (ডান কাঁধ খোলা রাখা)। তাওয়াফ শেষে আবার কাঁধ ঢেকে ফেলা।',
            'রমল (পুরুষদের): প্রথম 3 চক্করে কাঁধ হেলিয়ে বীরদর্পে একটু দ্রুত ও ছোট পদক্ষেপে হাঁটা সুন্নত। অবশিষ্ট 4 চক্কর স্বাভাবিক পদক্ষেপে হাঁটা।',
            'ইস্তিলাম: প্রতি চক্করের শুরুতে হাজরে আসওয়াদের সোজাসুজি মেঝেতে থাকা মার্বেল রেখায় দাঁড়িয়ে দুই হাত কানের লতি পর্যন্ত তুলে "বিসমিল্লাহি আল্লাহু আকবার" বলে কাবার দিকে ইশারা করে হাতে চুমু খাওয়া।',
            'রুকনে ইয়ামানী: 3য় কোণ বা রুকনে ইয়ামানী অতিক্রমের সময় সম্ভব হলে স্পর্শ করা (চুমু খাওয়া নয়) এবং হাজরে আসওয়াদ পর্যন্ত "রাব্বানা আতিনা..." দোয়াটি পাঠ করা সুন্নত।',
        ],
        points: [
            'তাওয়াফের জন্য কোনো নির্দিষ্ট দোয়া মুখস্থ থাকা আবশ্যক নয়; কুরআন তেলাওয়াত, জিকির ও নিজের ভাষায় মনের আকুল মোনাজাত করা যায়।',
        ],
    },
    {
        step: 4,
        title: 'মাকামে ইবরাহীমে নামাজ ও জমজমের পানি পান',
        subtitle: '2 রাকাত তাওয়াফের সালাত ও বরকতময় জমজম',
        image: '/images/umrah/zamzam.webp',
        badge: 'ওয়াজিব ও সুন্নত',
        desc: 'তাওয়াফের 7 চক্কর শেষ করে পুরুষদের উভয় কাঁধ ঢেকে নেওয়া, মাকামে ইবরাহীমের পেছনে দুই রাকাত সালাত আদায় করা এবং তৃপ্তিভরে জমজম পান করা।',
        arZamzam: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ',
        transZamzam: 'আল্লাহুম্মা ইন্নী আসআলুকা \'ইলমান নাফি\'আ, ওয়া রিযক্বান ওয়াসি\'আ, ওয়া শিফা-আম মিন কুল্লি দা-\'',
        meaningZamzam: 'হে আল্লাহ! আমি আপনার নিকট উপকারী জ্ঞান, প্রশস্ত হালাল রিজিক এবং সকল রোগব্যাধি থেকে পূর্ণ আরোগ্য প্রার্থনা করছি।',
        details: [
            'তাওয়াফের নামাজ: মাকামে ইবরাহীমের পেছনে (জায়গা না পেলে মাতাফের বা হারামের যেকোনো স্থানে) 2 রাকাত তাওয়াফের ওয়াজিব নামাজ আদায় করা। 1ম রাকাতে সূরা কাফিরুন ও 2য় রাকাতে সূরা ইখলাস পাঠ করা মোস্তাহাব।',
            'মুলতাজামে দোয়া: সুযোগ ও সুবিধা থাকলে কাবা ঘরের দরজা ও হাজরে আসওয়াদের মধ্যবর্তী স্থান \'মুলতাজাম\'-এ বুক ও গাল লাগিয়ে দোয়া করা।',
            'জমজম পান: দাঁড়িয়ে কাবামুখী হয়ে তিন শ্বাসে তৃপ্তিভরে জমজমের পানি পান করা এবং মাথায় ও মুখমণ্ডলে কিছু পানি মেখে বরকতের দোয়া করা।',
        ],
        points: [
            'জমজমের পানি যে উদ্দেশ্যে পান করা হয়, আল্লাহ তা কবুল করেন (সহীহ হাদিস)।',
        ],
    },
    {
        step: 5,
        title: 'সাফা-মারওয়া পাহাড়ে সাঈ (7 বার)',
        subtitle: 'মা হাজেরা (আ.)-এর স্মরণে সাফা ও মারওয়ার মাঝে দৌড়ানো ও দোয়া',
        image: '/images/umrah/safa.webp',
        badge: '3য় ফরজ (রুকন)',
        desc: 'সাফা পাহাড় থেকে শুরু করে মারওয়া পাহাড় পর্যন্ত মোট 7 বার যাতায়াত করা। সাফা থেকে মারওয়া = 1ম বার, মারওয়া থেকে সাফা = 2য় বার... এভাবে 7ম বার মারওয়া পাহাড়ে সমাপ্ত হবে।',
        arSaiStart: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا',
        transSaiStart: 'ইন্নাস সাফা ওয়াল মারওয়াতা মিন শা\'আইরিল্লাহ...',
        meaningSaiStart: 'নিশ্চয়ই সাফা ও মারওয়া আল্লাহর নিদর্শনসমূহের অন্তর্ভুক্ত।',
        arSafaTakbeer: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الأَحْزَابَ وَحْدَهُ',
        transSafaTakbeer: 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু...',
        meaningSafaTakbeer: 'এক আল্লাহ ব্যতীত কোনো সত্য উপাস্য নেই, তাঁর কোনো শরিক নেই। রাজত্ব ও প্রশংসা একমাত্র তাঁরই। তিনি তাঁর ওয়াদা পূর্ণ করেছেন, তাঁর বান্দাকে সাহায্য করেছেন এবং একাই সকল সম্মিলিত বাহিনীকে পরাভূত করেছেন।',
        details: [
            'সাফায় আগমন: সাফা পাহাড়ের প্রাঙ্গণে উঠে কাবামুখী হয়ে দুই হাত তুলে 3 বার তাকবীর ("আল্লাহু আকবার") ও তাওহীদের ঘোষণা দেওয়া এবং নিজের জন্য দীর্ঘ দোয়া করা।',
            'সবুজ বাতি (মাইল্লাইন আখদারাইন): সাফা ও মারওয়ার মধ্যবর্তী সবুজ টিউবলাইটে চিহ্নিত স্থানে পুরুষদের একটু দ্রুতপায়ে দৌড়ে পার হওয়া সুন্নত। নারীরা স্বাভাবিকভাবে হাঁটবেন।',
            'মারওয়ায় সমাপ্তি: প্রতিবার মারওয়ায় পৌঁছেও কাবামুখী হয়ে হাত তুলে দোয়া করা। এভাবে 7ম চক্করটি মারওয়া পাহাড়ে এসে শেষ হবে।',
            'পবিত্রতা: সাঈর জন্য অজু থাকা উত্তম, তবে অজু ভেঙে গেলেও সাঈ শুদ্ধ হয়ে যায়।',
        ],
        points: [
            'সাঈ চলাকালে বেশি বেশি ইস্তিগফার, দরূদ ও আল্লাহর কাছে ক্ষমা প্রার্থনা করা উত্তম।',
        ],
    },
    {
        step: 6,
        title: 'হলক বা কসর (মাথা মুণ্ডন বা চুল কাটা)',
        subtitle: 'ইহরামের সমাপ্তি ও উমরার পরিপূর্ণতা',
        image: '/images/umrah/ihram.webp',
        badge: 'ওয়াজিব আমল',
        desc: 'সাঈ সম্পন্ন করার পর চুল কাটার মাধ্যমে উমরার যাবতীয় কার্যাবলী আনুষ্ঠানিকভাবে সমাপ্ত হয় এবং ইহরামের সমস্ত বিধিনিষেধ মুক্ত হয়ে স্বাভাবিক হালাল অবস্থায় ফেরা হয়।',
        details: [
            'পুরুষদের জন্য: সম্পূর্ণ মাথা ব্লেড বা মেশিন দিয়ে ন্যাড়া করা (হলক) সবচেয়ে বেশি সওয়াবের। নবীজী (ﷺ) মাথা মুণ্ডনকারীদের জন্য 3 বার রহমতের দোয়া করেছেন। অথবা পুরো মাথার চুল চতুর্দিক থেকে সমানভাবে ছোট করে ছাঁটা (কসর)।',
            'নারীদের জন্য: নারীরা কখনোই মাথা মুণ্ডন করবেন না। তাদের ক্ষেত্রে চুলের যেকোনো একদিকের বেনী বা গোছা একত্র করে আঙুলের এক কর পরিমাণ (প্রায় এক ইঞ্চি) চুল কাটাই নিয়ম।',
            'ইহরাম সমাপ্তি (তাহাল্লুল): চুল কাটার সাথে সাথেই উমরার ইহরাম শেষ হয়ে যায় এবং পূর্বে নিষিদ্ধ হওয়া সাধারণ পোশাক, সুগন্ধি ইত্যাদি সবকিছু আবার হালাল হয়ে যায়।',
        ],
        points: [
            'পুরুষরা অল্প দুই-একটি চুল না কেটে পুরো মাথার চুল সমানভাবে ছাঁটবেন বা মুণ্ডন করবেন।',
            'চুল কাটার পর আলহামদুলিল্লাহ বলে শুকরিয়া আদায় করুন এবং উমরা কবুল হওয়ার মোনাজাত করুন।',
        ],
    },
];

// Umrah Prohibitions (ইহরাম অবস্থায় নিষিদ্ধ বিষয়সমূহ)
const prohibitions = [
    { title: 'চুল ও নখ কাটা', desc: 'শরীরের কোনো অংশের চুল বা দাড়ি কাটা, ছাঁটা, উপড়ানো বা নখ কাটা সম্পূর্ণ নিষিদ্ধ।', icon: ShieldAlert, scope: 'উভয়ের জন্য' },
    { title: 'সুগন্ধি ব্যবহার', desc: 'পোশাকে, শরীরে, সাবানে বা তেলের মাধ্যমে কোনো প্রকার সুবাসিত আতর বা পারফিউম ব্যবহার নিষিদ্ধ।', icon: AlertCircle, scope: 'উভয়ের জন্য' },
    { title: 'দাম্পত্য মেলামেশা', desc: 'যৌন মিলন, যৌন উত্তেজক স্পর্শ, কামভাবপূর্ণ চুম্বন বা বিবাহ বন্ধনে আবদ্ধ হওয়া হারাম।', icon: ShieldAlert, scope: 'উভয়ের জন্য' },
    { title: 'ঝগড়া ও পাপাচার', desc: 'সঙ্গীদের সাথে তর্ক-বিতর্ক, গালাগালি, অভিশাপ দেওয়া বা যেকোনো প্রকার পাপকাজে লিপ্ত হওয়া।', icon: AlertCircle, scope: 'উভয়ের জন্য' },
    { title: 'শিকার ও উদ্ভিদ নষ্ট', desc: 'হারাম শরীফের সীমানায় কোনো বন্য পশুপাখি শিকার করা বা গাছের পাতা-ডাল কাটা নিষিদ্ধ।', icon: AlertCircle, scope: 'উভয়ের জন্য' },
    { title: 'সেলাইযুক্ত পোশাক (পুরুষ)', desc: 'পুরুষদের জন্য পাজামা, শার্ট, গেঞ্জি, আন্ডারওয়্যার বা কোনো প্রকার সেলাই করা পোশাক পরা নিষিদ্ধ।', icon: ShieldAlert, scope: 'পুরুষদের জন্য' },
    { title: 'মাথা ও চেহারা ঢাকা (পুরুষ)', desc: 'পুরুষদের জন্য টুপি, পাগড়ি, গামছা বা চাদর দিয়ে মাথা ও কপাল আবৃত রাখা নিষিদ্ধ।', icon: ShieldAlert, scope: 'পুরুষদের জন্য' },
    { title: 'গোড়ালি ঢাকা জুতো (পুরুষ)', desc: 'এমন জুতো পরা যা পায়ের পাতার ওপরের উঁচু হাড় বা পেছনের গোড়ালি ঢেকে ফেলে।', icon: AlertCircle, scope: 'পুরুষদের জন্য' },
    { title: 'মুখমণ্ডল নেকাব দিয়ে ঢাকা (নারী)', desc: 'নারীরা ইহরাম অবস্থায় চেহারা স্পর্শ করে এমন সেলাই করা নেকাব বা হাতমোজা (দস্তানা) পরবেন না।', icon: AlertCircle, scope: 'নারীদের জন্য' },
];

// Interactive Checklist items
const defaultChecklist = [
    { id: 'c1', text: 'পাসপোর্ট ও নুসুক/উমরা ভিসা প্রিন্ট কপি', checked: false },
    { id: 'c2', text: '2 সেট সুতি সাদা ইহরামের কাপড় (পুরুষদের জন্য)', checked: false },
    { id: 'c3', text: 'ইহরামের চাদর আটকানোর জন্য মজবুত বেল্ট বা মানিব্যাগ', checked: false },
    { id: 'c4', text: 'আরামদায়ক স্যান্ডেল (গোড়ালি ও পায়ের উপরিভাগ উন্মুক্ত)', checked: false },
    { id: 'c5', text: 'সুগন্ধিমুক্ত (Fragrance-Free) সাবান, শ্যাম্পু ও পেট্রোলিয়াম জেলি', checked: false },
    { id: 'c6', text: 'তাওয়াফ ও সাঈ দোয়ার ছোট বই বা হাসানা মোবাইল অ্যাপ', checked: false },
    { id: 'c7', text: 'ডিজিটাল তসবিহ বা আঙুলের 7-দানার তাওয়াফ রিং', checked: false },
    { id: 'c8', text: 'নিয়মিত প্রেসক্রিপশনের প্রয়োজনীয় ওষুধপত্র', checked: false },
    { id: 'c9', text: 'পাসপোর্ট ও টাকা বহনের জন্য ছোট ঝুলানো সাইডব্যাগ', checked: false },
    { id: 'c10', text: 'হলক বা মাথা মুণ্ডনের জন্য পরিচ্ছন্ন ডিসপোজেবল রেজার (পুরুষ)', checked: false },
];

export function UmrahGuidePage() {
    const [viewMode, setViewMode] = useState('stepper'); // 'stepper', 'all', 'tracker', 'prohibitions', 'checklist'
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [copiedKey, setCopiedKey] = useState(null);

    // Interactive Tawaf Counter state (1 to 7)
    const [tawafRound, setTawafRound] = useState(1);
    const [tawafCompleted, setTawafCompleted] = useState(false);

    // Interactive Sa'i Counter state (1 to 7)
    const [saiLap, setSaiLap] = useState(1);
    const [saiCompleted, setSaiCompleted] = useState(false);

    // Checklist state
    const [checklist, setChecklist] = useState(() => {
        try {
            const saved = localStorage.getItem('hasana-umrah-checklist');
            return saved ? JSON.parse(saved) : defaultChecklist;
        } catch {
            return defaultChecklist;
        }
    });

    const toggleChecklistItem = (id) => {
        hapticImpact();
        const updated = checklist.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setChecklist(updated);
        try {
            localStorage.setItem('hasana-umrah-checklist', JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    const handleCopy = (text, key) => {
        hapticImpact();
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const nextStep = () => {
        hapticImpact();
        if (activeStepIndex < umrahSteps.length - 1) {
            setActiveStepIndex(prev => prev + 1);
            window.scrollTo({ top: 350, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        hapticImpact();
        if (activeStepIndex > 0) {
            setActiveStepIndex(prev => prev - 1);
            window.scrollTo({ top: 350, behavior: 'smooth' });
        }
    };

    const handleTawafIncrement = () => {
        hapticImpact();
        if (tawafRound < 7) {
            setTawafRound(prev => prev + 1);
        } else {
            setTawafCompleted(true);
        }
    };

    const resetTawaf = () => {
        hapticImpact();
        setTawafRound(1);
        setTawafCompleted(false);
    };

    const handleSaiIncrement = () => {
        hapticImpact();
        if (saiLap < 7) {
            setSaiLap(prev => prev + 1);
        } else {
            setSaiCompleted(true);
        }
    };

    const resetSai = () => {
        hapticImpact();
        setSaiLap(1);
        setSaiCompleted(false);
    };

    const currentStep = umrahSteps[activeStepIndex];
    const checkedCount = checklist.filter(c => c.checked).length;
    const checklistProgress = Math.round((checkedCount / checklist.length) * 100);

    return (
        <Layout>
            {/* Visual Hero Header with Kaaba art */}
            <div className="relative overflow-hidden bg-emerald-950 text-white pt-10 pb-16 md:py-20 border-b border-gold/30">
                {/* Background Artwork */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition duration-1000"
                    style={{ backgroundImage: `url('/images/umrah/kaaba.webp')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />

                <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        সুন্নাহভিত্তিক সচিত্র পূর্ণাঙ্গ নির্দেশিকা
                    </span>

                    <h1 className="font-arabic text-3xl md:text-5xl text-gold font-bold mb-2 tracking-wide drop-shadow-md">
                        العُمْرَةُ خُطْوَةً بِخُطْوَةٍ
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                        উমরা গাইড ও ধাপে ধাপে নিয়মাবলী
                    </h2>
                    <p className="text-sm md:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
                        রাসূলুল্লাহ (ﷺ)-এর সুন্নাত অনুসরণ করে সহীহ ও নির্ভুলভাবে উমরা পালনের ডিজিটাল নির্দেশিকা ও সরাসরি আমল সহায়ক
                    </p>

                    {/* Quick Info Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
                        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
                            <span className="text-gold font-bold text-lg block">4টি মূল স্তম্ভ</span>
                            <span className="text-xs text-white/80">ইহরাম, তাওয়াফ, সাঈ, হলক</span>
                        </div>
                        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
                            <span className="text-gold font-bold text-lg block">3-4 ঘণ্টা</span>
                            <span className="text-xs text-white/80">মোট সম্ভাব্য সময়</span>
                        </div>
                        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
                            <span className="text-gold font-bold text-lg block">মক্কা মোকাররমা</span>
                            <span className="text-xs text-white/80">পবিত্র হারামাইন শরীফ</span>
                        </div>
                        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
                            <span className="text-gold font-bold text-lg block">সহীহ বুখারী ও মুসলিম</span>
                            <span className="text-xs text-white/80">বিশুদ্ধ প্রামাণ্য ভিত্তি</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Tabs */}
            <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
                <div className="mx-auto max-w-5xl px-4">
                    <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('stepper'); }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all native-press select-none ${
                                viewMode === 'stepper'
                                    ? 'bg-primary text-gold shadow-sm scale-102'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Footprints className="w-4 h-4" />
                            ধাপে ধাপে ভিউ ({activeStepIndex + 1}/6)
                        </button>

                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('all'); }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all native-press select-none ${
                                viewMode === 'all'
                                    ? 'bg-primary text-gold shadow-sm scale-102'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            একনজরে পূর্ণাঙ্গ গাইড (6 ধাপ)
                        </button>

                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('tracker'); }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all native-press select-none ${
                                viewMode === 'tracker'
                                    ? 'bg-primary text-gold shadow-sm scale-102'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Compass className="w-4 h-4" />
                            তাওয়াফ ও সাঈ কাউন্টার
                        </button>

                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('prohibitions'); }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all native-press select-none ${
                                viewMode === 'prohibitions'
                                    ? 'bg-primary text-gold shadow-sm scale-102'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            ইহরামের বিধিনিষেধ
                        </button>

                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('checklist'); }}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all native-press select-none ${
                                viewMode === 'checklist'
                                    ? 'bg-primary text-gold shadow-sm scale-102'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <ListCheck className="w-4 h-4" />
                            প্রস্তুতি চেকলিস্ট ({checkedCount}/{checklist.length})
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8">
                {/* ============================================================== */}
                {/* 1. STEPPER VIEW (INTERACTIVE STEP-BY-STEP SLIDESHOW) */}
                {/* ============================================================== */}
                {viewMode === 'stepper' && (
                    <div className="space-y-6">
                        {/* Step Progress Bar */}
                        <div className="rounded-2xl bg-card border border-border p-4 shadow-xs">
                            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
                                <span>ধাপ অগ্রগতি: {activeStepIndex + 1} / {umrahSteps.length}</span>
                                <span className="text-primary font-bold">{Math.round(((activeStepIndex + 1) / umrahSteps.length) * 100)}% সম্পন্ন</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-600 via-primary to-gold transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${((activeStepIndex + 1) / umrahSteps.length) * 100}%` }}
                                />
                            </div>

                            {/* Stepper Buttons */}
                            <div className="grid grid-cols-6 gap-1.5 mt-3 pt-3 border-t border-border/50">
                                {umrahSteps.map((s, idx) => (
                                    <button
                                        key={s.step}
                                        type="button"
                                        onClick={() => { hapticImpact(); setActiveStepIndex(idx); }}
                                        className={`py-2 px-1 text-center rounded-2xl text-xs font-bold transition-all native-press flex flex-col items-center gap-0.5 ${
                                            activeStepIndex === idx
                                                ? 'bg-primary text-gold shadow-md scale-105 border border-gold/40'
                                                : idx < activeStepIndex
                                                ? 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                                                : 'bg-muted/70 text-muted-foreground hover:bg-muted border border-border/50'
                                        }`}
                                    >
                                        <span>ধাপ {s.step}</span>
                                        <span className="hidden md:inline text-[10px] truncate max-w-[80px] font-normal">{s.title.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Step Card with native mobile slide transition */}
                        <article 
                            key={currentStep.step} 
                            className="rounded-3xl bg-card border border-border overflow-hidden shadow-md transition-all duration-300 animate-slide-up"
                        >
                            {/* Step Image Artwork */}
                            {currentStep.image && (
                                <div className="relative h-60 sm:h-72 md:h-84 w-full overflow-hidden bg-zinc-950">
                                    <img 
                                        src={currentStep.image} 
                                        alt={currentStep.title}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    {/* High-contrast dark gradient scrim overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

                                    {/* Top Left Badge */}
                                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                                        <span className="px-3 py-1 rounded-full bg-emerald-800/90 text-gold text-xs font-bold shadow-lg backdrop-blur-md border border-gold/40">
                                            {currentStep.badge}
                                        </span>
                                    </div>

                                    {/* Bottom Content Card with Guaranteed Crystal Contrast */}
                                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 p-3.5 sm:p-4.5">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="px-2.5 py-0.5 rounded-full bg-gold/25 border border-gold/60 text-gold text-[11px] font-bold tracking-wide">
                                                ধাপ {currentStep.step} এর আমল
                                            </span>
                                            <span className="text-[11px] text-zinc-300 font-medium">
                                                • {activeStepIndex + 1} / {umrahSteps.length} সম্পন্ন
                                            </span>
                                        </div>
                                        <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                                            {currentStep.title}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-zinc-200 mt-1.5 font-medium leading-relaxed drop-shadow-xs">
                                            {currentStep.subtitle}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="p-5 sm:p-7 md:p-8 space-y-6">
                                <p className="text-base text-foreground/90 leading-relaxed font-medium bg-muted/40 p-4 rounded-2xl border border-border/50">
                                    {currentStep.desc}
                                </p>

                                {/* Prayers and Duas Section */}
                                {(currentStep.arNiyyah || currentStep.arTalbiyah || currentStep.arTawafStart || currentStep.arZamzam || currentStep.arSaiStart) && (
                                    <div className="space-y-4">
                                        {currentStep.arNiyyah && (
                                            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                                        <BookOpen className="w-3.5 h-3.5" /> উমরার নিয়তের দোয়া:
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(currentStep.arNiyyah, 'niyyah')}
                                                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                                                    >
                                                        {copiedKey === 'niyyah' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                        <span>কপি</span>
                                                    </button>
                                                </div>
                                                <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right leading-loose" dir="rtl">
                                                    {currentStep.arNiyyah}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                    <strong className="text-foreground not-italic">উচ্চারণ:</strong> {currentStep.transNiyyah}
                                                </p>
                                                <p className="text-xs sm:text-sm text-foreground/90">
                                                    <strong className="text-primary">অর্থ:</strong> {currentStep.meaningNiyyah}
                                                </p>
                                            </div>
                                        )}

                                        {currentStep.arTalbiyah && (
                                            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5" /> তালবিয়ার শব্দমালা (লাব্বাইক):
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(currentStep.arTalbiyah, 'talbiyah')}
                                                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                                                    >
                                                        {copiedKey === 'talbiyah' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                        <span>কপি</span>
                                                    </button>
                                                </div>
                                                <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right leading-loose" dir="rtl">
                                                    {currentStep.arTalbiyah}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                    <strong className="text-foreground not-italic">উচ্চারণ:</strong> {currentStep.transTalbiyah}
                                                </p>
                                                <p className="text-xs sm:text-sm text-foreground/90">
                                                    <strong className="text-primary">অর্থ:</strong> {currentStep.meaningTalbiyah}
                                                </p>
                                            </div>
                                        )}

                                        {currentStep.arTawafStart && (
                                            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 space-y-3">
                                                <span className="text-xs font-bold text-primary block">হাজরে আসওয়াদে ইস্তিলামের তাকবীর:</span>
                                                <p className="font-arabic text-2xl text-primary font-bold text-right" dir="rtl">
                                                    {currentStep.arTawafStart}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                    <strong className="text-foreground not-italic">উচ্চারণ:</strong> {currentStep.transTawafStart}
                                                </p>
                                                <p className="text-xs sm:text-sm text-foreground/90">
                                                    <strong className="text-primary">অর্থ:</strong> {currentStep.meaningTawafStart}
                                                </p>
                                            </div>
                                        )}

                                        {currentStep.arYemeniDua && (
                                            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-5 space-y-3">
                                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">রুকনে ইয়ামানী ও হাজরে আসওয়াদের মধ্যবর্তী মাসনুন দোয়া:</span>
                                                <p className="font-arabic text-2xl text-primary font-bold text-right leading-loose" dir="rtl">
                                                    {currentStep.arYemeniDua}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                    <strong className="text-foreground not-italic">উচ্চারণ:</strong> {currentStep.transYemeniDua}
                                                </p>
                                                <p className="text-xs sm:text-sm text-foreground/90">
                                                    <strong className="text-primary">অর্থ:</strong> {currentStep.meaningYemeniDua}
                                                </p>
                                            </div>
                                        )}

                                        {currentStep.arZamzam && (
                                            <div className="rounded-2xl bg-sky-500/5 border border-sky-500/20 p-5 space-y-3">
                                                <span className="text-xs font-bold text-sky-700 dark:text-sky-400 block">জমজমের পানি পানের দোয়া:</span>
                                                <p className="font-arabic text-2xl text-primary font-bold text-right leading-loose" dir="rtl">
                                                    {currentStep.arZamzam}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                    <strong className="text-foreground not-italic">উচ্চারণ:</strong> {currentStep.transZamzam}
                                                </p>
                                                <p className="text-xs sm:text-sm text-foreground/90">
                                                    <strong className="text-primary">অর্থ:</strong> {currentStep.meaningZamzam}
                                                </p>
                                            </div>
                                        )}

                                        {currentStep.arSaiStart && (
                                            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 space-y-3">
                                                <span className="text-xs font-bold text-primary block">সাফায় ওঠার কুরআনী আয়াত ও তাকবীর:</span>
                                                <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right leading-loose" dir="rtl">
                                                    {currentStep.arSaiStart}
                                                </p>
                                                <p className="font-arabic text-lg md:text-xl text-foreground font-semibold text-right leading-loose mt-2 pt-2 border-t border-border/40" dir="rtl">
                                                    {currentStep.arSafaTakbeer}
                                                </p>
                                                <p className="text-xs sm:text-sm text-foreground/90 mt-2">
                                                    <strong className="text-primary">অর্থ:</strong> {currentStep.meaningSafaTakbeer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Detailed Points */}
                                {currentStep.details && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                            <Info className="w-4 h-4 text-primary" /> করণীয় নির্দেশনাবলী:
                                        </h4>
                                        <ul className="space-y-2.5">
                                            {currentStep.details.map((d, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span>{d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Extra Important Tips */}
                                {currentStep.points && (
                                    <div className="rounded-2xl bg-gold/10 border border-gold/30 p-4 text-xs sm:text-sm text-foreground space-y-1.5">
                                        <span className="font-bold text-primary flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5" /> বিশেষ সতর্কবার্তা ও টিপস:
                                        </span>
                                        {currentStep.points.map((pt, i) => (
                                            <p key={i} className="text-muted-foreground pl-4">• {pt}</p>
                                        ))}
                                    </div>
                                )}

                                {/* Navigation Footer */}
                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={activeStepIndex === 0}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                                            activeStepIndex === 0
                                                ? 'opacity-40 cursor-not-allowed bg-muted text-muted-foreground'
                                                : 'bg-muted text-foreground hover:bg-muted/80 shadow-xs'
                                        }`}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        পূর্ববর্তী ধাপ
                                    </button>

                                    {activeStepIndex < umrahSteps.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary text-gold hover:opacity-95 shadow-md transition"
                                        >
                                            পরবর্তী ধাপ
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => { hapticImpact(); setViewMode('tracker'); }}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition"
                                        >
                                            তাওয়াফ কাউন্টার শুরু করুন
                                            <Compass className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    </div>
                )}

                {/* ============================================================== */}
                {/* 2. ALL STEPS OVERVIEW (ROADMAP VIEW) */}
                {/* ============================================================== */}
                {viewMode === 'all' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-5">
                            {umrahSteps.map((item, idx) => (
                                <article
                                    key={item.step}
                                    className="rounded-3xl bg-card border border-border p-5 md:p-6 shadow-sm card-hover flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-9 h-9 rounded-2xl bg-primary text-gold flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                                                    {item.step.toLocaleString('bn-BD-u-nu-latn')}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-base md:text-lg text-foreground">
                                                        {item.title}
                                                    </h3>
                                                    <span className="text-[11px] text-muted-foreground">{item.subtitle}</span>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                                                {item.badge}
                                            </span>
                                        </div>

                                        <p className="text-xs md:text-sm text-foreground/80 leading-relaxed mb-4">
                                            {item.desc}
                                        </p>

                                        {item.details && (
                                            <ul className="space-y-1.5 text-xs text-muted-foreground">
                                                {item.details.slice(0, 2).map((d, i) => (
                                                    <li key={i} className="flex items-start gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                                        <span className="line-clamp-2">{d}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { hapticImpact(); setActiveStepIndex(idx); setViewMode('stepper'); }}
                                        className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary hover:underline"
                                    >
                                        <span>বিস্তারিত নির্দেশিকা ও দোয়া দেখুন</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* 3. TAWAF & SA'I INTERACTIVE TRACKER COUNTER */}
                {/* ============================================================== */}
                {viewMode === 'tracker' && (
                    <div className="space-y-8">
                        {/* Tawaf Tracker Card */}
                        <div className="rounded-3xl bg-card border-2 border-primary/30 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                        তাওয়াফ ডিজিটাল সহায়ক
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-extrabold text-foreground mt-1">
                                        কাবা শরীফ তাওয়াফ কাউন্টার (7 চক্কর)
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        হাজরে আসওয়াদ থেকে শুরু করে কাবার চারপাশ ঘড়ির কাঁটার বিপরীত দিকে 7 চক্কর গণনা করুন
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetTawaf}
                                    className="p-2 text-muted-foreground hover:text-foreground rounded-full bg-muted transition"
                                    title="কাউন্টার রিসেট করুন"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>

                            {!tawafCompleted ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    {/* Circular Round Indicator */}
                                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5 shadow-inner mb-6">
                                        <span className="text-4xl md:text-5xl font-black text-primary">
                                            {tawafRound.toLocaleString('bn-BD-u-nu-latn')}
                                        </span>
                                        <span className="absolute bottom-6 text-xs font-bold text-muted-foreground">
                                            / 7ম চক্কর
                                        </span>
                                    </div>

                                    {/* Realtime Round Guidance */}
                                    <div className="max-w-md bg-muted/60 border border-border p-4 rounded-2xl text-xs md:text-sm text-foreground/90 mb-6">
                                        {tawafRound <= 3 ? (
                                            <p className="font-semibold text-primary">
                                                ⚡ 1ম-3য় চক্কর: পুরুষদের একটু দ্রুত ও বীরদর্পে চলা (রমল) সুন্নত এবং ডান কাঁধ খোলা রাখা (ইজতিবা)।
                                            </p>
                                        ) : (
                                            <p className="font-semibold text-foreground">
                                                🚶 4র্থ-7ম চক্কর: স্বাভাবিক পদক্ষেপে প্রশান্তির সাথে প্রদক্ষিণ করুন।
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-2">
                                            হাজরে আসওয়াদে পৌঁছালে বলুন: <strong className="text-primary font-arabic text-sm">بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ</strong>
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleTawafIncrement}
                                        className="native-press w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-primary text-gold text-base font-bold shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                                    >
                                        <span>চক্কর {tawafRound} সম্পন্ন (+1 গণনা)</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-emerald-600">
                                        আলহামদুলিল্লাহ! আপনার 7 চক্কর তাওয়াফ সম্পন্ন হয়েছে।
                                    </h4>
                                    <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
                                        এখন ডান কাঁধ ঢেকে নিন, মাকামে ইবরাহীমের পেছনে 2 রাকাত তাওয়াফের সালাত আদায় করুন এবং তৃপ্তিভরে জমজম পান করে সাঈর জন্য অগ্রসর হোন।
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetTawaf}
                                        className="native-press px-5 py-2 text-xs font-semibold rounded-full bg-muted text-foreground hover:bg-muted/80 transition"
                                    >
                                        পুনরায় গণনা শুরু করুন
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sa'i Tracker Card */}
                        <div className="rounded-3xl bg-card border-2 border-emerald-500/30 p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                                        সাঈ ডিজিটাল সহায়ক
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-extrabold text-foreground mt-1">
                                        সাফা ও মারওয়া সাঈ কাউন্টার (7 বার)
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        সাফা থেকে শুরু করে মারওয়া পাহাড়ে 7ম বারে সমাপ্তি
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetSai}
                                    className="p-2 text-muted-foreground hover:text-foreground rounded-full bg-muted transition"
                                    title="কাউন্টার রিসেট করুন"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>

                            {!saiCompleted ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-emerald-500/20 bg-emerald-500/5 shadow-inner mb-6">
                                        <span className="text-4xl md:text-5xl font-black text-emerald-600">
                                            {saiLap.toLocaleString('bn-BD-u-nu-latn')}
                                        </span>
                                        <span className="absolute bottom-6 text-xs font-bold text-muted-foreground">
                                            / 7ম বার
                                        </span>
                                    </div>

                                    {/* Direction indicator */}
                                    <div className="max-w-md bg-muted/60 border border-border p-4 rounded-2xl text-xs md:text-sm text-foreground/90 mb-6">
                                        <span className="text-xs font-bold text-emerald-600 block mb-1">
                                            বর্তমান অভিমুখ:
                                        </span>
                                        <p className="text-base font-bold text-foreground">
                                            {saiLap % 2 === 1 ? 'সাফা ➔ মারওয়া' : 'মারওয়া ➔ সাফা'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            💡 মাঝের সবুজ লাইটের চিহ্নিত স্থানে পুরুষদের দ্রুতপায়ে দৌড়ানো সুন্নত।
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSaiIncrement}
                                        className="native-press w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-emerald-600 text-white text-base font-bold shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                                    >
                                        <span>{saiLap % 2 === 1 ? 'মারওয়ায় পৌঁছেছি (+1)' : 'সাফায় পৌঁছেছি (+1)'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-emerald-600">
                                        আলহামদুলিল্লাহ! আপনার সাঈ সমাপ্ত হয়েছে।
                                    </h4>
                                    <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
                                        এখন সর্বশেষ ওয়াজিব ধাপ হলো পুরুষদের সম্পূর্ণ মাথা মুণ্ডন (হলক) বা চুল ছোট করা (কসর) এবং নারীদের আঙুলের এক কর পরিমাণ চুল কাটা।
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetSai}
                                        className="px-5 py-2 text-xs font-semibold rounded-full bg-muted text-foreground hover:bg-muted/80 transition"
                                    >
                                        পুনরায় গণনা শুরু করুন
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* 4. PROHIBITIONS VIEW (ইহরামের নিষিদ্ধ বিষয়সমূহ) */}
                {/* ============================================================== */}
                {viewMode === 'prohibitions' && (
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 md:p-8">
                            <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 mb-2">
                                <ShieldAlert className="w-6 h-6 shrink-0" />
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold">ইহরাম অবস্থায় নিষিদ্ধ বিষয়সমূহ (মুহাররামাতুল ইহরাম):</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        ইহরাম বাঁধার পর থেকে চুল কাটা বা হলকের পূর্ব পর্যন্ত এই বিষয়গুলো থেকে কঠোরভাবে বিরত থাকা ওয়াজিব
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {prohibitions.map((p, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-card border border-border p-5 shadow-xs flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                {p.scope}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-base text-foreground mb-1">
                                            {p.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {p.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dam / Penalty notes */}
                        <div className="rounded-2xl bg-card border border-border p-5 text-xs text-muted-foreground space-y-2">
                            <span className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                                <HelpCircle className="w-4 h-4 text-primary" /> ভুলবশত কোনো নিষিদ্ধ কাজ হয়ে গেলে করণীয়:
                            </span>
                            <p>
                                অজ্ঞতাবশত বা ভুলবশত কোনো নিষিদ্ধ কাজ (যেমন আতর লাগানো বা চুল ঝরে যাওয়া) হয়ে গেলে তাৎক্ষণিকভাবে তা বন্ধ করে তওবা ও ইস্তিগফার করবেন। ইচ্ছাকৃত বা অসাবধানতাবশত নিষেধাজ্ঞা ভঙ্গ করলে অপরাধভেদে ফিদইয়া বা দম (একটি ছাগল/ভেড়া কোরবানি অথবা 6 জন মিসকিনকে খাবার খাওয়ানো) ওয়াজিব হতে পারে।
                            </p>
                        </div>
                    </div>
                )}

                {/* ============================================================== */}
                {/* 5. INTERACTIVE CHECKLIST VIEW */}
                {/* ============================================================== */}
                {viewMode === 'checklist' && (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="rounded-3xl bg-card border border-border p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-foreground">উমরার প্রয়োজনীয় সামগ্রী চেকলিস্ট</h3>
                                    <p className="text-xs text-muted-foreground">ভ্রমণের পূর্বে প্রতিটি প্রয়োজনীয় জিনিস প্রস্তুত করে টিকচিহ্ন দিন</p>
                                </div>
                                <span className="text-lg font-black text-primary">
                                    {checklistProgress}%
                                </span>
                            </div>

                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-primary transition-all duration-300 rounded-full"
                                    style={{ width: `${checklistProgress}%` }}
                                />
                            </div>

                            <div className="space-y-2.5">
                                {checklist.map((item) => (
                                    <label
                                        key={item.id}
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
                                            item.checked
                                                ? 'bg-primary/5 border-primary/30 text-muted-foreground line-through'
                                                : 'bg-card border-border hover:border-primary/50 text-foreground'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => toggleChecklistItem(item.id)}
                                            className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                                        />
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
