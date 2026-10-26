import { useEffect, useState } from "react";
import { Minus, Plus, Rows3 } from "lucide-react";

export type ArabicSettings = { size: number; leading: number };

const KEY = "hasana-arabic-settings";
const DEF: ArabicSettings = { size: 0, leading: 0 };
const SIZES = ["text-xl", "text-2xl", "text-3xl", "text-4xl"];
const LEADS = ["leading-loose", "leading-[2.2]", "leading-[2.6]", "leading-[3]"];

export function useArabicSettings() {
  const [s, setS] = useState<ArabicSettings>(DEF);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...DEF, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);
  const update = (p: Partial<ArabicSettings>) =>
    setS((prev) => {
      const next = { ...prev, ...p };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  return {
    sizeClass: SIZES[s.size] ?? SIZES[1],
    leadClass: LEADS[s.leading] ?? LEADS[0],
    size: s.size,
    leading: s.leading,
    incSize: () => update({ size: Math.min(s.size + 1, SIZES.length - 1) }),
    decSize: () => update({ size: Math.max(s.size - 1, 0) }),
    incLead: () => update({ leading: Math.min(s.leading + 1, LEADS.length - 1) }),
    decLead: () => update({ leading: Math.max(s.leading - 1, 0) }),
  };
}

export function TextSettingsBar({ s }: { s: ReturnType<typeof useArabicSettings> }) {
  const btn = "size-9 rounded-full bg-primary text-gold grid place-items-center disabled:opacity-40 active:scale-95 transition";
  return (
    <div className="sticky top-[57px] z-10 mx-auto max-w-3xl px-4">
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-card border shadow-sm px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">আরবি আকার</span>
          <button aria-label="আরবি ছোট করুন" className={btn} onClick={s.decSize} disabled={s.size === 0}><Minus className="size-4" /></button>
          <span className="font-arabic text-gold text-lg leading-none">ع</span>
          <button aria-label="আরবি বড় করুন" className={btn} onClick={s.incSize} disabled={s.size === 3}><Plus className="size-4" /></button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">লাইনের ব্যবধান</span>
          <button aria-label="ব্যবধান কমান" className={btn} onClick={s.decLead} disabled={s.leading === 0}><Minus className="size-4" /></button>
          <Rows3 className="size-4 text-gold" />
          <button aria-label="ব্যবধান বাড়ান" className={btn} onClick={s.incLead} disabled={s.leading === 3}><Plus className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
