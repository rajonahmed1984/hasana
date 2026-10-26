import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero, card } from "@/components/Layout";

const items: { ar?: string; t: string; d: string; s?: string }[] = [
{t:"ইহরাম",d:"মীকাত থেকে গোসল করে ইহরামের কাপড় পরে উমরার নিয়ত করুন।"},
{ar:"لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",t:"তালবিয়া",d:"ইহরামের পর বেশি বেশি তালবিয়া পাঠ করুন।"},
{t:"তাওয়াফ",d:"হাজরে আসওয়াদ থেকে শুরু করে কাবা শরীফ সাতবার প্রদক্ষিণ করুন।"},
{t:"মাকামে ইবরাহীমে নামাজ",d:"তাওয়াফ শেষে দুই রাকাত নামাজ আদায় করুন ও জমজমের পানি পান করুন।"},
{t:"সাঈ",d:"সাফা থেকে মারওয়া পর্যন্ত সাতবার যাতায়াত করুন।"},
{t:"হলক বা কসর",d:"মাথা মুণ্ডন বা চুল ছোট করে ইহরাম মুক্ত হোন।"}];

export const Route = createFileRoute("/umrah-guide")({
  head: () => ({ meta: [
    { title: "উমরা গাইড — হাসানা" }, { name: "description", content: "ধাপে ধাপে উমরার নিয়মাবলী" },
    { property: "og:title", content: "উমরা গাইড — হাসানা" }, { property: "og:description", content: "ধাপে ধাপে উমরার নিয়মাবলী" },
  ]}),
  component: () => (
    <Layout>
      <PageHero ar="العمرة" title="উমরা গাইড" sub="ধাপে ধাপে উমরার নিয়মাবলী" />
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-5">
        {items.map((i, n) => (
          <div key={n} className={card}>
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-full bg-primary text-gold grid place-items-center text-sm font-bold">{(n + 1).toLocaleString("bn-BD")}</span>
              <h3 className="font-bold text-lg">{i.t}</h3>
            </div>
            {i.ar && <p className="font-arabic text-2xl text-primary text-right mt-4 leading-loose">{i.ar}</p>}
            <p className="mt-3">{i.d}</p>
            {i.s && <p className="text-sm text-muted-foreground mt-2">{i.s}</p>}
          </div>
        ))}
      </div>
    </Layout>
  ),
});
