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
    Play, 
    Pause,
    Calendar
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { hapticImpact, nativeShare } from '../native';

const quickAccess = [
    { to: '/quran', title: 'আল-কুরআন', desc: 'পবিত্র কুরআন শরীফ পড়ুন', icon: BookOpen },
    { to: '/hadith', title: 'হাদিস শরীফ', desc: 'নির্বাচিত হাদিস পড়ুন', icon: ScrollText },
    { to: '/duas', title: 'দোয়া সমূহ', desc: 'দৈনন্দিন প্রয়োজনীয় দোয়া', icon: Heart },
    { to: '/umrah-guide', title: 'উমরা গাইড', desc: 'উমরার পূর্ণাঙ্গ নিয়মাবলী', icon: MapPin },
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    // Dhaka prayer times approximation
    const prayerTimes = [
        { name: 'ফজর', start: '০৫:০৫', end: '০৬:২০' },
        { name: 'যোহর', start: '১২:০২', end: '০৩:৪০' },
        { name: 'আসর', start: '০৩:৪০', end: '০৫:১৩' },
        { name: 'মাগরিব', start: '০৫:১৩', end: '০৬:২৫' },
        { name: 'ইশা', start: '০৬:২৫', end: '০৫:০৫' },
    ];

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            setCurrentTime(timeStr);
            setCurrentDate(dateStr);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const verseOfDay = {
        title: 'আজকের দিনের আয়াত',
        text_ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        text_bn: 'তুমি আমাদের (সরল ও) অবিচল পথটি দেখিয়ে দাও-',
        reference: 'সূরা আল-ফাতিহা, ১:৬',
        audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3'
    };

    const handlePlayAudio = () => {
        hapticImpact();
        if (isPlaying && audio) {
            audio.pause();
            setIsPlaying(false);
        } else {
            if (audio) {
                audio.play();
                setIsPlaying(true);
            } else {
                const newAudio = new Audio(verseOfDay.audio_url);
                newAudio.onended = () => setIsPlaying(false);
                newAudio.play();
                setAudio(newAudio);
                setIsPlaying(true);
            }
        }
    };

    const handleShareVerse = async () => {
        hapticImpact();
        await nativeShare({
            title: verseOfDay.title,
            text: `${verseOfDay.text_ar}\n\n${verseOfDay.text_bn}\n\n— ${verseOfDay.reference}`,
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
                <div className="rounded-3xl bg-card border-2 border-gold/40 p-5 md:p-7 shadow-xl backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base md:text-lg">আজকের নামাজের সময়সূচী</h2>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> ঢাকা, বাংলাদেশ
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm md:text-base font-bold text-primary tabular-nums">
                                {currentTime}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 md:gap-3 text-center">
                        {prayerTimes.map((prayer) => (
                            <div 
                                key={prayer.name} 
                                className="rounded-2xl bg-muted/70 hover:bg-muted p-2.5 md:py-4 md:px-2 border border-border/50 transition-colors"
                            >
                                <p className="text-xs md:text-sm font-semibold text-muted-foreground">{prayer.name}</p>
                                <p className="mt-1 font-bold text-primary tabular-nums text-sm md:text-lg">{prayer.start}</p>
                                <p className="text-[10px] md:text-xs text-muted-foreground/75 mt-0.5">শেষ {prayer.end}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Verse of the Day Card */}
            <section className="mx-auto max-w-3xl px-4 mt-8">
                <div className="rounded-3xl bg-card border border-border p-6 md:p-8 text-center shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                            {verseOfDay.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handlePlayAudio}
                                className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-gold flex items-center justify-center transition"
                                title={isPlaying ? 'বিরতি দিন' : 'তেলাওয়াত শুনুন'}
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>
                            <button
                                type="button"
                                onClick={handleShareVerse}
                                className="w-8 h-8 rounded-full bg-muted text-foreground/80 hover:bg-muted-foreground/20 flex items-center justify-center transition"
                                title="শেয়ার করুন"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <p className="font-arabic text-2xl md:text-4xl text-primary font-bold my-4 leading-loose">
                        {verseOfDay.text_ar}
                    </p>
                    <p className="text-base md:text-lg text-foreground font-medium leading-relaxed">
                        "{verseOfDay.text_bn}"
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-3 font-semibold">
                        ({verseOfDay.reference})
                    </p>
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
                            className="rounded-2xl bg-card border border-border p-4 md:p-6 shadow-sm card-hover flex flex-col justify-between group"
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
