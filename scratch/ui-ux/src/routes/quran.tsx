import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero, card } from "@/components/Layout";

const items: { ar?: string; t: string; d: string; s?: string }[] = [
{ar:"الْفَاتِحَة",t:"সূরা আল-ফাতিহা",d:"সূচনা",s:"মাক্কী • ৭ আয়াত"},
{ar:"الْبَقَرَة",t:"সূরা আল-বাকারা",d:"গাভী",s:"মাদানী • ২৮৬ আয়াত"},
{ar:"آلِ عِمْرَان",t:"সূরা আলে-ইমরান",d:"ইমরানের পরিবার",s:"মাদানী • ২০০ আয়াত"},
{ar:"النِّسَاء",t:"সূরা আন-নিসা",d:"নারী",s:"মাদানী • ১৭৬ আয়াত"},
{ar:"يس",t:"সূরা ইয়াসীন",d:"ইয়াসীন",s:"মাক্কী • ৮৩ আয়াত"},
{ar:"الرَّحْمَٰن",t:"সূরা আর-রহমান",d:"পরম করুণাময়",s:"মাদানী • ৭৮ আয়াত"},
{ar:"الْمُلْك",t:"সূরা আল-মুলক",d:"সার্বভৌমত্ব",s:"মাক্কী • ৩০ আয়াত"},
{ar:"الْإِخْلَاص",t:"সূরা আল-ইখলাস",d:"একনিষ্ঠতা",s:"মাক্কী • ৪ আয়াত"}];

export const Route = createFileRoute("/quran")({
  head: () => ({ meta: [
    { title: "আল-কুরআন — হাসানা" }, { name: "description", content: "পবিত্র কুরআন শরীফ পড়ুন" },
    { property: "og:title", content: "আল-কুরআন — হাসানা" }, { property: "og:description", content: "পবিত্র কুরআন শরীফ পড়ুন" },
  ]}),
  component: () => (
    <Layout>
      <PageHero ar="القرآن الكريم" title="আল-কুরআন" sub="পবিত্র কুরআন শরীফ পড়ুন" />
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-5">
        {items.map((i, n) => (
          <Link key={n} to="/surah/$slug" params={{ slug: "al-fatiha" }} disabled={n !== 0} className={card}>
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-full bg-primary text-gold grid place-items-center text-sm font-bold">{(n + 1).toLocaleString("bn-BD")}</span>
              <h3 className="font-bold text-lg">{i.t}</h3>
            </div>
            {i.ar && <p className="font-arabic text-2xl text-primary text-right mt-4 leading-loose">{i.ar}</p>}
            <p className="mt-3">{i.d}</p>
            {i.s && <p className="text-sm text-muted-foreground mt-2">{i.s}</p>}
          </Link>
        ))}
      </div>
    </Layout>
  ),
});
