import React from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, 
    ScrollText, 
    Clock, 
    Bookmark, 
    Share2, 
    Moon, 
    Bell, 
    WifiOff, 
    Search, 
    ShieldCheck, 
    Sparkles, 
    ArrowRight, 
    Heart, 
    Compass, 
    Smartphone,
    Award
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { DuaHandsIcon, KaabaIcon, TasbihIcon } from '../components/IslamicIcons';
import { hapticImpact } from '../native';

const FEATURE_CATEGORIES = [
    {
        categoryTitle: 'মূল ইবাদত ও দ্বীনি জ্ঞান',
        categoryDesc: 'দৈনন্দিন জীবনে কুরআন, সুন্নাহ ও ইবাদত পালনের অত্যাবশ্যকীয় মাধ্যম',
        items: [
            {
                title: 'আল-কুরআনুল কারীম',
                badge: 'সম্পূর্ণ কুরআন',
                badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                desc: '১১৪টি পূর্ণাঙ্গ সূরা, বিশুদ্ধ আরবি পাঠ্য, সহজ-সরল প্রমিত বাংলা অনুবাদ এবং আয়াতভিত্তিক অডিও তেলাওয়াত শোনার সুবিধা।',
                icon: BookOpen,
                to: '/quran',
                actionText: 'কুরআন পড়ুন',
            },
            {
                title: 'সহীহ হাদিস সম্ভার',
                badge: '১৫,০০০+ হাদিস',
                badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
                desc: 'সহীহ বুখারী ও সহীহ মুসলিমসহ প্রামাণ্য হাদিসের সুবিশাল সংকলন। অধ্যায় ও বিষয়ভিত্তিক সাজানো বিশুদ্ধ বর্ণনা।',
                icon: ScrollText,
                to: '/hadith',
                actionText: 'হাদিস দেখুন',
            },
            {
                title: 'মাসনুন দোয়া ও জিকির',
                badge: 'দৈনন্দিন দোয়া',
                badgeColor: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
                desc: 'সকাল-সন্ধ্যা, বিপদ-আপদ, সালাতের পর ও দৈনন্দিন জীবনের সকল বরকতময় মাসনুন দোয়ার আরবি, উচ্চারণ ও অর্থসহ সংকলন।',
                icon: DuaHandsIcon,
                to: '/duas',
                actionText: 'দোয়া সমূহ',
            },
            {
                title: 'নামাজের সঠিক সময়সূচী',
                badge: 'লাইভ ওয়াক্ত',
                badgeColor: 'bg-primary/15 text-primary border-primary/30',
                desc: 'স্বয়ংক্রিয় জিপিএস লোকেশন অনুযায়ী ফজর, যোহর, আসর, মাগরিব ও ইশার শুরু ও শেষের সময় এবং লাইভ ওয়াক্ত কাউন্টডাউন।',
                icon: Clock,
                to: '/prayer-times',
                actionText: 'সময়সূচী দেখুন',
            },
            {
                title: 'ডিজিটাল তসবিহ কাউন্টার',
                badge: 'ইন্টারেক্টিভ',
                badgeColor: 'bg-gold/20 text-gold border-gold/40',
                desc: 'সুবহানাল্লাহ, আলহামদুলিল্লাহসহ ৯টি খাঁটি জিকির, ৩৩/৯৯ টার্গেট সিলেক্টর, হ্যাপটিক ভাইব্রেশন ও স্বয়ংক্রিয় ল্যাপ ট্র্যাকার।',
                icon: TasbihIcon,
                to: '/tasbih',
                actionText: 'তসবিহ গণনা',
            },
            {
                title: 'উমরাহ পূর্ণাঙ্গ গাইড',
                badge: 'সচিত্র নির্দেশিকা',
                badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
                desc: 'ইহরাম পরিধান, তাওয়াফ, সা\'ঈ ও হালাল হওয়ার সহজ ধারাবাহিক নিয়মাবলী ও ঐতিহাসিক স্থানসমূহের তথ্য।',
                icon: KaabaIcon,
                to: '/umrah-guide',
                actionText: 'উমরা গাইড',
            },
        ],
    },
    {
        categoryTitle: 'স্মার্ট প্রযুক্তি ও আধুনিক সুবিধা',
        categoryDesc: 'আপনার পাঠ ও ব্যবহারের অভিজ্ঞতাকে স্বাচ্ছন্দ্যময় ও বরকতময় করতে উন্নত প্রযুক্তি',
        items: [
            {
                title: 'ইসলামিক প্রশ্ন ও অনুসন্ধান (জানুন)',
                badge: 'স্মার্ট সার্চ',
                badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
                desc: '"মন খারাপ হলে কী করব?" বা "রিজিক বৃদ্ধির দোয়া" লিখে অনুসন্ধান করলেই কুরআন ও হাদিস থেকে সরাসরি সমাধান খুঁজে পাওয়া যায়।',
                icon: Search,
                to: '/explore',
                actionText: 'প্রশ্ন করুন',
            },
            {
                title: 'অফলাইন মোড (ইন্টারনেট ছাড়া)',
                badge: 'অফলাইন সাপোর্ট',
                badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
                desc: 'একবার ডাউনলোড করে নিলে পরবর্তীতে ইন্টারনেট সংযোগ না থাকলেও পবিত্র কুরআন, হাদিস ও দোয়া নির্বিঘ্নে পড়া যায়।',
                icon: WifiOff,
                to: '/settings',
                actionText: 'অফলাইন ডাউনলোড',
            },
            {
                title: 'ওয়াক্ত ও সকালের আয়াত নোটিফিকেশন',
                badge: 'সতর্কবার্তা',
                badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
                desc: 'প্রতিটি ওয়াক্তের পূর্বে স্মরণ করিয়ে দেওয়া এবং প্রতিদিন সকালে একটি প্রেরণাদায়ী আয়াত নোটিফিকেশনের মাধ্যমে দিন শুরু করা।',
                icon: Bell,
                to: '/settings',
                actionText: 'নোটিফিকেশন সেটিংস',
            },
            {
                title: 'বুকমার্ক ও ব্যক্তিগত কালেকশন',
                badge: 'সংরক্ষণ',
                badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
                desc: 'যেকোনো আয়াত, হাদিস বা প্রিয় দোয়া এক ট্যাপে বুকমার্কে সংরক্ষণ করুন এবং পরবর্তীতে অফলাইনেও সহজেই খুঁজে নিন।',
                icon: Bookmark,
                to: '/bookmarks',
                actionText: 'বুকমার্ক দেখুন',
            },
            {
                title: 'আয়াত ও হাদিস ফটো কার্ড শেয়ার',
                badge: 'সোশ্যাল শেয়ার',
                badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                desc: 'পছন্দের আয়াত ও হাদিস দিয়ে মুহূর্তেই আকর্ষণীয় ইসলামিক ফটো কার্ড তৈরি করে ফেসবুক, হোয়াটসঅ্যাপ বা বন্ধুদের সাথে শেয়ার করুন।',
                icon: Share2,
                to: '/',
                actionText: 'হোমে শেয়ার করুন',
            },
            {
                title: 'ডার্ক মোড ও আরামদায়ক থিম',
                badge: 'আই প্রোটেকশন',
                badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
                desc: 'রাতের বেলা বা কম আলোতে চোখের সুরক্ষায় আধুনিক প্রিমিয়াম ডার্ক থিম এবং ঝকঝকে ক্লিয়ার ইসলামিক গোল্ডেন অ্যাকসেন্ট।',
                icon: Moon,
                to: '/settings',
                actionText: 'থিম পরিবর্তন',
            },
        ],
    },
    {
        categoryTitle: 'পবিত্রতা ও বিশ্বস্ততা',
        categoryDesc: 'সম্পূর্ণ বিজ্ঞাপনহীন, নিরাপদ ও নির্ভরযোগ্য ইসলামিক প্ল্যাটফর্ম',
        items: [
            {
                title: 'সম্পূর্ণ বিজ্ঞাপনমুক্ত অভিজ্ঞতা',
                badge: '১০০% পরিচ্ছন্ন',
                badgeColor: 'bg-gold/20 text-gold border-gold/40',
                desc: 'কোনো ধরণের বিরক্তিকর ব্যানার, ভিডিও বা পপআপ বিজ্ঞাপন নেই। আপনার ইবাদত ও পাঠের সময় মনযোগ থাকবে সম্পূর্ণ অটুট।',
                icon: ShieldCheck,
            },
            {
                title: 'অ্যান্ড্রয়েড নেটিভ অপ্টিমাইজেশন',
                badge: 'লাইটওয়েট ও ফাস্ট',
                badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                desc: 'হার্ডওয়্যার ব্যাক বাটন সমর্থন, হ্যাপটিক টাচ ভাইব্রেশন এবং ব্যাটারি ও মেমোরি বান্ধব মসৃণ পারফরম্যান্স।',
                icon: Smartphone,
            },
            {
                title: 'বিশুদ্ধ তথ্যসূত্র ও প্রামাণিকতা',
                badge: 'যাচাইকৃত',
                badgeColor: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
                desc: 'কুরআনুল কারীমের নির্ভরযোগ্য প্রমিত অনুবাদ এবং ইসলামিক ফাউন্ডেশন বাংলাদেশ ও আন্তর্জাতিক মানের সহীহ হাদিস সূত্র।',
                icon: Award,
            },
        ],
    },
];

export function FeaturesPage() {
    return (
        <Layout>
            {/* Page Hero */}
            <PageHero
                ar="مُمَيِّزَاتُ التَّطْبِيقِ"
                title="অ্যাপ্লিকেশন বৈশিষ্ট্য"
                sub="হাসানা অ্যাপের সকল ইসলামিক ফিচার ও স্মার্ট প্রযুক্তির বিস্তারিত পরিচিতি"
            />

            <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-12">
                {FEATURE_CATEGORIES.map((cat, catIdx) => (
                    <section key={catIdx} className="space-y-5">
                        {/* Section Title */}
                        <div className="border-b border-border/80 pb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-gold shrink-0" />
                                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                    {cat.categoryTitle}
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {cat.categoryDesc}
                            </p>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {cat.items.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="rounded-3xl bg-card border border-border/80 hover:border-gold/45 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* Top Icon & Badge */}
                                            <div className="flex items-center justify-between gap-2 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a4232] to-[#041f17] border border-gold/40 text-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                    <Icon className="w-6 h-6 text-gold" />
                                                </div>

                                                {item.badge && (
                                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-xs ${item.badgeColor}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Desc */}
                                            <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-gold transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>

                                        {/* Action Button (if linkable) */}
                                        {item.to && (
                                            <div className="mt-5 pt-3 border-t border-border/50">
                                                <Link
                                                    to={item.to}
                                                    onClick={() => hapticImpact()}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-gold transition native-press group/btn"
                                                >
                                                    <span>{item.actionText || 'বিস্তারিত দেখুন'}</span>
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Bottom Call to Action Card */}
                <div className="rounded-3xl bg-hero text-primary-foreground p-6 sm:p-8 md:p-10 border border-gold/40 shadow-xl relative overflow-hidden text-center space-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gold/15 blur-2xl pointer-events-none rounded-full" />
                    <p className="font-arabic text-2xl sm:text-3xl font-bold text-gold drop-shadow-sm">
                        فَاسْتَبِقُوا الْخَيْرَاتِ
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                        সৎকাজে একে অপরের সাথে প্রতিযোগিতা করুন
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
                        হাসানা সম্পূর্ণ ফ্রিতে এবং সদকায়ে জারিয়া হিসেবে তৈরি করা হয়েছে। অ্যাপটি ভালো লাগলে আপনার পরিবার ও প্রিয়জনদের সাথে শেয়ার করুন।
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/quran"
                            onClick={() => hapticImpact()}
                            className="px-6 py-2.5 rounded-full gold-gradient-btn text-xs sm:text-sm font-bold shadow-md native-press"
                        >
                            কুরআন তিলাওয়াত শুরু করুন
                        </Link>
                        <Link
                            to="/prayer-times"
                            onClick={() => hapticImpact()}
                            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition native-press"
                        >
                            নামাজের সময় দেখুন
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
