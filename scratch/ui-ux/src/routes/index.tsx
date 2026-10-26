import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ScrollText, HandHeart, MapPin, Clock, Bookmark, Share2, Moon, ChevronRight } from "lucide-react";
import { Layout, card } from "@/components/Layout";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "হাসানা — নামাজের সময়, কুরআন, হাদিস ও দোয়া" },
    { name: "description", content: "নামাজের সময়সূচী, আল-কুরআন, হাদিস, দোয়া ও উমরা গাইড — এক জায়গায়।" },
    { property: "og:title", content: "হাসানা — ইসলামিক অ্যাপ্লিকেশন" },
    { property: "og:description", content: "নামাজের সময়, কুরআন, হাদিস ও দোয়া।" },
  ]}),
  component: Index,
});

const prayers = [
  ["ফজর", "০৫:৩৫", "০৭:০৫"], ["যোহর", "১২:০৯", "০২:৪৫"], ["আসর", "০২:৪৫", "০৫:১৩"],
  ["মাগরিব", "০৫:১৩", "০৬:৪৩"], ["ইশা", "০৬:৪৩", "০৫:৩৫"],
];
const quick = [
  { to: "/quran", t: "আল-কুরআন", d: "পবিত্র কুরআন শরীফ পড়ুন", I: BookOpen },
  { to: "/hadith", t: "হাদিস শরীফ", d: "নির্বাচিত হাদিস পড়ুন", I: ScrollText },
  { to: "/duas", t: "দোয়া সমূহ", d: "দৈনন্দিন দোয়া শিখুন", I: HandHeart },
  { to: "/umrah-guide", t: "উমরা গাইড", d: "উমরার নিয়মাবলী জানুন", I: MapPin },
] as const;
const features = [
  { t: "নামাজের সময়সূচী", d: "প্রতিদিন সঠিক সময়ে নামাজের তথ্য", I: Clock },
  { t: "বুকমার্ক", d: "প্রিয় আয়াত সংরক্ষণ করুন", I: Bookmark },
  { t: "শেয়ার করুন", d: "আয়াত ও দোয়া শেয়ার করুন", I: Share2 },
  { t: "ডার্ক মোড", d: "রাতের জন্য আরামদায়ক", I: Moon },
];

function Index() {
  return (
    <Layout>
      <section className="bg-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pattern opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16 text-center">
          <p className="font-arabic text-4xl md:text-5xl text-gold">السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-3">আসসালামু আলাইকুম</h1>
          <p className="mt-2 opacity-85 max-w-md mx-auto">কুরআন, হাদিস, দোয়া ও নামাজের সময় — সবকিছু এক অ্যাপে</p>
          <p className="mt-4 inline-block rounded-full bg-primary-foreground/10 border border-gold/30 px-4 py-1.5 text-sm text-gold">১৫ জমাদিউল আউয়াল, ১৪৪৮ হিজরি</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 -mt-6 relative">
        <div className="rounded-3xl bg-card border-2 border-gold/40 p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg flex items-center gap-2"><Clock className="size-5 text-primary" /> আজকের নামাজের সময়</h2>
            <span className="text-xs text-muted-foreground">ঢাকা</span>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            {prayers.map(([n, s]) => (
              <div key={n} className="rounded-xl bg-muted py-3 px-1">
                <p className="text-xs font-semibold text-muted-foreground">{n}</p>
                <p className="mt-1 font-bold text-primary tabular-nums text-sm md:text-base">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 mt-6">
        <div className="rounded-3xl bg-card border p-5 md:p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">আজকের দিনের আয়াত</p>
          <p className="font-arabic text-2xl md:text-3xl mt-3 text-primary">اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ</p>
          <p className="mt-3 text-lg">তুমি আমাদের সরল ও অবিচল পথটি দেখিয়ে দাও</p>
          <p className="text-sm text-muted-foreground mt-1">(সূরা আল-ফাতিহা, ১:৬)</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-14">
        <h2 className="text-2xl font-bold mb-4">দ্রুত অ্যাক্সেস</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {quick.map(({ to, t, d, I }) => (
            <Link key={to} to={to} className={card}>
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-primary text-gold grid place-items-center"><I /></div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-bold md:text-lg">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-bold mt-10 mb-4">বৈশিষ্ট্য সমূহ</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {features.map(({ t, d, I }) => (
            <div key={t} className="rounded-2xl bg-muted p-4 md:p-6">
              <I className="text-primary" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
