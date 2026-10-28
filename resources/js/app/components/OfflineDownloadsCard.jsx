import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Download, HardDrive, Loader2, ScrollText, Trash2, WifiOff } from 'lucide-react';
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
    { id: 'quran', title: 'আল-কুরআন', desc: '114টি সূরা, আরবি ও বাংলা অনুবাদ', size: '≈ 4 MB', icon: BookOpen, download: downloadQuran },
    { id: 'duas', title: 'দোয়া', desc: 'সকল দোয়া ও ক্যাটাগরি', size: '< 1 MB', icon: DuaHandsIcon, download: downloadDuas },
    { id: 'hadith', title: 'হাদিস', desc: 'সকল সংকলনের হাদিস', size: '≈ 40 MB', icon: ScrollText, download: downloadHadiths },
];

const formatDate = (ts) => new Date(ts).toLocaleDateString('bn-BD-u-nu-latn', { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * Settings card: download Quran / duas / hadith to read without internet, and remove them again.
 */
export function OfflineDownloadsCard() {
    const { confirm } = useModal();
    const [status, setStatus] = useState({});
    const [usageMb, setUsageMb] = useState(null);
    const [busy, setBusy] = useState(null); // { id, progress }
    const [error, setError] = useState(null);

    const refresh = async () => {
        setStatus(await getOfflineStatus());
        setUsageMb(await getStorageUsageMb());
    };

    useEffect(() => {
        refresh();
        // The app also downloads packs automatically in the background
        const onStatus = () => refresh();
        window.addEventListener('hasana-offline-status', onStatus);
        return () => window.removeEventListener('hasana-offline-status', onStatus);
    }, []);

    if (typeof window !== 'undefined' && !('caches' in window)) return null;

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
            message: 'মুছে ফেললে ইন্টারনেট ছাড়া এটি আর পড়া যাবে না। পরে আবার ডাউনলোড করা যাবে।',
            confirmText: 'হ্যাঁ, মুছুন',
            cancelText: 'বাতিল',
            variant: 'danger',
        });
        if (!ok) return;
        await removeOfflinePack(pack.id);
        refresh();
    };

    return (
        <div className="rounded-2xl bg-card border-2 border-gold/30 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary text-gold flex items-center justify-center">
                    <WifiOff className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-base">অফলাইনে পড়ুন</h3>
                    <p className="text-xs text-muted-foreground">একবার ডাউনলোড করুন, এরপর ইন্টারনেট ছাড়াই পড়তে পারবেন</p>
                </div>
            </div>

            {error && (
                <div className="text-xs px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-2.5">
                {PACKS.map((pack) => {
                    const Icon = pack.icon;
                    const saved = status[pack.id];
                    const isBusy = busy?.id === pack.id;

                    return (
                        <div key={pack.id} className="rounded-xl border border-border/70 bg-muted/30 p-3">
                            <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 shrink-0 text-primary" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm flex items-center gap-1.5">
                                        {pack.title}
                                        {saved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground truncate">
                                        {saved
                                            ? `ডাউনলোড • ${formatDate(saved.at)}`
                                            : `${pack.desc} • ${pack.size}`}
                                    </p>
                                </div>

                                {isBusy ? (
                                    <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-primary tabular-nums">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {Math.round(busy.progress * 100)}%
                                    </span>
                                ) : (
                                    <div className="shrink-0 flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            disabled={Boolean(busy)}
                                            onClick={() => handleDownload(pack)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-gold text-xs font-bold transition hover:brightness-110 disabled:opacity-50"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            {saved ? 'আপডেট' : 'ডাউনলোড'}
                                        </button>
                                        {saved && (
                                            <button
                                                type="button"
                                                disabled={Boolean(busy)}
                                                onClick={() => handleRemove(pack)}
                                                aria-label={`${pack.title} মুছুন`}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isBusy && (
                                <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-gold transition-all duration-300"
                                        style={{ width: `${Math.max(4, busy.progress * 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {usageMb !== null && (
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                    <HardDrive className="w-3.5 h-3.5" />
                    এই ডিভাইসে হাসানা ব্যবহার করছে প্রায় {usageMb} MB
                </p>
            )}
        </div>
    );
}
