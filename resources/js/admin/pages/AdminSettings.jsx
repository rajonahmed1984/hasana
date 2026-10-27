import React, { useState, useEffect, useRef } from 'react';
import { 
    Settings, 
    UploadCloud, 
    Image, 
    Trash2, 
    Save, 
    Server, 
    ShieldCheck, 
    CheckCircle2, 
    Sparkles, 
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import { apiGet, apiPost } from '../api';
import { useToast } from '../components/AdminLayout';

export default function AdminSettings() {
    const { showToast } = useToast();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverInfo, setServerInfo] = useState({});

    // Form state
    const [siteName, setSiteName] = useState('Hasana');
    const [siteTitleBn, setSiteTitleBn] = useState('হাসানা');
    const [siteTagline, setSiteTagline] = useState('পবিত্র কুরআন, হাদিস ও দোয়া');
    const [developerName, setDeveloperName] = useState('Apptimatic');

    // Logo state
    const [currentLogoUrl, setCurrentLogoUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [removeLogo, setRemoveLogo] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/settings');
            const s = res.settings || {};
            setSiteName(s.site_name || 'Hasana');
            setSiteTitleBn(s.site_title_bn || 'হাসানা');
            setSiteTagline(s.site_tagline || 'পবিত্র কুরআন, হাদিস ও দোয়া');
            setDeveloperName(s.developer_name || 'Apptimatic');
            setCurrentLogoUrl(res.logo_url || '/images/logo.svg');
            setServerInfo(res.server_info || {});
        } catch (err) {
            showToast(err.message || 'সেটিংস লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.match(/^image\/(svg\+xml|png|jpeg|jpg|webp)$/)) {
            showToast('শুধুমাত্র SVG, PNG, JPG বা WEBP ইমেজ ফাইল গ্রহণযোগ্য', 'error');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            showToast('ফাইলের আকার সর্বোচ্চ ৩ মেগাবাইট হতে পারবে', 'error');
            return;
        }
        setLogoFile(file);
        setRemoveLogo(false);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setPreviewUrl(null);
        setRemoveLogo(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('site_name', siteName);
            formData.append('site_title_bn', siteTitleBn);
            formData.append('site_tagline', siteTagline);
            formData.append('developer_name', developerName);

            if (removeLogo) {
                formData.append('remove_logo', '1');
            } else if (logoFile) {
                formData.append('logo', logoFile);
            }

            const res = await apiPost('/admin/settings', formData);
            showToast(res.message || 'সকল সেটিংস এবং ব্র্যান্ড লোগো সফলভাবে সংরক্ষণ করা হয়েছে!');

            if (res.logo_url) {
                setCurrentLogoUrl(res.logo_url);
                setPreviewUrl(null);
                setLogoFile(null);
                setRemoveLogo(false);
                if (window.AdminConfig) {
                    window.AdminConfig.logoUrl = res.logo_url;
                }
            }
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const displayLogo = previewUrl || (removeLogo ? '/images/logo.svg' : currentLogoUrl);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        ওয়েবসাইট কনফিগারেশন ও ব্র্যান্ড লোগো
                    </h2>
                    <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                        অ্যাপের নাম, স্লোগান, ব্র্যান্ড লোগো আপলোড ও ডেভেলপার ক্রেডেনশিয়াল পরিচালনা করুন
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Brand Logo Live Stage */}
                <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2dfd5] dark:border-[#233e38]">
                        <div className="w-10 h-10 rounded-xl bg-[#dfab3b]/15 text-[#dfab3b] flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                ব্র্যান্ড লোগো ও প্রিভিউ স্টেজ
                            </h3>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                রিয়েল-টাইম ড্র্যাগ অ্যান্ড ড্রপ লোগো আপলোডার (SVG, PNG, WEBP, JPG)
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Live Previews Stage (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            <span className="text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] block">
                                লাইভ স্টেজ প্রিভিউ (ডার্ক ও লাইট ব্যাকগ্রাউন্ড)
                            </span>

                            {/* Light preview card */}
                            <div className="p-6 rounded-2xl bg-[#f8f7f2] border border-[#e2dfd5] flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                                <span className="absolute top-3 left-3 text-[10px] font-bold text-[#546e6a] bg-white px-2 py-0.5 rounded-md">
                                    লাইট মোড
                                </span>
                                <div className="w-32 h-20 flex items-center justify-center p-2">
                                    <img 
                                        src={displayLogo} 
                                        alt="Logo Preview Light" 
                                        className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <span className="text-xs font-bold text-[#14302b] mt-2">
                                    {siteTitleBn} — {siteName}
                                </span>
                            </div>

                            {/* Dark preview card */}
                            <div className="p-6 rounded-2xl bg-[#0d1715] border border-[#233e38] flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                                <span className="absolute top-3 left-3 text-[10px] font-bold text-[#8aa39f] bg-[#1a2f2b] px-2 py-0.5 rounded-md">
                                    ডার্ক মোড
                                </span>
                                <div className="w-32 h-20 flex items-center justify-center p-2">
                                    <img 
                                        src={displayLogo} 
                                        alt="Logo Preview Dark" 
                                        className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <span className="text-xs font-bold text-[#e4ebe9] mt-2">
                                    {siteTitleBn} — {siteName}
                                </span>
                            </div>

                            {/* Logo action row */}
                            <div className="flex items-center justify-between text-xs pt-1">
                                <span className="text-[11px] text-[#546e6a] dark:text-[#8aa39f]">
                                    {logoFile ? `নতুন ফাইল: ${logoFile.name}` : (removeLogo ? 'ডিফল্ট লোগোতে রিসেট করা হবে' : 'বর্তমান লোগো সক্রিয়')}
                                </span>
                                {(logoFile || !removeLogo) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold hover:underline"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>লোগো রিমুভ করুন</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Dropzone (7 cols) */}
                        <div className="lg:col-span-7">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".svg,.png,.jpg,.jpeg,.webp"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="hidden"
                            />

                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                    isDragging 
                                        ? 'border-[#dfab3b] bg-[#dfab3b]/5 scale-99' 
                                        : 'border-[#e2dfd5] dark:border-[#233e38] hover:border-[#125e54] dark:hover:border-[#dfab3b] bg-[#f8f7f2]/50 dark:bg-[#162724]/40'
                                }`}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#125e54]/10 dark:bg-[#125e54]/20 text-[#125e54] dark:text-[#dfab3b] flex items-center justify-center mb-4 shadow-sm">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <h4 className="text-base font-bold text-[#14302b] dark:text-[#e4ebe9] mb-1">
                                    ক্লিক করুন অথবা নতুন লোগো ফাইল টেনে আনুন
                                </h4>
                                <p className="text-xs text-[#546e6a] dark:text-[#8aa39f] max-w-sm mb-4 leading-relaxed">
                                    স্বচ্ছ ব্যাকগ্রাউন্ডের SVG বা উচ্চ মানের PNG লোগো সবচেয়ে ভালো দেখাবে। ফাইল সাইজ সর্বোচ্চ ৩ MB.
                                </p>
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#125e54] text-white text-xs font-semibold shadow-md shadow-[#125e54]/20 hover:bg-[#187468] transition-colors">
                                    <Image className="w-4 h-4 text-[#dfab3b]" />
                                    <span>ফাইল ব্রাউজ করুন</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Site Identity Details */}
                <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2dfd5] dark:border-[#233e38]">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#125e54] dark:text-emerald-400 flex items-center justify-center">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                সাধারণ ওয়েবসাইট তথ্য
                            </h3>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                অ্যাপের শিরোনাম, বাংলা নাম, স্লোগান ও কপিরাইট তথ্য
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                সাইটের নাম (Site Name) *
                            </label>
                            <input
                                type="text"
                                required
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                সিস্টেমের অভ্যন্তরীণ ও ডিফল্ট ইংরেজি নাম
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                সাইটের বাংলা শিরোনাম (Title BN) *
                            </label>
                            <input
                                type="text"
                                required
                                value={siteTitleBn}
                                onChange={(e) => setSiteTitleBn(e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                হেডার এবং মূল অ্যাপে প্রদর্শিত বাংলা নাম
                            </span>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                সাইটের স্লোগান / ট্যাগলাইন *
                            </label>
                            <input
                                type="text"
                                required
                                value={siteTagline}
                                onChange={(e) => setSiteTagline(e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                অ্যাপের হোমপেজ ও মেটা ডেসক্রিপশনে প্রদর্শিত মূল ট্যাগলাইন
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                নির্মাতা সংস্থা / ডেভেলপার নাম *
                            </label>
                            <input
                                type="text"
                                required
                                value={developerName}
                                onChange={(e) => setDeveloperName(e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                "Developed by" সেকশনে প্রদর্শিত নাম (Apptimatic)
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Server & System Environment */}
                <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2dfd5] dark:border-[#233e38]">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                            <Server className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                সিস্টেম ও সার্ভার পরিবেশ
                            </h3>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                ব্যাকএন্ড ফ্রেমওয়ার্ক, ডাটাবেস ও স্টোরেজ অবস্থা
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                            <span className="text-[10px] font-bold text-[#546e6a] uppercase block mb-1">পিএইচপি সংস্করণ</span>
                            <span className="font-mono text-sm font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                PHP {serverInfo.php_version || '8.2+'}
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                            <span className="text-[10px] font-bold text-[#546e6a] uppercase block mb-1">লারাভেল সংস্করণ</span>
                            <span className="font-mono text-sm font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                v{serverInfo.laravel_version || '12.0+'}
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                            <span className="text-[10px] font-bold text-[#546e6a] uppercase block mb-1">ফ্রন্টএন্ড স্ট্যাক</span>
                            <span className="text-sm font-bold text-[#125e54] dark:text-[#dfab3b]">
                                React 19 + Tailwind
                            </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                            <span className="text-[10px] font-bold text-[#546e6a] uppercase block mb-1">এনভায়রনমেন্ট</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {serverInfo.app_env || 'production'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Submit Row */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#125e54] text-white text-sm font-bold hover:bg-[#187468] transition-all disabled:opacity-50 shadow-lg shadow-[#125e54]/25 active:scale-98"
                    >
                        {submitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-4 h-4 text-[#dfab3b]" />
                        )}
                        <span>সকল সেটিংস সংরক্ষণ করুন</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
