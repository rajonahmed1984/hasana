import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    BookOpen, 
    ScrollText, 
    Heart, 
    MapPin, 
    Share2, 
    Sun,
    ChevronRight,
    CalendarDays,
    Ban,
    Leaf,
    Bell,
    BellRing,
    Sparkles,
    Loader2,
    Navigation,
    Compass,
    X,
    Search,
    CheckCircle2,
    Circle
} from 'lucide-react';
import { DuaHandsIcon, KaabaIcon, TasbihIcon } from '../components/IslamicIcons';
import { Layout } from '../components/Layout';
import { ShareCardModal } from '../components/ShareCardModal';
import { SmartSearchInput } from '../components/SmartSearchInput';
import { hapticImpact, isNative } from '../native';
import { 
    isPrayerNotificationEnabled, 
    enablePrayerNotifications, 
    disablePrayerNotifications,
    fetchDailyContent,
    isDailyAyahNotificationEnabled,
    setDailyAyahNotificationEnabled,
    requestNotifPermission
} from '../services/prayerNotifications';
import { 
    getStoredLocation, 
    requestUserLocation, 
    getAccuratePrayerTimes,
    calculateSolarPrayerTimes,
    calculatePrayerCountdown,
    isJumuahDay,
    withJumuah,
    getForbiddenStatus
} from '../services/locationService';
import { getBanglaDate, getHijriFallback } from '../services/banglaCalendar';
import { subscribeToUpdateState } from '../services/appUpdate';

const quickAccess = [
    { to: '/quran', title: 'আল-কুরআন', desc: 'পবিত্র কুরআন শরীফ পড়ুন', icon: BookOpen },
    { to: '/hadith', title: 'হাদিস শরীফ', desc: 'নির্বাচিত হাদিস পড়ুন', icon: ScrollText },
    { to: '/duas', title: 'দোয়া সমূহ', desc: 'দৈনন্দিন প্রয়োজনীয় দোয়া', icon: DuaHandsIcon },
    { to: '/umrah-guide', title: 'উমরা গাইড', desc: 'উমরার পূর্ণাঙ্গ নিয়মাবলী', icon: KaabaIcon },
];

const dailyHadith = {
    title: 'আজকের হাদিস',
    text_ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    text_bn: 'রাসূলুল্লাহ (সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম) বলেছেন: "তোমাদের মধ্যে সেই ব্যক্তি সর্বোত্তম, যে নিজে কুরআন শিখে এবং অন্যকে তা শিক্ষা দেয়।"',
    reference: 'সহীহ বুখারী, হাদিস নং ৫০২৭',
};

const toBnDigits = (num) => String(num).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

const pad2 = (n) => String(n).padStart(2, '0');
const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [nowTime, setNowTime] = useState(() => new Date());
    const [notifActive, setNotifActive] = useState(false);
    const [dailyAyah, setDailyAyah] = useState(null);
    // Islamic day from the backend: occasion (Jumu'ah, Ramadan …), hijri date, hadith and amal list
    const [dailyContent, setDailyContent] = useState(null);
    const [amalDone, setAmalDone] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(`hasana-amal-done-${todayKey()}`) || '[]');
        } catch {
            return [];
        }
    });
    const [dailyAyahNotifActive, setDailyAyahNotifActive] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareCardData, setShareCardData] = useState(null);
    const [appUpdateInfo, setAppUpdateInfo] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [homeQuery, setHomeQuery] = useState('');

    // Toggle search card when header search button is clicked or ?search=open in URL
    useEffect(() => {
        const handleToggle = (e) => {
            setIsSearchOpen((prev) => {
                const next = e?.detail?.open !== undefined ? Boolean(e.detail.open) : !prev;
                window.dispatchEvent(new CustomEvent('hasana:search-state', { detail: { open: next } }));
                if (next) {
                    setTimeout(() => {
                        const form = document.getElementById('home-search-form');
                        const input = document.getElementById('home-search-input');
                        if (form) {
                            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        if (input) {
                            input.focus();
                        }
                    }, 80);
                }
                return next;
            });
        };

        window.addEventListener('hasana:toggle-search', handleToggle);
        return () => window.removeEventListener('hasana:toggle-search', handleToggle);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('search') === 'open' || params.get('search') === '1' || location.hash === '#search') {
            setIsSearchOpen(true);
            window.dispatchEvent(new CustomEvent('hasana:search-state', { detail: { open: true } }));
            setTimeout(() => {
                const form = document.getElementById('home-search-form');
                const input = document.getElementById('home-search-input');
                if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (input) input.focus();
            }, 100);
        }
    }, [location.search, location.hash]);

    const handleCloseSearch = () => {
        hapticImpact();
        setIsSearchOpen(false);
        window.dispatchEvent(new CustomEvent('hasana:search-state', { detail: { open: false } }));
    };

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

        // Fetch today's Ayah, hadith and amal from backend
        fetchDailyContent().then((content) => {
            if (content) {
                setDailyAyah(content.ayah);
                setDailyContent(content);
            }
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
        const updateClock = () => setNowTime(new Date());
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
        text_ar: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ',
        text_bn: 'তুমি আমাদের (সরল ও) অবিচল পথটি দেখিয়ে দাও-',
        reference: 'সূরা আল-ফাতিহা, 1:6',
        deep_link: '/surah/al-fatiha?ayah=6',
        surah_name: 'আল-ফাতিহা',
    };

    const todayHadith = dailyContent?.hadith || dailyHadith;

    const toggleAmal = (index) => {
        hapticImpact();
        setAmalDone((prev) => {
            const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
            try { localStorage.setItem(`hasana-amal-done-${todayKey()}`, JSON.stringify(next)); } catch {}
            return next;
        });
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
            reference: todayHadith.reference,
            text_ar: todayHadith.text_ar,
            text_bn: todayHadith.text_bn,
            url: `${window.location.origin}/hadith`,
        });
        setIsShareModalOpen(true);
    };

    // While a forbidden prayer time runs, the whole card turns red and counts down to its end
    const forbidden = getForbiddenStatus(prayerTimes, nowTime);
    const inForbidden = Boolean(forbidden?.active);

    // On Fridays the Dhuhr tile reads "জুমা"
    const isFriday = isJumuahDay(nowTime);
    const displayTimes = withJumuah(prayerTimes, nowTime);

    // Three calendars side by side: Gregorian, Hijri and Bangla
    const weekday = nowTime.toLocaleDateString('bn-BD', { weekday: 'long' });
    const banglaDate = getBanglaDate(nowTime);
    const hijri = dailyContent?.hijri?.day ? dailyContent.hijri : getHijriFallback(nowTime);
    const dateCells = [
        {
            key: 'gregorian',
            day: nowTime.getDate(),
            month: nowTime.toLocaleDateString('bn-BD', { month: 'long' }),
            year: `${nowTime.getFullYear()} খ্রিস্টাব্দ`,
        },
        {
            key: 'hijri',
            day: hijri?.day ?? '--',
            month: hijri?.month_bn ?? '—',
            year: hijri ? `${hijri.year} হিজরি` : '',
        },
        {
            key: 'bangla',
            day: banglaDate.day,
            month: banglaDate.monthName,
            year: `${banglaDate.year} বঙ্গাব্দ`,
        },
    ];

    const amalTotal = dailyContent?.amal?.length || 0;
    const amalDoneCount = amalDone.filter((i) => i < amalTotal).length;

    const shortcuts = [
        { to: '/prayer-times', label: 'নামাজের সময়', icon: Sun },
        { to: '/tasbih', label: 'তসবিহ', icon: TasbihIcon },
        { to: '/bookmarks', label: 'বুকমার্ক', icon: Heart },
        { to: '/features', label: 'সকল বৈশিষ্ট্য', icon: Compass },
    ];

    return (
        <Layout>
            {/* ───── Hero: greeting, location and live prayer card ───── */}
            <section className="bg-hero text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 pattern opacity-25 pointer-events-none" />
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[28rem] h-48 bg-gold/15 blur-3xl rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-5xl px-4 pt-4 pb-10 md:pt-10 md:pb-16">
                    {/* Greeting row */}
                    <div className="flex flex-col items-center text-center">
                        <p className="font-arabic text-lg md:text-2xl text-gold leading-tight drop-shadow-[0_1px_6px_rgba(212,175,55,0.35)]">
                            السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ
                        </p>
                        <h1 className="text-xl md:text-3xl font-extrabold text-white mt-0.5">আসসালামু আলাইকুম</h1>

                        {/* Weekday | Jumu'ah / season | location */}
                        <div className="mt-2.5 inline-flex items-stretch max-w-full rounded-full border border-gold/30 bg-primary-foreground/[0.07] backdrop-blur-sm divide-x divide-gold/20 text-[11px] md:text-xs overflow-hidden">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 font-semibold text-emerald-50 whitespace-nowrap">
                                <CalendarDays className="w-3.5 h-3.5 text-gold" />
                                {weekday}
                            </span>
                            {isFriday ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 font-bold text-gold bg-gold/15 whitespace-nowrap">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    জুমা মুবারক
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 font-medium text-emerald-100/85 whitespace-nowrap">
                                    <Leaf className="w-3.5 h-3.5 text-gold/80" />
                                    {banglaDate.season}কাল
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDetectLocation(true)}
                                disabled={locationLoading}
                                className="inline-flex items-center gap-1 min-w-0 px-3 py-1.5 font-semibold text-gold hover:bg-primary-foreground/10 transition native-press"
                                title="অবস্থান নির্ণয় করুন"
                            >
                                {locationLoading
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                    : <MapPin className="w-3.5 h-3.5 shrink-0" />}
                                <span className="truncate max-w-[6.5rem] md:max-w-[10rem]">{locationData?.city || 'অবস্থান'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Date strip: Gregorian · Hijri · Bangla */}
                    <div className="mt-3 md:mt-5 grid grid-cols-3 rounded-xl border border-gold/25 bg-primary-foreground/[0.05] backdrop-blur-sm divide-x divide-gold/15 overflow-hidden">
                        {dateCells.map(({ key, day, month, year }) => (
                            <div key={key} className="min-w-0 px-1.5 py-2 md:px-3 md:py-2.5 text-center">
                                <p className="text-[12px] md:text-sm font-bold text-white leading-tight">
                                    <span className="tabular-nums text-gold">{day}</span> {month}
                                </p>
                                <p className="mt-0.5 text-[9.5px] md:text-[11px] text-emerald-100/60 tabular-nums leading-none">{year}</p>
                            </div>
                        ))}
                    </div>

                    {/* Live prayer card */}
                    <div className={`mt-5 md:mt-8 rounded-3xl border bg-black/20 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.35)] relative overflow-hidden transition-colors ${
                        inForbidden ? 'border-rose-400/50' : 'border-gold/35'
                    }`}>
                        {inForbidden && <div className="absolute inset-0 bg-gradient-to-b from-rose-500/15 to-transparent pointer-events-none" />}
                        {/* Mosque silhouette backdrop */}
                        <svg viewBox="0 0 240 75" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[26rem] max-w-none h-auto text-gold opacity-[0.12] pointer-events-none" fill="none" stroke="currentColor" aria-hidden="true">
                            <path d="M 12 75 C 12 38, 48 16, 120 4 C 192 16, 228 38, 228 75" strokeWidth="2" strokeLinecap="round" />
                            <path d="M 88 75 C 88 50, 102 42, 120 32 C 138 42, 152 50, 152 75 Z" fill="currentColor" fillOpacity="0.5" strokeWidth="1.2" />
                            <path d="M 120 28 Q 118 23 120 18 Q 124 23 120 28" fill="currentColor" />
                            <rect x="64" y="44" width="7" height="31" rx="1.5" fill="currentColor" fillOpacity="0.5" strokeWidth="1" />
                            <polygon points="67.5,35 64,44 71,44" fill="currentColor" />
                            <rect x="169" y="44" width="7" height="31" rx="1.5" fill="currentColor" fillOpacity="0.5" strokeWidth="1" />
                            <polygon points="172.5,35 169,44 176,44" fill="currentColor" />
                        </svg>

                        <div className="relative p-4 md:p-6">
                            <div className="md:flex md:items-center md:justify-between md:gap-6">
                                <div className="text-center md:text-left md:flex-1 md:min-w-0">
                                    {inForbidden ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-200 text-[11px] md:text-xs font-bold">
                                            <Ban className="w-3.5 h-3.5 animate-pulse" />
                                            <span>এখন নামাজের নিষিদ্ধ সময়</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/45 text-gold text-[11px] md:text-xs font-bold">
                                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                            <span>{`বর্তমান ওয়াক্ত: ${countdownData.currentPrayerName}`}</span>
                                        </span>
                                    )}

                                    <p className={`mt-2.5 text-[2.6rem] leading-none sm:text-5xl md:text-6xl font-black tracking-tight tabular-nums ${
                                        inForbidden
                                            ? 'text-rose-200 drop-shadow-[0_2px_14px_rgba(244,63,94,0.45)]'
                                            : 'text-gold drop-shadow-[0_2px_14px_rgba(212,175,55,0.45)]'
                                    }`}>
                                        {inForbidden ? forbidden.formatted : countdownData.formattedCountdown}
                                    </p>
                                    {inForbidden ? (
                                        <>
                                            <p className="mt-2 text-xs text-rose-100/90 flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                                                <span className="font-semibold text-rose-200">{forbidden.active.name} শেষ হতে বাকি</span>
                                                <span className="text-rose-200/50">•</span>
                                                <span>পরবর্তী: {countdownData.nextPrayerName} ({countdownData.nextPrayerTime})</span>
                                            </p>
                                            <p className="mt-1.5 text-[11px] text-rose-100/75">{forbidden.active.note}</p>
                                        </>
                                    ) : (
                                        <p className="mt-2 text-xs text-emerald-100/90 flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                                            <span className="font-semibold text-gold/90">{countdownData.label}</span>
                                            <span className="text-gold/50">•</span>
                                            <span>পরবর্তী: {countdownData.nextPrayerName} ({countdownData.nextPrayerTime})</span>
                                        </p>
                                    )}

                                </div>

                                <div className="mt-4 md:mt-0 flex items-center justify-center gap-2 shrink-0">
                                    <Link
                                        to="/prayer-times"
                                        onClick={() => hapticImpact()}
                                        className="gold-gradient-btn px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 native-press"
                                    >
                                        <span>সকল ওয়াক্ত</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleToggleNotification}
                                        className={`px-3.5 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border native-press transition ${
                                            notifActive
                                                ? 'bg-gold/20 border-gold/60 text-gold'
                                                : 'bg-primary-foreground/10 border-primary-foreground/20 text-emerald-50 hover:bg-primary-foreground/15'
                                        }`}
                                        title={notifActive ? 'নামাজের রিমাইন্ডার চালু আছে' : 'নামাজের রিমাইন্ডার চালু করুন'}
                                    >
                                        {notifActive ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                                        <span>{notifActive ? 'রিমাইন্ডার চালু' : 'রিমাইন্ডার'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Today's five waqts */}
                            <div className="mt-4 md:mt-5 grid grid-cols-5 gap-1.5 md:gap-2.5">
                                {displayTimes.map((p, i) => {
                                    const active = i === activePrayerIndex;
                                    const jumuah = isFriday && p.id === 'dhuhr';
                                    return (
                                        <Link
                                            key={p.id || p.name}
                                            to="/prayer-times"
                                            onClick={() => hapticImpact()}
                                            className={`rounded-2xl px-1 py-2 md:py-3 text-center border transition native-press ${
                                                active
                                                    ? 'bg-gold text-[#062319] border-gold shadow-[0_4px_18px_rgba(212,175,55,0.45)]'
                                                    : jumuah
                                                        ? 'bg-gold/10 border-gold/45 text-emerald-50/90 hover:bg-gold/15'
                                                        : 'bg-primary-foreground/[0.06] border-primary-foreground/10 text-emerald-50/90 hover:bg-primary-foreground/10'
                                            }`}
                                        >
                                            <p className={`text-[11px] md:text-xs font-bold truncate ${active ? '' : 'text-gold/90'}`}>{p.name}</p>
                                            <p className="mt-0.5 text-[11px] md:text-sm font-semibold tabular-nums whitespace-nowrap">{p.start}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Quick access: four main sections, overlapping the hero like a native app ───── */}
            <section className="mx-auto max-w-5xl px-4 -mt-6 md:-mt-9 relative z-10">
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {quickAccess.map(({ to, title, desc, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => hapticImpact()}
                            className="rounded-2xl md:rounded-3xl bg-card border border-gold/30 hover:border-gold/60 shadow-md card-hover px-1 py-2.5 md:p-5 flex flex-col items-center md:items-start text-center md:text-left group native-press select-none"
                        >
                            <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#0a4232] to-[#041f17] border border-gold/40 text-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                            </div>
                            <h3 className="mt-2 md:mt-4 text-[11px] sm:text-xs md:text-base font-bold leading-tight whitespace-nowrap group-hover:text-gold transition-colors">{title}</h3>
                            <p className="hidden md:block text-xs text-muted-foreground mt-1">{desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Secondary shortcuts */}
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                    {shortcuts.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => hapticImpact()}
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-card border border-border hover:border-gold/50 px-3.5 py-2 text-xs font-semibold text-foreground/90 shadow-xs native-press"
                        >
                            <Icon className="w-4 h-4 text-primary" />
                            <span>{label}</span>
                        </Link>
                    ))}
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); window.dispatchEvent(new CustomEvent('hasana:toggle-search', { detail: { open: true } })); }}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-card border border-border hover:border-gold/50 px-3.5 py-2 text-xs font-semibold text-foreground/90 shadow-xs native-press"
                    >
                        <Search className="w-4 h-4 text-primary" />
                        <span>অনুসন্ধান</span>
                    </button>
                </div>
            </section>

            {/* ───── Search (opens from header / shortcut) ───── */}
            {isSearchOpen && (
                <section className="mx-auto max-w-5xl px-4 mt-5">
                    {/* Not overflow-hidden: the suggestion list drops below the card */}
                    <div
                        id="home-search-form"
                        className="rounded-3xl bg-hero text-primary-foreground p-5 md:p-7 shadow-2xl border-2 border-gold/50 relative scroll-mt-28 animate-in fade-in slide-in-from-top-3"
                    >
                        <div className="absolute inset-0 rounded-3xl pattern opacity-30 pointer-events-none" />
                        <div className="relative">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <h2 className="font-bold text-lg md:text-xl text-white flex items-center gap-2">
                                        <Search className="w-5 h-5 text-gold" />
                                        <span>কোনো বিষয়ে জানতে চান?</span>
                                    </h2>
                                    <p className="text-xs md:text-sm opacity-90 mt-1 text-emerald-100">
                                        প্রশ্ন লিখুন — কুরআন, হাদিস ও দোয়া থেকে খুঁজে দেখানো হবে
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseSearch}
                                    className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-emerald-100 hover:text-white transition native-press shrink-0 border border-white/10"
                                    title="সার্চ বন্ধ করুন"
                                    aria-label="সার্চ বন্ধ করুন"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <SmartSearchInput
                                className="mt-4"
                                inputId="home-search-input"
                                value={homeQuery}
                                onChange={setHomeQuery}
                                onSearch={(q) => {
                                    hapticImpact();
                                    navigate(`/explore?q=${encodeURIComponent(q)}`);
                                }}
                                buttonClassName="gold-gradient-btn"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ───── App update & location banners ───── */}
            {((isNative() && appUpdateInfo?.hasUpdate) || showLocationBanner) && (
                <section className="mx-auto max-w-5xl px-4 mt-5 space-y-3">
                    {isNative() && appUpdateInfo && appUpdateInfo.hasUpdate && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 border border-gold/50 shadow-xl flex items-center justify-between gap-3 text-white animate-fade-scale">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-gold" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gold">নতুন সংস্করণ এসেছে (v{appUpdateInfo.latestVersion})</p>
                                    <p className="text-[11px] text-emerald-100/90 line-clamp-2">
                                        {appUpdateInfo.message || 'নতুন ফিচার ও পারফরম্যান্স উন্নয়নের জন্য এখনই আপডেট করুন।'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <a
                                    href={appUpdateInfo.storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => hapticImpact()}
                                    className="gold-gradient-btn px-3.5 py-2 rounded-full text-xs font-bold native-press"
                                >
                                    আপডেট
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setAppUpdateInfo(null)}
                                    className="p-1.5 text-white/60 hover:text-white"
                                    title="বাতিল করুন"
                                    aria-label="বাতিল করুন"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {showLocationBanner && (
                        <div className="p-3.5 rounded-2xl bg-card border border-gold/35 shadow-md flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Navigation className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-foreground">সঠিক নামাজের সময় পেতে অবস্থান দিন</p>
                                    <p className="text-[11px] text-muted-foreground">বর্তমানে {locationData?.city || 'ঢাকা'}-র সময় দেখানো হচ্ছে</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleDetectLocation(true)}
                                    disabled={locationLoading}
                                    className="gold-gradient-btn px-3.5 py-2 rounded-full text-xs font-bold native-press inline-flex items-center gap-1.5"
                                >
                                    {locationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
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
                                    aria-label="পরে করবো"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ───── Today's Amal ───── */}
            {amalTotal > 0 && (
                <section className="mx-auto max-w-5xl px-4 mt-7">
                    <div className="rounded-3xl bg-card border border-gold/30 p-4 md:p-6 shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    আজকের আমল
                                </span>
                                <h2 className="mt-2 text-base md:text-lg font-bold text-foreground">
                                    {dailyContent.occasion?.title || new Date().toLocaleDateString('bn-BD', { weekday: 'long' })}
                                </h2>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full tabular-nums">
                                {toBnDigits(amalDoneCount)}/{toBnDigits(amalTotal)}
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-gold to-primary transition-all duration-500"
                                style={{ width: `${Math.round((amalDoneCount / amalTotal) * 100)}%` }}
                            />
                        </div>

                        {dailyContent.occasion?.others?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {dailyContent.occasion.others.map((title) => (
                                    <span key={title} className="text-[11px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                                        {title}
                                    </span>
                                ))}
                            </div>
                        )}

                        <ul className="mt-3 space-y-0.5">
                            {dailyContent.amal.map((item, index) => {
                                const done = amalDone.includes(index);
                                return (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() => toggleAmal(index)}
                                            className="w-full flex items-start gap-2.5 text-left rounded-xl px-2 py-2 hover:bg-muted/60 transition native-press"
                                        >
                                            {done
                                                ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                                : <Circle className="w-5 h-5 text-muted-foreground/50 shrink-0" />}
                                            <span className={`text-sm leading-relaxed ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                {item}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>
            )}

            {/* ───── Ayah & Hadith of the day ───── */}
            <section className="mx-auto max-w-5xl px-4 mt-7 grid md:grid-cols-2 gap-4 md:gap-6">
                {/* Ayah */}
                <article className="rounded-3xl bg-card border border-gold/30 shadow-md relative overflow-hidden flex flex-col">
                    <div className="h-1 bg-gradient-to-r from-gold via-primary to-gold" />
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold uppercase tracking-wider bg-gold/15 border border-gold/30 px-3 py-1 rounded-full">
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
                                    title={dailyAyahNotifActive ? 'প্রতিদিনের আয়াত নোটিফিকেশন সচল আছে' : 'প্রতিদিনের আয়াত নোটিফিকেশন চালু করুন'}
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

                        <p className="font-quran text-2xl md:text-[1.75rem] text-primary mt-5 leading-[2.1] text-center" dir="rtl">
                            {activeVerse.text_ar}
                        </p>
                        <p className="mt-3 text-[15px] md:text-base text-foreground font-medium leading-relaxed text-center">
                            "{activeVerse.text_bn}"
                        </p>
                        <p className="text-xs text-gold font-bold mt-3 text-center">— {activeVerse.reference}</p>

                        <div className="mt-auto pt-5 flex justify-center">
                            <Link
                                to={activeVerse.deep_link || '/quran'}
                                onClick={() => hapticImpact()}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full gold-gradient-btn text-xs font-bold native-press"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>সম্পূর্ণ সূরা পড়ুন</span>
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Hadith */}
                <article className="rounded-3xl bg-card border border-gold/30 shadow-md relative overflow-hidden flex flex-col">
                    <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold uppercase tracking-wider bg-gold/15 border border-gold/30 px-3 py-1 rounded-full">
                                <ScrollText className="w-3.5 h-3.5" />
                                আজকের হাদিস
                            </span>
                            <button
                                type="button"
                                onClick={handleShareHadith}
                                className="w-8 h-8 rounded-full bg-muted text-foreground/80 hover:bg-muted-foreground/20 flex items-center justify-center transition native-press"
                                title="হাদিসটি শেয়ার করুন"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                        {todayHadith.text_ar && (
                            <p className="font-arabic text-2xl md:text-3xl text-gold font-bold mt-5 leading-loose text-center" dir="rtl">
                                {todayHadith.text_ar}
                            </p>
                        )}
                        <p className={`text-[15px] md:text-base text-foreground font-medium leading-relaxed text-center ${todayHadith.text_ar ? 'mt-3' : 'mt-5'}`}>
                            "{todayHadith.text_bn}"
                        </p>
                        <p className="text-xs text-gold font-bold mt-3 text-center">
                            — {todayHadith.narrator ? `${todayHadith.narrator}, ` : ''}{todayHadith.reference}
                        </p>

                        <div className="mt-auto pt-5 flex justify-center">
                            <Link
                                to="/hadith"
                                onClick={() => hapticImpact()}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full gold-gradient-btn text-xs font-bold native-press"
                            >
                                <ScrollText className="w-3.5 h-3.5" />
                                <span>হাদিস সম্ভার পড়ুন</span>
                            </Link>
                        </div>
                    </div>
                </article>
            </section>

            {/* ───── Explore more ───── */}
            <section className="mx-auto max-w-5xl px-4 mt-7 mb-4 md:mb-10">
                <Link
                    to="/explore"
                    onClick={() => hapticImpact()}
                    className="rounded-3xl bg-gradient-to-r from-[#0a4232] to-[#062b20] border border-gold/35 p-4 md:p-6 flex items-center justify-between gap-3 text-primary-foreground shadow-md native-press group"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                            <Compass className="w-5 h-5 text-gold" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm md:text-base font-bold text-white">বিষয়ভিত্তিক অনুসন্ধান</p>
                            <p className="text-[11px] md:text-xs text-emerald-100/80 truncate">ধৈর্য, রিজিক, দুশ্চিন্তা — যেকোনো বিষয়ে কুরআন, হাদিস ও দোয়া খুঁজুন</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gold shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
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
