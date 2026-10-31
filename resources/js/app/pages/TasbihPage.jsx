import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Smartphone, Sparkles, ChevronDown } from 'lucide-react';
import { Layout } from '../components/Layout';
import { hapticImpact } from '../native';

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

    // Progress ring around the tap circle
    const RING_R = 46;
    const RING_C = 2 * Math.PI * RING_R;

    const iconBtn = (active) => `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition native-press ${
        active ? 'bg-gold/20 text-gold' : 'bg-white/5 text-emerald-100/50'
    }`;

    return (
        <Layout>
            {/* One screen-high column between the app header and the bottom navigation */}
            <main className="tasbih-screen bg-gradient-to-b from-[#082e21] to-[#02130c] text-white select-none overflow-hidden">
                <div className="mx-auto max-w-md h-full flex flex-col px-4 py-3 gap-3">
                    {/* Controls: back, dhikr selector, sound, vibration, reset */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            aria-label="ফিরে যান"
                            onClick={() => { hapticImpact(); navigate(-1); }}
                            className={`${iconBtn(false)} !text-emerald-100/80`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="relative flex-1 min-w-0">
                            <select
                                value={selectedDhikrIndex}
                                onChange={(e) => handleSelectDhikr(Number(e.target.value))}
                                aria-label="জিকির নির্বাচন করুন"
                                className="w-full h-9 bg-white/5 border border-gold/30 text-gold font-semibold text-sm rounded-xl pl-3 pr-8 appearance-none outline-none truncate cursor-pointer"
                            >
                                {DHIKR_PRESETS.map((d, i) => (
                                    <option key={d.id} value={i} className="bg-[#052016] text-emerald-100">
                                        {d.title_bn}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <button type="button" onClick={toggleSound} aria-label={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'} className={iconBtn(soundEnabled)}>
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                        <button type="button" onClick={toggleVibration} aria-label={vibrationEnabled ? 'ভাইব্রেশন বন্ধ করুন' : 'ভাইব্রেশন চালু করুন'} className={iconBtn(vibrationEnabled)}>
                            <Smartphone className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={handleReset} aria-label="গণনা রিসেট করুন" className={`${iconBtn(false)} !text-red-300/80`}>
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Current dhikr */}
                    <div className="text-center shrink-0">
                        <p className="font-arabic text-2xl font-bold text-gold leading-relaxed line-clamp-2" dir="rtl">
                            {currentDhikr.title_ar}
                        </p>
                        <p className="text-sm text-emerald-100/70 mt-0.5 line-clamp-2">
                            {currentDhikr.meaning}
                        </p>
                    </div>

                    {/* Tap circle: takes the remaining height and scales with the screen */}
                    <div className="tasbih-stage flex-1 min-h-0 flex items-center justify-center relative">
                        {celebrating && (
                            <div className="absolute top-0 px-3 py-1 rounded-full bg-gold text-[#06241a] font-bold text-xs shadow-lg flex items-center gap-1.5 z-10">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>মাশাআল্লাহ! ১ চক্র সম্পন্ন</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleTapCount}
                            aria-label="গণনা করুন"
                            className={`tasbih-circle relative rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-100 ${
                                buttonActive ? 'scale-95' : ''
                            }`}
                        >
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
                                <circle cx="50" cy="50" r={RING_R} fill="#0b3a2b" stroke="rgba(212,175,55,0.15)" strokeWidth="3" />
                                {target > 0 && (
                                    <circle
                                        cx="50" cy="50" r={RING_R} fill="none"
                                        stroke="#d4af37" strokeWidth="3" strokeLinecap="round"
                                        strokeDasharray={RING_C}
                                        strokeDashoffset={RING_C * (1 - progressPercent / 100)}
                                        className="transition-[stroke-dashoffset] duration-200"
                                    />
                                )}
                            </svg>
                            <span className="relative text-7xl font-black tabular-nums text-white">
                                {toBn(count)}
                            </span>
                            <span className="relative text-base font-semibold text-gold/80 mt-1">
                                {target > 0 ? `/ ${toBn(target)}` : 'ট্যাপ করুন'}
                            </span>
                            {laps > 0 && (
                                <span className="relative mt-2 text-sm font-semibold text-emerald-100/80">
                                    চক্র: {toBn(laps)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Target presets */}
                    <div className="flex items-center justify-center gap-1.5 flex-wrap shrink-0">
                        {TARGET_PRESETS.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => { hapticImpact(); setTarget(t); }}
                                className={`min-w-[2.75rem] px-2.5 py-1.5 rounded-lg text-base font-bold transition native-press ${
                                    target === t ? 'bg-gold text-[#06241a]' : 'bg-white/5 text-emerald-100/70'
                                }`}
                            >
                                {t === 0 ? '∞' : toBn(t)}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    );
}
