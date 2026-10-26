import React, { useState, useEffect } from 'react';
import { Bookmark, Share2, Loader2, ScrollText, Check } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { TextSettingsBar, useArabicSettings } from '../components/TextSettingsBar';
import { hapticImpact, nativeShare } from '../native';

const curatedHadiths = [
    {
        id: 'c1',
        title: 'নিয়তের গুরুত্ব',
        text_ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
        text_bn: 'সকল কাজ নিয়তের ওপর নির্ভরশীল। প্রতিটি মানুষ তার নিয়তের ফলই লাভ করবে।',
        reference: 'সহীহ বুখারী, হাদিস নং ১',
        category: 'ঈমান ও নিয়ত',
    },
    {
        id: 'c2',
        title: 'কুরআন শিক্ষা ও প্রচার',
        text_ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
        text_bn: 'তোমাদের মধ্যে সর্বোত্তম সে, যে নিজে কুরআন শেখে এবং অন্যকে তা শেখায়।',
        reference: 'সহীহ বুখারী, হাদিস নং ৫০২৭',
        category: 'কুরআন ও জ্ঞান',
    },
    {
        id: 'c3',
        title: 'পবিত্রতার গুরুত্ব',
        text_ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
        text_bn: 'পবিত্রতা হলো ঈমানের অর্ধেক।',
        reference: 'সহীহ মুসলিম, হাদিস নং ২২৩',
        category: 'ইবাদত ও পবিত্রতা',
    },
    {
        id: 'c4',
        title: 'দ্বীনের মূল চেতনা',
        text_ar: 'الدِّينُ النَّصِيحَةُ',
        text_bn: 'দ্বীন হলো আন্তরিক কল্যাণকামিতা (আল্লাহ, তাঁর কিতাব, তাঁর রাসুল এবং সকল মুসলমানের প্রতি)।',
        reference: 'সহীহ মুসলিম, হাদিস নং ৫৫',
        category: 'আখলাক ও চরিত্র',
    },
    {
        id: 'c5',
        title: 'জ্ঞান অর্জনের ফজিলত',
        text_ar: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
        text_bn: 'যে ব্যক্তি জ্ঞান অর্জনের উদ্দেশ্যে কোনো পথ অবলম্বন করে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।',
        reference: 'সহীহ মুসলিম, হাদিস নং ২৬৯৯',
        category: 'কুরআন ও জ্ঞান',
    },
    {
        id: 'c6',
        title: 'প্রকৃত ঈমান ও ভ্রাতৃত্ব',
        text_ar: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        text_bn: 'তোমাদের কেউ পূর্ণ মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে যা নিজের জন্য পছন্দ করে।',
        reference: 'সহীহ বুখারী, হাদিস নং ১৩',
        category: 'আখলাক ও চরিত্র',
    },
];

export function HadithPage() {
    const [hadiths, setHadiths] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-hadith-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const textSettings = useArabicSettings();

    useEffect(() => {
        const fetchHadithData = async () => {
            try {
                const [catsRes, hadithsRes] = await Promise.all([
                    fetch('/api/hadith/categories').then((r) => r.ok ? r.json() : null),
                    fetch('/api/hadiths?per_page=50').then((r) => r.ok ? r.json() : null),
                ]);

                const apiHadiths = (hadithsRes?.data || []).map((h) => ({
                    id: h.id,
                    title: h.title || 'হাদিস',
                    text_ar: h.arabic_text || h.text_ar || '',
                    text_bn: h.bangla_text || h.text_bn || h.translation || '',
                    reference: h.narrator || h.reference || 'সহীহ হাদিস',
                    category: h.category?.name || 'সাধারণ',
                }));

                // Combine API hadiths with curated ones
                const combined = [...apiHadiths, ...curatedHadiths];
                setHadiths(combined);

                // Extract all unique categories
                const allCats = Array.from(new Set(combined.map((h) => h.category).filter(Boolean)));
                setCategories(allCats);
            } catch (err) {
                console.error('Failed to fetch hadiths:', err);
                setHadiths(curatedHadiths);
                const allCats = Array.from(new Set(curatedHadiths.map((h) => h.category)));
                setCategories(allCats);
            } finally {
                setLoading(false);
            }
        };

        fetchHadithData();
    }, []);

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

    const handleShare = async (hadith) => {
        hapticImpact();
        const result = await nativeShare({
            title: `হাদিস: ${hadith.title}`,
            text: `${hadith.text_ar ? hadith.text_ar + '\n\n' : ''}${hadith.text_bn}\n\n— ${hadith.reference}`,
            url: window.location.href,
        });
        if (result === 'copied') {
            setCopiedId(hadith.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const filteredHadiths = activeCategory === 'all'
        ? hadiths
        : hadiths.filter((h) => h.category === activeCategory);

    return (
        <Layout>
            <PageHero 
                ar="الحديث الشريف" 
                title="হাদিস শরীফ" 
                sub="রাসূলুল্লাহ (সাঃ)-এর পবিত্র বাণী ও জীবনদর্শন — নির্বাচিত সহীহ হাদিস সংগ্রহ" 
            />

            <TextSettingsBar settings={textSettings} />

            {/* Category Filter Pills */}
            <div className="mx-auto max-w-6xl px-4 mt-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveCategory('all'); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                            activeCategory === 'all'
                                ? 'bg-primary text-gold shadow-sm'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        সকল হাদিস ({hadiths.length})
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => { hapticImpact(); setActiveCategory(cat); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                                activeCategory === cat
                                    ? 'bg-primary text-gold shadow-sm'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hadiths Grid */}
            <div className="mx-auto max-w-6xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">হাদিস লোড হচ্ছে...</p>
                    </div>
                ) : filteredHadiths.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-lg">কোন হাদিস পাওয়া যায়নি</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {filteredHadiths.map((item, idx) => {
                            const isBookmarked = bookmarks.some((b) => b.id === item.id);
                            const isCopied = copiedId === item.id;

                            return (
                                <article
                                    key={item.id || idx}
                                    className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-sm card-hover flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-8 h-8 rounded-full bg-primary text-gold flex items-center justify-center text-xs font-bold shrink-0">
                                                    {(idx + 1).toLocaleString('bn-BD')}
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
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
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
                                                    className="w-7 h-7 rounded-full bg-muted text-muted-foreground hover:text-primary flex items-center justify-center transition"
                                                    title="শেয়ার করুন"
                                                >
                                                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {item.text_ar && (
                                            <p 
                                                className={`font-arabic ${textSettings.sizeClass} text-primary font-bold text-right my-3 ${textSettings.leadClass}`}
                                                dir="rtl"
                                            >
                                                {item.text_ar}
                                            </p>
                                        )}

                                        <p className="text-base text-foreground font-normal leading-relaxed mt-2">
                                            {item.text_bn}
                                        </p>
                                    </div>

                                    {item.reference && (
                                        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                                {item.category || 'হাদিস'}
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
        </Layout>
    );
}
