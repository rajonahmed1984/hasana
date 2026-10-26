import { Link } from "@tanstack/react-router";
import { Home, BookOpen, ScrollText, HandHeart, MapPin } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", l: "হোম", I: Home }, { to: "/quran", l: "কুরআন", I: BookOpen }, { to: "/hadith", l: "হাদিস", I: ScrollText },
  { to: "/duas", l: "দোয়া", I: HandHeart }, { to: "/umrah-guide", l: "উমরা", I: MapPin },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-20 bg-primary text-primary-foreground shadow-lg">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-arabic text-3xl text-gold">حسنة</span>
            <span className="font-semibold text-lg">হাসানা</span>
          </Link>
          <nav className="hidden md:flex gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                className="px-3 py-1.5 rounded-full hover:bg-primary-foreground/10"
                activeProps={{ className: "bg-gold text-primary font-semibold" }}>{n.l}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-primary text-primary-foreground border-t border-gold/30 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {nav.map(({ to, l, I }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-0.5 py-2 text-[11px] opacity-75"
            activeProps={{ className: "text-gold opacity-100 font-semibold" }}>
            <I className="size-5" />{l}
          </Link>
        ))}
      </nav>
      <footer className="hidden md:block bg-primary text-primary-foreground/80 text-center py-6 text-sm">
        <p className="font-arabic text-xl text-gold mb-1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        © ২০২৬ হাসানা — ইসলামিক অ্যাপ্লিকেশন
      </footer>
    </div>
  );
}

export function PageHero({ ar, title, sub }: { ar: string; title: string; sub: string }) {
  return (
    <section className="bg-hero text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 pattern opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-14 text-center">
        <p className="font-arabic text-3xl md:text-4xl text-gold">{ar}</p>
        <h1 className="mt-2 text-2xl md:text-4xl font-bold">{title}</h1>
        <p className="mt-2 opacity-80">{sub}</p>
      </div>
    </section>
  );
}

export const card = "rounded-2xl bg-card border p-4 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition";
