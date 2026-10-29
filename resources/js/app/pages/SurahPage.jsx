import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Bookmark, 
    Share2, 
    Loader2, 
    Feather, 
    Check, 
    ChevronLeft,
    ChevronRight,
    Languages
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { WordByWord } from '../components/WordByWord';
import { TextSettingsBar, useArabicSettings } from '../components/TextSettingsBar';
import { ShareCardModal } from '../components/ShareCardModal';
import { hapticImpact } from '../native';

export function SurahPage() {
    const { slug } = useParams();
    const [surahData, setSurahData] = useState(null);
    const [ayahs, setAyahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-bookmarks') || '[]');
        } catch {
            return [];
        }
    });
    const [copiedAyah, setCopiedAyah] = useState(null);
    const [shareCardData, setShareCardData] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [wordsOpen, setWordsOpen] = useState({});
    const textSettings = useArabicSettings();

    useEffect(() => {
        const fetchSurah = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch first page (up to 150 ayahs, or all pages if needed)
                const res = await fetch(`/api/surahs/${encodeURIComponent(slug)}?per_page=150`);
                if (!res.ok) throw new Error('সূরা পাওয়া যায়নি');
                const json = await res.json();
                setSurahData(json.data);
                
                let allAyahs = json.ayahs?.data || [];
                const lastPage = json.ayahs?.meta?.last_page || 1;

                // If Surah has more than 150 ayahs (e.g. Al-Baqarah 286 ayahs), fetch remaining pages
                if (lastPage > 1) {
                    for (let p = 2; p <= lastPage; p++) {
                        const nextRes = await fetch(`/api/surahs/${encodeURIComponent(slug)}?page=${p}&per_page=150`);
                        if (nextRes.ok) {
                            const nextJson = await nextRes.json();
                            allAyahs = [...allAyahs, ...(nextJson.ayahs?.data || [])];
                        }
                    }
                }
                setAyahs(allAyahs);
            } catch (err) {
                setError(err.message || 'সূরা লোড করতে সমস্যা হয়েছে');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchSurah();
        }
    }, [slug]);

    useEffect(() => {
        if (!loading && ayahs.length > 0 && window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const el = document.getElementById(targetId);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-2', 'ring-gold', 'bg-primary/5');
                    setTimeout(() => {
                        el.classList.remove('ring-2', 'ring-gold', 'bg-primary/5');
                    }, 2500);
                }, 150);
            }
        }
    }, [loading, ayahs]);

    const toggleBookmark = (ayah) => {
        hapticImpact();
        const key = `${surahData.number}:${ayah.number}`;
        let updated;
        const exists = bookmarks.some((b) => b.key === key);

        if (exists) {
            updated = bookmarks.filter((b) => b.key !== key);
        } else {
            updated = [
                ...bookmarks,
                {
                    key,
                    surahNumber: surahData.number,
                    surahNameBn: surahData.name_bn || surahData.name_en,
                    surahSlug: surahData.slug,
                    ayahNumber: ayah.number,
                    ayahNumberBn: ayah.number_bn || ayah.number,
                    text_ar: ayah.text_ar,
                    text_bn: ayah.text_bn,
                    timestamp: Date.now(),
                },
            ];
        }

        setBookmarks(updated);
        try {
            localStorage.setItem('hasana-bookmarks', JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    const handleShare = (ayah) => {
        hapticImpact();
        setShareCardData({
            type: 'ayah',
            title: `সূরা ${surahData.name_bn || surahData.name_en} — আয়াত ${ayah.number_bn || ayah.number}`,
            reference: `সূরা ${surahData.name_bn || surahData.name_en} (${surahData.number_bn || surahData.number}:${ayah.number_bn || ayah.number})`,
            text_ar: ayah.text_ar,
            text_bn: ayah.text_bn,
            url: `${window.location.origin}/surah/${surahData.slug}#ayah-${ayah.number}`,
        });
        setIsShareModalOpen(true);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                    <p className="text-base font-medium">সূরা লোড হচ্ছে...</p>
                </div>
            </Layout>
        );
    }

    if (error || !surahData) {
        return (
            <Layout>
                <div className="mx-auto max-w-md text-center py-24 px-4">
                    <p className="text-xl font-bold text-red-600 mb-2">সূরা পাওয়া যায়নি</p>
                    <p className="text-sm text-muted-foreground mb-6">{error || 'অনুরোধকৃত সূরাটি বিদ্যমান নেই'}</p>
                    <Link
                        to="/quran"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-gold font-bold text-sm shadow-md"
                    >
                        <ArrowLeft className="w-4 h-4" /> সকল সূরায় ফিরে যান
                    </Link>
                </div>
            </Layout>
        );
    }

    const translator = surahData.translator_bn || surahData.meta?.translator_bn;
    const isBismillahShown = surahData.number !== 1 && surahData.number !== 9;

    return (
        <Layout>
            {/* Surah Hero Header (compact) */}
            <section className="bg-hero text-primary-foreground relative overflow-hidden py-4 md:py-8">
                <div className="absolute inset-0 pattern opacity-35 pointer-events-none" />
                <div className="relative mx-auto max-w-3xl px-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/quran"
                            onClick={() => hapticImpact()}
                            aria-label="সব সূরা"
                            title="সব সূরা"
                            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gold bg-primary-foreground/10 border border-gold/30 hover:text-gold hover:bg-primary-foreground/20 transition native-press"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg md:text-2xl font-bold leading-tight truncate">
                                {surahData.name_bn || surahData.name_en}
                                {surahData.meaning_bn && (
                                    <span className="ml-1.5 text-sm md:text-base font-medium opacity-80">({surahData.meaning_bn})</span>
                                )}
                            </h1>
                            <p className="mt-0.5 text-[11px] md:text-sm opacity-80 truncate">
                                {surahData.revelation_label_bn || (surahData.revelation_type === 'meccan' ? 'মক্কায় অবতীর্ণ' : 'মদিনায় অবতীর্ণ')}
                                {' • '}আয়াত: {surahData.ayah_count_bn || surahData.ayah_count}
                                {surahData.revelation_order && (
                                    <>{' • '}ক্রম: {surahData.revelation_order_bn || surahData.revelation_order}</>
                                )}
                            </p>
                        </div>

                        <p className="shrink-0 font-arabic text-3xl md:text-5xl text-gold font-bold leading-none drop-shadow-md" dir="rtl">
                            {surahData.name_ar}
                        </p>
                    </div>

                    {/* Translator Reference */}
                    {translator && (
                        <p className="mt-3 flex items-center gap-1.5 text-[11px] md:text-xs text-white/80">
                            <Feather className="w-3 h-3 shrink-0 text-gold" />
                            <span className="truncate">অনুবাদক: {translator}</span>
                        </p>
                    )}
                </div>
            </section>

            {/* Sticky Arabic Text Settings Bar */}
            <TextSettingsBar settings={textSettings} />

            {/* Ayahs Container */}
            <div className="mx-auto max-w-3xl px-4 py-5 md:py-8 space-y-4 md:space-y-6">
                {/* Surah Summary / About if available */}
                {surahData.summary_bn && (
                    <div className="rounded-2xl bg-muted/80 border border-border p-5 text-sm md:text-base leading-relaxed text-foreground/90">
                        <p className="font-semibold text-primary mb-1">সূরার ভূমিকা ও প্রেক্ষাপট:</p>
                        {surahData.summary_bn}
                    </div>
                )}

                {/* Bismillah Header */}
                {isBismillahShown && (
                    <div className="text-center py-6">
                        <p className="font-arabic text-3xl md:text-4xl text-primary font-bold">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            পরম করুণাময় ও অসীম দয়ালু আল্লাহ তায়ালার নামে শুরু করছি
                        </p>
                    </div>
                )}

                {/* Ayahs List */}
                {ayahs.map((ayah) => {
                    const key = `${surahData.number}:${ayah.number}`;
                    const isBookmarked = bookmarks.some((b) => b.key === key);
                    const isCopied = copiedAyah === key;
                    const showWords = !!wordsOpen[ayah.number];

                    return (
                        <article 
                            key={ayah.number} 
                            id={`ayah-${ayah.number}`}
                            className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            {/* Ayah Header Bar */}
                            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                                <span className="inline-flex items-center justify-center rounded-full bg-primary text-gold px-3 py-1 text-xs font-bold tracking-wider shadow-sm">
                                    {surahData.number_bn || surahData.number}:{ayah.number_bn || ayah.number}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            // A double click would open and close it again
                                            if (e.detail > 1) return;
                                            hapticImpact();
                                            setWordsOpen((prev) => ({ ...prev, [ayah.number]: !prev[ayah.number] }));
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                        aria-pressed={showWords}
                                        className={`native-press h-8 px-2.5 rounded-full flex items-center gap-1 text-xs font-semibold transition ${
                                            showWords
                                                ? 'bg-primary text-gold shadow-sm'
                                                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                        }`}
                                        title="প্রতিটি শব্দের অর্থ দেখুন"
                                    >
                                        <Languages className="w-4 h-4" />
                                        <span>শব্দার্থ</span>
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="বুকমার্ক"
                                        onClick={() => toggleBookmark(ayah)}
                                        className={`native-press w-8 h-8 rounded-full flex items-center justify-center transition ${
                                            isBookmarked
                                                ? 'bg-primary text-gold shadow-sm'
                                                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                        }`}
                                        title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্ক করুন'}
                                    >
                                        <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="শেয়ার করুন"
                                        onClick={() => handleShare(ayah)}
                                        className="native-press w-8 h-8 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition"
                                        title="আয়াত শেয়ার করুন"
                                    >
                                        {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Ayah Content */}
                            <div className="space-y-4">
                                {/* Arabic Text */}
                                <p 
                                    className={`font-arabic text-primary font-bold text-right ${textSettings.sizeClass} ${textSettings.leadClass} select-text`}
                                    dir="rtl"
                                >
                                    {ayah.text_ar}
                                </p>

                                {showWords && <WordByWord surah={surahData.number} ayah={ayah.number} />}

                                {/* Bengali Translation */}
                                <p className="text-base md:text-lg text-foreground font-normal leading-relaxed select-text pt-2">
                                    {ayah.text_bn}
                                </p>
                            </div>
                        </article>
                    );
                })}
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
