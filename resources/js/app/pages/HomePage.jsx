import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, 
    ScrollText, 
    Heart, 
    MapPin, 
    Clock, 
    Bookmark, 
    Share2, 
    Moon, 
    ChevronRight, 
    Calendar,
    Bell,
    BellRing,
    Sparkles,
    Loader2,
    Navigation,
    Compass,
    X
} from 'lucide-react';
import { DuaHandsIcon, KaabaIcon } from '../components/IslamicIcons';
import { Layout } from '../components/Layout';
import { hapticImpact, nativeShare } from '../native';
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
    calculateSolarPrayerTimes 
} from '../services/locationService';

const quickAccess = [
    { to: '/quran', title: 'আল-কুরআন', desc: 'পবিত্র কুরআন শরীফ পড়ুন', icon: BookOpen },
    { to: '/hadith', title: 'হাদিস শরীফ', desc: 'নির্বাচিত হাদিস পড়ুন', icon: ScrollText },
    { to: '/duas', title: 'দোয়া সমূহ', desc: 'দৈনন্দিন প্রয়োজনীয় দোয়া', icon: DuaHandsIcon },
    { to: '/umrah-guide', title: 'উমরা গাইড', desc: 'উমরার পূর্ণাঙ্গ নিয়মাবলী', icon: KaabaIcon },
];

const features = [
    { title: 'নামাজের সময়সূচী', desc: 'প্রতিদিন সঠিক সময়ে নামাজের সময়', icon: Clock },
    { title: 'বুকমার্ক সংরক্ষণ', desc: 'পছন্দের আয়াত ও দোয়া বুকমার্ক করুন', icon: Bookmark },
    { title: 'আয়াত ও দোয়া শেয়ার', desc: 'সহজেই শেয়ার করুন বন্ধুমহলে', icon: Share2 },
    { title: 'ডার্ক মোড সমর্থন', desc: 'চোখের আরামের জন্য আধুনিক ডার্ক মোড', icon: Moon },
];

export function HomePage() {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [notifActive, setNotifActive] = useState(false);
    const [dailyAyah, setDailyAyah] = useState(null);
    const [dailyAyahNotifActive, setDailyAyahNotifActive] = useState(false);

    // Dynamic Location & Prayer Times State
    const [locationData, setLocationData] = useState(() => getStoredLocation());
    const [prayerTimes, setPrayerTimes] = useState(() => {
        const loc = getStoredLocation();
        return calculateSolarPrayerTimes(loc.latitude, loc.longitude);
    });
    const [locationLoading, setLocationLoading] = useState(false);
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

    const handleShareVerse = async () => {
        hapticImpact();
        await nativeShare({
            title: activeVerse.title,
            text: `${activeVerse.text_ar}\n\n${activeVerse.text_bn}\n\n— ${activeVerse.reference}`,
            url: window.location.origin + (activeVerse.deep_link || '/'),
        });
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-hero text-primary-foreground relative overflow-hidden pt-10 pb-16 md:py-20">
                <div className="absolute inset-0 pattern opacity-35 pointer-events-none" />
                <div className="relative mx-auto max-w-6xl px-4 text-center">
                    <p className="font-arabic text-3xl md:text-5xl text-gold font-bold drop-shadow-sm">
                        السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ
                    </p>
                    <h1 className="text-2xl md:text-4xl font-bold mt-3">আসসালামু আলাইকুম</h1>
                    <p className="mt-2 text-sm md:text-base opacity-85 max-w-md mx-auto">
                        কুরআন, হাদিস, দোয়া ও নামাজের সময়সূচী — সবকিছু এক অ্যাপে
                    </p>
                    
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-gold/40 px-4 py-1.5 text-xs md:text-sm text-gold font-medium backdrop-blur-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{currentDate || 'আজকের দিন'}</span>
                    </div>
                </div>
            </section>

            {/* Prayer Times Floating Card */}
            <section className="mx-auto max-w-5xl px-4 -mt-10 relative z-20">
                {/* Location Detection Banner for First Open / Install */}
                {showLocationBanner && (
                    <div className="mb-3 p-3.5 rounded-2xl bg-card border-2 border-primary/30 shadow-lg backdrop-blur-md flex items-center justify-between gap-3 animate-fade-scale">
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

                <div className="rounded-3xl bg-card border-2 border-gold/40 p-4 sm:p-5 md:p-7 shadow-xl backdrop-blur-md">
                    <div className="mb-4 space-y-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <h2 className="font-bold text-base md:text-lg whitespace-nowrap truncate">আজকের নামাজের সময়</h2>
                            </div>
                            <span className="shrink-0 whitespace-nowrap text-sm md:text-base font-bold text-primary tabular-nums">
                                {currentTime}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => handleDetectLocation(true)}
                                disabled={locationLoading}
                                title="বর্তমান জিপিএস লোকেশন আপডেট করতে ক্লিক করুন"
                                className="min-w-0 text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition native-press group"
                            >
                                {locationLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-primary" />
                                ) : (
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                                )}
                                <span className="font-semibold text-foreground/90 group-hover:underline truncate">
                                    {locationData.cityName}
                                </span>
                                {/* Only shown while the default city is used, as a hint to detect the real location */}
                                {locationData.isDefault && (
                                    <span className="shrink-0 whitespace-nowrap text-[10px] px-2 py-0.5 rounded-full font-medium text-amber-600 bg-amber-500/10 border border-amber-500/20">
                                        অটো-ডিটেক্ট করুন
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleNotification}
                                title={notifActive ? "নামাজের নোটিফিকেশন সক্রিয় আছে (ক্লিক করে বন্ধ করুন)" : "নামাজের নোটিফিকেশন চালু করুন"}
                                aria-label={notifActive ? 'নোটিফিকেশন বন্ধ করুন' : 'নোটিফিকেশন চালু করুন'}
                                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition border ${
                                    notifActive 
                                        ? 'bg-primary/10 text-primary border-primary/30 shadow-xs' 
                                        : 'bg-muted text-muted-foreground border-border hover:bg-muted-foreground/15'
                                }`}
                            >
                                {notifActive ? (
                                    <BellRing className="w-3.5 h-3.5 text-gold animate-pulse" />
                                ) : (
                                    <Bell className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline whitespace-nowrap">
                                    {notifActive ? 'নোটিফিকেশন চালু' : 'নোটিফিকেশন পান'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 md:gap-3 text-center">
                        {prayerTimes.map((prayer) => (
                            <div 
                                key={prayer.name} 
                                className="min-w-0 rounded-2xl bg-muted/70 hover:bg-muted px-1 py-2.5 md:py-4 md:px-2 border border-border/50 transition-colors"
                            >
                                <p className="text-xs md:text-sm font-semibold text-muted-foreground whitespace-nowrap">{prayer.name}</p>
                                <p className="mt-1 font-bold text-primary tabular-nums whitespace-nowrap text-[13px] sm:text-sm md:text-lg">{prayer.start}</p>
                                <p className="mt-1 text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/75 leading-tight">শেষ<span className="block tabular-nums whitespace-nowrap">{prayer.end}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Verse of the Day Card */}
            <section className="mx-auto max-w-3xl px-4 mt-8">
                <div className="rounded-3xl bg-card border border-border p-6 md:p-8 text-center shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider bg-primary/10 px-3.5 py-1.5 rounded-full">
                            <Sparkles className="w-3.5 h-3.5" />
                            {activeVerse.title}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleToggleDailyAyahNotif}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
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
                                className="w-8 h-8 rounded-full bg-muted text-foreground/80 hover:bg-muted-foreground/20 flex items-center justify-center transition"
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-gold hover:bg-primary-dark font-bold text-xs transition shadow-sm"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>কুরআনে সম্পূর্ণ সূরা পড়ুন</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Access Grid */}
            <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl md:text-2xl font-bold">দ্রুত অ্যাক্সেস</h2>
                    <span className="text-xs text-muted-foreground">মূল ইসলামিক বিভাগসমূহ</span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                    {quickAccess.map(({ to, title, desc, icon: Icon }) => (
                        <Link 
                            key={to} 
                            to={to} 
                            onClick={() => hapticImpact()}
                            className="rounded-2xl bg-card border border-border p-4 md:p-6 shadow-sm card-hover flex flex-col justify-between group native-press select-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="mt-4">
                                <h3 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors">{title}</h3>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Features Section */}
                <h2 className="text-xl md:text-2xl font-bold mt-12 mb-5">অ্যাপ্লিকেশন বৈশিষ্ট্য</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
                    {features.map(({ title, desc, icon: Icon }) => (
                        <div key={title} className="rounded-2xl bg-muted/60 border border-border/60 p-4 md:p-6">
                            <div className="w-10 h-10 rounded-xl bg-card text-primary flex items-center justify-center shadow-sm mb-3">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-sm md:text-base">{title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
