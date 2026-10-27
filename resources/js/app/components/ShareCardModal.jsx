import React, { useState, useRef } from 'react';
import { 
    X, 
    Download, 
    Share2, 
    Copy, 
    Check, 
    Sparkles, 
    Image as ImageIcon,
    Palette,
    Eye
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { hapticImpact, nativeShare } from '../native';

const THEMES = [
    {
        id: 'emerald',
        name: 'এমারেল্ড রয়্যাল',
        bg: 'from-[#0f4a34] via-[#0b3827] to-[#062419]',
        cardBg: 'linear-gradient(145deg, #0f4a34 0%, #092c1f 100%)',
        border: 'border-amber-400/50',
        innerBorder: 'rgba(251, 191, 36, 0.3)',
        accent: 'text-amber-300',
        bismillah: 'text-amber-200/90',
        arabic: 'text-amber-100',
        translit: 'text-emerald-200/85',
        translation: 'text-white',
        refBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
        brandText: 'text-amber-300',
        swatch: 'bg-[#0f4a34] border-amber-400',
    },
    {
        id: 'midnight',
        name: 'মিডনাইট ডার্ক',
        bg: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
        cardBg: 'linear-gradient(145deg, #1e293b 0%, #090d16 100%)',
        border: 'border-amber-500/40',
        innerBorder: 'rgba(245, 158, 11, 0.25)',
        accent: 'text-amber-400',
        bismillah: 'text-amber-300/85',
        arabic: 'text-white',
        translit: 'text-slate-300/80',
        translation: 'text-slate-100',
        refBg: 'bg-slate-800/90 text-amber-300 border-slate-700',
        brandText: 'text-amber-400',
        swatch: 'bg-[#090d16] border-amber-500',
    },
    {
        id: 'sunset',
        name: 'গোল্ডেন আম্বার',
        bg: 'from-[#78350f] via-[#572208] to-[#290d02]',
        cardBg: 'linear-gradient(145deg, #78350f 0%, #3a1303 100%)',
        border: 'border-amber-300/60',
        innerBorder: 'rgba(252, 211, 77, 0.35)',
        accent: 'text-amber-200',
        bismillah: 'text-amber-200/90',
        arabic: 'text-amber-100',
        translit: 'text-amber-200/80',
        translation: 'text-amber-50',
        refBg: 'bg-amber-500/25 text-amber-200 border-amber-300/40',
        brandText: 'text-amber-300',
        swatch: 'bg-[#78350f] border-amber-300',
    },
    {
        id: 'cream',
        name: 'ভিন্টেজ পার্চমেন্ট',
        bg: 'from-[#fdfbf7] via-[#f7f2e7] to-[#ede3d1]',
        cardBg: 'linear-gradient(145deg, #fefce8 0%, #f4ede0 100%)',
        border: 'border-[#0f4a34]/40',
        innerBorder: 'rgba(15, 74, 52, 0.25)',
        accent: 'text-[#0f4a34]',
        bismillah: 'text-[#0f4a34]/85',
        arabic: 'text-[#092c1f]',
        translit: 'text-[#0f4a34]/75',
        translation: 'text-slate-800',
        refBg: 'bg-[#0f4a34]/10 text-[#0f4a34] border-[#0f4a34]/30',
        brandText: 'text-[#0f4a34]',
        swatch: 'bg-[#f4ede0] border-[#0f4a34]',
    },
];

export function ShareCardModal({ isOpen, onClose, data }) {
    if (!isOpen || !data) return null;

    const [selectedThemeId, setSelectedThemeId] = useState('emerald');
    const [showBismillah, setShowBismillah] = useState(true);
    const [showTranslit, setShowTranslit] = useState(Boolean(data.transliteration));
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [toast, setToast] = useState(null);

    const cardRef = useRef(null);
    const theme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

    const showToastMessage = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    // Download Card as PNG
    const handleDownload = async () => {
        hapticImpact();
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 2.5,
                cacheBust: true,
            });

            const link = document.createElement('a');
            const safeName = (data.title || 'hasana-card').replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
            link.download = `${safeName}.png`;
            link.href = dataUrl;
            link.click();

            showToastMessage('ছবি সফলভাবে ডাউনলোড হয়েছে!');
        } catch (error) {
            console.error('Failed to generate image:', error);
            showToastMessage('ছবি তৈরি করা সম্ভব হয়নি।');
        } finally {
            setIsGenerating(false);
        }
    };

    // Share Card as Image File (or fallback)
    const handleShareImage = async () => {
        hapticImpact();
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            const blob = await toBlob(cardRef.current, {
                pixelRatio: 2.5,
                cacheBust: true,
            });

            if (!blob) throw new Error('Blob creation failed');

            const file = new File([blob], 'hasana-card.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: data.title || 'হাসানা ইসলামিক ফটো কার্ড',
                    text: `${data.title}\n\n— হাসানা ইসলামিক অ্যাপ`,
                });
                showToastMessage('কার্ডটি শেয়ার করা হয়েছে!');
            } else {
                // If direct file sharing is not supported, download the image and copy text
                const dataUrl = await toPng(cardRef.current, { pixelRatio: 2.5 });
                const link = document.createElement('a');
                link.download = `hasana_card.png`;
                link.href = dataUrl;
                link.click();

                await nativeShare({
                    title: data.title || 'হাসানা',
                    text: `${data.text_ar}\n\n${data.text_bn}\n\n— ${data.reference || ''}\n${data.url || window.location.href}`,
                    url: data.url || window.location.href,
                });
                showToastMessage('ছবি সেভ হয়েছে এবং লিঙ্ক শেয়ার খোলা হয়েছে');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
                // Fallback to text share
                await nativeShare({
                    title: data.title || 'হাসানা',
                    text: `${data.text_ar}\n\n${data.text_bn}\n\n— ${data.reference || ''}`,
                    url: data.url || window.location.href,
                });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Copy formatted text
    const handleCopyText = async () => {
        hapticImpact();
        const copyText = `${data.text_ar}\n\n${data.transliteration && showTranslit ? 'উচ্চারণ: ' + data.transliteration + '\n\n' : ''}অর্থ: ${data.text_bn}\n\n— ${data.reference || data.title}\n${data.url || window.location.href}`;
        try {
            await navigator.clipboard.writeText(copyText);
            setIsCopied(true);
            showToastMessage('টেক্সট কপি করা হয়েছে!');
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            showToastMessage('কপি করা সম্ভব হয়নি');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-lg bg-card text-card-foreground rounded-3xl shadow-2xl border border-border overflow-hidden z-10 flex flex-col my-auto animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gold border border-gold/30">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm sm:text-base leading-tight">ইসলামিক ফটো কার্ড তৈরি করুন</h3>
                            <p className="text-[11px] text-primary-foreground/80">পছন্দের ডিজাইন ও ফরম্যাটে শেয়ার বা ডাউনলোড করুন</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                        aria-label="বন্ধ করুন"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
                    {/* Theme Selector */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5 text-primary" /> কার্ডের থিম নির্বাচন করুন
                            </span>
                            <div className="flex items-center gap-2">
                                {data.transliteration && (
                                    <button
                                        type="button"
                                        onClick={() => setShowTranslit(!showTranslit)}
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${
                                            showTranslit 
                                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        উচ্চারণ {showTranslit ? '✓' : '✗'}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowBismillah(!showBismillah)}
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${
                                        showBismillah 
                                            ? 'bg-primary/10 text-primary border border-primary/20' 
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    বিসমিল্লাহ {showBismillah ? '✓' : '✗'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {THEMES.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => { hapticImpact(); setSelectedThemeId(t.id); }}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-semibold transition ${
                                        selectedThemeId === t.id
                                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 font-bold text-primary'
                                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    <span className={`w-6 h-6 rounded-full shadow-inner border-2 ${t.swatch}`} />
                                    <span className="truncate w-full text-center">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LIVE PHOTO CARD CONTAINER (Centered Content) */}
                    <div className="flex items-center justify-center py-1">
                        <div
                            ref={cardRef}
                            style={{ background: theme.cardBg }}
                            className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center transition-all select-none border-2 ${theme.border}`}
                        >
                            {/* Inner Ornamental Border Frame */}
                            <div 
                                className="absolute inset-3 rounded-2xl pointer-events-none"
                                style={{ border: `1px solid ${theme.innerBorder}` }}
                            />

                            {/* Corner Decorative Dots */}
                            <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                            <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-amber-400/60" />

                            {/* Card Header: Bismillah & Ornament */}
                            {showBismillah && (
                                <div className="mb-4 relative z-10">
                                    <p className={`font-arabic text-lg sm:text-xl font-bold tracking-wide ${theme.bismillah}`}>
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mt-1 opacity-60">
                                        <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
                                        <span className="text-[10px] text-amber-300">✦</span>
                                        <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
                                    </div>
                                </div>
                            )}

                            {/* Card Center: Arabic Content */}
                            {data.text_ar && (
                                <div className="my-2 relative z-10 w-full px-2">
                                    <p 
                                        className={`font-arabic text-2xl sm:text-3xl font-bold leading-loose text-center ${theme.arabic}`}
                                        dir="rtl"
                                    >
                                        {data.text_ar}
                                    </p>
                                </div>
                            )}

                            {/* Card Center: Transliteration */}
                            {showTranslit && data.transliteration && (
                                <p className={`text-xs sm:text-sm italic my-2 relative z-10 px-3 max-w-sm leading-relaxed ${theme.translit}`}>
                                    {data.transliteration}
                                </p>
                            )}

                            {/* Card Center: Bengali Translation */}
                            {data.text_bn && (
                                <div className="mt-2 mb-3 relative z-10 px-2 max-w-sm">
                                    <p className={`text-sm sm:text-base font-medium leading-relaxed ${theme.translation}`}>
                                        "{data.text_bn}"
                                    </p>
                                </div>
                            )}

                            {/* Card Footer: Divider, Reference & Branding */}
                            <div className="mt-4 pt-3 w-full border-t border-amber-400/20 relative z-10 flex flex-col items-center gap-2">
                                <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${theme.refBg}`}>
                                    {data.reference || data.title}
                                </span>

                                <div className="flex items-center justify-center gap-1.5 opacity-90 text-[11px] font-semibold">
                                    <span className="font-arabic text-sm font-bold text-amber-300">حسنة</span>
                                    <span className={`${theme.brandText}`}>• হাসানা ইসলামিক প্ল্যাটফর্ম</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="p-4 sm:p-5 border-t border-border bg-muted/40 flex items-center justify-between gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleCopyText}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition"
                    >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'কপি হয়েছে' : 'টেক্সট কপি'}</span>
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            type="button"
                            disabled={isGenerating}
                            onClick={handleDownload}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold active:scale-95 transition disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            <span>{isGenerating ? 'তৈরি হচ্ছে...' : 'ছবি ডাউনলোড'}</span>
                        </button>

                        <button
                            type="button"
                            disabled={isGenerating}
                            onClick={handleShareImage}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-gold font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>ছবি শেয়ার করুন</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Toast inside modal */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
}
