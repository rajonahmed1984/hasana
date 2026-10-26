import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero, card } from "@/components/Layout";
import { TextSettingsBar, useArabicSettings } from "@/components/TextSettings";

const items: { ar?: string; t: string; d: string; s?: string }[] = [
{ar:"إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",t:"নিয়তের গুরুত্ব",d:"সকল কাজ নিয়তের উপর নির্ভরশীল।",s:"সহীহ বুখারী, ১"},
{ar:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",t:"কুরআন শিক্ষা",d:"তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শেখে ও শেখায়।",s:"সহীহ বুখারী, ৫০২৭"},
{ar:"الطُّهُورُ شَطْرُ الْإِيمَانِ",t:"পবিত্রতা",d:"পবিত্রতা ঈমানের অর্ধেক।",s:"সহীহ মুসলিম, ২২৩"},
{ar:"الدِّينُ النَّصِيحَةُ",t:"কল্যাণকামিতা",d:"দ্বীন হলো কল্যাণ কামনা।",s:"সহীহ মুসলিম, ৫৫"}];

export const Route = createFileRoute("/hadith")({
  head: () => ({ meta: [
    { title: "হাদিস শরীফ — হাসানা" }, { name: "description", content: "নির্বাচিত হাদিস পড়ুন" },
    { property: "og:title", content: "হাদিস শরীফ — হাসানা" }, { property: "og:description", content: "নির্বাচিত হাদিস পড়ুন" },
  ]}),
  component: HadithPage,
});

function HadithPage() {
  const ts = useArabicSettings();
  return (
    <Layout>
      <PageHero ar="الحديث الشريف" title="হাদিস শরীফ" sub="নির্বাচিত হাদিস পড়ুন" />
      <div className="pt-4"><TextSettingsBar s={ts} /></div>
      <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-5">
        {items.map((i, n) => (
          <div key={n} className={card}>
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-full bg-primary text-gold grid place-items-center text-sm font-bold">{(n + 1).toLocaleString("bn-BD")}</span>
              <h3 className="font-bold text-lg">{i.t}</h3>
            </div>
            {i.ar && <p className={`font-arabic ${ts.sizeClass} text-primary text-right mt-4 ${ts.leadClass}`}>{i.ar}</p>}
            <p className="mt-3">{i.d}</p>
            {i.s && <p className="text-sm text-muted-foreground mt-2">{i.s}</p>}
          </div>
        ))}
      </div>
    </Layout>
  );
}
