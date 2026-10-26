import React from 'react';
import { Heart, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
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
                        হাসানা (Hasana) একটি আধুনিক, দ্রুতগতির এবং বিজ্ঞাপনমুক্ত ইসলামিক প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য প্রতিটি মুসলিমের দৈনন্দিন জীবনে পবিত্র কুরআনের সঠিক অর্থ, সহীহ হাদিস এবং প্রয়োজনীয় দোয়াগুলো সহজে ও সাবলীলভাবে পৌঁছে দেওয়া।
                    </p>
                </div>

                {/* Features Highlights */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-card border border-border p-5">
                        <BookOpen className="w-6 h-6 text-primary mb-2" />
                        <h3 className="font-bold text-base mb-1">পবিত্র ১১৪টি সূরা</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            সহজ সরল প্রমিত বাংলা অনুবাদ, বিশুদ্ধ আরবি মূল পাঠ্য এবং অডিও তেলাওয়াতসহ সম্পূর্ণ কুরআন।
                        </p>
                    </div>

                    <div className="rounded-2xl bg-card border border-border p-5">
                        <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                        <h3 className="font-bold text-base mb-1">বিশুদ্ধ হাদিস ও রেফারেন্স</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            সহীহ বুখারী, সহীহ মুসলিমসহ প্রামাণ্য হাদিস গ্রন্থসমূহ থেকে যাচাইকৃত নির্বাচিত হাদিস।
                        </p>
                    </div>
                </div>

                {/* Translators Credit */}
                <div className="rounded-3xl bg-muted/70 border border-border p-6 md:p-8">
                    <h3 className="text-lg font-bold text-primary mb-3">অনুবাদ ও তাফসির কৃতজ্ঞতা</h3>
                    <div className="space-y-3 text-sm text-foreground/90">
                        <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="font-bold text-primary">হাফেজ মুনির উদ্দীন আহমদ</p>
                            <p className="text-xs text-muted-foreground">কুরআন শরীফ সহজ সরল বাংলা অনুবাদ (সূরা ১–৭ এবং ৭৮–১১৪)</p>
                        </div>
                        <div className="p-3 bg-card rounded-xl border border-border">
                            <p className="font-bold text-primary">মাওলানা মুহিউদ্দীন খান</p>
                            <p className="text-xs text-muted-foreground">মারেফুল কুরআন বাংলা অনুবাদ (সূরা ৮–৭৭)</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
