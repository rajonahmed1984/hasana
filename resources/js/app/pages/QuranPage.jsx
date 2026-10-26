import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { hapticImpact } from '../native';

export function QuranPage() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, meccan, medinan

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

    return (
        <Layout>
            <PageHero 
                ar="القرآن الكريم" 
                title="আল-কুরআন" 
                sub="পবিত্র কুরআন শরীফ — ১১৪টি সূরার সহজ ও সুন্দর বাংলা অনুবাদ"
            >
                {/* Search Bar inside Hero */}
                <div className="mt-6 mx-auto max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="সূরা খুঁজুন (যেমন: ফাতিহা, fatiha, ১)..."
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-card/95 text-foreground placeholder:text-muted-foreground border border-gold/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold backdrop-blur-md text-sm md:text-base"
                        />
                    </div>
                </div>
            </PageHero>

            {/* Filter Tabs */}
            <div className="mx-auto max-w-6xl px-4 mt-6">
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setFilterType('all'); }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                                filterType === 'all'
                                    ? 'bg-primary text-gold'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            সকল সূরা ({surahs.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setFilterType('meccan'); }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                                filterType === 'meccan'
                                    ? 'bg-primary text-gold'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            মাক্কী
                        </button>
                        <button
                            type="button"
                            onClick={() => { hapticImpact(); setFilterType('medinan'); }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                                filterType === 'medinan'
                                    ? 'bg-primary text-gold'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            মাদানী
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        প্রদর্শন: <span className="font-bold text-primary">{filteredSurahs.length}টি</span> সূরা
                    </p>
                </div>
            </div>

            {/* Surah List */}
            <div className="mx-auto max-w-6xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">পবিত্র কুরআন লোড হচ্ছে...</p>
                    </div>
                ) : filteredSurahs.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
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
                                    className="rounded-2xl bg-card border border-border p-4 md:p-5 shadow-sm card-hover flex flex-col justify-between group"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-primary text-gold flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                                                {surah.number_bn || surah.number}
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors">
                                                    {surah.name_bn || surah.name_en}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {surah.name_en}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="font-arabic text-2xl text-primary font-bold text-right shrink-0">
                                            {surah.name_ar}
                                        </p>
                                    </div>

                                    <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                        <p className="truncate max-w-[65%]">
                                            {surah.meaning_bn ? `অর্থ: "${surah.meaning_bn}"` : ''}
                                        </p>
                                        <p className="font-medium text-primary">
                                            {revLabel} • {ayahCount} আয়াত
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
