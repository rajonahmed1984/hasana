import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Clock, 
    MapPin, 
    Bell, 
    BellRing, 
    Sparkles, 
    Loader2, 
    Sunrise, 
    Sunset, 
    Sun, 
    Moon, 
    CloudSun, 
    ShieldAlert, 
    ArrowLeft, 
    Share2, 
    CheckCircle2, 
    ChevronRight, 
    Info, 
    AlertTriangle, 
    Calendar, 
    RefreshCw,
    Compass,
    BookOpen
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { hapticImpact, isNative } from '../native';
import { 
    getStoredLocation, 
    requestUserLocation, 
    getAccuratePrayerTimes,
    calculateSolarPrayerTimes,
    calculatePrayerCountdown,
    toBengaliDigits,
    formatBengaliTime
} from '../services/locationService';
import { 
    isPrayerNotificationEnabled, 
    enablePrayerNotifications, 
    disablePrayerNotifications,
    requestNotifPermission
} from '../services/prayerNotifications';

// Format Hijri Date in Bengali (Islamic Umalqura calendar)
const getBengaliHijriDate = (date = new Date()) => {
    try {
        const options = {
            calendar: 'islamic-umalqura',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            numberingSystem: 'beng',
        };
        const formatted = new Intl.DateTimeFormat('bn-BD-u-nu-beng', options).format(date);
        return formatted.replace(/যুগ/g, 'হিজরি');
    } catch {
        return '';
    }
};

// Format Gregorian Date in Bengali
const getBengaliGregorianDate = (date = new Date()) => {
    try {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            numberingSystem: 'beng',
        };
        return new Intl.DateTimeFormat('bn-BD-u-nu-beng', options).format(date);
    } catch {
        return date.toLocaleDateString('bn-BD');
    }
};

export function PrayerTimesPage() {
    const navigate = useNavigate();
    const [nowTime, setNowTime] = useState(() => new Date());
    const [locationData, setLocationData] = useState(() => getStoredLocation());
    const [prayerTimes, setPrayerTimes] = useState(() => {
        const loc = getStoredLocation();
        return calculateSolarPrayerTimes(loc.latitude, loc.longitude);
    });
    const [locationLoading, setLocationLoading] = useState(false);
    const [notifActive, setNotifActive] = useState(() => isPrayerNotificationEnabled());
    const [copiedShare, setCopiedShare] = useState(false);

    // Live clock ticking every second
    useEffect(() => {
        const timer = setInterval(() => {
            setNowTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Current formatted time (Bengali digits)
    const currentTimeFormatted = useMemo(() => {
        const hours = nowTime.getHours();
        const minutes = nowTime.getMinutes();
        const seconds = nowTime.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 === 0 ? 12 : hours % 12;
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return `${toBengaliDigits(`${pad(h12)}:${pad(minutes)}:${pad(seconds)}`)} ${ampm}`;
    }, [nowTime]);

    // Live countdown to next prayer / end of current waqt
    const countdownData = useMemo(() => {
        return calculatePrayerCountdown(prayerTimes, nowTime);
    }, [prayerTimes, nowTime]);

    // Active prayer index (-1 if between sunrise and Dhuhr)
    const activePrayerIndex = useMemo(() => {
        const nowMin = nowTime.getHours() * 60 + nowTime.getMinutes();
        const starts = prayerTimes.map((p) => p.startHour * 60 + p.startMin);
        const last = prayerTimes.length - 1;
        if (nowMin >= starts[last] || nowMin < starts[0]) return last; // Isha runs until Fajr
        for (let i = 0; i < last; i++) {
            const p = prayerTimes[i];
            const end = p.endHour != null ? p.endHour * 60 + p.endMin : starts[i + 1];
            if (nowMin >= starts[i] && nowMin < end) return i;
        }
        return -1;
    }, [prayerTimes, nowTime]);

    // Refresh prayer schedule on mount from online/offline cache
    useEffect(() => {
        const loc = getStoredLocation();
        getAccuratePrayerTimes(loc.latitude, loc.longitude).then((schedule) => {
            if (schedule && schedule.length === 5) {
                setPrayerTimes(schedule);
            }
        });
    }, []);

    // Handle GPS auto-detect location
    const handleDetectLocation = async () => {
        hapticImpact();
        setLocationLoading(true);
        try {
            const res = await requestUserLocation();
            if (res.success && res.location) {
                setLocationData(res.location);
                if (res.schedule) {
                    setPrayerTimes(res.schedule);
                }
            } else if (res.error) {
                alert(res.error);
            }
        } catch (err) {
            console.error('[PrayerTimesPage] Location error:', err);
        } finally {
            setLocationLoading(false);
        }
    };

    // Toggle Prayer Azan / Notification
    const handleToggleNotification = async () => {
        hapticImpact();
        if (notifActive) {
            disablePrayerNotifications();
            setNotifActive(false);
        } else {
            const granted = await requestNotifPermission();
            if (granted) {
                enablePrayerNotifications();
                setNotifActive(true);
            } else {
                alert('নামাজের ওয়াক্তের নোটিফিকেশন পেতে অনুগ্রহ করে নোটিফিকেশন পারমিশন দিন।');
            }
        }
    };

    // Share prayer schedule
    const handleShareSchedule = async () => {
        hapticImpact();
        const text = `🕌 আজকের নামাজের সময়সূচী (${locationData.cityName})\n` +
            `তারিখ: ${getBengaliGregorianDate(nowTime)} (${getBengaliHijriDate(nowTime)})\n\n` +
            `• ফজর: ${prayerTimes[0]?.start} (শেষ: ${prayerTimes[0]?.end})\n` +
            `• যোহর: ${prayerTimes[1]?.start} (শেষ: ${prayerTimes[1]?.end})\n` +
            `• আসর: ${prayerTimes[2]?.start} (শেষ: ${prayerTimes[2]?.end})\n` +
            `• মাগরিব: ${prayerTimes[3]?.start} (শেষ: ${prayerTimes[3]?.end})\n` +
            `• ইশা: ${prayerTimes[4]?.start} (শেষ: ${prayerTimes[4]?.end})\n\n` +
            `হাসানা (Hasana) অ্যাপ থেকে সংগৃহীত। https://hasanaa.com`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'আজকের নামাজের সময়সূচী — হাসানা',
                    text,
                    url: 'https://hasanaa.com/prayer-times',
                });
                return;
            } catch {
                // fall through to clipboard
            }
        }

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2500);
        }
    };

    // Calculation for Nafal & forbidden prayer times
    const sunriseTime = prayerTimes[0]?.end || '০৬:০৩';
    const sunsetTime = prayerTimes[3]?.start || '০৫:২২';
    const dhuhrTime = prayerTimes[1]?.start || '১১:৪২';
    const fajrTime = prayerTimes[0]?.start || '০৪:৪৬';

    // Detailed metadata for the 5 primary prayers
    const prayerDetails = [
        {
            id: 'fajr',
            index: 0,
            name: 'ফজর',
            arabicName: 'صَلَاةُ الفَجْر',
            nameEn: 'Fajr',
            icon: Sunrise,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-500/10 border-amber-500/25',
            start: prayerTimes[0]?.start || '--:--',
            end: prayerTimes[0]?.end || '--:--',
            desc: 'সুবহে সাদিক থেকে সূর্যোদয়ের পূর্ব পর্যন্ত ফজরের ওয়াক্ত থাকে। আস-সালাতু খাইরুম মিনান নাওম।',
            rakats: '২ রাকাত সুন্নত + ২ রাকাত ফরজ',
        },
        {
            id: 'dhuhr',
            index: 1,
            name: 'যোহর',
            arabicName: 'صَلَاةُ الظُّهْر',
            nameEn: 'Dhuhr',
            icon: Sun,
            iconColor: 'text-amber-400',
            iconBg: 'bg-amber-400/10 border-amber-400/25',
            start: prayerTimes[1]?.start || '--:--',
            end: prayerTimes[1]?.end || '--:--',
            desc: 'দ্বিপ্রহরে সূর্য পশ্চিমাকাশে ঢলে পড়ার পর থেকে আসরের ওয়াক্তের পূর্ব পর্যন্ত সময় থাকে।',
            rakats: '৪ রাকাত সুন্নত + ৪ রাকাত ফরজ + ২ রাকাত সুন্নত + ২ রাকাত নফল',
        },
        {
            id: 'asr',
            index: 2,
            name: 'আসর',
            arabicName: 'صَلَاةُ العَصْر',
            nameEn: 'Asr',
            icon: CloudSun,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-500/10 border-emerald-500/25',
            start: prayerTimes[2]?.start || '--:--',
            end: prayerTimes[2]?.end || '--:--',
            desc: 'আসরের সালাত অত্যন্ত ফজিলতপূর্ণ (সালাতুল উসতা)। সূর্যাস্তের পূর্ব পর্যন্ত সময় থাকে।',
            rakats: '৪ রাকাত সুন্নতে গায়রে মুয়াক্কাদা + ৪ রাকাত ফরজ',
        },
        {
            id: 'maghrib',
            index: 3,
            name: 'মাগরিব',
            arabicName: 'صَلَاةُ المَغْرِب',
            nameEn: 'Maghrib',
            icon: Sunset,
            iconColor: 'text-orange-500',
            iconBg: 'bg-orange-500/10 border-orange-500/25',
            start: prayerTimes[3]?.start || '--:--',
            end: prayerTimes[3]?.end || '--:--',
            desc: 'সূর্যাস্তের পরপরই মাগরিবের ওয়াক্ত শুরু হয়। বিলম্ব না করে অবিলম্বে নামাজ আদায় করা মুস্তাহাব।',
            rakats: '৩ রাকাত ফরজ + ২ রাকাত সুন্নত + ২ রাকাত নফল (আওয়াবীন)',
        },
        {
            id: 'isha',
            index: 4,
            name: 'ইশা',
            arabicName: 'صَلَاةُ العِشَاء',
            nameEn: 'Isha',
            icon: Moon,
            iconColor: 'text-indigo-400',
            iconBg: 'bg-indigo-400/10 border-indigo-400/25',
            start: prayerTimes[4]?.start || '--:--',
            end: prayerTimes[0]?.start || '--:--',
            desc: 'পশ্চিমাকাশের লালিমা দূর হওয়ার পর থেকে ফজরের আগ পর্যন্ত ইশার ওয়াক্ত থাকে। রাতের প্রথমাংশে পড়া উত্তম।',
            rakats: '৪ রাকাত সুন্নত + ৪ রাকাত ফরজ + ২ রাকাত সুন্নত + ২ রাকাত নফল + ৩ রাকাত বিতর',
        },
    ];

    // Nafal and auxiliary times
    const nafalTimes = [
        {
            title: 'তাহাজ্জুদ সালাত',
            arabic: 'صَلَاةُ التَّهَجُّد',
            timing: 'রাত ০১:৩০ হতে ফজরের পূর্ব পর্যন্ত',
            desc: 'রাতের শেষ তৃতীয়াংশ আল্লাহর নৈকট্য লাভের সর্বোত্তম সময়। নফল সালাতের মধ্যে এটি শ্রেষ্ঠ।',
            badge: 'শ্রেষ্ঠ নফল সালাত',
        },
        {
            title: 'ইশরাক সালাত',
            arabic: 'صَلَاةُ الإِشْرَاق',
            timing: `সূর্যোদয়ের ১৫ মিনিট পর হতে (আনুমানিক ${sunriseTime} এর পর)`,
            desc: 'সূর্য উদিত হওয়ার পর ২ বা ৪ রাকাত নামাজ। এতে একটি পূর্ণাঙ্গ হজ ও উমরার সওয়াব রয়েছে।',
            badge: 'হজ ও উমরার সওয়াব',
        },
        {
            title: 'চাশত / সালাতুত দুহা',
            arabic: 'صَلَاةُ الضُّحَى',
            timing: `সকাল ০৯:৩০ হতে যোহরের ২০ মিনিট পূর্ব পর্যন্ত`,
            desc: 'শরীরের প্রতিটি জোড়ার পক্ষ থেকে সাদাকা হিসেবে ২, ৪ বা ৮ রাকাত নফল সালাত।',
            badge: 'অঙ্গ-প্রত্যঙ্গের সাদাকা',
        },
        {
            title: 'আওয়াবীন সালাত',
            arabic: 'صَلَاةُ الأَوَّابِين',
            timing: `মাগরিবের পর হতে ইশার পূর্ব পর্যন্ত`,
            desc: 'মাগরিবের ফরজ ও সুন্নতের পর ৬ রাকাত নফল নামাজ। আল্লাহ অভিমুখীদের বিশেষ নামাজ।',
            badge: 'মাগরিব পরবর্তী আমল',
        },
        {
            title: 'সাহরি শেষ ও ইফতার',
            arabic: 'السَّحُورُ وَالإِفْطَار',
            timing: `সাহরি শেষ: ${fajrTime} • ইফতার: ${sunsetTime}`,
            desc: 'আজকের ফরজ বা নফল রোজার সাহরি ও সূর্যাস্তের সাথে সাথে ইফতারের সঠিক সময়।',
            badge: 'রোজা ও সিয়াম',
        },
    ];

    // Forbidden prayer times
    const forbiddenTimes = [
        {
            title: '১. সূর্যোদয়ের সময়',
            time: `সূর্য উদিত হওয়ার সময় (${sunriseTime} হতে পরবর্তী ১৫ মিনিট)`,
            desc: 'সূর্য ওঠা শুরু হওয়া থেকে তা পুরোপুরি ওপরে ওঠার পূর্ব পর্যন্ত যেকোনো সালাত আদায় করা কঠোরভাবে নিষিদ্ধ।',
        },
        {
            title: '২. ঠিক দ্বিপ্রহরের সময় (নিস্ফুন নাহার)',
            time: `ঠিক দুপুর বেলা (${dhuhrTime} এর ঠিক পূর্ববর্তী ১০-১২ মিনিট)`,
            desc: 'সূর্য ঠিক মাথার উপর থাকাকালে পশ্চিমাকাশে হেলে পড়ার আগ পর্যন্ত নামাজ আদায় করা মাকরূহে তাহরীমী।',
        },
        {
            title: '৩. সূর্যাস্তের সময়',
            time: `সূর্য হলুদ বর্ণ ধারণ থেকে সূর্যাস্ত (${sunsetTime} এর পূর্ববর্তী ১৫ মিনিট)`,
            desc: 'সূর্য ডোবার পূর্ব মুহূর্তে নামাজ পড়া নিষেধ (তবে সেদিনের আসর না পড়ে থাকলে দ্রুত তা পড়ে নিতে হবে)।',
        },
    ];

    return (
        <Layout>
            {/* Top Bar with Back Button */}
            <div className="bg-[#06241a] border-b border-gold/20 py-3 px-4">
                <div className="mx-auto max-w-3xl flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            hapticImpact();
                            navigate(-1);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-100 hover:text-gold transition native-press"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>ফিরে যান</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleShareSchedule}
                            title="সময়সূচী শেয়ার বা কপি করুন"
                            className="p-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/30 text-gold text-xs font-semibold flex items-center gap-1.5 transition native-press"
                        >
                            {copiedShare ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[11px] text-emerald-300">কপি হয়েছে</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" />
                                    <span className="text-[11px] hidden sm:inline">শেয়ার</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Page Header Hero */}
            <section className="bg-hero text-primary-foreground relative overflow-hidden py-8 md:py-12 border-b border-gold/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gold/15 blur-3xl pointer-events-none rounded-full" />
                <div className="absolute inset-0 pattern opacity-30 pointer-events-none" />

                <div className="relative mx-auto max-w-3xl px-4 text-center">
                    <p className="font-arabic text-3xl md:text-4xl text-gold font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                        مَوَاقِيتُ الصَّلَاة
                    </p>
                    <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        নামাজের সময়সূচী
                    </h1>
                    <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/85 max-w-md mx-auto">
                        সঠিক সময়ে ৫ ওয়াক্ত সালাত, নফল নামাজ ও নিষিদ্ধ সময়ের সম্পূর্ণ তালিকা
                    </p>

                    {/* Location & Real-time Info Pill */}
                    <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-black/35 backdrop-blur-md border border-gold/30 rounded-2xl px-3.5 py-2 text-xs">
                        {/* Location with GPS detect */}
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={locationLoading}
                            title="জিপিএস লোকেশন রিফ্রেশ করতে ক্লিক করুন"
                            className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-gold transition native-press"
                        >
                            {locationLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                            ) : (
                                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                            )}
                            <span className="font-semibold text-white">{locationData.cityName}</span>
                            <RefreshCw className={`w-3 h-3 text-gold/80 hover:rotate-180 transition-transform ${locationLoading ? 'animate-spin' : ''}`} />
                        </button>

                        <span className="text-gold/50">•</span>

                        {/* Live Digital Clock */}
                        <div className="inline-flex items-center gap-1.5 text-gold font-bold tabular-nums">
                            <Clock className="w-3.5 h-3.5 text-gold animate-pulse" />
                            <span>{currentTimeFormatted}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8 space-y-6">

                {/* Date & Notification Control Card */}
                <div className="rounded-2xl bg-card border border-gold/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span className="font-medium text-foreground">{getBengaliGregorianDate(nowTime)}</span>
                        </div>
                        {getBengaliHijriDate(nowTime) && (
                            <p className="text-xs text-gold font-bold">
                                🌙 {getBengaliHijriDate(nowTime)}
                            </p>
                        )}
                    </div>

                    {/* Azan Notification Toggle */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={handleToggleNotification}
                            title={notifActive ? 'নামাজের নোটিফিকেশন বন্ধ করুন' : 'নামাজের নোটিফিকেশন চালু করুন'}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs native-press border ${
                                notifActive
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                                    : 'bg-muted text-muted-foreground border-border hover:bg-muted-foreground/10'
                            }`}
                        >
                            {notifActive ? (
                                <>
                                    <BellRing className="w-4 h-4 text-gold animate-pulse" />
                                    <span>নামাজের নোটিফিকেশন চালু আছে</span>
                                </>
                            ) : (
                                <>
                                    <Bell className="w-4 h-4 text-muted-foreground" />
                                    <span>নোটিফিকেশন সক্রিয় করুন</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Active Waqt Countdown Card */}
                <div className="rounded-3xl bg-gradient-to-br from-[#0c3f2d] via-[#072c1f] to-[#041a12] text-white p-5 sm:p-6 shadow-xl border-2 border-gold/50 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
                    
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/45 text-gold text-xs font-bold uppercase tracking-wider shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                        <span>{`বর্তমান ওয়াক্ত: ${countdownData.currentPrayerName}`}</span>
                    </span>

                    <div className="mt-3">
                        <div className="text-4xl sm:text-5xl font-black text-gold tracking-tight tabular-nums drop-shadow-[0_2px_12px_rgba(212,175,55,0.5)]">
                            {countdownData.formattedCountdown}
                        </div>
                        <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/90 font-medium flex items-center justify-center gap-2 flex-wrap">
                            <span className="text-gold/90 font-bold">{countdownData.label}</span>
                            <span>•</span>
                            <span>পরবর্তী ওয়াক্ত: {countdownData.nextPrayerName} ({countdownData.nextPrayerTime})</span>
                        </p>
                    </div>
                </div>

                {/* Primary 5 Waqt Prayer Times List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gold" />
                            <span>৫ ওয়াক্ত নামাজের সময়সূচী</span>
                        </h2>
                        <span className="text-xs text-muted-foreground font-medium">আজকের দিন</span>
                    </div>

                    {/* Vertical List of Prayers */}
                    <div className="space-y-2.5">
                        {prayerDetails.map((prayer) => {
                            const isActive = prayer.index === activePrayerIndex;
                            const IconComponent = prayer.icon;

                            return (
                                <div
                                    key={prayer.id}
                                    className={`rounded-2xl transition-all duration-300 p-4 sm:p-5 border shadow-sm ${
                                        isActive
                                            ? 'bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 text-white border-gold/60 shadow-lg shadow-emerald-950/40 ring-2 ring-gold/40'
                                            : 'bg-card text-card-foreground border-border/80 hover:border-gold/40'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Icon & Name */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                                                isActive 
                                                    ? 'bg-gold/25 border-gold/60 text-gold shadow-md' 
                                                    : `${prayer.iconBg} ${prayer.iconColor}`
                                            }`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={`font-bold text-base sm:text-lg leading-tight ${isActive ? 'text-white' : 'text-foreground'}`}>
                                                        {prayer.name}
                                                    </h3>
                                                    <span className={`font-arabic text-xs sm:text-sm font-semibold ${isActive ? 'text-gold' : 'text-muted-foreground/80'}`}>
                                                        {prayer.arabicName}
                                                    </span>
                                                    {isActive && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gold text-primary shadow-xs uppercase tracking-wider">
                                                            চলমান ওয়াক্ত
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-[11px] line-clamp-1 mt-0.5 ${isActive ? 'text-emerald-200/80' : 'text-muted-foreground'}`}>
                                                    {prayer.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Start & End Times */}
                                        <div className="text-right shrink-0">
                                            <div className={`text-lg sm:text-xl font-black tabular-nums ${
                                                isActive ? 'text-gold drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]' : 'text-primary'
                                            }`}>
                                                {prayer.start}
                                            </div>
                                            <div className={`text-[11px] font-semibold mt-0.5 ${
                                                isActive ? 'text-emerald-200/90' : 'text-muted-foreground'
                                            }`}>
                                                শেষ: <span className="tabular-nums font-bold">{prayer.end}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rakats Breakdown */}
                                    <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${
                                        isActive ? 'border-white/15 text-emerald-100/75' : 'border-border/60 text-muted-foreground'
                                    }`}>
                                        <span className="flex items-center gap-1 font-medium">
                                            <BookOpen className="w-3.5 h-3.5 text-gold shrink-0" />
                                            <span>রাকাত সংখ্যা: {prayer.rakats}</span>
                                        </span>
                                        <span className="font-semibold text-gold">
                                            {isActive ? '● ওয়াক্ত চলমান' : 'ওয়াক্ত'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Nafal & Auxiliary Timings List */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gold" />
                            <span>নফল ও বিশেষ নামাজের সময়</span>
                        </h2>
                        <span className="text-xs text-muted-foreground">বরকতময় আমল</span>
                    </div>

                    <div className="space-y-2.5">
                        {nafalTimes.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl bg-card border border-border/80 p-4 shadow-xs hover:border-gold/35 transition"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-sm sm:text-base text-foreground">
                                                {item.title}
                                            </h3>
                                            <span className="font-arabic text-xs text-gold font-semibold">
                                                {item.arabic}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-bold">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="inline-block text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl tabular-nums">
                                            {item.timing}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3 Forbidden Prayer Times Warning Card */}
                <div className="rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border-2 border-amber-500/35 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3 text-amber-700 dark:text-amber-400">
                        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <h2 className="font-bold text-base sm:text-lg">
                            নামাজের ৩টি নিষিদ্ধ সময় (মাকরূহে তাহরীমী)
                        </h2>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                        হাদিস শরীফ অনুযায়ী দিনে ৩টি নির্দিষ্ট সময়ে যেকোনো ধরণের ফরজ, ওয়াজিব, সুন্নত বা নফল নামাজ আদায় করা সম্পূর্ণ নিষিদ্ধ:
                    </p>

                    <div className="space-y-2.5">
                        {forbiddenTimes.map((f) => (
                            <div
                                key={f.title}
                                className="rounded-xl bg-card/90 border border-amber-500/25 p-3 sm:p-3.5 shadow-xs"
                            >
                                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                    <h3 className="font-bold text-xs sm:text-sm text-foreground">
                                        {f.title}
                                    </h3>
                                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                                        {f.time}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quran & Sunnah Guidance on Prayer Card */}
                <div className="rounded-3xl bg-card border border-gold/30 p-5 sm:p-6 shadow-sm text-center relative overflow-hidden">
                    <p className="font-arabic text-xl md:text-2xl text-gold font-bold mb-2">
                        إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
                    </p>
                    <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed max-w-lg mx-auto">
                        "নিশ্চয়ই নামাজ মুমিনদের ওপর নির্দিষ্ট সময়ে আদায় করা ফরজ করা হয়েছে।"
                    </p>
                    <p className="text-[11px] text-gold font-bold mt-1">
                        — সূরা আন-নিসা: ১০৩
                    </p>

                    <div className="my-4 border-t border-border/60" />

                    <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        রাসূলুল্লাহ (সা.) বলেছেন: <span className="text-foreground font-medium">"আল্লাহর নিকট সবচেয়ে প্রিয় আমল হলো ঠিক সময়ে নামাজ আদায় করা।"</span>
                    </p>
                    <p className="text-[11px] text-gold font-bold mt-1">
                        — সহীহ বুখারী: ৫২৭
                    </p>
                </div>
            </main>
        </Layout>
    );
}