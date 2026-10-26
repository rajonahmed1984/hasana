import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero, card } from "@/components/Layout";
import { TextSettingsBar, useArabicSettings } from "@/components/TextSettings";

const items: { ar?: string; t: string; d: string; s?: string }[] = [
{ar:"بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",t:"ঘুমানোর দোয়া",d:"হে আল্লাহ, তোমার নামেই আমি মরি ও জীবিত হই।"},
{ar:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",t:"ঘুম থেকে উঠার দোয়া",d:"সকল প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর জীবিত করেছেন।"},
{ar:"بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",t:"খাওয়ার শুরুর দোয়া",d:"আল্লাহর নামে ও আল্লাহর বরকতে শুরু করছি।"},
{ar:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",t:"দুনিয়া ও আখিরাতের কল্যাণ",d:"হে আমাদের রব, দুনিয়া ও আখিরাতে কল্যাণ দাও এবং জাহান্নাম থেকে রক্ষা করো।",s:"সূরা বাকারা, ২:২০১"}];

export const Route = createFileRoute("/duas")({
  head: () => ({ meta: [
    { title: "দোয়া সমূহ — হাসানা" }, { name: "description", content: "দৈনন্দিন দোয়া শিখুন" },
    { property: "og:title", content: "দোয়া সমূহ — হাসানা" }, { property: "og:description", content: "দৈনন্দিন দোয়া শিখুন" },
  ]}),
  component: DuasPage,
});

function DuasPage() {
  const ts = useArabicSettings();
  return (
    <Layout>
      <PageHero ar="الأدعية" title="দোয়া সমূহ" sub="দৈনন্দিন দোয়া শিখুন" />
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
