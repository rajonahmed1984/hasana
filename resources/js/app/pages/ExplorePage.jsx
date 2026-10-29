import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Loader2, BookOpen, ScrollText, TriangleAlert, ChevronRight, Info } from 'lucide-react';
import { Layout } from '../components/Layout';
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
        setSearchParams({ q: value });
    };

    const terms = result ? Object.keys(result.terms || {}) : [];
    const total = result ? result.ayahs.length + result.hadiths.length + result.duas.length : 0;

    const sections = {
        ayah: (
            <Section key="ayah" icon={BookOpen} title="কুরআনের আয়াত" count={result?.ayahs.length}>
                {result?.ayahs.map((a) => (
                    <article key={a.id} className="rounded-2xl bg-card border border-gold/30 hover:border-gold/55 p-4 md:p-5 shadow-sm space-y-3">
                        <p className="font-arabic text-2xl text-gold font-bold text-right leading-loose drop-shadow-[0_1px_3px_rgba(212,175,55,0.3)]" dir="rtl">{a.text_ar}</p>
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
            <PageHero ar="اطلب العلم" title="জানুন" sub="প্রশ্ন বা বিষয় লিখুন (বাংলা বা Banglish) — কুরআন, হাদিস ও দোয়া থেকে মিলিয়ে দেখানো হবে" />

            <div className="mx-auto max-w-3xl px-4 -mt-6 relative z-10">
                <form
                    onSubmit={(e) => { e.preventDefault(); ask(input); }}
                    className="flex items-center gap-2 rounded-2xl bg-card border border-border shadow-md p-2"
                >
                    <Search className="w-5 h-5 text-muted-foreground ml-2 shrink-0" />
                    <input
                        type="search"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="যেমন: ধৈর্য নিয়ে কুরআনে কী বলা হয়েছে?"
                        maxLength={200}
                        className="flex-1 min-w-0 bg-transparent outline-none text-sm md:text-base py-2"
                    />
                    <button type="submit" disabled={loading} className="shrink-0 px-4 py-2 rounded-xl bg-primary text-gold font-bold text-sm native-press disabled:opacity-60">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'খুঁজুন'}
                    </button>
                </form>

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
                        <p className="text-sm">কুরআন, হাদিস ও দোয়া থেকে খোঁজা হচ্ছে...</p>
                    </div>
                )}

                {error && !loading && (
                    <p className="text-sm text-center text-red-600 py-10">{error}</p>
                )}

                {result && !loading && !error && (
                    <>
                        {result.is_fiqh && (
                            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex gap-3 text-amber-900 dark:text-amber-200">
                                <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm leading-relaxed">
                                    এটি একটি মাসআলা (বিধান) সংক্রান্ত প্রশ্ন। এর সঠিক উত্তরের জন্য একজন বিজ্ঞ আলেমের সাথে পরামর্শ করুন।
                                    নিচের আয়াত ও হাদিসগুলো শুধু পড়া ও জানার জন্য দেওয়া হলো।
                                </p>
                            </div>
                        )}

                        {Object.keys(result.converted || {}).length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                বাংলায় বুঝে খোঁজা হয়েছে:{' '}
                                {Object.entries(result.converted).map(([latin, bangla], i) => (
                                    <span key={latin}>
                                        {i > 0 && ', '}
                                        <span className="font-semibold text-foreground">{latin}</span> → <span className="font-semibold text-primary">{bangla}</span>
                                    </span>
                                ))}
                            </p>
                        )}

                        {total > 0 ? (
                            <p className="text-sm text-muted-foreground">
                                {result.topics.length > 0
                                    ? <>«{result.topics.join('», «')}» বিষয়ে </>
                                    : <>«{result.query}» এর জন্য </>}
                                কুরআন, হাদিস ও দোয়া থেকে {total}টি ফলাফল পাওয়া গেছে।
                            </p>
                        ) : (
                            <div className="text-center py-12">
                                <p className="font-semibold">কিছু পাওয়া যায়নি</p>
                                <p className="text-sm text-muted-foreground mt-1">অন্য শব্দে লিখে দেখুন, অথবা উপরের কোনো বিষয় বেছে নিন।</p>
                            </div>
                        )}

                        {order.map((kind) => sections[kind])}

                        {total > 0 && (
                            <p className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-4">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                ফলাফলগুলো আপনার লেখা শব্দ ও সংশ্লিষ্ট শব্দ মিলিয়ে হাসানার কুরআন, হাদিস ও দোয়ার সংগ্রহ থেকে খোঁজা হয়েছে —
                                কোনো ব্যাখ্যা বা মতামত যোগ করা হয়নি। প্রতিটি লেখার সাথে তার সূত্র দেওয়া আছে।
                            </p>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
