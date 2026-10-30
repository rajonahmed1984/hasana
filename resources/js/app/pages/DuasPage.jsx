import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Bookmark, 
    Share2, 
    Loader2, 
    Check, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    X
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { TextSettingsBar, useArabicSettings } from '../components/TextSettingsBar';
import { ShareCardModal } from '../components/ShareCardModal';
import { hapticImpact } from '../native';

const curatedDuas = [
    {
        id: 'd1',
        title: 'ঘুমানোর দোয়া',
        text_ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'বিসমিকাল্লাহুম্মা আমূতু ওয়া আহইয়া',
        text_bn: 'হে আল্লাহ! আপনার নাম নিয়েই আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং আপনার নামেই জীবিত (জাগ্রত) হব।',
        reference: 'সহীহ বুখারী, হাদিস নং 6324',
        category: 'দৈনন্দিন দোয়া',
        category_slug: 'daily-life-duas',
    },
    {
        id: 'd2',
        title: 'ঘুম থেকে জাগ্রত হওয়ার দোয়া',
        text_ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'আলহামদু লিল্লাহিল্লাযী আহ্ইয়ানা বা\'দা মা আমাতানা ওয়া ইলাইহিন নুশূর',
        text_bn: 'সমস্ত প্রশংসা সেই আল্লাহর জন্য যিনি মৃত্যুর (ঘুমের) পর আমাদের পুনরায় জীবন দান করলেন এবং তাঁর কাছেই সকলের পুনরুত্থান।',
        reference: 'সহীহ বুখারী, হাদিস নং 6312',
        category: 'দৈনন্দিন দোয়া',
        category_slug: 'daily-life-duas',
    },
    {
        id: 'd3',
        title: 'খাবার শুরুর দোয়া',
        text_ar: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        transliteration: 'বিসমিল্লাহি ওয়া \'আলা বারাকাতিল্লাহ',
        text_bn: 'আল্লাহর নামে এবং আল্লাহর বরকতের ওপর ভরসা করে খাওয়া শুরু করছি।',
        reference: 'মুস্তাদরাক হাকিম, হাদিস নং 7111',
        category: 'দৈনন্দিন দোয়া',
        category_slug: 'daily-life-duas',
    },
    {
        id: 'd4',
        title: 'খাবার শেষে দোয়া',
        text_ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'আলহামদু লিল্লাহিল্লাযী আত\'আমানা ওয়া সাক্বানা ওয়া জা\'আলানা মুসলিমীন',
        text_bn: 'সমস্ত প্রশংসা আল্লাহর জন্য যিনি আমাদের আহার করালেন, পান করালেন এবং মুসলিম হিসেবে সৃষ্টি করলেন।',
        reference: 'সুনানে আবু দাউদ, হাদিস নং 3850',
        category: 'দৈনন্দিন দোয়া',
        category_slug: 'daily-life-duas',
    },
    {
        id: 'd5',
        title: 'দুনিয়া ও আখিরাতের সার্বিক কল্যাণের শ্রেষ্ঠ দোয়া',
        text_ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'রাব্বানা আতিনা ফিদ-দুনইয়া হাসানাতাও ওয়া ফিল-আখিরাতি হাসানাতাও ওয়া ক্বিনা \'আযাবান নার',
        text_bn: 'হে আমাদের প্রতিপালক! আমাদের দুনিয়াতেও কল্যাণ দান করুন এবং আখিরাতেও কল্যাণ দান করুন, আর আমাদেরকে জাহান্নামের ভয়াবহ আযাব থেকে রক্ষা করুন।',
        reference: 'সূরা আল-বাকারা, 2:201',
        category: 'কুরআনী দোয়া ও মোনাজাত',
        category_slug: 'quranic-duas',
    },
    {
        id: 'd6',
        title: 'কঠিন কাজ সহজ ও অন্তরের জড়তা মুক্তির দোয়া',
        text_ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
        transliteration: 'রাব্বিশ রাহলী সাদরী, ওয়া ইয়াসসির লী আমরী, ওয়াহলুল \'উকদাতাম মিল লিসানী, ইয়াফক্বাহূ ক্বওলী',
        text_bn: 'হে আমার রব! আমার বক্ষ প্রশস্ত করে দিন, আমার কাজ সহজ করে দিন এবং আমার জিহ্বার জড়তা দূর করে দিন যেন মানুষ আমার কথা বুঝতে পারে।',
        reference: 'সূরা ত্বা-হা, 20:25-28',
        category: 'কুরআনী দোয়া ও মোনাজাত',
        category_slug: 'quranic-duas',
    },
    {
        id: 'd7',
        title: 'দোয়ায়ে ইউনুস (বিপদ ও দুশ্চিন্তা মুক্তির শ্রেষ্ঠ দোয়া)',
        text_ar: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        transliteration: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুনতু মিনায যালিমীন',
        text_bn: 'আপনি ব্যতীত কোনো সত্য উপাস্য নেই, আপনি পরম পবিত্র। নিশ্চয়ই আমি অত্যাচারীদের অন্তর্ভুক্ত হয়ে গেছি।',
        reference: 'সূরা আল-আম্বিয়া, 21:87; তিরমিযী, হাদিস নং 3505',
        category: 'বিপদ-আপদ ও দুশ্চিন্তা মুক্তি',
        category_slug: 'distress-and-protection',
    },
];

export function DuasPage() {
    const location = useLocation();
    const [duas, setDuas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [activeCategory, setActiveCategory] = useState(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('cat') || params.get('category') || 'all';
        } catch {
            return 'all';
        }
    });

    useEffect(() => {
        try {
            const params = new URLSearchParams(location.search);
            const cat = params.get('cat') || params.get('category');
            if (cat) {
                setActiveCategory(cat);
            }
        } catch {}
    }, [location.search]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [shareCardData, setShareCardData] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-dua-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const tabsContainerRef = useRef(null);
    const textSettings = useArabicSettings();

    // Scroll tabs smoothly left / right
    const scrollTabs = (direction) => {
        hapticImpact();
        if (tabsContainerRef.current) {
            const offset = direction === 'left' ? -200 : 200;
            tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // Auto-center tab on click
    const handleTabClick = (e, slug) => {
        hapticImpact();
        setActiveCategory(slug);
        if (e && e.currentTarget) {
            e.currentTarget.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    };

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/dua/categories');
                if (res.ok) {
                    const json = await res.json();
                    const cats = json.data || [];
                    setCategories(cats);
                    const total = cats.reduce((acc, c) => acc + (c.items_count || 0), 0);
                    setTotalCount(total);
                }
            } catch (err) {
                console.error('Failed to load dua categories:', err);
            }
        };

        fetchCategories();
    }, []);

    // Fetch duas when category or search changes
    const fetchDuas = useCallback(async (catSlug, query) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (catSlug && catSlug !== 'all') {
                params.append('category', catSlug);
            }
            if (query) {
                params.append('query', query);
            }
            params.append('per_page', '250');

            const res = await fetch(`/api/duas?${params.toString()}`);
            if (res.ok) {
                const json = await res.json();
                const fetched = (json.data || []).map((d) => ({
                    id: d.id,
                    title: d.title || 'দোয়া',
                    text_ar: d.arabic_text || d.text_ar || '',
                    transliteration: d.transliteration || '',
                    text_bn: d.bangla_meaning || d.text_bn || d.meaning || '',
                    reference: d.reference || '',
                    category: d.category?.name || 'দোয়া',
                    category_slug: d.category?.slug || '',
                }));

                if (fetched.length > 0) {
                    setDuas(fetched);
                } else if (catSlug === 'all' && !query) {
                    setDuas(curatedDuas);
                } else {
                    setDuas([]);
                }
            } else {
                setDuas(curatedDuas);
            }
        } catch (err) {
            console.error('Failed to fetch duas:', err);
            setDuas(curatedDuas);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDuas(activeCategory, debouncedQuery);
    }, [activeCategory, debouncedQuery, fetchDuas]);

    const toggleBookmark = (dua) => {
        hapticImpact();
        const exists = bookmarks.some((b) => b.id === dua.id);
        const updated = exists
            ? bookmarks.filter((b) => b.id !== dua.id)
            : [...bookmarks, dua];
        setBookmarks(updated);
        try {
            localStorage.setItem('hasana-dua-bookmarks', JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    const handleShare = (dua) => {
        hapticImpact();
        setShareCardData({
            type: 'dua',
            title: `দোয়া: ${dua.title}`,
            reference: dua.reference ? `রেফারেন্স: ${dua.reference}` : (dua.category ? `${dua.category} • হাসানা` : 'হাসানা ইসলামিক অ্যাপ'),
            text_ar: dua.text_ar || '',
            text_bn: dua.text_bn || '',
            transliteration: dua.transliteration || '',
            url: `${window.location.origin}/duas`,
        });
        setIsShareModalOpen(true);
    };

    const activeCatObj = useMemo(() => {
        if (activeCategory === 'all') return null;
        return categories.find((c) => c.slug === activeCategory);
    }, [categories, activeCategory]);

    const filteredDuas = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return duas;
        return duas.filter((d) =>
            (d.title && d.title.toLowerCase().includes(q)) ||
            (d.text_bn && d.text_bn.toLowerCase().includes(q)) ||
            (d.transliteration && d.transliteration.toLowerCase().includes(q)) ||
            (d.text_ar && d.text_ar.includes(q)) ||
            (d.reference && d.reference.toLowerCase().includes(q))
        );
    }, [duas, searchQuery]);

    return (
        <Layout>
            <PageHero 
                ar="الأدعية النبوية" 
                title="দোয়া সমূহ" 
                sub="দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া, জিকির ও কুরআনী মোনাজাত" 
            />

            <TextSettingsBar settings={textSettings} />

            {/* Search Box */}
            <div className="mx-auto max-w-6xl px-4 mt-6">
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="দোয়ার নাম, উচ্চারণ, অর্থ বা রেফারেন্স দিয়ে অনুসন্ধান করুন..."
                        className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            aria-label="অনুসন্ধান মুছুন"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Tabs with Smooth Scrolling */}
            <div className="mx-auto max-w-6xl px-4 mt-4">
                <div className="relative flex items-center">
                    {/* Left Scroll Arrow */}
                    <button
                        type="button"
                        onClick={() => scrollTabs('left')}
                        aria-label="বামে স্ক্রোল করুন"
                        className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-card border border-border shadow-sm items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition z-10 mr-1.5"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Scrollable Tabs Row */}
                    <div
                        ref={tabsContainerRef}
                        className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none scroll-smooth flex-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <button
                            type="button"
                            onClick={(e) => handleTabClick(e, 'all')}
                            className={`native-press px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                                activeCategory === 'all'
                                    ? 'gold-gradient-btn text-primary font-bold shadow-sm'
                                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30'
                            }`}
                        >
                            সকল দোয়া ({totalCount ? totalCount.toLocaleString('bn-BD-u-nu-latn') : duas.length.toLocaleString('bn-BD-u-nu-latn')})
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.slug}
                                type="button"
                                onClick={(e) => handleTabClick(e, cat.slug)}
                                className={`native-press px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                                    activeCategory === cat.slug
                                        ? 'gold-gradient-btn text-primary font-bold shadow-sm'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30'
                                }`}
                            >
                                {cat.name} ({cat.items_count?.toLocaleString('bn-BD-u-nu-latn') || 0})
                            </button>
                        ))}
                    </div>

                    {/* Right Scroll Arrow */}
                    <button
                        type="button"
                        onClick={() => scrollTabs('right')}
                        aria-label="ডানে স্ক্রোল করুন"
                        className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-card border border-border shadow-sm items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition z-10 ml-1.5"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {activeCatObj?.description && (
                    <p className="text-xs text-muted-foreground mt-2 px-1">
                        {activeCatObj.description}
                    </p>
                )}
            </div>

            {/* Duas Grid */}
            <div className="mx-auto max-w-6xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">দোয়া লোড হচ্ছে...</p>
                    </div>
                ) : filteredDuas.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-card rounded-2xl border border-gold/30">
                        <p className="text-base font-semibold text-foreground mb-1">কোনো দোয়া পাওয়া যায়নি</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            অনুসন্ধানের শব্দ পরিবর্তন করে চেষ্টা করুন অথবা অন্য ক্যাটাগরি নির্বাচন করুন
                        </p>
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                            className="px-4 py-1.5 text-xs font-semibold rounded-full gold-gradient-btn text-primary hover:opacity-90 transition"
                        >
                            সকল দোয়া দেখুন
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {filteredDuas.map((item, idx) => {
                            const isBookmarked = bookmarks.some((b) => b.id === item.id);
                            const isCopied = copiedId === item.id;

                            return (
                                <article
                                    key={item.id || idx}
                                    className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-5 md:p-6 shadow-sm card-hover flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0c4a3b] to-[#041a13] border border-gold/45 text-gold flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                                                    {(idx + 1).toLocaleString('bn-BD-u-nu-latn')}
                                                </span>
                                                <h3 className="font-bold text-base md:text-lg text-foreground">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    aria-label="বুকমার্ক"
                                                    onClick={() => toggleBookmark(item)}
                                                    className={`native-press w-7 h-7 rounded-full flex items-center justify-center transition ${
                                                        isBookmarked
                                                            ? 'bg-primary text-gold'
                                                            : 'bg-muted text-muted-foreground hover:text-primary'
                                                    }`}
                                                    title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্ক করুন'}
                                                >
                                                    <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="শেয়ার করুন"
                                                    onClick={() => handleShare(item)}
                                                    className="native-press w-7 h-7 rounded-full bg-muted text-muted-foreground hover:text-primary flex items-center justify-center transition"
                                                    title="শেয়ার করুন"
                                                >
                                                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {item.text_ar && (
                                            <p 
                                                className={`font-arabic ${textSettings.sizeClass} text-gold font-bold text-right my-3 ${textSettings.leadClass} drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]`}
                                                dir="rtl"
                                            >
                                                {item.text_ar}
                                            </p>
                                        )}

                                        {item.transliteration && (
                                            <p className="text-xs md:text-sm text-muted-foreground italic mb-2">
                                                <span className="font-semibold text-foreground/80 not-italic">উচ্চারণ:</span> {item.transliteration}
                                            </p>
                                        )}

                                        <p className="text-base text-foreground font-normal leading-relaxed mt-1">
                                            <span className="font-semibold text-primary">অর্থ:</span> {item.text_bn}
                                        </p>
                                    </div>

                                    {item.reference && (
                                        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                                {item.category || 'দোয়া'}
                                            </span>
                                            <span>{item.reference}</span>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Islamic Photo Card Creator Modal */}
            <ShareCardModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                data={shareCardData} 
            />
        </Layout>
    );
}
