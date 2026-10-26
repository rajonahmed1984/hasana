import React, { useState, useEffect } from 'react';
import { Bookmark, Share2, Loader2, Heart, Check } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { TextSettingsBar, useArabicSettings } from '../components/TextSettingsBar';
import { hapticImpact, nativeShare } from '../native';

const curatedDuas = [
    {
        id: 'd1',
        title: 'ঘুমানোর দোয়া',
        text_ar: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'বিসমিকাল্লাহুম্মা আমূতু ওয়া আহ্ইয়া',
        text_bn: 'হে আল্লাহ, আপনার নামেই আমি মৃত্যুবরণ করি (ঘুমাই) এবং আপনার নামেই জীবিত হই (জাগ্রত হই)।',
        reference: 'সহীহ বুখারী, হাদিস নং ৬৩২৪',
        category: 'দৈনন্দিন দোয়া',
    },
    {
        id: 'd2',
        title: 'ঘুম থেকে উঠার দোয়া',
        text_ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'আলহামদু লিল্লাহিল্লাযী আহ্ইয়ানা বা’দা মা আমাতানা ওয়া ইলাইহিন নুশূর',
        text_bn: 'সকল প্রশংসা আল্লাহর, যিনি মৃত্যুর পর আমাদের পুনরায় জীবন দান করলেন এবং তাঁর নিকটেই সকলের পুনরুত্থান।',
        reference: 'সহীহ বুখারী, হাদিস নং ৬৩১২',
        category: 'দৈনন্দিন দোয়া',
    },
    {
        id: 'd3',
        title: 'খাবার শুরুর দোয়া',
        text_ar: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        transliteration: 'বিসমিল্লাহি ওয়া ‘আলা বারাকাতিল্লাহ',
        text_bn: 'আল্লাহর নামে এবং আল্লাহর বরকতের সাথে খাওয়া শুরু করছি।',
        reference: 'মুস্তাদরাক হাকিম, হাদিস নং ৭১১১',
        category: 'দৈনন্দিন দোয়া',
    },
    {
        id: 'd4',
        title: 'খাবার শেষের দোয়া',
        text_ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'আলহামদু লিল্লাহিল্লাযী আত’আমানা ওয়া সাকানা ওয়া জা’আলানা মুসলিমীন',
        text_bn: 'সকল প্রশংসা আল্লাহর, যিনি আমাদের পানাহার করিয়েছেন এবং মুসলিম বানিয়েছেন।',
        reference: 'আবু দাউদ, হাদিস নং ৩৮৫০',
        category: 'দৈনন্দিন দোয়া',
    },
    {
        id: 'd5',
        title: 'দুনিয়া ও আখিরাতের সার্বিক কল্যাণ',
        text_ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'রাব্বানা আতিনা ফিদ-দুনইয়া হাসানাতাও ওয়া ফিল-আখিরাতি হাসানাতাও ওয়া কিনা আযাবান নার',
        text_bn: 'হে আমাদের পালনকর্তা! আমাদের দুনিয়াতেও কল্যাণ দান করুন এবং আখিরাতেও কল্যাণ দান করুন এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করুন।',
        reference: 'সূরা আল-বাকারা, ২:২০১',
        category: 'কুরআনী দোয়া',
    },
    {
        id: 'd6',
        title: 'হেদায়েত ও তাকওয়া লাভের দোয়া',
        text_ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
        transliteration: 'আল্লাহুম্মা ইন্নি আসআলুকাল হুদা ওয়াত-তুকা ওয়াল ‘আফাফা ওয়াল গিনা',
        text_bn: 'হে আল্লাহ! আমি আপনার নিকট প্রার্থনা করি সুপথ, তাকওয়া, পবিত্রতা ও প্রাচুর্য।',
        reference: 'সহীহ মুসলিম, হাদিস নং ২৭২৫',
        category: 'মাগফিরাত ও ক্ষমা',
    },
    {
        id: 'd7',
        title: 'কঠিন কাজ সহজ ও অন্তর প্রশান্তির দোয়া',
        text_ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        transliteration: 'রাব্বিশ রাহলি সাদরি, ওয়া ইয়াসসির লি আমরি',
        text_bn: 'হে আমার পালনকর্তা! আমার বক্ষ প্রশস্ত করে দিন এবং আমার কাজকে সহজ করে দিন।',
        reference: 'সূরা ত্বা-হা, ২০:২৫-২৬',
        category: 'কুরআনী দোয়া',
    },
];

export function DuasPage() {
    const [duas, setDuas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('hasana-dua-bookmarks') || '[]');
        } catch {
            return [];
        }
    });

    const textSettings = useArabicSettings();

    useEffect(() => {
        const fetchDuas = async () => {
            try {
                const res = await fetch('/api/duas?per_page=50');
                if (res.ok) {
                    const json = await res.json();
                    const apiDuas = (json.data || []).map((d) => ({
                        id: d.id,
                        title: d.title,
                        text_ar: d.arabic_text || d.text_ar || '',
                        transliteration: d.transliteration || '',
                        text_bn: d.bangla_meaning || d.text_bn || d.meaning || '',
                        reference: d.reference || '',
                        category: d.category?.name || 'দোয়া',
                    }));
                    const combined = [...apiDuas, ...curatedDuas];
                    setDuas(combined);
                    const cats = Array.from(new Set(combined.map((d) => d.category).filter(Boolean)));
                    setCategories(cats);
                } else {
                    setDuas(curatedDuas);
                    setCategories(Array.from(new Set(curatedDuas.map((d) => d.category))));
                }
            } catch {
                setDuas(curatedDuas);
                setCategories(Array.from(new Set(curatedDuas.map((d) => d.category))));
            } finally {
                setLoading(false);
            }
        };

        fetchDuas();
    }, []);

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

    const handleShare = async (dua) => {
        hapticImpact();
        const result = await nativeShare({
            title: `দোয়া: ${dua.title}`,
            text: `${dua.text_ar}\n\nউচ্চারণ: ${dua.transliteration}\n\nঅর্থ: ${dua.text_bn}\n\n— ${dua.reference || 'হাসানা অ্যাপ'}`,
            url: window.location.href,
        });
        if (result === 'copied') {
            setCopiedId(dua.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const filteredDuas = activeCategory === 'all'
        ? duas
        : duas.filter((d) => d.category === activeCategory);

    return (
        <Layout>
            <PageHero 
                ar="الأدعية النبوية" 
                title="দোয়া সমূহ" 
                sub="দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া, জিকির ও কুরআনী মোনাজাত" 
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
                        সকল দোয়া ({duas.length})
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

            {/* Duas Grid */}
            <div className="mx-auto max-w-6xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">দোয়া লোড হচ্ছে...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {filteredDuas.map((item, idx) => {
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
        </Layout>
    );
}
