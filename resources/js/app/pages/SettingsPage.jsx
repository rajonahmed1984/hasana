import React, { useState, useEffect } from 'react';
import { Moon, Sun, ShieldCheck, RefreshCw, Code2, ExternalLink, Bell, BellRing, BellOff, Check, Send, Sparkles, BookOpen, LogOut } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { hapticImpact } from '../native';
import { 
    isPrayerNotificationEnabled, 
    enablePrayerNotifications, 
    disablePrayerNotifications, 
    sendTestPrayerNotification, 
    getPrayerPreferences, 
    savePrayerPreference, 
    PRAYER_SCHEDULE,
    isDailyAyahNotificationEnabled,
    setDailyAyahNotificationEnabled,
    sendTestDailyAyahNotification
} from '../services/prayerNotifications';
import { useModal } from '../context/ModalContext';

export function SettingsPage() {
    const { confirm, alert: customAlert, confirmExit } = useModal();
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
            localStorage.getItem('hasana-theme') === 'dark';
    });

    const [notificationsActive, setNotificationsActive] = useState(false);
    const [dailyAyahActive, setDailyAyahActive] = useState(false);
    const [prayerPrefs, setPrayerPrefs] = useState(() => getPrayerPreferences());
    const [isTestingNotification, setIsTestingNotification] = useState(false);
    const [isTestingAyah, setIsTestingAyah] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState(null);

    useEffect(() => {
        setNotificationsActive(isPrayerNotificationEnabled());
        setDailyAyahActive(isDailyAyahNotificationEnabled());
    }, []);

    const toggleTheme = () => {
        hapticImpact();
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('hasana-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('hasana-theme', 'light');
        }
    };

    const handleToggleNotification = async () => {
        hapticImpact();
        setNotificationMsg(null);
        if (notificationsActive) {
            disablePrayerNotifications();
            setNotificationsActive(false);
            setNotificationMsg('নামাজের নোটিফিকেশন বন্ধ করা হয়েছে।');
        } else {
            const res = await enablePrayerNotifications();
            if (res.success) {
                setNotificationsActive(true);
                setNotificationMsg('আলহামদুলিল্লাহ! নামাজের নোটিফিকেশন সফলভাবে চালু হয়েছে।');
            } else {
                setNotificationMsg(res.error || 'নোটিফিকেশনের অনুমতি প্রদান করা সম্ভব হয়নি।');
            }
        }
    };

    const handleToggleDailyAyah = async () => {
        hapticImpact();
        setNotificationMsg(null);
        if (dailyAyahActive) {
            setDailyAyahNotificationEnabled(false);
            setDailyAyahActive(false);
            setNotificationMsg('প্রতিদিনের আয়াত নোটিফিকেশন বন্ধ করা হয়েছে।');
        } else {
            const res = await enablePrayerNotifications();
            if (res.success) {
                setDailyAyahNotificationEnabled(true);
                setDailyAyahActive(true);
                setNotificationMsg('আলহামদুলিল্লাহ! প্রতিদিনের আয়াত নোটিফিকেশন চালু হয়েছে।');
            } else {
                setNotificationMsg(res.error || 'নোটিফিকেশনের অনুমতি প্রদান করা সম্ভব হয়নি।');
            }
        }
    };

    const handleTestNotification = async () => {
        hapticImpact();
        setIsTestingNotification(true);
        setNotificationMsg(null);
        const res = await sendTestPrayerNotification();
        setIsTestingNotification(false);
        setNotificationMsg(res.message);
        if (res.success) {
            setNotificationsActive(true);
        }
    };

    const handleTestDailyAyah = async () => {
        hapticImpact();
        setIsTestingAyah(true);
        setNotificationMsg(null);
        const res = await sendTestDailyAyahNotification();
        setIsTestingAyah(false);
        setNotificationMsg(res.message);
        if (res.success) {
            setDailyAyahActive(true);
        }
    };

    const handlePrayerPrefChange = (prayerId) => {
        hapticImpact();
        const updated = !prayerPrefs[prayerId];
        const next = savePrayerPreference(prayerId, updated);
        setPrayerPrefs({ ...next });
    };

    const handleClearStorage = async () => {
        hapticImpact();
        const ok = await confirm({
            title: 'সংরক্ষিত ডাটা রিসেট',
            arabic: 'إِعَادَةُ ضَبْطِ الْبَيَانَاتِ',
            message: 'আপনি কি নিশ্চিত যে সকল সংরক্ষিত বুকমার্ক ও লোকাল ক্যাশ মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।',
            iconType: 'trash',
            confirmText: 'হ্যাঁ, ডাটা মুছুন',
            cancelText: 'বাতিল',
            variant: 'danger',
        });

        if (ok) {
            localStorage.removeItem('hasana-bookmarks');
            localStorage.removeItem('hasana-hadith-bookmarks');
            localStorage.removeItem('hasana-dua-bookmarks');
            await customAlert({
                title: 'ডাটা সফলভাবে পরিষ্কার হয়েছে',
                arabic: 'تَمَّ الْحَذْفُ بِنَجَاح',
                message: 'আপনার সংরক্ষিত সকল বুকমার্ক ও লোকাল ক্যাশ মুছে ফেলা হয়েছে।',
                iconType: 'success',
                buttonText: 'আলহামদুলিল্লাহ, ঠিক আছে',
            });
        }
    };

    return (
        <Layout>
            <PageHero 
                ar="الإعدادات" 
                title="অ্যাপ সেটিংস" 
                sub="আপনার পছন্দ অনুযায়ী অ্যাপের প্রদর্শন ও কার্যকারিতা নিয়ন্ত্রণ করুন" 
            />

            <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
                {/* Theme Setting */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            {isDark ? <Moon className="w-5 h-5 text-gold" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-base">ডার্ক মোড (Dark Theme)</h3>
                            <p className="text-xs text-muted-foreground">রাতে বা কম আলোতে পড়ার সুবিধার জন্য</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="ডার্ক মোড পরিবর্তন"
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${
                            isDark ? 'bg-primary' : 'bg-muted'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            isDark ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                </div>

                {/* Namaz Notification Setting (Firebase FCM) */}
                <div className="rounded-2xl bg-card border-2 border-gold/30 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                notificationsActive 
                                    ? 'bg-primary text-gold shadow-xs' 
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                                {notificationsActive ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-base">নামাজের নোটিফিকেশন</h3>
                                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-semibold">
                                        Firebase
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">প্রতিটি নামাজের ওয়াক্ত শুরু হলে অটোমেটিক নোটিফিকেশন পান</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleNotification}
                            aria-label="নামাজের নোটিফিকেশন চালু বা বন্ধ"
                            className={`w-12 h-7 rounded-full p-1 transition-colors ${
                                notificationsActive ? 'bg-primary' : 'bg-muted'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                notificationsActive ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                        </button>
                    </div>

                    {notificationMsg && (
                        <div className="text-xs px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium flex items-center justify-between">
                            <span>{notificationMsg}</span>
                            <button 
                                type="button" 
                                onClick={() => setNotificationMsg(null)}
                                className="text-muted-foreground hover:text-foreground text-[10px] ml-2"
                            >
                                বন্ধ করুন
                            </button>
                        </div>
                    )}

                    {/* Prayer Time Selector Pills */}
                    <div className="pt-2 border-t border-border/60">
                        <p className="text-xs font-semibold text-muted-foreground mb-2.5">
                            কোন কোন নামাজের নোটিফিকেশন পেতে চান নির্বাচন করুন:
                        </p>
                        <div className="grid grid-cols-5 gap-1.5">
                            {PRAYER_SCHEDULE.map((p) => {
                                const active = prayerPrefs[p.id];
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handlePrayerPrefChange(p.id)}
                                        className={`p-2 rounded-xl text-center border transition-all ${
                                            active
                                                ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
                                                : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted font-medium'
                                        }`}
                                    >
                                        <p className="text-xs">{p.name}</p>
                                        <p className="text-[10px] opacity-80 tabular-nums mt-0.5">{p.displayTime}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${notificationsActive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/50'}`} />
                            <span>{notificationsActive ? 'নোটিফিকেশন সক্রিয়' : 'নোটিফিকেশন বন্ধ'}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleTestNotification}
                            disabled={isTestingNotification}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/15 text-primary hover:bg-gold/25 font-bold text-xs transition border border-gold/40"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isTestingNotification ? 'পাঠানো হচ্ছে...' : 'টেস্ট নোটিফিকেশন'}</span>
                        </button>
                    </div>
                </div>

                {/* Daily Ayah Notification Setting */}
                <div className="rounded-2xl bg-card border-2 border-gold/30 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                dailyAyahActive 
                                    ? 'bg-primary text-gold shadow-xs' 
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-base">প্রতিদিনের আয়াত নোটিফিকেশন</h3>
                                    <span className="text-[10px] bg-gold/15 text-primary border border-gold/40 px-1.5 py-0.5 rounded-full font-bold">
                                        কোরআনের বাণী
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">প্রতিদিন সকালে কোরআনুল কারীমের একটি অনুপ্রেরণামূলক আয়াত নোটিফিকেশন পান</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleDailyAyah}
                            aria-label="প্রতিদিনের আয়াত নোটিফিকেশন চালু বা বন্ধ"
                            className={`w-12 h-7 rounded-full p-1 transition-colors ${
                                dailyAyahActive ? 'bg-primary' : 'bg-muted'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                dailyAyahActive ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${dailyAyahActive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/50'}`} />
                            <span>{dailyAyahActive ? 'আয়াত নোটিফিকেশন সচল' : 'আয়াত নোটিফিকেশন বন্ধ'}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleTestDailyAyah}
                            disabled={isTestingAyah}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/15 text-primary hover:bg-gold/25 font-bold text-xs transition border border-gold/40"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{isTestingAyah ? 'পাঠানো হচ্ছে...' : 'আজকের আয়াত টেস্ট করুন'}</span>
                        </button>
                    </div>
                </div>

                {/* Cache & Data Setting */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">সংরক্ষিত ডাটা রিসেট</h3>
                            <p className="text-xs text-muted-foreground">বুকমার্ক ও স্থানীয় ক্যাশ ডাটা পরিষ্কার করুন</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClearStorage}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white font-bold text-xs transition"
                    >
                        ডাটা মুছুন
                    </button>
                </div>

                {/* Official Facebook Page Card */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-base">অফিসিয়াল ফেসবুক পেজ</h3>
                            <p className="text-xs text-muted-foreground">facebook.com/page.hasana</p>
                        </div>
                    </div>

                    <a
                        href="https://www.facebook.com/page.hasana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition shadow-xs shrink-0"
                    >
                        <span>যুক্ত হোন</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Exit App Card */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">অ্যাপ থেকে প্রস্থান</h3>
                            <p className="text-xs text-muted-foreground">হাসানা অ্যাপ্লিকেশন বন্ধ বা প্রস্থান করুন</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => confirmExit()}
                        className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white font-bold text-xs transition active:scale-95"
                    >
                        প্রস্থান করুন
                    </button>
                </div>

                {/* Developer Info Card */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">ডেভেলপার পরিচিতি</h3>
                            <p className="text-xs text-muted-foreground">Developed by Apptimatic</p>
                        </div>
                    </div>

                    <a
                        href="https://apptimatic.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-gold text-xs font-bold transition"
                    >
                        <span>Apptimatic</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* App Info Card */}
                <div className="rounded-2xl bg-muted/60 border border-border p-5 text-center text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-primary text-sm">হাসানা ইসলামিক অ্যাপ্লিকেশন</p>
                    <p>ভার্সন: ২.৫ (নেটিভ স্পা + ক্যাপাসিটর মোবাইল রেডি)</p>
                    <p className="pt-1">
                        Developed with dedication by{' '}
                        <a
                            href="https://apptimatic.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-primary hover:underline"
                        >
                            Apptimatic
                        </a>
                    </p>
                    <p className="pt-1 text-[11px] text-muted-foreground/80">সকল প্রশংসা একমাত্র মহান আল্লাহ রব্বুল আলামীনের জন্য।</p>
                </div>
            </div>
        </Layout>
    );
}
