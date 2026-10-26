import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TextSettingsBar, useArabicSettings } from "@/components/TextSettings";

const surahs: Record<string, { ar: string; bn: string; mean: string; info: string; about: string; ayat: [string, string][] }> = {
  "al-fatiha": {
    ar: "الفاتحة", bn: "আল-ফাতিহা", mean: "সূচনা",
    info: "মক্কায় অবতীর্ণ • মোট আয়াত ৭ • অবতীর্ণের ক্রম: ৫",
    about: "এই সূরাটি নবুয়তের প্রাথমিক যুগে অবতীর্ণ হয় এবং এটি ইসলামের মৌলিক ভিত্তি স্থাপন করে। এটিকে 'উম্মুল কুরআন' বা কুরআনের মা বলা হয়, কারণ এটি নামাযের অবিচ্ছেদ্য অংশ।",
    ayat: [
      ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "রহমান রহীম আল্লাহ তায়ালার নামে-"],
      ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "সমস্ত প্রশংসা আল্লাহ তায়ালার জন্যে- তিনি সৃষ্টিকুলের মালিক,"],
      ["الرَّحْمَٰنِ الرَّحِيمِ", "তিনি পরম দয়ালু, অতি মেহেরবান,"],
      ["مَالِكِ يَوْمِ الدِّينِ", "তিনি বিচার দিনের মালিক।"],
      ["إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "(হে প্রভু,) আমরা তোমারই বন্দেগী করি এবং তোমারই সাহায্য চাই।"],
      ["اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "তুমি আমাদের (সরল ও) অবিচল পথটি দেখিয়ে দাও-"],
      ["صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", "তাদের পথ- যাদের ওপর তুমি অনুগ্রহ করেছো, তাদের (পথ) নয়- যাদের ওপর অভিশাপ দেয়া হয়েছে এবং (তাদের পথও নয়) যারা পথভ্রষ্ট হয়ে গেছে।"],
    ],
  },
};

export const Route = createFileRoute("/surah/$slug")({
  loader: ({ params }) => {
    const s = surahs[params.slug];
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData: s }) => ({ meta: s ? [
    { title: `সূরা ${s.bn} (${s.ar}) — হাসানা` },
    { name: "description", content: s.about },
    { property: "og:title", content: `সূরা ${s.bn} — হাসানা` },
    { property: "og:description", content: s.about },
  ] : [{ title: "সূরা পাওয়া যায়নি — হাসানা" }, { name: "robots", content: "noindex" }] }),
  component: Surah,
});

function Surah() {
  const s = Route.useLoaderData();
  const ts = useArabicSettings();
  return (
    <Layout>
      <section className="bg-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pattern opacity-40" />
        <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-12 text-center">
          <Link to="/quran" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100"><ArrowLeft className="size-4" /> সব সূরা</Link>
          <p className="font-arabic text-5xl md:text-6xl text-gold mt-4">{s.ar}</p>
          <h1 className="mt-3 text-3xl font-bold">{s.bn}</h1>
          <p className="opacity-85">"{s.mean}"</p>
          <p className="mt-2 text-sm opacity-75">{s.info}</p>
        </div>
      </section>
      <div className="pt-4"><TextSettingsBar s={ts} /></div>
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        <div className="rounded-2xl bg-muted p-5 text-sm leading-relaxed">{s.about}</div>
        <p className="font-arabic text-3xl text-center text-primary py-4">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        {s.ayat.map(([ar, bn], i) => (
          <article key={i} className="rounded-2xl bg-card border p-5 shadow-sm">
            <span className="inline-block rounded-full bg-primary text-gold px-3 py-0.5 text-xs font-bold">১:{(i + 1).toLocaleString("bn-BD")}</span>
            <p className={`font-arabic ${ts.sizeClass} text-right ${ts.leadClass} mt-3 text-primary`}>{ar}</p>
            <p className="mt-3 text-base leading-relaxed">{bn}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
}
