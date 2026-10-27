import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Bookmark, 
    Trash2, 
    ArrowRight, 
    ArrowUpRight, 
    Copy, 
    Check, 
    Share2, 
    Search, 
    X, 
    BookOpen, 
    ScrollText, 
    Heart, 
    Sparkles 
} from 'lucide-react';
import { DuaHandsIcon } from '../components/IslamicIcons';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { ShareCardModal } from '../components/ShareCardModal';
import { hapticImpact } from '../native';
import { useModal } from '../context/ModalContext';

export function BookmarksPage() {
    const navigate = useNavigate();
    const { confirm } = useModal();

    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const [hadithBookmarks, setHadithBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-hadith-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const [duaBookmarks, setDuaBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-dua-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const [activeTab, setActiveTab] = useState('ayahs'); // ayahs, hadiths, duas
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedKey, setCopiedKey] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [shareCardData, setShareCardData] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Sync bookmarks with localStorage across tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                setBookmarks(JSON.parse(localStorage.getItem('hasana-bookmarks') || '[]'));
                setHadithBookmarks(JSON.parse(localStorage.getItem('hasana-hadith-bookmarks') || '[]'));
                setDuaBookmarks(JSON.parse(localStorage.getItem('hasana-dua-bookmarks') || '[]'));
            } catch {
                // ignore
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const showToast = (text) => {
        setToastMessage(text);
        setTimeout(() => setToastMessage(null), 2500);
    };

    // Remove single bookmarks
    const removeAyahBookmark = (key) => {
        hapticImpact();
        const updated = bookmarks.filter((b) => b.key !== key);
        setBookmarks(updated);
        try {
            localStorage.setItem('hasana-bookmarks', JSON.stringify(updated));
            showToast('আয়াতটি বুকমার্ক থেকে সরানো হয়েছে');
        } catch {
            // ignore
        }
    };

    const removeHadithBookmark = (id) => {
        hapticImpact();
        const updated = hadithBookmarks.filter((b) => b.id !== id);
        setHadithBookmarks(updated);
        try {
            localStorage.setItem('hasana-hadith-bookmarks', JSON.stringify(updated));
            showToast('হাদিসটি বুকমার্ক থেকে সরানো হয়েছে');
        } catch {
            // ignore
        }
    };

    const removeDuaBookmark = (id) => {
        hapticImpact();
        const updated = duaBookmarks.filter((b) => b.id !== id);
        setDuaBookmarks(updated);
        try {
            localStorage.setItem('hasana-dua-bookmarks', JSON.stringify(updated));
            showToast('দোয়াটি বুকমার্ক থেকে সরানো হয়েছে');
        } catch {
            // ignore
        }
    };

    // Clear all in active tab
    const clearActiveTabBookmarks = async () => {
        hapticImpact();
        const tabNames = {
            ayahs: 'সকল আয়াত',
            hadiths: 'সকল হাদিস',
            duas: 'সকল দোয়া',
        };

        const confirmed = await confirm({
            title: 'বুকমার্ক মুছে ফেলতে চান?',
            arabic: 'حَذْفُ الْمَحْفُوظَاتِ',
            message: `আপনি কি নিশ্চিত যে এই বিভাগের ${tabNames[activeTab]} বুকমার্ক থেকে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।`,
            iconType: 'trash',
            confirmText: 'হ্যাঁ, মুছে ফেলুন',
            cancelText: 'বাতিল',
            variant: 'danger',
        });

        if (!confirmed) {
            return;
        }

        if (activeTab === 'ayahs') {
            setBookmarks([]);
            localStorage.setItem('hasana-bookmarks', '[]');
            showToast('সকল সংরক্ষিত আয়াত মুছে ফেলা হয়েছে');
        } else if (activeTab === 'hadiths') {
            setHadithBookmarks([]);
            localStorage.setItem('hasana-hadith-bookmarks', '[]');
            showToast('সকল সংরক্ষিত হাদিস মুছে ফেলা হয়েছে');
        } else if (activeTab === 'duas') {
            setDuaBookmarks([]);
            localStorage.setItem('hasana-dua-bookmarks', '[]');
            showToast('সকল সংরক্ষিত দোয়া মুছে ফেলা হয়েছে');
        }
    };

    // Copy actions
    const handleCopy = async (key, textToCopy, successMsg = 'ক্লিপবোর্ডে কপি করা হয়েছে!') => {
        hapticImpact();
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopiedKey(key);
            showToast(successMsg);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch {
            showToast('কপি করা সম্ভব হয়নি');
        }
    };

    // Share actions (Opens Photo Card Creator Modal)
    const handleShare = (cardData) => {
        hapticImpact();
        setShareCardData(cardData);
        setIsShareModalOpen(true);
    };

    // Filtered lists based on search
    const filteredAyahs = useMemo(() => {
        if (!searchQuery.trim()) return bookmarks;
        const q = searchQuery.toLowerCase().trim();
        return bookmarks.filter((b) => 
            (b.surahNameBn && b.surahNameBn.toLowerCase().includes(q)) ||
            (b.ayahNumberBn && String(b.ayahNumberBn).includes(q)) ||
            (b.text_bn && b.text_bn.toLowerCase().includes(q)) ||
            (b.text_ar && b.text_ar.includes(q)) ||
            (b.transliteration && b.transliteration.toLowerCase().includes(q))
        );
    }, [bookmarks, searchQuery]);

    const filteredHadiths = useMemo(() => {
        if (!searchQuery.trim()) return hadithBookmarks;
        const q = searchQuery.toLowerCase().trim();
        return hadithBookmarks.filter((h) => 
            (h.title && h.title.toLowerCase().includes(q)) ||
            (h.text_bn && h.text_bn.toLowerCase().includes(q)) ||
            (h.text_ar && h.text_ar.includes(q)) ||
            (h.reference && h.reference.toLowerCase().includes(q))
        );
    }, [hadithBookmarks, searchQuery]);

    const filteredDuas = useMemo(() => {
        if (!searchQuery.trim()) return duaBookmarks;
        const q = searchQuery.toLowerCase().trim();
        return duaBookmarks.filter((d) => 
            (d.title && d.title.toLowerCase().includes(q)) ||
            (d.text_bn && d.text_bn.toLowerCase().includes(q)) ||
            (d.text_ar && d.text_ar.includes(q)) ||
            (d.transliteration && d.transliteration.toLowerCase().includes(q)) ||
            (d.reference && d.reference.toLowerCase().includes(q))
        );
    }, [duaBookmarks, searchQuery]);

    const totalCount = bookmarks.length + hadithBookmarks.length + duaBookmarks.length;

    return (
        <Layout>
            <PageHero 
                ar="المحفوظات" 
                title="সংরক্ষিত বুকমার্কস" 
                sub={`পবিত্র কুরআন, হাদিস ও দোয়ার সংরক্ষিত তালিকা (${totalCount}টি আইটেম)`} 
            />

            {/* Filter Tabs & Search Bar */}
            <div className="mx-auto max-w-4xl px-4 mt-6">
                {/* Tabs */}
                <div className="flex items-center justify-center gap-2 border-b border-border pb-3 flex-wrap">
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveTab('ayahs'); }}
                        className={`flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                            activeTab === 'ayahs'
                                ? 'bg-primary text-gold shadow-sm scale-105'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>কুরআনের আয়াত</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] bg-primary-foreground/20">
                            {bookmarks.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveTab('hadiths'); }}
                        className={`flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                            activeTab === 'hadiths'
                                ? 'bg-primary text-gold shadow-sm scale-105'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <ScrollText className="w-3.5 h-3.5" />
                        <span>হাদিস</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] bg-primary-foreground/20">
                            {hadithBookmarks.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveTab('duas'); }}
                        className={`flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                            activeTab === 'duas'
                                ? 'bg-primary text-gold shadow-sm scale-105'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <DuaHandsIcon className="w-3.5 h-3.5" />
                        <span>দোয়া</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] bg-primary-foreground/20">
                            {duaBookmarks.length}
                        </span>
                    </button>
                </div>

                {/* Search Bar & Clear All Controls */}
                <div className="flex items-center justify-between gap-3 mt-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="বুকমার্কে খুঁজুন (বাংলা বা আরবি)..."
                            className="w-full pl-10 pr-9 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {((activeTab === 'ayahs' && bookmarks.length > 0) ||
                      (activeTab === 'hadiths' && hadithBookmarks.length > 0) ||
                      (activeTab === 'duas' && duaBookmarks.length > 0)) && (
                        <button
                            type="button"
                            onClick={clearActiveTabBookmarks}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-xl hover:bg-red-100 transition whitespace-nowrap"
                            title="এই ক্যাটাগরির সকল বুকমার্ক মুছুন"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">সবগুলো মুছুন</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mx-auto max-w-4xl px-4 py-6">
                {/* TAB 1: AYAHS */}
                {activeTab === 'ayahs' && (
                    bookmarks.length === 0 ? (
                        <div className="text-center py-20 px-4 rounded-3xl bg-card border border-border/80 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                                <Bookmark className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground">কোনো আয়াত বুকমার্ক করা নেই</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                                পবিত্র কুরআন তিলাওয়াত করার সময় পছন্দের আয়াতগুলো সহজে পেতে বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন।
                            </p>
                            <Link 
                                to="/quran" 
                                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-primary text-gold font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>কুরআন শরীফ পড়ুন</span>
                            </Link>
                        </div>
                    ) : filteredAyahs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="font-semibold text-base">"{searchQuery}" দিয়ে কোনো সংরক্ষিত আয়াত পাওয়া যায়নি</p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="mt-3 text-xs text-primary font-bold hover:underline"
                            >
                                সার্চ মুছে ফেলুন
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAyahs.map((b) => {
                                const isCopied = copiedKey === b.key;
                                const copyText = `${b.text_ar}\n\n${b.transliteration ? 'উচ্চারণ: ' + b.transliteration + '\n\n' : ''}অর্থ: ${b.text_bn}\n\n— সূরা ${b.surahNameBn} (${b.ayahNumberBn})`;
                                const shareUrl = `${window.location.origin}/surah/${b.surahSlug}#ayah-${b.ayahNumber}`;

                                return (
                                    <article 
                                        key={b.key} 
                                        className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition relative group"
                                    >
                                        {/* Card Header Bar */}
                                        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4 gap-2">
                                            <Link 
                                                to={`/surah/${b.surahSlug}#ayah-${b.ayahNumber}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-gold text-xs font-bold transition group-hover:bg-primary group-hover:text-gold"
                                                title="সম্পূর্ণ সূরা দেখুন"
                                            >
                                                <span>সূরা {b.surahNameBn} • আয়াত {b.ayahNumberBn}</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(b.key, copyText, 'আয়াতটি কপি করা হয়েছে!')}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted active:scale-95 transition"
                                                    title={isCopied ? 'কপি সম্পন্ন' : 'আয়াত কপি করুন'}
                                                >
                                                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleShare({
                                                        type: 'ayah',
                                                        title: `সূরা ${b.surahNameBn} — আয়াত ${b.ayahNumberBn}`,
                                                        reference: `সূরা ${b.surahNameBn} (${b.ayahNumberBn})`,
                                                        text_ar: b.text_ar,
                                                        text_bn: b.text_bn,
                                                        transliteration: b.transliteration || '',
                                                        url: shareUrl,
                                                    })}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted active:scale-95 transition"
                                                    title="ফটো কার্ড শেয়ার করুন"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeAyahBookmark(b.key)}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 transition"
                                                    title="বুকমার্ক থেকে মুছুন"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Arabic Verse */}
                                        <p className="font-arabic text-2xl md:text-3xl text-primary font-bold text-right leading-loose my-3" dir="rtl">
                                            {b.text_ar}
                                        </p>

                                        {/* Transliteration */}
                                        {b.transliteration && (
                                            <p className="text-xs md:text-sm text-primary/80 italic my-2">
                                                {b.transliteration}
                                            </p>
                                        )}

                                        {/* Bengali Translation */}
                                        <p className="text-sm md:text-base text-foreground mt-2 leading-relaxed">
                                            {b.text_bn}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    )
                )}

                {/* TAB 2: HADITHS */}
                {activeTab === 'hadiths' && (
                    hadithBookmarks.length === 0 ? (
                        <div className="text-center py-20 px-4 rounded-3xl bg-card border border-border/80 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                                <ScrollText className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground">কোনো হাদিস বুকমার্ক করা নেই</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                                গুরুত্বপূর্ণ হাদিসগুলো সংগ্রহে রাখতে হাদিস পাঠের সময় বুকমার্ক বোতামে চাপুন।
                            </p>
                            <Link 
                                to="/hadith" 
                                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-primary text-gold font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition"
                            >
                                <ScrollText className="w-4 h-4" />
                                <span>হাদিস ভাণ্ডার দেখুন</span>
                            </Link>
                        </div>
                    ) : filteredHadiths.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="font-semibold text-base">"{searchQuery}" দিয়ে কোনো সংরক্ষিত হাদিস পাওয়া যায়নি</p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="mt-3 text-xs text-primary font-bold hover:underline"
                            >
                                সার্চ মুছে ফেলুন
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredHadiths.map((h) => {
                                const isCopied = copiedKey === `hadith-${h.id}`;
                                const copyText = `${h.title}\n\n${h.text_ar ? h.text_ar + '\n\n' : ''}${h.text_bn}\n\n— রেফারেন্স: ${h.reference || 'হাসানা অ্যাপ'}`;

                                return (
                                    <article 
                                        key={h.id} 
                                        className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition relative"
                                    >
                                        {/* Card Header Bar */}
                                        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3 gap-2">
                                            <div>
                                                <h3 className="font-bold text-primary text-base md:text-lg leading-snug">
                                                    {h.title}
                                                </h3>
                                                {h.category && (
                                                    <span className="text-[11px] font-semibold text-muted-foreground">
                                                        {typeof h.category === 'object' ? h.category.name : h.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(`hadith-${h.id}`, copyText, 'হাদিসটি কপি করা হয়েছে!')}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted active:scale-95 transition"
                                                    title={isCopied ? 'কপি সম্পন্ন' : 'হাদিস কপি করুন'}
                                                >
                                                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleShare({
                                                        type: 'hadith',
                                                        title: `হাদিস: ${h.title}`,
                                                        reference: h.reference ? `রেফারেন্স: ${h.reference}` : h.title,
                                                        text_ar: h.text_ar || '',
                                                        text_bn: h.text_bn || '',
                                                        url: `${window.location.origin}/hadith`,
                                                    })}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted active:scale-95 transition"
                                                    title="ফটো কার্ড শেয়ার করুন"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeHadithBookmark(h.id)}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 transition"
                                                    title="বুকমার্ক থেকে মুছুন"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Arabic Hadith */}
                                        {h.text_ar && (
                                            <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right leading-loose my-3" dir="rtl">
                                                {h.text_ar}
                                            </p>
                                        )}

                                        {/* Translation */}
                                        <p className="text-sm md:text-base text-foreground mt-2 leading-relaxed">
                                            {h.text_bn}
                                        </p>

                                        {/* Reference */}
                                        {h.reference && (
                                            <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-medium">রেফারেন্স: {h.reference}</span>
                                                <Link 
                                                    to="/hadith" 
                                                    className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                                                >
                                                    <span>হাদিস পেজে যান</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )
                )}

                {/* TAB 3: DUAS */}
                {activeTab === 'duas' && (
                    duaBookmarks.length === 0 ? (
                        <div className="text-center py-20 px-4 rounded-3xl bg-card border border-border/80 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                                <DuaHandsIcon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground">কোনো দোয়া বুকমার্ক করা নেই</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                                প্রতিদিনের প্রয়োজনীয় ও কুরআনী দোয়া সহজে পেতে দোয়া পাঠের সময় বুকমার্কে যোগ করুন।
                            </p>
                            <Link 
                                to="/duas" 
                                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-primary text-gold font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition"
                            >
                                <DuaHandsIcon className="w-4 h-4" />
                                <span>দোয়া সমূহ পড়ুন</span>
                            </Link>
                        </div>
                    ) : filteredDuas.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="font-semibold text-base">"{searchQuery}" দিয়ে কোনো সংরক্ষিত দোয়া পাওয়া যায়নি</p>
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="mt-3 text-xs text-primary font-bold hover:underline"
                            >
                                সার্চ মুছে ফেলুন
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredDuas.map((d) => {
                                const isCopied = copiedKey === `dua-${d.id}`;
                                const copyText = `${d.title}\n\n${d.text_ar ? d.text_ar + '\n\n' : ''}${d.transliteration ? 'উচ্চারণ: ' + d.transliteration + '\n\n' : ''}অর্থ: ${d.text_bn}\n\n— ${d.reference || 'হাসানা অ্যাপ'}`;

                                return (
                                    <article 
                                        key={d.id} 
                                        className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition relative"
                                    >
                                        {/* Card Header Bar */}
                                        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3 gap-2">
                                            <div>
                                                <h3 className="font-bold text-primary text-base md:text-lg leading-snug">
                                                    {d.title}
                                                </h3>
                                                {d.category && (
                                                    <span className="text-[11px] font-semibold text-muted-foreground">
                                                        {typeof d.category === 'object' ? d.category.name : d.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(`dua-${d.id}`, copyText, 'দোয়াটি কপি করা হয়েছে!')}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted active:scale-95 transition"
                                                    title={isCopied ? 'কপি সম্পন্ন' : 'দোয়া কপি করুন'}
                                                >
                                                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleShare({
                                                        type: 'dua',
                                                        title: `দোয়া: ${d.title}`,
                                                        reference: d.reference ? `রেফারেন্স: ${d.reference}` : (d.category || 'দোয়া'),
                                                        text_ar: d.text_ar || '',
                                                        text_bn: d.text_bn || '',
                                                        transliteration: d.transliteration || '',
                                                        url: `${window.location.origin}/duas`,
                                                    })}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted active:scale-95 transition"
                                                    title="ফটো কার্ড শেয়ার করুন"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeDuaBookmark(d.id)}
                                                    className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 transition"
                                                    title="বুকমার্ক থেকে মুছুন"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Arabic Dua */}
                                        {d.text_ar && (
                                            <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right leading-loose my-3" dir="rtl">
                                                {d.text_ar}
                                            </p>
                                        )}

                                        {/* Transliteration */}
                                        {d.transliteration && (
                                            <p className="text-xs md:text-sm text-primary/80 italic my-2">
                                                উচ্চারণ: {d.transliteration}
                                            </p>
                                        )}

                                        {/* Translation */}
                                        <p className="text-sm md:text-base text-foreground mt-2 leading-relaxed">
                                            {d.text_bn}
                                        </p>

                                        {/* Reference */}
                                        {d.reference && (
                                            <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-medium">রেফারেন্স: {d.reference}</span>
                                                <Link 
                                                    to="/duas" 
                                                    className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                                                >
                                                    <span>দোয়া পেজে যান</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )
                )}
            </div>

            {/* Floating Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs md:text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Islamic Photo Card Creator Modal */}
            <ShareCardModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                data={shareCardData} 
            />
        </Layout>
    );
}
