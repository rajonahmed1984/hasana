import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, BookOpen, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { hapticImpact } from '../native';
import { QURAN_PARAS } from '../data/paras';

export function QuranPage() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('surah'); // 'surah' or 'para'
    const [filterType, setFilterType] = useState('all'); // 'all', 'meccan', 'medinan'

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const res = await fetch('/api/surahs?per_page=150');
                if (res.ok) {
                    const json = await res.json();
                    setSurahs(json.data || []);
                }
            } catch (err) {
                console.error('Failed to load surahs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
    }, []);

    // Filter surahs by search and Makki/Madani type
    const filteredSurahs = useMemo(() => {
        const q = search.trim().toLowerCase();
        return surahs.filter((s) => {
            // Type filter
            if (filterType === 'meccan' && s.revelation_type !== 'meccan') return false;
            if (filterType === 'medinan' && s.revelation_type !== 'medinan') return false;

            if (!q) return true;

            const nameBn = (s.name_bn || '').toLowerCase();
            const nameEn = (s.name_en || '').toLowerCase();
            const meaningBn = (s.meaning_bn || '').toLowerCase();
            const number = String(s.number);
            const numberBn = String(s.number_bn || '');

            return (
                nameBn.includes(q) ||
                nameEn.includes(q) ||
                meaningBn.includes(q) ||
                number.includes(q) ||
                numberBn.includes(q)
            );
        });
    }, [surahs, search, filterType]);

    // Filter paras by search
    const filteredParas = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return QURAN_PARAS;

        return QURAN_PARAS.filter((p) => {
            const numStr = String(p.number);
            const numBnStr = String(p.number_bn);
            const nameBn = p.name_bn.toLowerCase();
            const nameAr = p.name_ar.toLowerCase();
            const desc = p.surahs_desc.toLowerCase();
            const start = p.start.toLowerCase();
            const end = p.end.toLowerCase();

            return (
                numStr.includes(q) ||
                numBnStr.includes(q) ||
                nameBn.includes(q) ||
                nameAr.includes(q) ||
                desc.includes(q) ||
                start.includes(q) ||
                end.includes(q)
            );
        });
    }, [search]);

    const meccanCount = useMemo(() => {
        return surahs.filter((s) => s.revelation_type === 'meccan').length || 86;
    }, [surahs]);

    const medinanCount = useMemo(() => {
        return surahs.filter((s) => s.revelation_type === 'medinan').length || 28;
    }, [surahs]);

    // Quick map of surah number => surah object for Para pills
    const surahMap = useMemo(() => {
        const map = {};
        for (const s of surahs) {
            map[s.number] = s;
        }
        return map;
    }, [surahs]);

    return (
        <Layout>
            <PageHero 
                ar="القرآن الكريم" 
                title="আল-কুরআন" 
                sub="পবিত্র কুরআন শরীফ — 114টি সূরা ও 30 পারার সহজ ও সুন্দর বাংলা অনুবাদ"
            >
                {/* Search Bar inside Hero */}
                <div className="mt-6 mx-auto max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={
                                viewMode === 'surah'
                                    ? "সূরা খুঁজুন (যেমন: ফাতিহা, fatiha, 1, মাক্কী)..."
                                    : "পারা খুঁজুন (যেমন: 1, আম্মা, আলিফ লাম মীম)..."
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-card/95 text-foreground placeholder:text-muted-foreground border border-gold/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold backdrop-blur-md text-sm md:text-base"
                        />
                    </div>
                </div>
            </PageHero>

            {/* Main Tabs (সূরা অনুসারে vs পারা অনুসারে) */}
            <div className="mx-auto max-w-6xl px-4 mt-6">
                <div className="flex items-center justify-center mb-5">
                    <div className="inline-flex p-1 rounded-2xl bg-muted/70 border border-border shadow-inner">
                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('surah'); }}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                                viewMode === 'surah'
                                    ? 'gold-gradient-btn text-primary shadow-md'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            সূরা অনুসারে ({surahs.length || 114})
                        </button>
                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setViewMode('para'); }}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                                viewMode === 'para'
                                    ? 'gold-gradient-btn text-primary shadow-md'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            পারা অনুসারে (30 পারা)
                        </button>
                    </div>
                </div>

                {/* Sub-Filters for Surah Mode (সকল সূরা, মাক্কী, মাদানী) */}
                {viewMode === 'surah' && (
                    <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => { hapticImpact(); setFilterType('all'); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                    filterType === 'all'
                                        ? 'gold-gradient-btn text-primary shadow-sm'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30'
                                }`}
                            >
                                সকল সূরা ({surahs.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => { hapticImpact(); setFilterType('meccan'); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                    filterType === 'meccan'
                                        ? 'gold-gradient-btn text-primary shadow-sm'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30'
                                }`}
                            >
                                মাক্কী ({meccanCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => { hapticImpact(); setFilterType('medinan'); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                    filterType === 'medinan'
                                        ? 'gold-gradient-btn text-primary shadow-sm'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-gold/30'
                                }`}
                            >
                                মাদানী ({medinanCount})
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            প্রদর্শন: <span className="font-bold text-gold">{filteredSurahs.length}টি</span> সূরা
                        </p>
                    </div>
                )}

                {/* Sub-header for Para Mode */}
                {viewMode === 'para' && (
                    <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted-foreground">
                        <span>পবিত্র কুরআনের সম্পূর্ণ 30 পারা (Juz) সূচিপত্র</span>
                        <span>প্রদর্শন: <strong className="text-gold">{filteredParas.length}টি</strong> পারা</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="mx-auto max-w-6xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">পবিত্র কুরআন লোড হচ্ছে...</p>
                    </div>
                ) : viewMode === 'surah' ? (
                    /* Surahs Grid */
                    filteredSurahs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-gold/30">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40 text-gold" />
                            <p className="font-semibold text-lg">কোন সূরা পাওয়া যায়নি</p>
                            <p className="text-xs mt-1">অনুসন্ধান পরিবর্তন করে পুনরায় চেষ্টা করুন</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                            {filteredSurahs.map((surah) => {
                                const revLabel = surah.revelation_type === 'meccan' ? 'মাক্কী' : 'মাদানী';
                                const ayahCount = surah.ayah_count_bn || surah.ayah_count;

                                return (
                                    <Link
                                        key={surah.id || surah.number}
                                        to={`/surah/${surah.slug}`}
                                        onClick={() => hapticImpact()}
                                        className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-4 md:p-5 shadow-sm card-hover flex flex-col justify-between group native-press select-none"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c4a3b] to-[#041a13] border border-gold/45 text-gold flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
                                                    {surah.number_bn || surah.number}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-gold transition-colors">
                                                        {surah.name_bn || surah.name_en}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        {surah.name_en}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="font-arabic text-2xl text-gold font-bold text-right shrink-0 drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]">
                                                {surah.name_ar}
                                            </p>
                                        </div>

                                        <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                            <p className="truncate max-w-[65%]">
                                                {surah.meaning_bn ? `অর্থ: "${surah.meaning_bn}"` : ''}
                                            </p>
                                            <p className="font-medium text-gold flex items-center">
                                                <span className="inline-block px-2 py-0.5 rounded-md text-[11px] mr-1.5 font-semibold bg-gold/15 text-gold border border-gold/30">
                                                    {revLabel}
                                                </span>
                                                {ayahCount} আয়াত
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )
                ) : (
                    /* Paras (Juz) Grid */
                    filteredParas.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
                            <p className="font-semibold text-lg">কোন পারা পাওয়া যায়নি</p>
                            <p className="text-xs mt-1">পারা নম্বর বা নাম পরিবর্তন করে অনুসন্ধান করুন</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                            {filteredParas.map((para) => {
                                const targetSlug = para.first_slug || 'al-fatihah';

                                return (
                                    <div
                                        key={para.number}
                                        className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-5 shadow-sm card-hover flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0c4a3b] to-[#041a13] border border-gold/45 text-gold flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
                                                        <span className="text-[10px] uppercase font-normal leading-none opacity-80">পারা</span>
                                                        <span className="text-base leading-none font-bold mt-0.5">{para.number_bn}</span>
                                                    </span>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-foreground">
                                                            পারা {para.number_bn}: {para.name_bn}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {para.start} — {para.end}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="font-arabic text-2xl text-gold font-bold text-right shrink-0 drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]">
                                                    {para.name_ar}
                                                </p>
                                            </div>

                                            {/* Surahs Description */}
                                            <div className="mt-3 text-xs text-muted-foreground">
                                                <span className="font-semibold text-foreground">অন্তর্ভুক্ত সূরাসমূহ: </span>
                                                <span>{para.surahs_desc}</span>
                                            </div>

                                            {/* Surah Quick Chips */}
                                            {para.surah_numbers && para.surah_numbers.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                    {para.surah_numbers.slice(0, 5).map((num) => {
                                                        const s = surahMap[num];
                                                        if (!s) return null;
                                                        return (
                                                            <Link
                                                                key={num}
                                                                to={`/surah/${s.slug}`}
                                                                onClick={() => hapticImpact()}
                                                                className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-medium text-foreground hover:border-gold/40 hover:text-gold transition-colors inline-flex items-center gap-1"
                                                            >
                                                                <span>{s.number_bn}. {s.name_bn}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                    {para.surah_numbers.length > 5 && (
                                                        <span className="text-[11px] text-muted-foreground self-center px-1">
                                                            + আরও {para.surah_numbers.length - 5}টি সূরা
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {para.surah_numbers?.length || 1}টি সূরা অন্তর্ভুক্ত
                                            </span>
                                            <Link
                                                to={`/surah/${targetSlug}`}
                                                onClick={() => hapticImpact()}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline transition"
                                            >
                                                <span>পাঠ শুরু করুন</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
}
