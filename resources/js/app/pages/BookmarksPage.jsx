import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { hapticImpact } from '../native';

export function BookmarksPage() {
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

    const removeAyahBookmark = (key) => {
        hapticImpact();
        const updated = bookmarks.filter((b) => b.key !== key);
        setBookmarks(updated);
        try {
            localStorage.setItem('hasana-bookmarks', JSON.stringify(updated));
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
        } catch {
            // ignore
        }
    };

    return (
        <Layout>
            <PageHero 
                ar="المحفوظات" 
                title="সংরক্ষিত বুকমার্কস" 
                sub="আপনার পছন্দের আয়াত, হাদিস ও দোয়াসমূহ এক জায়গায়" 
            />

            {/* Filter Tabs */}
            <div className="mx-auto max-w-4xl px-4 mt-6">
                <div className="flex items-center justify-center gap-2 border-b border-border pb-3">
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveTab('ayahs'); }}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                            activeTab === 'ayahs'
                                ? 'bg-primary text-gold shadow-sm'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        কুরআনের আয়াত ({bookmarks.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveTab('hadiths'); }}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                            activeTab === 'hadiths'
                                ? 'bg-primary text-gold shadow-sm'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        হাদিস ({hadithBookmarks.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => { hapticImpact(); setActiveTab('duas'); }}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition ${
                            activeTab === 'duas'
                                ? 'bg-primary text-gold shadow-sm'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        দোয়া ({duaBookmarks.length})
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-8">
                {activeTab === 'ayahs' && (
                    bookmarks.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
                            <p className="font-semibold text-lg">কোন আয়াত বুকমার্ক করা নেই</p>
                            <p className="text-xs mt-1">পবিত্র কুরআন পাঠের সময় আয়াত বুকমার্ক করুন</p>
                            <Link to="/quran" className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-gold font-bold text-xs">
                                কুরআন পড়ুন
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookmarks.map((b) => (
                                <article key={b.key} className="rounded-2xl bg-card border border-border p-5 shadow-sm">
                                    <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                                        <Link 
                                            to={`/surah/${b.surahSlug}#ayah-${b.ayahNumber}`}
                                            className="font-bold text-primary hover:underline text-base flex items-center gap-1.5"
                                        >
                                            <span>সূরা {b.surahNameBn} (আয়াত: {b.ayahNumberBn})</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => removeAyahBookmark(b.key)}
                                            className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted"
                                            title="মুছুন"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right my-2" dir="rtl">
                                        {b.text_ar}
                                    </p>
                                    <p className="text-sm md:text-base text-foreground mt-2 leading-relaxed">
                                        {b.text_bn}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'hadiths' && (
                    hadithBookmarks.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
                            <p className="font-semibold text-lg">কোন হাদিস বুকমার্ক করা নেই</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {hadithBookmarks.map((h) => (
                                <article key={h.id} className="rounded-2xl bg-card border border-border p-5 shadow-sm">
                                    <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                                        <h3 className="font-bold text-primary text-base">{h.title}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeHadithBookmark(h.id)}
                                            className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {h.text_ar && (
                                        <p className="font-arabic text-xl text-primary font-bold text-right my-2" dir="rtl">
                                            {h.text_ar}
                                        </p>
                                    )}
                                    <p className="text-sm md:text-base text-foreground mt-2 leading-relaxed">
                                        {h.text_bn}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">{h.reference}</p>
                                </article>
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'duas' && (
                    duaBookmarks.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
                            <p className="font-semibold text-lg">কোন দোয়া বুকমার্ক করা নেই</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {duaBookmarks.map((d) => (
                                <article key={d.id} className="rounded-2xl bg-card border border-border p-5 shadow-sm">
                                    <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                                        <h3 className="font-bold text-primary text-base">{d.title}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeDuaBookmark(d.id)}
                                            className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {d.text_ar && (
                                        <p className="font-arabic text-xl text-primary font-bold text-right my-2" dir="rtl">
                                            {d.text_ar}
                                        </p>
                                    )}
                                    <p className="text-sm md:text-base text-foreground mt-2 leading-relaxed">
                                        {d.text_bn}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
}
