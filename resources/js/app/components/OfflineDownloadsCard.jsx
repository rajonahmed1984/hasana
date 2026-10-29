import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Download, HardDrive, Loader2, RefreshCw, ScrollText, Trash2, WifiOff } from 'lucide-react';
import { DuaHandsIcon } from './IslamicIcons';
import { hapticImpact } from '../native';
import { useModal } from '../context/ModalContext';
import {
    getOfflineStatus,
    getStorageUsageMb,
    downloadQuran,
    downloadDuas,
    downloadHadiths,
    removeOfflinePack,
} from '../services/offlineStore';

const PACKS = [
    { id: 'quran', title: 'আল-কুরআন', desc: '১১৪টি সূরা, আরবি ও বাংলা অনুবাদ', size: '≈ ৪ MB', icon: BookOpen, download: downloadQuran },
    { id: 'duas', title: 'দোয়া', desc: 'সকল দোয়া ও ক্যাটাগরি', size: '< ১ MB', icon: DuaHandsIcon, download: downloadDuas },
    { id: 'hadith', title: 'হাদিস', desc: 'সকল সংকলনের হাদিস', size: '≈ ৪০ MB', icon: ScrollText, download: downloadHadiths },
];

const toBnDigits = (str) => {
    const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return String(str).replace(/[0-9]/g, (d) => bn[Number(d)]);
};

const formatDate = (ts) => {
    try {
        const d = new Date(ts);
        const day = toBnDigits(d.getDate());
        const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
        const month = months[d.getMonth()];
        const year = toBnDigits(d.getFullYear());
        return `${day} ${month}, ${year}`;
    } catch {
        return 'সংরক্ষিত';
    }
};

/**
 * Settings card: download Quran / duas / hadith to read without internet, and remove them again.
 * Shows high-visibility "ডাউনলোড সম্পন্ন" badges and emerald highlights when packs are stored locally.
 */
export function OfflineDownloadsCard() {
    const { confirm } = useModal();
    const [status, setStatus] = useState({});
    const [usageMb, setUsageMb] = useState(null);
    const [busy, setBusy] = useState(null); // { id, progress }
    const [error, setError] = useState(null);

    const refresh = async () => {
        const s = await getOfflineStatus();
        setStatus(s || {});
        const u = await getStorageUsageMb();
        setUsageMb(u);
    };

    useEffect(() => {
        refresh();
        const onStatus = () => refresh();
        window.addEventListener('hasana-offline-status', onStatus);
        return () => window.removeEventListener('hasana-offline-status', onStatus);
    }, []);

    const handleDownload = async (pack) => {
        hapticImpact();
        if (!navigator.onLine) {
            setError('ডাউনলোড করতে ইন্টারনেট সংযোগ প্রয়োজন।');
            return;
        }
        setError(null);
        setBusy({ id: pack.id, progress: 0 });
        try {
            await pack.download((progress) => setBusy({ id: pack.id, progress }));
        } catch (err) {
            setError(err.message || 'ডাউনলোড সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।');
        } finally {
            setBusy(null);
            refresh();
        }
    };

    const handleRemove = async (pack) => {
        hapticImpact();
        const ok = await confirm({
            title: `${pack.title} মুছে ফেলবেন?`,
            message: 'মুছে ফেললে ইন্টারনেট ছাড়া এটি আর অফলাইনে পড়া যাবে না। পরে আবার যেকোনো সময় ডাউনলোড করা যাবে।',
            confirmText: 'হ্যাঁ, মুছুন',
            cancelText: 'বাতিল',
            variant: 'danger',
        });
        if (!ok) return;
        await removeOfflinePack(pack.id);
        refresh();
    };

    return (
        <div className="rounded-2xl bg-card border-2 border-gold/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-gold" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">অফলাইনে পড়ুন</h3>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            ইন্টারনেট ছাড়া
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">একবার ডাউনলোড করুন, এরপর ইন্টারনেট ছাড়াই পড়তে পারবেন</p>
                </div>
            </div>

            {error && (
                <div className="text-xs px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {PACKS.map((pack) => {
                    const Icon = pack.icon;
                    const saved = status[pack.id];
                    const isBusy = busy?.id === pack.id;

                    return (
                        <div
                            key={pack.id}
                            className={`rounded-2xl border transition-all duration-300 p-3.5 ${
                                saved
                                    ? 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/30 shadow-xs'
                                    : 'border-border/70 bg-muted/20 hover:border-gold/30'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Pack Icon */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    saved
                                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                                        : 'bg-primary/10 text-primary border border-gold/20'
                                }`}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Title & Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-bold text-sm text-foreground">{pack.title}</p>
                                        {saved && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white dark:bg-emerald-600 shadow-xs animate-fade-scale">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                <span>ডাউনলোড সম্পন্ন</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        {saved ? (
                                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                                <span>✓ অফলাইনে প্রস্তুত</span>
                                                <span>•</span>
                                                <span>সাইজ: {pack.size}</span>
                                                <span>•</span>
                                                <span>{formatDate(saved.at)}</span>
                                            </span>
                                        ) : (
                                            <span>{pack.desc} • {pack.size}</span>
                                        )}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                {isBusy ? (
                                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 border border-gold/40 text-primary font-bold text-xs tabular-nums">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                                        <span>{toBnDigits(Math.round(busy.progress * 100))}%</span>
                                    </div>
                                ) : (
                                    <div className="shrink-0 flex items-center gap-1.5">
                                        {saved ? (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={Boolean(busy)}
                                                    onClick={() => handleDownload(pack)}
                                                    title="ডাটা আপডেট করুন"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold transition active:scale-95 cursor-pointer"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                    <span className="text-[11px]">আপডেট</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={Boolean(busy)}
                                                    onClick={() => handleRemove(pack)}
                                                    title={`${pack.title} মুছে ফেলুন`}
                                                    aria-label={`${pack.title} মুছুন`}
                                                    className="p-1.5 rounded-xl text-red-500 hover:text-white hover:bg-red-500 border border-red-500/20 transition active:scale-95 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={Boolean(busy)}
                                                onClick={() => handleDownload(pack)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl gold-gradient-btn text-primary text-xs font-bold shadow-sm transition active:scale-95 hover:brightness-105 cursor-pointer"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>ডাউনলোড</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Progress bar during download */}
                            {isBusy && (
                                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-gold to-amber-500 transition-all duration-300 rounded-full"
                                        style={{ width: `${Math.max(5, busy.progress * 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {usageMb !== null && (
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                    <HardDrive className="w-3.5 h-3.5 text-gold" />
                    <span>এই ডিভাইসে হাসানা ব্যবহার করছে প্রায় {toBnDigits(usageMb)} MB</span>
                </p>
            )}
        </div>
    );
}
