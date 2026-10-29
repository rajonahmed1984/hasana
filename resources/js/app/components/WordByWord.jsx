import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Word-by-word Bangla meaning of an ayah (served by our API from quran.com and cached there;
// if our server can't reach quran.com, it is fetched from quran.com directly)
const cache = new Map();

const fromServer = async (surah, ayah) => {
    const res = await fetch(`/api/quran/words/${surah}/${ayah}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error();
    return (await res.json()).words || [];
};

const fromQuranCom = async (surah, ayah) => {
    const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?language=bn&words=true&word_fields=text_uthmani`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    return (json.verse?.words || [])
        .filter((w) => w.char_type_name === 'word')
        .map((w) => ({ ar: w.text_uthmani || w.text || '', bn: w.translation?.text || '', tr: w.transliteration?.text || '' }));
};

export function WordByWord({ surah, ayah }) {
    const key = `${surah}:${ayah}`;
    const [words, setWords] = useState(() => cache.get(key) || null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cache.has(key)) return;
        let cancelled = false;
        setError(null);
        fromServer(surah, ayah)
            .catch(() => fromQuranCom(surah, ayah))
            .then((list) => {
                cache.set(key, list);
                if (!cancelled) setWords(list);
            })
            .catch(() => {
                if (cancelled) return;
                setError(navigator.onLine
                    ? 'শব্দার্থ এখন লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।'
                    : 'শব্দার্থ দেখতে ইন্টারনেট সংযোগ প্রয়োজন।');
            });
        return () => { cancelled = true; };
    }, [key]);

    if (error) {
        return <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 rounded-xl px-3 py-2">{error}</p>;
    }

    if (!words) {
        return (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" /> শব্দার্থ লোড হচ্ছে...
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-muted/60 border border-border/60 p-3">
            <div className="flex flex-wrap gap-2" dir="rtl">
                {words.map((w, i) => (
                    <div key={i} className="rounded-xl bg-card border border-border/60 px-2.5 py-1.5 text-center min-w-[64px]">
                        <p className="font-arabic text-xl text-primary font-bold leading-relaxed">{w.ar}</p>
                        <p className="text-xs text-foreground leading-snug" dir="ltr">{w.bn}</p>
                        {w.tr && <p className="text-[10px] text-muted-foreground italic" dir="ltr">{w.tr}</p>}
                    </div>
                ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">শব্দার্থের উৎস: quran.com</p>
        </div>
    );
}
