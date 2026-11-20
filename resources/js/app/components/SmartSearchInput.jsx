import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Clock, Sparkles, BookOpen, X, ArrowUpLeft } from 'lucide-react';
import { DuaHandsIcon } from './IslamicIcons';

const RECENT_KEY = 'hasana-recent-searches';
const MAX_RECENT = 6;

export const getRecentSearches = () => {
    try {
        const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        return Array.isArray(list) ? list.filter((s) => typeof s === 'string') : [];
    } catch {
        return [];
    }
};

export const addRecentSearch = (text) => {
    const value = text.trim();
    if (!value) return;
    try {
        const next = [value, ...getRecentSearches().filter((s) => s !== value)].slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
        // storage unavailable: recent list is a convenience only
    }
};

const removeRecentSearch = (text) => {
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(getRecentSearches().filter((s) => s !== text)));
    } catch {}
};

const TYPE_ICON = { topic: Sparkles, question: Search, dua: DuaHandsIcon, surah: BookOpen, recent: Clock };
const TYPE_LABEL = { topic: 'বিষয়', dua: 'দোয়া', surah: 'সূরা' };

/**
 * Search box with type-ahead suggestions from /api/explore/suggest and the user's recent searches.
 * onSearch(text) runs for a typed query or a picked suggestion; suggestions with a link (a surah) open it directly.
 */
export function SmartSearchInput({
    value,
    onChange,
    onSearch,
    loading = false,
    placeholder = 'যেমন: মন খারাপ হলে কী করব?',
    inputId,
    autoFocus = false,
    buttonClassName = 'bg-primary text-gold',
    className = '',
}) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [active, setActive] = useState(-1);
    const [recent, setRecent] = useState(getRecentSearches);
    const boxRef = useRef(null);

    const query = value.trim();

    // Debounced suggestions while typing
    useEffect(() => {
        if (query.length < 2) {
            setItems([]);
            setFetching(false);
            return;
        }
        const controller = new AbortController();
        setFetching(true);
        const timer = setTimeout(() => {
            fetch(`/api/explore/suggest?q=${encodeURIComponent(query)}`, {
                headers: { Accept: 'application/json' },
                signal: controller.signal,
            })
                .then((res) => (res.ok ? res.json() : { suggestions: [] }))
                .then((json) => { setItems(json.suggestions || []); setActive(-1); })
                .catch(() => {})
                .finally(() => !controller.signal.aborted && setFetching(false));
        }, 200);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [query]);

    // Close when tapping outside
    useEffect(() => {
        const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('pointerdown', onDown);
        return () => document.removeEventListener('pointerdown', onDown);
    }, []);

    const recentMatches = recent
        .filter((s) => !query || (s.toLowerCase().includes(query.toLowerCase()) && s !== query))
        .slice(0, query ? 2 : MAX_RECENT)
        .map((text) => ({ text, type: 'recent' }));
    const list = [...recentMatches, ...items.filter((s) => !recentMatches.some((r) => r.text === s.text))];

    const run = (item) => {
        setOpen(false);
        setActive(-1);
        if (item.link) {
            navigate(item.link);
            return;
        }
        onChange(item.text);
        addRecentSearch(item.text);
        setRecent(getRecentSearches());
        onSearch(item.text);
    };

    const submit = (e) => {
        e.preventDefault();
        if (active >= 0 && list[active]) {
            run(list[active]);
            return;
        }
        if (!query) return;
        run({ text: query });
    };

    const onKeyDown = (e) => {
        if (!open || !list.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => (i + 1) % list.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => (i <= 0 ? list.length - 1 : i - 1));
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    const showList = open && list.length > 0;

    return (
        <div ref={boxRef} className={`relative ${className}`}>
            <form
                onSubmit={submit}
                className={`flex items-center gap-2 rounded-2xl bg-card border border-border shadow-md p-1.5 md:p-2 focus-within:border-gold/60 focus-within:ring-2 focus-within:ring-gold/30 transition ${showList ? 'rounded-b-none' : ''}`}
            >
                {fetching
                    ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-gold ml-2 shrink-0 animate-spin" />
                    : <Search className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground ml-2 shrink-0" />}
                <input
                    id={inputId}
                    name="q"
                    type="search"
                    value={value}
                    autoFocus={autoFocus}
                    onChange={(e) => { onChange(e.target.value); setOpen(true); }}
                    onFocus={() => { setRecent(getRecentSearches()); setOpen(true); }}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    maxLength={200}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showList}
                    aria-autocomplete="list"
                    className="flex-1 min-w-0 bg-transparent outline-none text-sm md:text-base text-foreground py-2"
                />
                <button type="submit" disabled={loading} className={`shrink-0 px-4 py-2 rounded-xl font-bold text-sm native-press disabled:opacity-60 ${buttonClassName}`}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'খুঁজুন'}
                </button>
            </form>

            {showList && (
                <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-30 max-h-80 overflow-y-auto rounded-b-2xl bg-card border border-t-0 border-border shadow-xl py-1"
                >
                    {!query && (
                        <li className="px-4 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground">সাম্প্রতিক খোঁজ</li>
                    )}
                    {list.map((item, i) => {
                        const Icon = TYPE_ICON[item.type] || Search;
                        return (
                            <li key={`${item.type}-${item.text}`} role="option" aria-selected={i === active}>
                                <div
                                    className={`flex items-center gap-2.5 px-3 md:px-4 py-2.5 cursor-pointer ${i === active ? 'bg-primary/10' : 'hover:bg-muted/70'}`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => run(item)}
                                >
                                    <Icon className={`w-4 h-4 shrink-0 ${item.type === 'recent' ? 'text-muted-foreground' : 'text-gold'}`} />
                                    <span className="flex-1 min-w-0 text-sm text-foreground truncate">{item.text}</span>
                                    {TYPE_LABEL[item.type] && (
                                        <span className="shrink-0 text-[10px] font-semibold text-gold bg-gold/10 px-1.5 py-0.5 rounded-full">
                                            {TYPE_LABEL[item.type]}
                                        </span>
                                    )}
                                    {item.type === 'recent' ? (
                                        <button
                                            type="button"
                                            aria-label="মুছে ফেলুন"
                                            className="shrink-0 p-1 -m-1 text-muted-foreground hover:text-foreground"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSearch(item.text);
                                                setRecent(getRecentSearches());
                                            }}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label="বক্সে বসান"
                                            title="বক্সে বসান"
                                            className="shrink-0 p-1 -m-1 text-muted-foreground hover:text-foreground"
                                            onClick={(e) => { e.stopPropagation(); onChange(item.text); }}
                                        >
                                            <ArrowUpLeft className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
