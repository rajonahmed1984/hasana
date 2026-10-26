import React, { useState } from 'react';
import { Moon, Sun, Type, Volume2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { hapticImpact } from '../native';

export function SettingsPage() {
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
            localStorage.getItem('hasana-theme') === 'dark';
    });

    const [reciter, setReciter] = useState(() => {
        return localStorage.getItem('hasana-reciter') || 'ar.alafasy';
    });

    const toggleTheme = () => {
        hapticImpact();
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('hasana-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('hasana-theme', 'light');
        }
    };

    const handleReciterChange = (e) => {
        hapticImpact();
        setReciter(e.target.value);
        localStorage.setItem('hasana-reciter', e.target.value);
    };

    const handleClearStorage = () => {
        hapticImpact();
        if (window.confirm('আপনি কি নিশ্চিত যে সকল সংরক্ষিত বুকমার্ক ও ক্যাশ মুছে ফেলতে চান?')) {
            localStorage.removeItem('hasana-bookmarks');
            localStorage.removeItem('hasana-hadith-bookmarks');
            localStorage.removeItem('hasana-dua-bookmarks');
            alert('ক্যাশ ও বুকমার্ক সফলভাবে মুছে ফেলা হয়েছে।');
        }
    };

    return (
        <Layout>
            <PageHero 
                ar="الإعدادات" 
                title="অ্যাপ সেটিংস" 
                sub="আপনার পছন্দ অনুযায়ী অ্যাপের প্রদর্শন ও কার্যকারিতা নিয়ন্ত্রণ করুন" 
            />

            <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
                {/* Theme Setting */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            {isDark ? <Moon className="w-5 h-5 text-gold" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-base">ডার্ক মোড (Dark Theme)</h3>
                            <p className="text-xs text-muted-foreground">রাতে বা কম আলোতে পড়ার সুবিধার জন্য</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${
                            isDark ? 'bg-primary' : 'bg-muted'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            isDark ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                </div>

                {/* Reciter Setting */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">কুরআন তেলাওয়াতকারী (ক্বারী)</h3>
                            <p className="text-xs text-muted-foreground">আপনার পছন্দের ক্বারীর কণ্ঠ নির্বাচন করুন</p>
                        </div>
                    </div>

                    <select
                        value={reciter}
                        onChange={handleReciterChange}
                        className="w-full mt-2 p-3 rounded-xl bg-muted border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="ar.alafasy">মিশারি রাশিদ আল-আফাসী (Mishary Rashid Alafasy)</option>
                        <option value="ar.abdulbasit">আব্দুল বাসিত আব্দুল সামাদ (Abdul Basit)</option>
                        <option value="ar.husary">মাহমুদ খলিল আল-হুসারী (Mahmoud Khalil Al-Husary)</option>
                        <option value="ar.minshawi">মোহাম্মদ সিদ্দিক আল-মিনশাবী (Mohamed Siddiq Al-Minshawi)</option>
                    </select>
                </div>

                {/* Cache & Data Setting */}
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">সংরক্ষিত ডাটা রিসেট</h3>
                            <p className="text-xs text-muted-foreground">বুকমার্ক ও স্থানীয় ক্যাশ ডাটা পরিষ্কার করুন</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClearStorage}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white font-bold text-xs transition"
                    >
                        ডাটা মুছুন
                    </button>
                </div>

                {/* App Info Card */}
                <div className="rounded-2xl bg-muted/60 border border-border p-5 text-center text-xs text-muted-foreground">
                    <p className="font-semibold text-primary text-sm mb-1">হাসানা ইসলামিক অ্যাপ্লিকেশন</p>
                    <p>ভার্সন: ২.৪ (নেটিভ স্পা + ক্যাপাসিটর মোবাইল রেডি)</p>
                    <p className="mt-1">সকল প্রশংসা একমাত্র মহান আল্লাহ রব্বুল আলামীনের জন্য।</p>
                </div>
            </div>
        </Layout>
    );
}
