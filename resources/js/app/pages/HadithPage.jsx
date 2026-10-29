import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bookmark, Share2, Loader2, ScrollText, Check, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { TextSettingsBar, useArabicSettings } from '../components/TextSettingsBar';
import { ShareCardModal } from '../components/ShareCardModal';
import { hapticImpact } from '../native';

export function HadithPage() {
    const tabsContainerRef = useRef(null);
    const [hadiths, setHadiths] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [copiedId, setCopiedId] = useState(null);
    const [shareCardData, setShareCardData] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-hadith-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const textSettings = useArabicSettings();

    const scrollTabs = (direction) => {
        hapticImpact();
        if (tabsContainerRef.current) {
            const offset = direction === 'left' ? -240 : 240;
            tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

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
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/hadith/categories');
                if (res.ok) {
                    const json = await res.json();
                    const cats = json.data || [];
                    setCategories(cats);
                    const total = cats.reduce((acc, c) => acc + (c.items_count || 0), 0);
                    setTotalCount(total);
                }
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };

        fetchCategories();
    }, []);

    // Fetch hadiths when category, search query or page changes
    const fetchHadiths = useCallback(async (catSlug, query, pageNum, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const params = new URLSearchParams();
            if (catSlug && catSlug !== 'all') {
                params.append('category', catSlug);
            }
            if (query) {
                params.append('query', query);
            }
            params.append('page', pageNum.toString());
            params.append('per_page', '24');

            const res = await fetch(`/api/hadiths?${params.toString()}`);
            if (res.ok) {
                const json = await res.json();
                const fetched = (json.data || []).map((h) => ({
                    id: h.id,
                    title: h.title || 'হাদিস',
                    text_ar: h.arabic_text || h.text_ar || '',
                    text_bn: h.bangla_text || h.text_bn || h.translation || '',
                    reference: h.narrator || h.reference || 'সহীহ হাদিস',
                    category: h.category?.name || 'সাধারণ',
                }));

                const meta = json.meta || {};
                setHasMore(meta.current_page < meta.last_page);

                if (append) {
                    setHadiths((prev) => [...prev, ...fetched]);
                } else {
                    setHadiths(fetched);
                }
            }
        } catch (err) {
            console.error('Failed to fetch hadiths:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Reload hadiths from page 1 on category or debounced query change
    useEffect(() => {
        setPage(1);
        fetchHadiths(activeCategory, debouncedQuery, 1, false);
    }, [activeCategory, debouncedQuery, fetchHadiths]);

    const handleLoadMore = () => {
        if (loadingMore || !hasMore) return;
        hapticImpact();
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHadiths(activeCategory, debouncedQuery, nextPage, true);
    };

    const toggleBookmark = (hadith) => {
        hapticImpact();
        const exists = bookmarks.some((b) => b.id === hadith.id);
        const updated = exists
            ? bookmarks.filter((b) => b.id !== hadith.id)
            : [...bookmarks, hadith];
        setBookmarks(updated);
        try {
            localStorage.setItem('hasana-hadith-bookmarks', JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    const handleShare = (hadith) => {
        hapticImpact();
        setShareCardData({
            type: 'hadith',
            title: `হাদিস: ${hadith.title}`,
            reference: hadith.reference ? `রেফারেন্স: ${hadith.reference}` : hadith.title,
            text_ar: hadith.text_ar || '',
            text_bn: hadith.text_bn || '',
            url: `${window.location.origin}/hadith`,
        });
        setIsShareModalOpen(true);
    };

    const activeCatObj = categories.find((c) => c.slug === activeCategory);

    return (
        <Layout>
            <PageHero 
                ar="الحديث الشريف" 
                title="হাদিস শরীফ" 
                sub="সহীহ বুখারী ও সহীহ মুসলিম — ইসলামিক ফাউন্ডেশন অনুযায়ী বিষয়ভিত্তিক সকল হাদিস সংগ্রহ" 
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
                        placeholder="হাদিসের বাণী, বর্ণনাকারী বা রেফারেন্স দিয়ে অনুসন্ধান করুন..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mx-auto max-w-6xl px-4 mt-4">
                <div className="relative flex items-center">
                    {/* Left Scroll Button */}
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
                            সকল হাদিস ({totalCount.toLocaleString('bn-BD-u-nu-latn')})
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

                    {/* Right Scroll Button */}
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

            {/* Hadiths Grid */}
            <div className="mx-auto max-w-6xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">হাদিস লোড হচ্ছে...</p>
                    </div>
                ) : hadiths.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-gold/30">
                        <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-40 text-gold" />
                        <p className="font-semibold text-lg">কোন হাদিস পাওয়া যায়নি</p>
                        <p className="text-sm mt-1">ভিন্ন শব্দ বা অন্য ক্যাটাগরি নির্বাচন করে চেষ্টা করুন।</p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 gap-5">
                            {hadiths.map((item, idx) => {
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

                                            <p className="text-base text-foreground font-normal leading-relaxed mt-2 whitespace-pre-line">
                                                {item.text_bn}
                                            </p>
                                        </div>

                                        {item.reference && (
                                            <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                                <span className="font-semibold text-gold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-full">
                                                    {item.category || 'হাদিস'}
                                                </span>
                                                <span className="text-right text-muted-foreground font-medium">{item.reference}</span>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center mt-8">
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-2.5 rounded-full gold-gradient-btn text-primary font-bold text-sm hover:opacity-95 transition inline-flex items-center gap-2 shadow-md disabled:opacity-50 native-press"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            আরও হাদিস লোড হচ্ছে...
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            আরও হাদিস দেখুন
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
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
