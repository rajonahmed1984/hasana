import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import { toBlob, getFontEmbedCSS } from 'html-to-image';
import { hapticImpact, isNative, shareImageNative } from '../native';
import { useCloseOnBack } from '../services/backHandler';

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
        translit: 'text-[#0f4a34]/75',
        translation: 'text-slate-800',
        refBg: 'bg-[#0f4a34]/10 text-[#0f4a34] border-[#0f4a34]/30',
        brandText: 'text-[#0f4a34]',
        swatch: 'bg-[#f4ede0] border-[#0f4a34]',
    },
];

const BN_FONT = "'Hind Siliguri', sans-serif";
const AR_FONT = "'Amiri', serif";

// Arabic letters and marks, except the ﷺ and ﷻ signs that Bangla text uses too
const AR = '[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDF9\\uFDFC-\\uFDFF\\uFE70-\\uFEFF]';
const ARABIC_RUN = new RegExp(`${AR}(?:[\\s\\p{Po}\\p{Pd}\\p{Pi}\\p{Pf}\\uFDFA\\uFDFB]*${AR})*`, 'gu');

// Many hadith translations quote the Arabic inline, but the card shows Bangla only
const banglaOnly = (text = '') => text
    .replace(ARABIC_RUN, '')
    .replace(/[(\[{]\s*[:;,.।\-]*\s*[)\]}]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s:;,.।\-)\]}]+/, '')
    .trim();

// getFontEmbedCSS fetches every font file, so it is computed once per page load
let fontEmbedCSSCache = null;

export function ShareCardModal({ isOpen, onClose, data }) {
    if (!isOpen || !data) return null;
    // Separate component so its hooks always run in the same order (and state resets on each open)
    return <ShareCardDialog onClose={onClose} data={data} />;
}

function ShareCardDialog({ onClose, data }) {
    useCloseOnBack(true, onClose);

    const [selectedThemeId, setSelectedThemeId] = useState('emerald');
    const [showBismillah, setShowBismillah] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [toast, setToast] = useState(null);

    const cardRef = useRef(null);
    const theme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];
    const cardText = banglaOnly(data.text_bn);

    const showToastMessage = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    // Render the card to a PNG blob, with the self-hosted fonts embedded so Bangla/Arabic text renders correctly
    const generateBlob = async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        if (!fontEmbedCSSCache) {
            fontEmbedCSSCache = await getFontEmbedCSS(cardRef.current);
        }
        const blob = await toBlob(cardRef.current, {
            pixelRatio: 3,
            cacheBust: true,
            fontEmbedCSS: fontEmbedCSSCache,
        });
        if (!blob) throw new Error('Blob creation failed');
        return blob;
    };

    const fileName = () => `hasana-${(data.reference || data.title || 'card').replace(/[^a-zA-Z0-9ঀ-৿]+/g, '-')}.png`;

    const downloadBlob = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName();
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    // Download Card as PNG (in the native app, the share sheet offers "Save")
    const handleDownload = async () => {
        hapticImpact();
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            const blob = await generateBlob();
            if (isNative()) {
                await shareImageNative(blob, fileName());
            } else {
                downloadBlob(blob);
                showToastMessage('ছবি সফলভাবে ডাউনলোড হয়েছে!');
            }
        } catch (error) {
            console.error('Failed to generate image:', error);
            showToastMessage('ছবি তৈরি করা সম্ভব হয়নি।');
        } finally {
            setIsGenerating(false);
        }
    };

    // Share only the card image — no extra text or link
    const handleShareImage = async () => {
        hapticImpact();
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            const blob = await generateBlob();

            if (isNative()) {
                await shareImageNative(blob, fileName());
                return;
            }

            const file = new File([blob], fileName(), { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
            } else {
                downloadBlob(blob);
                showToastMessage('এই ব্রাউজারে সরাসরি শেয়ার হয় না — ছবি ডাউনলোড হয়েছে');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
                showToastMessage('শেয়ার করা সম্ভব হয়নি।');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Copy formatted text
    const handleCopyText = async () => {
        hapticImpact();
        const copyText = `${data.text_ar}\n\nঅর্থ: ${data.text_bn}\n\n— ${data.reference || data.title}\n${data.url || window.location.href}`;
        try {
            await navigator.clipboard.writeText(copyText);
            setIsCopied(true);
            showToastMessage('টেক্সট কপি করা হয়েছে!');
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            showToastMessage('কপি করা সম্ভব হয়নি');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-lg bg-card text-card-foreground shadow-2xl border border-border overflow-hidden z-10 flex flex-col my-auto animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-gold border border-gold/30">
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
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
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
                                <button
                                    type="button"
                                    onClick={() => setShowBismillah(!showBismillah)}
                                    className={`px-2 py-0.5 text-[11px] font-semibold transition ${
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
                                    className={`flex flex-col items-center gap-1 p-2 border text-[11px] font-semibold transition ${
                                        selectedThemeId === t.id
                                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 font-bold text-primary'
                                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    <span className={`w-6 h-6 shadow-inner border-2 ${t.swatch}`} />
                                    <span className="truncate w-full text-center">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LIVE PHOTO CARD (this exact node is exported as the image) */}
                    <div className="flex items-center justify-center py-1">
                        <div
                            ref={cardRef}
                            style={{ background: theme.cardBg, fontFamily: BN_FONT }}
                            className={`w-full max-w-[400px] px-6 pt-7 pb-5 relative overflow-hidden flex flex-col items-center text-center select-none border-2 ${theme.border}`}
                        >
                            {/* Inner ornamental frame */}
                            <div
                                className="absolute inset-2.5 pointer-events-none"
                                style={{ border: `1px solid ${theme.innerBorder}` }}
                            />

                            {/* Bismillah */}
                            {showBismillah && (
                                <div className="relative z-10 mb-3">
                                    <p
                                        className={`whitespace-nowrap text-[17px] leading-relaxed font-bold ${theme.bismillah}`}
                                        style={{ fontFamily: AR_FONT }}
                                        dir="rtl"
                                    >
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mt-1 opacity-70">
                                        <span className="w-10 h-px bg-gradient-to-r from-transparent to-amber-400" />
                                        <span className={`text-[9px] ${theme.accent}`}>✦</span>
                                        <span className="w-10 h-px bg-gradient-to-l from-transparent to-amber-400" />
                                    </div>
                                </div>
                            )}

                            {/* Bangla translation */}
                            {cardText && (
                                <p
                                    className={`relative z-10 mt-3 w-full text-[15px] leading-[1.8] font-medium ${theme.translation}`}
                                    style={{ fontFamily: BN_FONT, textWrap: 'pretty' }}
                                >
                                    <span className={`${theme.accent} font-bold`}>“</span>
                                    {cardText}
                                    <span className={`${theme.accent} font-bold`}>”</span>
                                </p>
                            )}

                            {/* Footer: reference + branding */}
                            <div className="relative z-10 mt-5 w-full flex flex-col items-center gap-2.5">
                                <div className="flex items-center justify-center gap-2 w-full">
                                    <span className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
                                    <span
                                        className={`px-3 py-1 text-[12px] leading-snug font-semibold border ${theme.refBg}`}
                                        style={{ textWrap: 'balance' }}
                                    >
                                        {data.reference || data.title}
                                    </span>
                                    <span className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
                                </div>

                                <div className={`flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold opacity-85 ${theme.brandText}`}>
                                    <span className="text-[15px] leading-none font-bold" style={{ fontFamily: AR_FONT }}>حسنة</span>
                                    <span className="opacity-60">|</span>
                                    <span>হাসানা অ্যাপ</span>
                                    <span className="opacity-60">•</span>
                                    <span className="tracking-wide" style={{ fontFamily: 'system-ui, sans-serif' }}>hasanaa.com</span>
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
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-card border border-border text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition"
                    >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'কপি হয়েছে' : 'টেক্সট কপি'}</span>
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            type="button"
                            disabled={isGenerating}
                            onClick={handleDownload}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold active:scale-95 transition disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            <span>{isGenerating ? 'তৈরি হচ্ছে...' : 'ছবি ডাউনলোড'}</span>
                        </button>

                        <button
                            type="button"
                            disabled={isGenerating}
                            onClick={handleShareImage}
                            className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-gold font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>ছবি শেয়ার করুন</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Toast inside modal */}
            {toast && (
                <div className="fixed bottom-above-nav left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-5 py-2.5 shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>{toast}</span>
                </div>
            )}
        </div>,
        document.body
    );
}
