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
    ExternalLink,
    Smartphone
} from 'lucide-react';
import { apiGet, apiPost } from '../api';
import { useToast } from '../components/AdminLayout';

const LOGO_TYPES = /^image\/(svg\+xml|png|jpeg|jpg|webp)$/;

// Brand images, each previewed on the background it is shown on
const BRAND_SLOTS = [
    {
        key: 'logo',
        title: 'ওয়েবসাইট লোগো — লাইট মোড',
        hint: 'ওয়েবসাইটের সবুজ হেডার ও মেনুতে দেখাবে। সাদা বা হালকা রঙের লোগো ভালো দেখাবে।',
        previewBg: '#125e54',
        accept: '.svg,.png,.jpg,.jpeg,.webp',
        types: LOGO_TYPES,
        maxMb: 3,
    },
    {
        key: 'logo_dark',
        title: 'ওয়েবসাইট লোগো — ডার্ক মোড',
        hint: 'ডার্ক মোডে ওয়েবসাইটে দেখাবে। না দিলে লাইট মোডের লোগো দেখাবে।',
        previewBg: '#0d1715',
        accept: '.svg,.png,.jpg,.jpeg,.webp',
        types: LOGO_TYPES,
        maxMb: 3,
    },
    {
        key: 'app_logo',
        title: 'অ্যাপ লোগো — লাইট মোড',
        hint: 'Android অ্যাপের হেডার ও মেনুতে দেখাবে। না দিলে ওয়েবসাইটের লোগো দেখাবে।',
        previewBg: '#125e54',
        accept: '.svg,.png,.jpg,.jpeg,.webp',
        types: LOGO_TYPES,
        maxMb: 3,
    },
    {
        key: 'app_logo_dark',
        title: 'অ্যাপ লোগো — ডার্ক মোড',
        hint: 'ডার্ক মোডে অ্যাপে দেখাবে। না দিলে ওয়েবসাইটের ডার্ক লোগো বা অ্যাপের লাইট লোগো দেখাবে।',
        previewBg: '#0d1715',
        accept: '.svg,.png,.jpg,.jpeg,.webp',
        types: LOGO_TYPES,
        maxMb: 3,
    },
    {
        key: 'favicon',
        title: 'ফেভিকন (ব্রাউজার ট্যাব আইকন)',
        hint: 'বর্গাকার ICO, PNG বা SVG — 512×512 সাইজ সবচেয়ে ভালো। ওয়েবসাইট ও অ্যাডমিন দুই জায়গাতেই দেখাবে।',
        previewBg: '#f8f7f2',
        accept: '.ico,.svg,.png,.jpg,.jpeg,.webp',
        types: /^image\/(x-icon|vnd\.microsoft\.icon|svg\+xml|png|jpeg|jpg|webp)$/,
        maxMb: 1,
        square: true,
    },
    {
        key: 'og_image',
        title: 'OG ইমেজ (সোশ্যাল শেয়ার প্রিভিউ)',
        hint: 'Facebook, WhatsApp ইত্যাদিতে ওয়েবসাইটের লিংক শেয়ার করলে এই ছবি দেখাবে। 1200×630 সাইজ, JPG বা PNG।',
        previewBg: '#e2dfd5',
        accept: '.png,.jpg,.jpeg,.webp',
        types: /^image\/(png|jpeg|jpg|webp)$/,
        maxMb: 5,
        wide: true,
    },
];

function BrandImageCard({ slot, currentUrl, isUploaded, file, previewUrl, removed, onSelect, onRemove }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const shownUrl = previewUrl || (removed ? null : currentUrl);

    const status = file
        ? `নতুন ফাইল: ${file.name}`
        : removed
            ? 'সংরক্ষণের পর ডিফল্টে ফিরে যাবে'
            : isUploaded ? 'আপলোড করা ছবি সক্রিয়' : 'ডিফল্ট দেখাচ্ছে';

    return (
        <div className={`rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] p-4 flex flex-col gap-3 ${slot.wide ? 'md:col-span-2' : ''}`}>
            <div>
                <h4 className="text-sm font-bold text-[#14302b] dark:text-[#e4ebe9]">{slot.title}</h4>
                <p className="text-[11px] leading-relaxed text-[#546e6a] dark:text-[#8aa39f] mt-0.5">{slot.hint}</p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={slot.accept}
                onChange={(e) => { onSelect(e.target.files[0]); e.target.value = ''; }}
                className="hidden"
            />

            {/* Preview on the background it is shown on — click or drop a file to replace */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); onSelect(e.dataTransfer.files?.[0]); }}
                onClick={() => inputRef.current?.click()}
                style={{ background: slot.previewBg }}
                className={`relative rounded-xl cursor-pointer flex items-center justify-center overflow-hidden border-2 border-dashed transition ${
                    isDragging ? 'border-[#dfab3b]' : 'border-transparent hover:border-[#dfab3b]/70'
                } ${slot.wide ? 'aspect-[1200/630] max-h-64' : 'h-32'}`}
            >
                {shownUrl ? (
                    <img
                        src={shownUrl}
                        alt={slot.title}
                        className={slot.wide ? 'w-full h-full object-cover' : slot.square ? 'w-16 h-16 object-contain' : 'max-h-20 max-w-[70%] object-contain'}
                    />
                ) : (
                    <span className="flex flex-col items-center gap-1.5 text-xs font-semibold text-[#8aa39f]">
                        <UploadCloud className="w-6 h-6" />
                        ছবি নেই
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-[#546e6a] dark:text-[#8aa39f] truncate">{status}</span>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center gap-1.5 text-[#125e54] dark:text-[#dfab3b] font-semibold hover:underline"
                    >
                        <Image className="w-3.5 h-3.5" />
                        <span>আপলোড</span>
                    </button>
                    {(file || (isUploaded && !removed)) && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold hover:underline"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>রিমুভ</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminSettings() {
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [serverInfo, setServerInfo] = useState({});

    // Form state
    const [siteName, setSiteName] = useState('Hasana');
    const [siteTitleBn, setSiteTitleBn] = useState('হাসানা');
    const [siteTagline, setSiteTagline] = useState('পবিত্র কুরআন, হাদিস ও দোয়া');
    const [developerName, setDeveloperName] = useState('Apptimatic');

    // Android app version (drives the in-app "new version" prompt)
    const [appVersion, setAppVersion] = useState({
        app_latest_version: '1.0',
        app_latest_build: 1,
        app_min_build: 1,
        app_update_message: '',
        app_store_url: '',
    });
    const [savedBuild, setSavedBuild] = useState(1);
    const [notifyAppUpdate, setNotifyAppUpdate] = useState(true);
    const setAppField = (key, value) => setAppVersion((prev) => ({ ...prev, [key]: value }));

    // Brand images: what is live now, plus pending uploads / removals keyed by slot
    const [brandAssets, setBrandAssets] = useState({});
    const [brandUploaded, setBrandUploaded] = useState({});
    const [brandFiles, setBrandFiles] = useState({});
    const [brandPreviews, setBrandPreviews] = useState({});
    const [brandRemoved, setBrandRemoved] = useState({});

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/settings');
            const s = res.settings || {};
            setSiteName(s.site_name || 'Hasana');
            setSiteTitleBn(s.site_title_bn || 'হাসানা');
            setSiteTagline(s.site_tagline || 'পবিত্র কুরআন, হাদিস ও দোয়া');
            setDeveloperName(s.developer_name || 'Apptimatic');
            setAppVersion({
                app_latest_version: s.app_latest_version || '1.0',
                app_latest_build: s.app_latest_build || 1,
                app_min_build: s.app_min_build || 1,
                app_update_message: s.app_update_message || '',
                app_store_url: s.app_store_url || '',
            });
            setSavedBuild(s.app_latest_build || 1);
            setBrandAssets(res.brand_assets || {});
            setBrandUploaded(res.brand_uploaded || {});
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

    const handleBrandSelect = (slot, file) => {
        if (!file) return;
        if (!file.type.match(slot.types)) {
            showToast(`এই ফাইল গ্রহণযোগ্য নয় — অনুমোদিত: ${slot.accept.replaceAll('.', ' ').toUpperCase()}`, 'error');
            return;
        }
        if (file.size > slot.maxMb * 1024 * 1024) {
            showToast(`ফাইলের আকার সর্বোচ্চ ${slot.maxMb} মেগাবাইট হতে পারবে`, 'error');
            return;
        }
        setBrandFiles((prev) => ({ ...prev, [slot.key]: file }));
        setBrandPreviews((prev) => ({ ...prev, [slot.key]: URL.createObjectURL(file) }));
        setBrandRemoved((prev) => ({ ...prev, [slot.key]: false }));
    };

    const handleBrandRemove = (slot) => {
        setBrandFiles((prev) => ({ ...prev, [slot.key]: null }));
        setBrandPreviews((prev) => ({ ...prev, [slot.key]: null }));
        // Discarding a new pick keeps the live image; otherwise the live upload is removed on save
        setBrandRemoved((prev) => ({ ...prev, [slot.key]: !brandFiles[slot.key] && !!brandUploaded[slot.key] }));
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
            Object.entries(appVersion).forEach(([key, value]) => formData.append(key, value ?? ''));
            formData.append('notify_app_update', notifyAppUpdate ? '1' : '0');

            BRAND_SLOTS.forEach(({ key }) => {
                if (brandRemoved[key]) {
                    formData.append(`remove_${key}`, '1');
                } else if (brandFiles[key]) {
                    formData.append(key, brandFiles[key]);
                }
            });

            const res = await apiPost('/admin/settings', formData);
            showToast(res.message || 'সকল সেটিংস এবং ব্র্যান্ড লোগো সফলভাবে সংরক্ষণ করা হয়েছে!');
            if (res.settings?.app_latest_build) {
                setSavedBuild(res.settings.app_latest_build);
            }

            if (res.brand_assets) {
                setBrandAssets(res.brand_assets);
                setBrandUploaded(res.brand_uploaded || {});
                setBrandFiles({});
                setBrandPreviews({});
                setBrandRemoved({});
                if (window.AdminConfig) {
                    window.AdminConfig.logoUrl = res.logo_url;
                    window.AdminConfig.brand = res.brand_assets;
                }
                window.dispatchEvent(new CustomEvent('hasana-logo-updated', { detail: res.brand_assets }));
            }
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

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
                                লোগো, ফেভিকন ও OG ইমেজ
                            </h3>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                অ্যাপ ও ওয়েবসাইটের জন্য আলাদা লোগো, ডার্ক মোড লোগো, ব্রাউজার আইকন ও শেয়ার ইমেজ — প্রিভিউতে ক্লিক বা ফাইল টেনে এনে আপলোড করুন
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BRAND_SLOTS.map((slot) => (
                            <BrandImageCard
                                key={slot.key}
                                slot={slot}
                                currentUrl={brandAssets[slot.key]}
                                isUploaded={!!brandUploaded[slot.key]}
                                file={brandFiles[slot.key]}
                                previewUrl={brandPreviews[slot.key]}
                                removed={!!brandRemoved[slot.key]}
                                onSelect={(file) => handleBrandSelect(slot, file)}
                                onRemove={() => handleBrandRemove(slot)}
                            />
                        ))}
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

                {/* 3. Android App Version & Update Prompt */}
                <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2dfd5] dark:border-[#233e38]">
                        <div className="w-10 h-10 rounded-xl bg-[#dfab3b]/15 text-[#dfab3b] flex items-center justify-center">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                অ্যান্ড্রয়েড অ্যাপ ভার্সন ও আপডেট নোটিফিকেশন
                            </h3>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                Play Store-এ নতুন ভার্সন প্রকাশের পর এখানে বিল্ড নম্বর বাড়ান — ব্যবহারকারীরা অ্যাপে আপডেট করার বার্তা পাবেন
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                সর্বশেষ ভার্সন নাম (versionName)
                            </label>
                            <input
                                type="text"
                                value={appVersion.app_latest_version}
                                onChange={(e) => setAppField('app_latest_version', e.target.value)}
                                placeholder="1.1"
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                ব্যবহারকারীকে দেখানো ভার্সন, যেমন 1.1
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                সর্বশেষ বিল্ড নম্বর (versionCode) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={appVersion.app_latest_build}
                                onChange={(e) => setAppField('app_latest_build', e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                android/app/build.gradle-এর versionCode — এর চেয়ে পুরনো অ্যাপে আপডেট বার্তা দেখাবে
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                ন্যূনতম বিল্ড নম্বর (বাধ্যতামূলক আপডেট) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={appVersion.app_min_build}
                                onChange={(e) => setAppField('app_min_build', e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                            <span className="text-[10px] text-[#546e6a] block mt-1">
                                এর চেয়ে পুরনো অ্যাপ আপডেট না করে ব্যবহার করা যাবে না
                            </span>
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                আপডেট বার্তা (ঐচ্ছিক)
                            </label>
                            <input
                                type="text"
                                value={appVersion.app_update_message}
                                onChange={(e) => setAppField('app_update_message', e.target.value)}
                                placeholder="যেমন: অফলাইনে কুরআন পড়া ও নতুন নোটিফিকেশন সুবিধা যোগ হয়েছে"
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-2">
                                Play Store লিংক
                            </label>
                            <input
                                type="url"
                                value={appVersion.app_store_url}
                                onChange={(e) => setAppField('app_store_url', e.target.value)}
                                placeholder="https://play.google.com/store/apps/details?id=com.hasanaa.app"
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        {Number(appVersion.app_latest_build) > Number(savedBuild) && (
                            <label className="md:col-span-3 flex items-center gap-2.5 text-xs font-semibold text-[#14302b] dark:text-[#e4ebe9] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notifyAppUpdate}
                                    onChange={(e) => setNotifyAppUpdate(e.target.checked)}
                                    className="w-4 h-4 accent-[#125e54]"
                                />
                                সংরক্ষণের পর সকল অ্যাপ ব্যবহারকারীকে "নতুন ভার্সন এসেছে" পুশ নোটিফিকেশন পাঠান
                            </label>
                        )}
                    </div>
                </div>

                {/* 4. Server & System Environment */}
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
