import React from 'react';
import { Heart, Sparkles, BookOpen, ShieldCheck, Code2, ExternalLink, Globe } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';

export function AboutPage() {
    return (
        <Layout>
            <PageHero 
                ar="عن التطبيق" 
                title="হাসানা সম্পর্কে" 
                sub="আধুনিক প্রযুক্তি ও বিশুদ্ধ ইসলামিক জ্ঞানের এক অপূর্ব সমন্বয়" 
            />

            <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
                {/* Mission Card */}
                <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                        <Sparkles className="w-6 h-6 text-gold" />
                        <h2 className="text-xl font-bold">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
                    </div>
                    <p className="text-base text-foreground/90 leading-relaxed">
                        হাসানা (Hasana) একটি আধুনিক, দ্রুতগতির এবং সম্পূর্ণ বিজ্ঞাপনমুক্ত ইসলামিক প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য প্রতিটি মুসলিমের প্রাত্যহিক জীবনে পবিত্র কুরআনের সঠিক অর্থ, সহীহ হাদিসের প্রামাণ্য বাণী এবং মাসনুন দোয়াগুলো সহজে ও সাবলীলভাবে পৌঁছে দেওয়া।
                    </p>
                </div>

                {/* Features Highlights */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-card border border-border p-5">
                        <BookOpen className="w-6 h-6 text-primary mb-2" />
                        <h3 className="font-bold text-base mb-1">পবিত্র 114টি সূরা</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            সহজ সরল প্রমিত বাংলা অনুবাদ, বিশুদ্ধ আরবি মূল পাঠ্য ও পারা ভিত্তিক বিন্যাসসহ সম্পূর্ণ কুরআন।
                        </p>
                    </div>

                    <div className="rounded-2xl bg-card border border-border p-5">
                        <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                        <h3 className="font-bold text-base mb-1">15,000+ সহীহ হাদিস</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            ইসলামিক ফাউন্ডেশন বাংলাদেশ অনুযায়ী সহীহ বুখারী ও সহীহ মুসলিমের বিষয়ভিত্তিক সম্পূর্ণ হাদিস সংগ্রহ।
                        </p>
                    </div>
                </div>

                {/* Developer Credit - Apptimatic */}
                <div className="rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-gold flex items-center justify-center font-bold shadow-md shrink-0">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                                    কারিগরি তত্ত্বাবধান ও সফটওয়্যার ডেভেলপমেন্ট
                                </span>
                                <h3 className="text-xl font-black text-foreground mt-0.5">
                                    Developed by <span className="text-primary">Apptimatic</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    প্রিমিয়াম ওয়েব ও মোবাইল অ্যাপ্লিকেশন ডেভেলপমেন্ট এজেন্সি
                                </p>
                            </div>
                        </div>

                        <a
                            href="https://apptimatic.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-gold text-xs font-bold shadow-sm hover:opacity-95 transition shrink-0"
                        >
                            <Globe className="w-4 h-4" />
                            <span>apptimatic.com</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Official Facebook Community Card */}
                <div className="rounded-3xl bg-gradient-to-br from-card via-card to-[#1877F2]/5 border-2 border-[#1877F2]/25 p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-[#1877F2] uppercase tracking-wider block">
                                    অফিসিয়াল সোশ্যাল কমিউনিটি
                                </span>
                                <h3 className="text-xl font-black text-foreground mt-0.5">
                                    হাসানা ফেসবুক পেজ
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    নিয়মিত ইসলামিক পোস্ট, হাদিস ও আপডেট পেতে আমাদের অফিসিয়াল পেজে যুক্ত থাকুন
                                </p>
                            </div>
                        </div>

                        <a
                            href="https://www.facebook.com/page.hasana"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-md shadow-[#1877F2]/20 transition shrink-0"
                        >
                            <span>ফেসবুক পেজ দেখুন</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Translators Credit */}
                <div className="rounded-3xl bg-muted/60 border border-border p-6 md:p-8">
                    <h3 className="text-lg font-bold text-primary mb-3">অনুবাদ ও হাদিস কৃতজ্ঞতা</h3>
                    <div className="space-y-3 text-sm text-foreground/90">
                        <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="font-bold text-primary">ইসলামিক ফাউন্ডেশন বাংলাদেশ</p>
                            <p className="text-xs text-muted-foreground">সহীহ বুখারী ও সহীহ মুসলিমের প্রামাণ্য বাংলা সংস্করণ ও রেফারেন্স</p>
                        </div>
                        <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="font-bold text-primary">হাফেজ মুনির উদ্দীন আহমদ</p>
                            <p className="text-xs text-muted-foreground">কুরআন শরীফ সহজ সরল বাংলা অনুবাদ (সূরা 1–7 এবং 78–114)</p>
                        </div>
                        <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="font-bold text-primary">মাওলানা মুহিউদ্দীন খান</p>
                            <p className="text-xs text-muted-foreground">মারেফুল কুরআন বাংলা অনুবাদ (সূরা 8–77)</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
