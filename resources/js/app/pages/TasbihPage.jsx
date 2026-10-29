import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    RotateCcw, 
    Volume2, 
    VolumeX, 
    Smartphone, 
    Sparkles, 
    Check, 
    Share2, 
    ChevronDown, 
    Award,
    Heart,
    BookOpen,
    Info,
    RefreshCw
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { TasbihIcon } from '../components/IslamicIcons';
import { hapticImpact, isNative } from '../native';

const DHIKR_PRESETS = [
    {
        id: 'subhanallah',
        title_bn: 'সুবহানাল্লাহ',
        title_ar: 'سُبْحَانَ اللَّهِ',
        transliteration: 'SubhanAllah',
        meaning: 'আল্লাহ অতি পবিত্র ও সকল ত্রুটিমুক্ত।',
        virtue: 'মিজানের পাল্লায় অত্যন্ত ভারী এবং আল্লাহর সবচেয়ে প্রিয় বাক্য।',
        target: 33,
    },
    {
        id: 'alhamdulillah',
        title_bn: 'আলহামদুলিল্লাহ',
        title_ar: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Alhamdulillah',
        meaning: 'সকল প্রশংসা কেবল আল্লাহর জন্য।',
        virtue: 'মিজানের পাল্লাকে নেকি দ্বারা পূর্ণ করে দেয়।',
        target: 33,
    },
    {
        id: 'allahuakbar',
        title_bn: 'আল্লাহু আকবার',
        title_ar: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        meaning: 'আল্লাহ সর্বশ্রেষ্ঠ ও মহান।',
        virtue: 'আসমান ও জমিনের মধ্যবর্তী শূন্যস্থানকে সওয়াবে পূর্ণ করে।',
        target: 34,
    },
    {
        id: 'la_ilaha_illallah',
        title_bn: 'লা ইলাহা ইল্লাল্লাহ',
        title_ar: 'لَا إِلَهَ إِلَّا اللَّهُ',
        transliteration: 'La ilaha illallah',
        meaning: 'আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই।',
        virtue: 'সর্বোত্তম জিকির এবং জান্নাতের চাবিকাঠি।',
        target: 100,
    },
    {
        id: 'astaghfirullah',
        title_bn: 'আস্তাগফিরুল্লাহ',
        title_ar: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullah',
        meaning: 'আমি আল্লাহর কাছে ক্ষমা প্রার্থনা করছি।',
        virtue: 'রিজিকে বরকত, দুশ্চিন্তা মুক্তি এবং গুনাহ মাফের শ্রেষ্ঠ মাধ্যম।',
        target: 100,
    },
    {
        id: 'darood',
        title_bn: 'দরূদ শরীফ',
        title_ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        transliteration: 'Allahumma Salli Ala Muhammad',
        meaning: 'হে আল্লাহ! হযরত মুহাম্মাদ (সা.)-এর ওপর শান্তি ও রহমত বর্ষণ করুন।',
        virtue: 'একবার পাঠে ১০টি রহমত বর্ষিত হয়, ১০টি গুনাহ মাফ হয় এবং ১০টি মর্যাদা বৃদ্ধি পায়।',
        target: 100,
    },
    {
        id: 'subhanallahi_bihamdihi',
        title_bn: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
        title_ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
        transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil Azeem',
        meaning: 'আল্লাহর প্রশংসাসহ তাঁর পবিত্রতা ঘোষণা করছি, মহান আল্লাহ পরম পবিত্র।',
        virtue: 'জিহ্বায় উচ্চারণে সহজ কিন্তু কিয়ামতের পাল্লায় অত্যন্ত ভারী দুটি বাক্য।',
        target: 100,
    },
    {
        id: 'la_hawla',
        title_bn: 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ',
        title_ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        transliteration: 'La hawla wa la quwwata illa billah',
        meaning: 'আল্লাহর সাহায্য ছাড়া অনিষ্ট থেকে বাঁচার বা সৎকাজ করার কোনো শক্তি নেই।',
        virtue: 'জান্নাতের অমূল্য রত্নভাণ্ডারের অন্যতম একটি রত্ন।',
        target: 33,
    },
    {
        id: 'hasbunallah',
        title_bn: 'হাসবুনাল্লাহু ওয়া নি\'মাল ওয়াকিল',
        title_ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: 'Hasbunallahu wa ni\'mal wakeel',
        meaning: 'আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনি উত্তম কর্মবিধায়ক।',
        virtue: 'বিপদ, শঙ্কা ও কঠিন সময়ে মুমিনের সর্বশ্রেষ্ঠ ভরসা।',
        target: 100,
    },
];

const TARGET_PRESETS = [33, 99, 100, 300, 1000, 0]; // 0 = unlimited

export function TasbihPage() {
    const navigate = useNavigate();

    // Selected Dhikr index
    const [selectedDhikrIndex, setSelectedDhikrIndex] = useState(() => {
        try {
            return parseInt(localStorage.getItem('hasana-tasbih-dhikr-idx') || '0', 10);
        } catch {
            return 0;
        }
    });

    const currentDhikr = DHIKR_PRESETS[selectedDhikrIndex] || DHIKR_PRESETS[0];

    // Current Count
    const [count, setCount] = useState(() => {
        try {
            return parseInt(localStorage.getItem(`hasana-tasbih-count-${currentDhikr.id}`) || '0', 10);
        } catch {
            return 0;
        }
    });

    // Target (33, 99, 100, etc. or 0 for unlimited)
    const [target, setTarget] = useState(() => {
        try {
            const saved = localStorage.getItem(`hasana-tasbih-target-${currentDhikr.id}`);
            return saved !== null ? parseInt(saved, 10) : currentDhikr.target;
        } catch {
            return currentDhikr.target;
        }
    });

    // Completed Laps/Cycles
    const [laps, setLaps] = useState(() => {
        try {
            return parseInt(localStorage.getItem(`hasana-tasbih-laps-${currentDhikr.id}`) || '0', 10);
        } catch {
            return 0;
        }
    });

    // Sound and vibration toggles
    const [soundEnabled, setSoundEnabled] = useState(() => {
        try {
            return localStorage.getItem('hasana-tasbih-sound') === 'true';
        } catch {
            return false;
        }
    });

    const [vibrationEnabled, setVibrationEnabled] = useState(() => {
        try {
            return localStorage.getItem('hasana-tasbih-vibrate') !== 'false';
        } catch {
            return true;
        }
    });

    // Celebration animation state on target reach
    const [celebrating, setCelebrating] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    // Save count
    useEffect(() => {
        try {
            localStorage.setItem(`hasana-tasbih-count-${currentDhikr.id}`, String(count));
            localStorage.setItem(`hasana-tasbih-laps-${currentDhikr.id}`, String(laps));
            localStorage.setItem(`hasana-tasbih-target-${currentDhikr.id}`, String(target));
            localStorage.setItem('hasana-tasbih-dhikr-idx', String(selectedDhikrIndex));
        } catch {
            // ignore
        }
    }, [count, laps, target, currentDhikr.id, selectedDhikrIndex]);

    // Handle Dhikr Change
    const handleSelectDhikr = (idx) => {
        hapticImpact();
        setSelectedDhikrIndex(idx);
        const dhikr = DHIKR_PRESETS[idx];
        const savedCount = parseInt(localStorage.getItem(`hasana-tasbih-count-${dhikr.id}`) || '0', 10);
        const savedLaps = parseInt(localStorage.getItem(`hasana-tasbih-laps-${dhikr.id}`) || '0', 10);
        const savedTarget = localStorage.getItem(`hasana-tasbih-target-${dhikr.id}`);
        setCount(savedCount);
        setLaps(savedLaps);
        setTarget(savedTarget !== null ? parseInt(savedTarget, 10) : dhikr.target);
    };

    // Play subtle audio beep if sound enabled
    const playBeep = (freq = 880, duration = 0.05) => {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + duration);
            }
        } catch {
            // ignore audio error
        }
    };

    // Increment count on tap
    const handleTapCount = useCallback(() => {
        setButtonActive(true);
        setTimeout(() => setButtonActive(false), 120);

        if (vibrationEnabled) {
            hapticImpact();
        }

        playBeep(880, 0.04);

        setCount((prev) => {
            const next = prev + 1;
            if (target > 0 && next >= target) {
                // Reached target!
                setCelebrating(true);
                playBeep(1320, 0.15);
                setLaps((l) => l + 1);
                setTimeout(() => setCelebrating(false), 1200);
                return 0; // reset for next lap
            }
            return next;
        });
    }, [target, vibrationEnabled, soundEnabled]);

    // Keyboard support (Space bar to count)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                handleTapCount();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleTapCount]);

    // Reset current count
    const handleReset = () => {
        hapticImpact();
        if (window.confirm('আপনি কি বর্তমান তসবিহ গণনা রিসেট করতে চান?')) {
            setCount(0);
            setLaps(0);
        }
    };

    // Toggle Sound
    const toggleSound = () => {
        hapticImpact();
        const next = !soundEnabled;
        setSoundEnabled(next);
        try { localStorage.setItem('hasana-tasbih-sound', String(next)); } catch {}
    };

    // Toggle Vibration
    const toggleVibration = () => {
        hapticImpact();
        const next = !vibrationEnabled;
        setVibrationEnabled(next);
        try { localStorage.setItem('hasana-tasbih-vibrate', String(next)); } catch {}
    };

    // Target Progress percentage
    const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;

    // Convert number to Bengali digits
    const toBn = (num) => {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
    };

    return (
        <Layout>
            {/* Top Bar with Back Button & Sound/Vibrate Controls */}
            <div className="bg-[#06241a] border-b border-gold/20 py-3 px-4 sticky top-0 z-30">
                <div className="mx-auto max-w-2xl flex items-center justify-between">
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
                        {/* Sound Toggle */}
                        <button
                            type="button"
                            onClick={toggleSound}
                            title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
                            className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition native-press ${
                                soundEnabled 
                                    ? 'bg-gold/20 text-gold border-gold/40' 
                                    : 'bg-black/30 text-emerald-100/60 border-white/10 hover:text-white'
                            }`}
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>

                        {/* Vibration Toggle */}
                        <button
                            type="button"
                            onClick={toggleVibration}
                            title={vibrationEnabled ? 'ভাইব্রেশন সচল আছে' : 'ভাইব্রেশন বন্ধ'}
                            className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition native-press ${
                                vibrationEnabled 
                                    ? 'bg-gold/20 text-gold border-gold/40' 
                                    : 'bg-black/30 text-emerald-100/60 border-white/10 hover:text-white'
                            }`}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>

                        {/* Reset Count Button */}
                        <button
                            type="button"
                            onClick={handleReset}
                            title="গণনা রিসেট করুন"
                            className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center transition native-press"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Tasbih Screen - Immersive Islamic Design */}
            <main className="min-h-[calc(100vh-130px)] bg-gradient-to-b from-[#082e21] via-[#052016] to-[#02130c] text-white flex flex-col justify-between px-4 py-5 select-none relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/10 blur-[100px] pointer-events-none rounded-full" />
                <div className="absolute inset-0 pattern opacity-20 pointer-events-none" />

                <div className="mx-auto max-w-md w-full relative z-10 space-y-4">
                    {/* Dhikr Selector Bar */}
                    <div className="relative">
                        <label className="text-[11px] font-bold text-gold uppercase tracking-wider block mb-1">
                            জিকির নির্বাচন করুন:
                        </label>
                        <div className="relative">
                            <select
                                value={selectedDhikrIndex}
                                onChange={(e) => handleSelectDhikr(Number(e.target.value))}
                                className="w-full bg-[#0a3a2a] border-2 border-gold/40 hover:border-gold/70 text-gold font-bold text-sm sm:text-base rounded-2xl px-4 py-3 appearance-none outline-none shadow-lg transition pr-10 cursor-pointer"
                            >
                                {DHIKR_PRESETS.map((d, i) => (
                                    <option key={d.id} value={i} className="bg-[#052016] text-emerald-100 py-1">
                                        {d.title_bn} ({d.title_ar})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-5 h-5 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Active Dhikr Display Card */}
                    <div className="rounded-3xl bg-black/40 border border-gold/30 p-4 sm:p-5 text-center backdrop-blur-md shadow-xl relative overflow-hidden">
                        <p className="font-arabic text-2xl sm:text-3xl font-bold text-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] my-1.5" dir="rtl">
                            {currentDhikr.title_ar}
                        </p>
                        <h2 className="text-lg sm:text-xl font-extrabold text-white">
                            {currentDhikr.title_bn}
                        </h2>
                        <p className="text-xs text-emerald-200/80 mt-1 italic">
                            "{currentDhikr.meaning}"
                        </p>
                    </div>

                    {/* Target Preset Selection Chips */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-emerald-200/80">টার্গেট:</span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {TARGET_PRESETS.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                        hapticImpact();
                                        setTarget(t);
                                    }}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition native-press border ${
                                        target === t
                                            ? 'bg-gold text-[#06241a] border-gold shadow-md scale-105'
                                            : 'bg-black/35 text-emerald-100/80 border-white/10 hover:border-gold/40'
                                    }`}
                                >
                                    {t === 0 ? 'অসীম (∞)' : toBn(t)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Giant Interactive Tap Area */}
                <div className="my-auto py-6 flex flex-col items-center justify-center relative z-10">
                    {/* Celebration Banner on completing target */}
                    {celebrating && (
                        <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-gold text-[#06241a] font-extrabold text-xs shadow-lg animate-bounce flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>মাশাআল্লাহ! ১ চক্র সম্পন্ন হয়েছে</span>
                        </div>
                    )}

                    {/* Main Circular Tap Button */}
                    <div className="relative">
                        {/* Outer Glow Ring */}
                        <div className={`absolute -inset-4 rounded-full bg-gold/20 blur-xl transition-opacity duration-300 pointer-events-none ${
                            buttonActive ? 'opacity-100 scale-105' : 'opacity-40'
                        }`} />

                        <button
                            type="button"
                            onClick={handleTapCount}
                            className={`w-60 h-60 sm:w-72 sm:h-72 rounded-full relative flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-100 border-4 shadow-[0_12px_45px_rgba(0,0,0,0.6)] ${
                                buttonActive
                                    ? 'scale-95 bg-gradient-to-br from-[#125841] to-[#0a3828] border-gold shadow-[0_4px_25px_rgba(212,175,55,0.6)]'
                                    : 'bg-gradient-to-br from-[#0e4836] via-[#093526] to-[#041a12] border-gold/55 hover:border-gold'
                            }`}
                        >
                            {/* Inner Target Progress Ring */}
                            {target > 0 && (
                                <div className="text-[11px] font-bold text-gold/80 mb-1">
                                    টার্গেট: {toBn(target)} ({toBn(progressPercent)}%)
                                </div>
                            )}

                            {/* Huge Digits */}
                            <div className="text-6xl sm:text-7xl font-black text-white tabular-nums tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] my-1">
                                {toBn(count)}
                            </div>

                            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gold mt-1 drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]">
                                TAP TO COUNT
                            </span>

                            {/* Laps indicator inside */}
                            {laps > 0 && (
                                <div className="mt-2 text-[10px] font-bold text-emerald-200 bg-gold/20 border border-gold/40 px-2.5 py-0.5 rounded-full">
                                    সম্পন্ন চক্র: {toBn(laps)}
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Helper hint */}
                    <p className="text-xs text-emerald-200/60 mt-4 text-center font-medium">
                        গণনা করতে স্ক্রিনের মাঝের বৃত্তটিতে স্পর্শ (ট্যাপ) করুন
                    </p>
                </div>

                {/* Bottom Virtue / Hadith Card */}
                <div className="mx-auto max-w-md w-full relative z-10 pt-2 pb-6">
                    <div className="rounded-2xl bg-black/40 border border-gold/25 p-3.5 sm:p-4 backdrop-blur-sm text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gold mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>জিকিরের বিশেষ ফজিলত</span>
                        </div>
                        <p className="text-xs text-emerald-100/90 leading-relaxed">
                            {currentDhikr.virtue}
                        </p>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
