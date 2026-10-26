import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';

const umrahSteps = [
    {
        step: 1,
        title: 'ইহরাম পরিধান ও প্রস্তুতি',
        desc: 'মীকাতের আগে নখ কাটা, গোসল করা এবং পুরুষদের ক্ষেত্রে সেলাইবিহীন দুই টুকরা সাদা চাদর পরিধান করা। নারীদের ক্ষেত্রে শালীন সাধারণ পোশাক পরা (মুখ ও হাত খোলা রাখা)।',
        ar: 'اللَّهُمَّ إِنِّي أُرِيدُ العُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي',
        trans: 'আল্লাহুম্মা ইন্নী উরীদুল ‘উমরাতা ফায়াসসিরহা লী ওয়া তাকাব্বালহা মিন্নী',
        meaning: 'হে আল্লাহ! আমি উমরার ইচ্ছা করছি, আপনি আমার জন্য তা সহজ করে দিন এবং আমার পক্ষ থেকে তা কবুল করে নিন।',
        points: [
            'মীকাত অতিক্রম করার আগেই ইহরামের পোশাক পরা ও নিয়ত করা ওয়াজিব',
            'নিয়ত করার সাথে সাথে তালবিয়া পাঠ শুরু করতে হবে',
        ],
    },
    {
        step: 2,
        title: 'তালবিয়া পাঠ',
        desc: 'ইহরাম বাঁধার পর থেকে কাবা শরীফে পৌঁছে তাওয়াফ শুরু করা পর্যন্ত বেশি বেশি তালবিয়া পাঠ করা সুন্নত।',
        ar: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        trans: 'লাব্বাইকাল্লাহুম্মা লাব্বাইক, লাব্বাইকা লা শারীকা লাকা লাব্বাইক, ইন্নাল হামদা ওয়ান নি‘মাতা লাকা ওয়াল মুল্ক, লা শারীকা লাক',
        meaning: 'আমি হাজির হে আল্লাহ! আমি হাজির। আপনার কোনো অংশীদার নেই, আমি হাজির। নিশ্চয়ই সমস্ত প্রশংসা, নিয়ামত ও রাজত্ব একমাত্র আপনারই, আপনার কোনো অংশীদার নেই।',
        points: [
            'পুরুষরা মাঝারি উচ্চস্বরে এবং নারীরা নিচু স্বরে পাঠ করবেন',
        ],
    },
    {
        step: 3,
        title: 'কাবা শরীফের তাওয়াফ',
        desc: 'হাজরে আসওয়াদ থেকে শুরু করে কাবা শরীফকে বামে রেখে ঘড়ির কাঁটার বিপরীত দিকে মোট ৭ চক্কর প্রদক্ষিণ করা।',
        ar: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ',
        trans: 'বিসমিল্লাহি ওয়াল্লাহু আকবার',
        meaning: 'আল্লাহর নামে এবং আল্লাহ সর্বশ্রেষ্ঠ। (প্রতিটি চক্করের শুরুতে হাজরে আসওয়াদের দিকে মুখ করে হাত তুলে পাঠ করা)',
        points: [
            'পুরুষদের জন্য প্রথম তিন চক্করে একটু দ্রুত ও বীরদর্পে চলা (রমল) সুন্নত',
            'তাওয়াফের জন্য ওযু থাকা আবশ্যক',
            'প্রতিটি চক্করে রুকনে ইয়ামানী ও হাজরে আসওয়াদের মাঝে "রাব্বানা আতিনা..." দোয়াটি পাঠ করা উত্তম',
        ],
    },
    {
        step: 4,
        title: 'মাকামে ইবরাহীমে নামাজ ও জমজম',
        desc: 'তাওয়াফের ৭ চক্কর শেষ করে মাকামে ইবরাহীমের পেছনে (জায়গা না পেলে মসজিদের যেকোনো স্থানে) দুই রাকাত তাওয়াফের নামাজ আদায় করা এবং পেট ভরে জমজমের পানি পান করা।',
        points: [
            'প্রথম রাকাতে সূরা কাফিরুন ও দ্বিতীয় রাকাতে সূরা ইখলাস পাঠ করা মোস্তাহাব',
            'জমজমের পানি দাঁড়িয়ে কাবামুখী হয়ে তিন শ্বাসে পান করা এবং নিজের ও উম্মাহর জন্য দোয়া করা',
        ],
    },
    {
        step: 5,
        title: 'সাফা-মারওয়া সাঈ',
        desc: 'সাফা পাহাড় থেকে শুরু করে মারওয়া পাহাড় পর্যন্ত মোট ৭ বার যাতায়াত করা (সাফা থেকে মারওয়া = ১ বার, মারওয়া থেকে সাফা = ২য় বার, এভাবে ৭ম বার মারওয়াতে শেষ হবে)।',
        ar: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ',
        trans: 'ইন্নাস সাফা ওয়াল মারওয়াতা মিন শা‘আইরিল্লাহ',
        meaning: 'নিশ্চয়ই সাফা ও মারওয়া আল্লাহর নিদর্শনসমূহের অন্তর্ভুক্ত।',
        points: [
            'সাফা ও মারওয়া পাহাড়ে উঠে কাবামুখী হয়ে হাত তুলে দোয়া করা সুন্নত',
            'পুরুষরা দুই সবুজ বাতির মাঝের স্থানটুকু দ্রুত পায়ে হেঁটে পার হবেন',
            'সাঈর জন্য ওযু থাকা আবশ্যক নয়, তবে উত্তম',
        ],
    },
    {
        step: 6,
        title: 'হলক বা কসর (মাথা মুণ্ডন বা চুল ছাঁটা)',
        desc: 'সাঈ শেষ করে পুরুষদের পুরো মাথা মুণ্ডন করা (হলক) বা সম্পূর্ণ মাথার চুল ছোট করা (কসর)। নারীদের ক্ষেত্রে আঙুলের এক কর পরিমাণ চুল কাটা।',
        points: [
            'পুরুষদের জন্য পুরো মাথা মুণ্ডন করা অধিক সওয়াবের',
            'চুল কাটার মাধ্যমেই উমরার সমস্ত কার্যাবলী সম্পন্ন হয় এবং ইহরামের সমাপ্তি ঘটে',
        ],
    },
];

export function UmrahGuidePage() {
    return (
        <Layout>
            <PageHero 
                ar="العمرة خطوة بخطوة" 
                title="উমরা গাইড" 
                sub="সুন্নত অনুযায়ী ধাপে ধাপে উমরা পালনের পূর্ণাঙ্গ সচিত্র নির্দেশিকা" 
            />

            <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
                {/* Intro summary banner */}
                <div className="rounded-3xl bg-card border-2 border-gold/40 p-6 md:p-8 shadow-sm">
                    <h2 className="text-lg md:text-xl font-bold text-primary mb-2">উমরার মূল ৪টি স্তম্ভ (রুকন ও ওয়াজিব):</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-center">
                        <div className="rounded-2xl bg-muted p-3">
                            <span className="font-bold text-primary block text-base">১. ইহরাম</span>
                            <span className="text-xs text-muted-foreground">নিয়ত ও তালবিয়া</span>
                        </div>
                        <div className="rounded-2xl bg-muted p-3">
                            <span className="font-bold text-primary block text-base">২. তাওয়াফ</span>
                            <span className="text-xs text-muted-foreground">কাবার ৭ চক্কর</span>
                        </div>
                        <div className="rounded-2xl bg-muted p-3">
                            <span className="font-bold text-primary block text-base">৩. সাঈ</span>
                            <span className="text-xs text-muted-foreground">সাফা-মারওয়া ৭ বার</span>
                        </div>
                        <div className="rounded-2xl bg-muted p-3">
                            <span className="font-bold text-primary block text-base">৪. হলক/কসর</span>
                            <span className="text-xs text-muted-foreground">চুল ছাঁটা বা মুণ্ডন</span>
                        </div>
                    </div>
                </div>

                {/* Steps List */}
                <div className="space-y-6">
                    {umrahSteps.map((item) => (
                        <article 
                            key={item.step} 
                            className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm card-hover relative"
                        >
                            <div className="flex items-start gap-4">
                                <span className="w-12 h-12 rounded-2xl bg-primary text-gold flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                                    {item.step.toLocaleString('bn-BD')}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                                        ধাপ {item.step.toLocaleString('bn-BD')}: {item.title}
                                    </h3>
                                    <p className="text-base text-foreground/90 leading-relaxed mb-4">
                                        {item.desc}
                                    </p>

                                    {item.ar && (
                                        <div className="rounded-2xl bg-muted/70 border border-border/80 p-4 my-4">
                                            <p className="font-arabic text-xl md:text-2xl text-primary font-bold text-right leading-loose" dir="rtl">
                                                {item.ar}
                                            </p>
                                            {item.trans && (
                                                <p className="text-xs md:text-sm text-muted-foreground italic mt-2">
                                                    <span className="font-semibold text-foreground not-italic">উচ্চারণ:</span> {item.trans}
                                                </p>
                                            )}
                                            {item.meaning && (
                                                <p className="text-xs md:text-sm text-foreground/90 mt-1">
                                                    <span className="font-semibold text-primary">অর্থ:</span> {item.meaning}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {item.points && item.points.length > 0 && (
                                        <div className="mt-3 space-y-1.5">
                                            {item.points.map((pt, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span>{pt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Prohibitions Warning Box */}
                <div className="rounded-3xl bg-amber-500/10 border border-amber-500/30 p-6 text-foreground">
                    <div className="flex items-center gap-2.5 text-amber-600 font-bold mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="text-base font-bold">ইহরাম অবস্থায় নিষিদ্ধ বিষয়সমূহ:</h3>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-muted-foreground mt-3">
                        <li>• নখ বা শরীরের যেকোনো অংশের চুল কাটা বা উপড়ানো</li>
                        <li>• শরীরে বা কাপড়ে সুগন্ধি ব্যবহার করা</li>
                        <li>• পুরুষদের সেলাইযুক্ত পোশাক বা জুতো (গোড়ালি ঢাকা) পরা</li>
                        <li>• পুরুষদের মাথা বা মুখমণ্ডল ঢাকা</li>
                        <li>• নারীদের মুখ নেকাব বা দস্তানা দিয়ে ঢাকা</li>
                        <li>• কোনো প্রকার শিকার বা গাছপালা কাটা</li>
                        <li>• স্বামী-স্ত্রীর বিশেষ মেলামেশা বা যেকোনো ধরণের অশ্লীল কথা/কাজ</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
