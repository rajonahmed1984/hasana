import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    BookOpen, 
    ScrollText, 
    Heart, 
    MapPin, 
    Clock, 
    Bookmark, 
    Share2, 
    Moon, 
    Sun,
    ChevronRight, 
    Calendar,
    Bell,
    BellRing,
    Sparkles,
    Loader2,
    Navigation,
    Compass,
    X,
    Search
} from 'lucide-react';
import { DuaHandsIcon, KaabaIcon, TasbihIcon } from '../components/IslamicIcons';
import { Layout } from '../components/Layout';
import { DailyQuiz } from '../components/DailyQuiz';
import { ShareCardModal } from '../components/ShareCardModal';
import { hapticImpact, isNative } from '../native';
import { 
    isPrayerNotificationEnabled, 
    enablePrayerNotifications, 
    disablePrayerNotifications,
    fetchDailyAyah,
    isDailyAyahNotificationEnabled,
    setDailyAyahNotificationEnabled,
    requestNotifPermission
} from '../services/prayerNotifications';
import { 
    getStoredLocation, 
    requestUserLocation, 
    getAccuratePrayerTimes,
    calculateSolarPrayerTimes,
    calculatePrayerCountdown
} from '../services/locationService';
import { subscribeToUpdateState } from '../services/appUpdate';

const quickAccess = [
    { to: '/quran', title: 'আল-কুরআন', desc: 'পবিত্র কুরআন শরীফ পড়ুন', icon: BookOpen },
    { to: '/hadith', title: 'হাদিস শরীফ', desc: 'নির্বাচিত হাদিস পড়ুন', icon: ScrollText },
    { to: '/duas', title: 'দোয়া সমূহ', desc: 'দৈনন্দিন প্রয়োজনীয় দোয়া', icon: DuaHandsIcon },
    { to: '/umrah-guide', title: 'উমরা গাইড', desc: 'উমরার পূর্ণাঙ্গ নিয়মাবলী', icon: KaabaIcon },
];

const features = [
    { title: 'নামাজের সময়সূচী', desc: 'প্রতিদিন সঠিক সময়ে নামাজের সময়', icon: Clock, to: '/prayer-times' },
    { title: 'ডিজিটাল তসবিহ', desc: 'দৈনন্দিন জিকির ও তাসবিহ গণনা', icon: TasbihIcon, to: '/tasbih' },
    { title: 'বুকমার্ক সংরক্ষণ', desc: 'পছন্দের আয়াত ও দোয়া বুকমার্ক করুন', icon: Bookmark, to: '/bookmarks' },
    { title: 'আয়াত ও দোয়া শেয়ার', desc: 'সহজেই শেয়ার করুন বন্ধুমহলে', icon: Share2 },
    { title: 'ডার্ক মোড সমর্থন', desc: 'চোখের আরামের জন্য আধুনিক ডার্ক মোড', icon: Moon },
];

const dailyHadith = {
    title: 'আজকের হাদিস',
    text_ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    text_bn: 'রাসূলুল্লাহ (সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম) বলেছেন: "তোমাদের মধ্যে সেই ব্যক্তি সর্বোত্তম, যে নিজে কুরআন শিখে এবং অন্যকে তা শিক্ষা দেয়।"',
    reference: 'সহীহ বুখারী, হাদিস নং ৫০২৭',
};

const toBnDigits = (num) => String(num).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

export function HomePage() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [nowTime, setNowTime] = useState(() => new Date());
    const [notifActive, setNotifActive] = useState(false);
    const [dailyAyah, setDailyAyah] = useState(null);
    const [dailyAyahNotifActive, setDailyAyahNotifActive] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareCardData, setShareCardData] = useState(null);
    const [appUpdateInfo, setAppUpdateInfo] = useState(null);

    useEffect(() => {
        return subscribeToUpdateState((info) => setAppUpdateInfo(info));
    }, []);

    // Dynamic Location & Prayer Times State
    const [locationData, setLocationData] = useState(() => getStoredLocation());
    const [prayerTimes, setPrayerTimes] = useState(() => {
        const loc = getStoredLocation();
        return calculateSolarPrayerTimes(loc.latitude, loc.longitude);
    });
    const [locationLoading, setLocationLoading] = useState(false);

    // Index of the prayer whose waqt is running now (-1 between sunrise and Dhuhr).
    // Recomputed on every render; the clock below re-renders every second.
    const activePrayerIndex = (() => {
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const starts = prayerTimes.map((p) => p.startHour * 60 + p.startMin);
        const last = prayerTimes.length - 1;
        if (nowMin >= starts[last] || nowMin < starts[0]) return last; // Isha runs until Fajr
        for (let i = 0; i < last; i++) {
            const p = prayerTimes[i];
            const end = p.endHour != null ? p.endHour * 60 + p.endMin : starts[i + 1];
            if (nowMin >= starts[i] && nowMin < end) return i;
        }
        return -1;
    })();

    const currentPrayer = activePrayerIndex >= 0 ? prayerTimes[activePrayerIndex] : prayerTimes[0];
    const nextPrayer = prayerTimes && prayerTimes.length > 0 
        ? prayerTimes[(activePrayerIndex + 1 + prayerTimes.length) % prayerTimes.length] 
        : null;

    // Live countdown to next prayer / end of current waqt, updates every second
    const countdownData = React.useMemo(() => {
        return calculatePrayerCountdown(prayerTimes, nowTime);
    }, [prayerTimes, nowTime]);

    const [showLocationBanner, setShowLocationBanner] = useState(() => {
        return localStorage.getItem('hasana-location-prompted') !== 'true' && 
               getStoredLocation().isDefault;
    });

    // Detect / Update Location
    const handleDetectLocation = async (manual = false) => {
        if (manual) hapticImpact();
        setLocationLoading(true);
        try {
            const res = await requestUserLocation();
            if (res.success && res.location) {
                setLocationData(res.location);
                if (res.schedule) {
                    setPrayerTimes(res.schedule);
                }
                setShowLocationBanner(false);
                localStorage.setItem('hasana-location-prompted', 'true');
            } else if (manual && res.error) {
                alert(res.error);
            }
        } catch (err) {
            console.error('[HomePage] Location detection error:', err);
        } finally {
            setLocationLoading(false);
        }
    };

    // Auto-prompt location on app install / first visit
    useEffect(() => {
        // If never prompted, ask for location
        const prompted = localStorage.getItem('hasana-location-prompted');
        if (!prompted && navigator.geolocation) {
            handleDetectLocation(false);
        }

        // Fetch accurate prayer times for current location (online + offline fallback)
        const loc = getStoredLocation();
        getAccuratePrayerTimes(loc.latitude, loc.longitude).then((schedule) => {
            if (schedule && schedule.length === 5) {
                setPrayerTimes(schedule);
                localStorage.setItem('hasana-dynamic-prayer-schedule', JSON.stringify(schedule));
            }
        });
    }, []);

    useEffect(() => {
        setNotifActive(isPrayerNotificationEnabled());
        setDailyAyahNotifActive(isDailyAyahNotificationEnabled());

        // Fetch today's Ayah from backend
        fetchDailyAyah().then((ayah) => {
            if (ayah) setDailyAyah(ayah);
        });
    }, []);

    const handleToggleNotification = async () => {
        hapticImpact();
        if (notifActive) {
            disablePrayerNotifications();
            setNotifActive(false);
        } else {
            const res = await enablePrayerNotifications();
            if (res.success) {
                setNotifActive(true);
            }
        }
    };

    const handleToggleDailyAyahNotif = async () => {
        hapticImpact();
        if (dailyAyahNotifActive) {
            setDailyAyahNotificationEnabled(false);
            setDailyAyahNotifActive(false);
        } else {
            const res = await requestNotifPermission();
            if (res.success) {
                setDailyAyahNotificationEnabled(true);
                setDailyAyahNotifActive(true);
            }
        }
    };

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('bn-BD-u-nu-latn', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString('bn-BD-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            setCurrentTime(timeStr);
            setCurrentDate(dateStr);
            setNowTime(now);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const activeVerse = dailyAyah ? {
        title: 'আজকের দিনের আয়াত',
        text_ar: dailyAyah.text_ar,
        text_bn: dailyAyah.text_bn,
        reference: dailyAyah.reference,
        deep_link: dailyAyah.deep_link,
        surah_name: dailyAyah.surah_name,
    } : {
        title: 'আজকের দিনের আয়াত',
        text_ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        text_bn: 'তুমি আমাদের (সরল ও) অবিচল পথটি দেখিয়ে দাও-',
        reference: 'সূরা আল-ফাতিহা, 1:6',
        deep_link: '/surah/al-fatiha?ayah=6',
        surah_name: 'আল-ফাতিহা',
    };

    // Photo card share for Ayah of the day
    const handleShareVerse = () => {
        hapticImpact();
        setShareCardData({
            type: 'ayah',
            title: activeVerse.title || 'আজকের দিনের আয়াত',
            reference: activeVerse.reference,
            text_ar: activeVerse.text_ar,
            text_bn: activeVerse.text_bn,
            url: window.location.origin + (activeVerse.deep_link || '/quran'),
        });
        setIsShareModalOpen(true);
    };

    // Photo card share for Hadith of the day
    const handleShareHadith = () => {
        hapticImpact();
        setShareCardData({
            type: 'hadith',
            title: 'আজকের হাদিস',
            reference: dailyHadith.reference,
            text_ar: dailyHadith.text_ar,
            text_bn: dailyHadith.text_bn,
            url: `${window.location.origin}/hadith`,
        });
        setIsShareModalOpen(true);
    };

    return (
        <Layout>
            {/* Hero Section with Mosque Mihrab Arch & Dome Silhouette */}
            <section className="bg-hero text-primary-foreground relative overflow-hidden pt-8 pb-14 md:py-16">
                <div className="absolute inset-0 pattern opacity-25 pointer-events-none" />
                <div className="relative mx-auto max-w-4xl px-4 text-center">
                    <p className="font-arabic text-2xl md:text-4xl text-gold font-bold drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
                        السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ
                    </p>
                    <h1 className="text-xl md:text-3xl font-extrabold mt-2 text-white">আসসালামু আলাইকুম</h1>
                    
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-gold/40 px-3.5 py-1 text-xs text-gold font-medium backdrop-blur-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{currentDate || 'আজকের দিন'}</span>
                    </div>

                    {/* Islamic Mosque Arch & Prayer Countdown Hero */}
                    <div className="mt-6 mx-auto max-w-md relative">
                        {/* Ambient Gold Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gold/20 blur-2xl pointer-events-none rounded-full" />

                        {/* Mosque Dome & Minarets Silhouette SVG */}
                        <div className="relative mx-auto max-w-[240px] pt-1 pb-3">
                            <svg viewBox="0 0 240 75" className="w-full h-auto text-gold drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" fill="none" stroke="currentColor">
                                {/* Mihrab Arch Outline */}
                                <path d="M 12 75 C 12 38, 48 16, 120 4 C 192 16, 228 38, 228 75" strokeWidth="2" strokeLinecap="round" />
                                <path d="M 22 75 C 22 44, 52 24, 120 14 C 188 24, 218 44, 218 75" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                                
                                {/* Central Mosque Dome Filled */}
                                <path d="M 88 75 C 88 50, 102 42, 120 32 C 138 42, 152 50, 152 75 Z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.2" />
                                {/* Crescent Moon */}
                                <path d="M 120 28 Q 118 23 120 18 Q 124 23 120 28" fill="currentColor" />
                                {/* Minarets */}
                                <rect x="64" y="44" width="7" height="31" rx="1.5" fill="currentColor" fillOpacity="0.3" strokeWidth="1" />
                                <polygon points="67.5,35 64,44 71,44" fill="currentColor" />
                                <rect x="169" y="44" width="7" height="31" rx="1.5" fill="currentColor" fillOpacity="0.3" strokeWidth="1" />
                                <polygon points="172.5,35 169,44 176,44" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Current Waqt Info & Live Countdown */}
                        <div className="relative z-10 -mt-1">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/45 text-gold text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                                <span>{`বর্তমান ওয়াক্ত: ${countdownData.currentPrayerName}`}</span>
                            </span>

                            <div className="mt-3">
                                {/* Live second and minute-wise countdown timer */}
                                <h3 className="text-4xl sm:text-5xl font-black text-gold tracking-tight tabular-nums drop-shadow-[0_2px_14px_rgba(212,175,55,0.5)]">
                                    {countdownData.formattedCountdown}
                                </h3>
                                <p className="mt-1 text-xs text-emerald-100/90 font-medium flex items-center justify-center gap-1.5 flex-wrap">
                                    <span className="text-gold/90 font-semibold">{countdownData.label}</span>
                                    <span>•</span>
                                    <span>পরবর্তী ওয়াক্ত: {countdownData.nextPrayerName} ({countdownData.nextPrayerTime})</span>
                                </p>
                            </div>

                            {/* View All Button */}
                            <div className="mt-4">
                                <Link
                                    to="/prayer-times"
                                    onClick={() => hapticImpact()}
                                    className="gold-gradient-btn px-5 py-2 rounded-full text-xs font-bold shadow-lg inline-flex items-center gap-1.5 native-press cursor-pointer"
                                >
                                    <span>সকল ওয়াক্ত দেখুন</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Play Store App Update Alert & Location Prompt Banners */}
            {((isNative() && appUpdateInfo?.hasUpdate) || showLocationBanner) && (
                <section className="mx-auto max-w-3xl px-4 mt-5 relative z-20 space-y-3">
                    {/* Play Store App Update Alert Banner (Native Android only) */}
                    {isNative() && appUpdateInfo && appUpdateInfo.hasUpdate && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 border border-gold/50 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-white animate-fade-scale">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-gold/25 border border-gold/50 text-gold flex items-center justify-center shrink-0 shadow-xs">
                                    <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                                        <span>নতুন সংস্করণ এসেছে (v{appUpdateInfo.latestVersion})</span>
                                        <span className="text-[10px] bg-gold text-primary font-extrabold px-1.5 py-0.2 rounded-full">Play Store</span>
                                    </p>
                                    <p className="text-[11px] text-white/80 line-clamp-1">
                                        {appUpdateInfo.message || 'নতুন ফিচার ও পারফরম্যান্স উন্নয়নের জন্য এখনই আপডেট করুন।'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={appUpdateInfo.storeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => hapticImpact()}
                                    className="px-3.5 py-1.5 rounded-xl bg-gold text-primary text-xs font-bold shadow-md hover:bg-gold/90 active:scale-95 transition"
                                >
                                    আপডেট
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setAppUpdateInfo(null)}
                                    className="p-1 text-white/60 hover:text-white"
                                    title="বাতিল করুন"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Location Detection Banner for First Open / Install */}
                    {showLocationBanner && (
                        <div className="p-3.5 rounded-2xl bg-card border-2 border-primary/30 shadow-lg backdrop-blur-md flex items-center justify-between gap-3 animate-fade-scale">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-primary text-gold flex items-center justify-center shrink-0 shadow-xs">
                                    <Navigation className="w-4 h-4 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-bold text-foreground">
                                        আপনার এলাকার সঠিক নামাজের সময়সূচী চান?
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        লোকেশন অনুমতি দিলে আপনার বর্তমান শহরের ওয়াক্ত অনুযায়ী সঠিক সময় ও আজান নোটিফিকেশন সেট হবে।
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleDetectLocation(true)}
                                    disabled={locationLoading}
                                    className="px-3 py-1.5 rounded-xl bg-primary text-gold text-xs font-bold shadow-xs hover:brightness-110 native-press flex items-center gap-1"
                                >
                                    {locationLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                    <span>অনুমতি দিন</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowLocationBanner(false);
                                        localStorage.setItem('hasana-location-prompted', 'true');
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition"
                                    title="পরে করবো"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Verse of the Day Card (আজকের দিনের আয়াত) */}
            <section className="mx-auto max-w-3xl px-4 mt-8">
                <div className="rounded-3xl bg-card border border-gold/35 p-6 md:p-8 text-center shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider bg-gold/15 border border-gold/30 px-3.5 py-1.5 rounded-full">
                            <Sparkles className="w-3.5 h-3.5" />
                            {activeVerse.title}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleToggleDailyAyahNotif}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition native-press ${
                                    dailyAyahNotifActive 
                                        ? 'bg-primary/10 text-primary border border-primary/30' 
                                        : 'bg-muted text-foreground/70 hover:bg-muted-foreground/20'
                                }`}
                                title={dailyAyahNotifActive ? "প্রতিদিনের আয়াত নোটিফিকেশন সচল আছে" : "প্রতিদিনের আয়াত নোটিফিকেশন চালু করুন"}
                            >
                                {dailyAyahNotifActive ? <BellRing className="w-4 h-4 text-gold" /> : <Bell className="w-4 h-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={handleShareVerse}
                                className="w-8 h-8 rounded-full bg-muted text-foreground/80 hover:bg-muted-foreground/20 flex items-center justify-center transition native-press"
                                title="আয়াতটি শেয়ার করুন"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <p className="font-arabic text-2xl md:text-4xl text-primary font-bold my-4 leading-loose">
                        {activeVerse.text_ar}
                    </p>
                    <p className="text-base md:text-lg text-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                        "{activeVerse.text_bn}"
                    </p>
                    <p className="text-xs md:text-sm text-gold font-bold mt-3">
                        — {activeVerse.reference}
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-3">
                        <Link
                            to={activeVerse.deep_link || '/quran'}
                            onClick={() => hapticImpact()}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full gold-gradient-btn text-xs font-bold transition shadow-md native-press"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>কুরআনে সম্পূর্ণ সূরা পড়ুন</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* আজকের হাদিস (Hadith of the Day) Card */}
            <section className="mx-auto max-w-3xl px-4 mt-8">
                <div className="rounded-3xl bg-card border border-gold/35 p-6 md:p-8 text-center shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider bg-gold/15 border border-gold/30 px-3.5 py-1.5 rounded-full">
                            <ScrollText className="w-3.5 h-3.5 text-gold" />
                            আজকের হাদিস
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleShareHadith}
                                className="w-8 h-8 rounded-full bg-muted text-foreground/80 hover:bg-muted-foreground/20 flex items-center justify-center transition native-press"
                                title="হাদিসটি শেয়ার করুন"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <p className="font-arabic text-2xl md:text-4xl text-gold font-bold my-4 leading-loose drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]" dir="rtl">
                        {dailyHadith.text_ar}
                    </p>
                    <p className="text-base md:text-lg text-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                        "{dailyHadith.text_bn}"
                    </p>
                    <p className="text-xs md:text-sm text-gold font-bold mt-3">
                        — {dailyHadith.reference}
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-3">
                        <Link
                            to="/hadith"
                            onClick={() => hapticImpact()}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full gold-gradient-btn text-xs font-bold transition shadow-md native-press"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>হাদিস সম্ভার পড়ুন</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ask / Explore & Daily Quiz */}
            <section className="mx-auto max-w-3xl px-4 mt-8 space-y-5">
                <form
                    id="home-search-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const q = e.currentTarget.elements.q.value.trim();
                        hapticImpact();
                        navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
                    }}
                    className="rounded-3xl bg-hero text-primary-foreground p-5 md:p-7 shadow-md border border-gold/30 relative overflow-hidden scroll-mt-24 transition-all duration-300"
                >
                    <div className="absolute inset-0 pattern opacity-30 pointer-events-none" />
                    <div className="relative">
                        <h2 className="font-bold text-lg md:text-xl text-white">কোনো বিষয়ে জানতে চান?</h2>
                        <p className="text-xs md:text-sm opacity-85 mt-1 text-emerald-100">প্রশ্ন লিখুন — কুরআন, হাদিস ও দোয়া থেকে খুঁজে দেখানো হবে</p>
                        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-card border border-gold/30 p-1.5 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/40 transition">
                            <Search className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
                            <input
                                id="home-search-input"
                                name="q"
                                type="search"
                                maxLength={200}
                                placeholder="যেমন: মন খারাপ হলে কী করব?"
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground py-2"
                            />
                            <button type="submit" className="shrink-0 px-4 py-2 rounded-xl gold-gradient-btn font-bold text-xs native-press cursor-pointer">
                                খুঁজুন
                            </button>
                        </div>
                    </div>
                </form>

                <DailyQuiz />
            </section>

            {/* Quick Access Grid */}
            <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">দ্রুত অ্যাক্সেস</h2>
                        <span className="text-xs text-muted-foreground">মূল ইসলামিক বিভাগসমূহ</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                    {quickAccess.map(({ to, title, desc, icon: Icon }) => (
                        <Link 
                            key={to} 
                            to={to} 
                            onClick={() => hapticImpact()}
                            className="rounded-2xl bg-card border border-gold/25 hover:border-gold/50 p-4 md:p-6 shadow-sm card-hover flex flex-col justify-between group native-press select-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a4232] to-[#041f17] border border-gold/40 text-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                    <Icon className="w-6 h-6 text-gold" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-bold text-base md:text-lg group-hover:text-gold transition-colors">{title}</h3>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Features Section */}
                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-5">অ্যাপ্লিকেশন বৈশিষ্ট্য</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                    {features.map(({ title, desc, icon: Icon, to }) => {
                        const cardContent = (
                            <div className="rounded-2xl bg-card border border-border/80 hover:border-gold/45 p-4 md:p-6 shadow-xs transition group h-full">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-sm md:text-base group-hover:text-gold transition-colors">{title}</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                            </div>
                        );

                        return to ? (
                            <Link key={title} to={to} onClick={() => hapticImpact()} className="block native-press">
                                {cardContent}
                            </Link>
                        ) : (
                            <div key={title}>{cardContent}</div>
                        );
                    })}
                </div>
            </section>

            {shareCardData && (
                <ShareCardModal
                    isOpen={isShareModalOpen}
                    onClose={() => {
                        setIsShareModalOpen(false);
                        setShareCardData(null);
                    }}
                    data={shareCardData}
                />
            )}
        </Layout>
    );
}
