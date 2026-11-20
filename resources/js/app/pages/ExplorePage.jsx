import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Loader2, BookOpen, ScrollText, TriangleAlert, ChevronRight, Info, Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout';
import { SmartSearchInput, addRecentSearch } from '../components/SmartSearchInput';
import { PageHero } from '../components/PageHero';
import { DuaHandsIcon } from '../components/IslamicIcons';
import { hapticImpact } from '../native';

// Shown until /api/explore/topics answers (and when offline)
const DEFAULT_TOPICS = ['ধৈর্য', 'দুশ্চিন্তা ও মন খারাপ', 'রিজিক ও জীবিকা', 'বাবা-মা', 'তওবা ও ক্ষমা', 'শুকরিয়া ও কৃতজ্ঞতা'];

const EXAMPLES = ['ধৈর্য নিয়ে কুরআনে কী বলা হয়েছে?', 'রিজিক বৃদ্ধির দোয়া', 'রাগ নিয়ন্ত্রণ সম্পর্কে হাদিস', 'mon kharap hole ki korbo'];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Bangla letters, vowel signs and joiners: a highlight must cover the whole word, because splitting
// a word between elements leaves its vowel sign / conjunct broken (অন্তর|ে shows as "অন্তর ◌ে")
const BN_WORD_CHARS = '[\\u0980-\\u09E5\\u09F0-\\u09FF\\u200C\\u200D]*';

// Marks the words that contain a searched term
function Highlight({ text, terms }) {
    if (!text) return null;
    if (!terms.length) return text;
    const re = new RegExp(`(${BN_WORD_CHARS}(?:${terms.map(escapeRegex).join('|')})${BN_WORD_CHARS})`, 'gu');
    // With one capture group, split() puts the matches at the odd indexes
    return text.split(re).map((part, i) =>
        i % 2 === 1
            ? <mark key={i} className="bg-gold/30 text-inherit rounded px-0.5">{part}</mark>
            : <React.Fragment key={i}>{part}</React.Fragment>
    );
}

// Cut at a space, never inside a word
const clip = (text, limit) => {
    const cut = text.lastIndexOf(' ', limit);
    return text.slice(0, cut > limit * 0.6 ? cut : limit).trimEnd();
};

function ClampText({ text, terms, limit = 320 }) {
    const [open, setOpen] = useState(false);
    if (!text) return null;
    const long = text.length > limit;
    const shown = long && !open ? `${clip(text, limit)}…` : text;
    return (
        <>
            <Highlight text={shown} terms={terms} />
            {long && (
                <button type="button" onClick={() => setOpen(!open)} className="ml-1 text-primary text-xs font-semibold hover:underline">
                    {open ? 'কম দেখুন' : 'পুরোটা পড়ুন'}
                </button>
            )}
        </>
    );
}

function Section({ icon: Icon, title, count, children }) {
    if (!count) return null;
    return (
        <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-bold text-base md:text-lg">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0c4a3b] to-[#041a13] border border-gold/45 text-gold flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4 text-gold" />
                </span>
                <span className="text-foreground">{title}</span>
                <span className="text-xs font-semibold text-gold">({count}টি)</span>
            </h2>
            {children}
        </section>
    );
}

export function ExplorePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const [input, setInput] = useState(q);
    const [topics, setTopics] = useState(DEFAULT_TOPICS);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/explore/topics', { headers: { Accept: 'application/json' } })
            .then((res) => res.json())
            .then((json) => json.topics?.length && setTopics(json.topics.map((t) => t.label)))
            .catch(() => {});
    }, []);

    useEffect(() => {
        setInput(q);
        if (!q.trim()) {
            setResult(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);
        fetch(`/api/explore?q=${encodeURIComponent(q)}`, { headers: { Accept: 'application/json' } })
            .then(async (res) => {
                if (res.status === 429) throw new Error('খুব দ্রুত অনেকবার খোঁজা হয়েছে। এক মিনিট পর আবার চেষ্টা করুন।');
                if (!res.ok) throw new Error('খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
                return res.json();
            })
            .then((json) => !cancelled && setResult(json))
            .catch((err) => {
                if (cancelled) return;
                setError(navigator.onLine ? err.message : 'খুঁজতে ইন্টারনেট সংযোগ প্রয়োজন।');
            })
            .finally(() => !cancelled && setLoading(false));
        return () => { cancelled = true; };
    }, [q]);

    const ask = (text) => {
        const value = text.trim();
        if (!value) return;
        hapticImpact();
        addRecentSearch(value);
        setInput(value);
        setSearchParams({ q: value });
    };

    const terms = result ? Object.keys(result.terms || {}) : [];
    const total = result ? result.ayahs.length + result.hadiths.length + result.duas.length : 0;

    const sections = {
        ayah: (
            <Section key="ayah" icon={BookOpen} title="কুরআনের আয়াত" count={result?.ayahs.length}>
                {result?.ayahs.map((a) => (
                    <article key={a.id} className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-4 md:p-5 shadow-sm space-y-3">
                        <p className="font-quran text-2xl text-gold text-right leading-[2.1]" dir="rtl">{a.text_ar}</p>
                        <p className="text-sm md:text-base leading-relaxed text-foreground"><Highlight text={a.text_bn} terms={terms} /></p>
                        <Link to={a.link} className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
                            {a.reference} <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </article>
                ))}
            </Section>
        ),
        hadith: (
            <Section key="hadith" icon={ScrollText} title="হাদিস" count={result?.hadiths.length}>
                {result?.hadiths.map((h) => (
                    <article key={h.id} className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-4 md:p-5 shadow-sm space-y-2">
                        {h.category && (
                            <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">{h.category}</span>
                        )}
                        <p className="text-sm md:text-base leading-relaxed text-foreground"><ClampText text={h.text_bn} terms={terms} /></p>
                        <p className="text-xs text-muted-foreground">{h.reference}</p>
                    </article>
                ))}
            </Section>
        ),
        dua: (
            <Section key="dua" icon={DuaHandsIcon} title="দোয়া" count={result?.duas.length}>
                {result?.duas.map((d) => (
                    <article key={d.id} className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-4 md:p-5 shadow-sm space-y-2">
                        <h3 className="font-bold text-foreground text-base"><Highlight text={d.title} terms={terms} /></h3>
                        {d.text_ar && <p className="font-arabic text-2xl text-gold font-bold text-right leading-loose drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]" dir="rtl">{d.text_ar}</p>}
                        {d.transliteration && <p className="text-sm italic text-muted-foreground">{d.transliteration}</p>}
                        <p className="text-sm md:text-base leading-relaxed text-foreground"><Highlight text={d.text_bn} terms={terms} /></p>
                        {d.reference && <p className="text-xs text-gold font-medium">সূত্র: {d.reference}</p>}
                    </article>
                ))}
            </Section>
        ),
    };
    // The kind the question asks for ("...দোয়া", "হাদিসে ...") comes first
    const order = ['ayah', 'hadith', 'dua'];
    if (result?.focus) order.sort((a, b) => (b === result.focus) - (a === result.focus));

    return (
        <Layout>
            <PageHero ar="اطلب العلم" title="জানুন" sub="যেকোনোভাবে প্রশ্ন লিখুন (বাংলা, Banglish বা English) — প্রশ্ন বুঝে কুরআন, হাদিস ও দোয়া থেকে সঠিক ফলাফল দেখানো হবে" />

            <div className="mx-auto max-w-3xl px-4 -mt-6 relative z-10">
                <SmartSearchInput
                    value={input}
                    onChange={setInput}
                    onSearch={ask}
                    loading={loading}
                    placeholder="যেমন: ধৈর্য নিয়ে কুরআনে কী বলা হয়েছে?"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                    {topics.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => ask(t)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition native-press ${
                                q === t ? 'bg-primary text-gold border-primary' : 'bg-muted text-foreground/80 border-border hover:bg-primary/10 hover:text-primary'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-6 md:py-8 space-y-6">
                {!q && (
                    <div className="rounded-2xl bg-muted/60 border border-border/60 p-5 space-y-3">
                        <p className="font-semibold">যেভাবে জিজ্ঞেস করতে পারেন:</p>
                        <div className="flex flex-col gap-2">
                            {EXAMPLES.map((ex) => (
                                <button key={ex} type="button" onClick={() => ask(ex)} className="text-left text-sm text-primary hover:underline">
                                    “{ex}”
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm">প্রশ্নটি বুঝে কুরআন, হাদিস ও দোয়া থেকে খোঁজা হচ্ছে...</p>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-sm text-center text-red-600 py-10">{error}</p>
                )}

                {result && !loading && !error && (
                    <>
                        {result.ai?.understood && (
                            <div className="rounded-2xl bg-gradient-to-br from-[#0a4232] to-[#062b20] border border-gold/35 p-4 text-primary-foreground shadow-md">
                                <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-full">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI যা বুঝেছে
                                </p>
                                <p className="mt-2 text-sm md:text-base text-white leading-relaxed">{result.ai.understood}</p>
                                {result.ai.corrected_query && result.ai.corrected_query !== result.query && (
                                    <p className="mt-1.5 text-xs text-emerald-100/75">
                                        খোঁজা হয়েছে: <span className="font-semibold text-gold">{result.ai.corrected_query}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {result.is_fiqh && (
                            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex gap-3 text-amber-900 dark:text-amber-200">
                                <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm leading-relaxed">
                                    এটি একটি মাসআলা (বিধান) সংক্রান্ত প্রশ্ন। এর সঠিক উত্তরের জন্য একজন বিজ্ঞ আলেমের সাথে পরামর্শ করুন।
                                    নিচের আয়াত ও হাদিসগুলো শুধু পড়া ও জানার জন্য দেওয়া হলো।
                                </p>
                            </div>
                        )}

                        {!result.ai && result.converted_query && (
                            <p className="text-sm text-muted-foreground">
                                বাংলায় বুঝে খোঁজা হয়েছে:{' '}
                                <span className="font-semibold text-primary">“{result.converted_query}”</span>
                            </p>
                        )}

                        {total > 0 ? (
                            <p className="text-sm text-muted-foreground">
                                {result.topics.length > 0
                                    ? <>«{result.topics.join('», «')}» বিষয়ে </>
                                    : <>«{result.query}» এর জন্য </>}
                                কুরআন, হাদিস ও দোয়া থেকে {total}টি ফলাফল পাওয়া গেছে।
                                {' '}পুরো প্রশ্নের সাথে যেগুলো সবচেয়ে বেশি মেলে, সেগুলো আগে দেখানো হয়েছে।
                            </p>
                        ) : (
                            <div className="text-center py-12">
                                <p className="font-semibold">কিছু পাওয়া যায়নি</p>
                                <p className="text-sm text-muted-foreground mt-1">অন্য শব্দে লিখে দেখুন, অথবা উপরের কোনো বিষয় বেছে নিন।</p>
                            </div>
                        )}

                        {order.map((kind) => sections[kind])}

                        {result.ai?.related?.length > 0 && (
                            <section className="space-y-2">
                                <h2 className="text-sm font-bold text-foreground">আরও জানতে পারেন</h2>
                                <div className="flex flex-col gap-2">
                                    {result.ai.related.map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => ask(r)}
                                            className="flex items-center gap-2 text-left rounded-xl bg-card border border-border hover:border-gold/50 px-3.5 py-2.5 text-sm text-foreground native-press"
                                        >
                                            <Search className="w-4 h-4 text-gold shrink-0" />
                                            <span className="flex-1 min-w-0">{r}</span>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {total > 0 && (
                            <p className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-4">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                {result.ai
                                    ? 'AI শুধু আপনার প্রশ্ন বুঝে খোঁজার শব্দ বের করেছে ও ফলাফল সাজিয়েছে। দেখানো সব আয়াত, হাদিস ও দোয়া হাসানার যাচাইকৃত সংগ্রহ থেকে নেওয়া — AI কোনো ব্যাখ্যা বা মতামত যোগ করেনি। প্রতিটি লেখার সাথে তার সূত্র দেওয়া আছে।'
                                    : 'ফলাফলগুলো আপনার লেখা শব্দ ও সংশ্লিষ্ট শব্দ মিলিয়ে হাসানার কুরআন, হাদিস ও দোয়ার সংগ্রহ থেকে খোঁজা হয়েছে — কোনো ব্যাখ্যা বা মতামত যোগ করা হয়নি। প্রতিটি লেখার সাথে তার সূত্র দেওয়া আছে।'}
                            </p>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
