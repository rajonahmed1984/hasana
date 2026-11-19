import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Clock, ScrollText, Heart, Bell, Share2, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { nativeShare } from '../native';

// What a tapped notification opens: its full text, plus a link to the related page
const TYPES = {
    prayer: { ar: 'الصلاة', title: 'নামাজের ওয়াক্ত', icon: Clock, linkText: 'নামাজের সময়সূচি দেখুন', fallbackLink: '/prayer-times' },
    daily_ayah: { ar: 'آية اليوم', title: 'আজকের আয়াত', icon: BookOpen, linkText: 'সূরাটি পড়ুন', fallbackLink: '/quran' },
    daily_hadith: { ar: 'حديث اليوم', title: 'আজকের হাদিস', icon: ScrollText, linkText: 'আরও হাদিস পড়ুন', fallbackLink: '/hadith' },
    durood: { ar: 'الصلاة على النبي ﷺ', title: 'দুরূদ', icon: Heart, linkText: 'দোয়া ও দুরূদ দেখুন', fallbackLink: '/duas' },
};
const DEFAULT_TYPE = { ar: 'حَسَنَة', title: 'নোটিফিকেশন', icon: Bell, linkText: 'বিস্তারিত দেখুন', fallbackLink: '/' };

// Only follow links inside the app
const safeLink = (link) => (typeof link === 'string' && link.startsWith('/') && !link.startsWith('//') ? link : null);

export function NotificationPage() {
    const [params] = useSearchParams();
    const meta = TYPES[params.get('type')] || DEFAULT_TYPE;
    const title = params.get('title') || meta.title;
    const body = params.get('body') || '';
    const link = safeLink(params.get('link')) || meta.fallbackLink;
    const Icon = meta.icon;

    const share = () => nativeShare({ title, text: body, url: 'https://hasanaa.com' });

    return (
        <Layout>
            <PageHero ar={meta.ar} title={meta.title} />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <article className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">{title}</h2>
                    </div>

                    {body ? (
                        <p className="text-base md:text-lg text-foreground/90 leading-relaxed whitespace-pre-line">{body}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">এই নোটিফিকেশনের কোনো বিস্তারিত লেখা নেই।</p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                        {link !== '/' && (
                            <Link
                                to={link}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                            >
                                {meta.linkText}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                        {body && (
                            <button
                                type="button"
                                onClick={share}
                                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                            >
                                <Share2 className="w-4 h-4" />
                                শেয়ার করুন
                            </button>
                        )}
                    </div>
                </article>
            </div>
        </Layout>
    );
}
