import React, { useState, useEffect } from 'react';
import { Minus, Plus, AlignJustify } from 'lucide-react';
import { hapticImpact } from '../native';

const STORAGE_KEY = 'hasana-arabic-settings';
const DEFAULT_SETTINGS = { size: 1, leading: 0 };
const SIZES = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
const LEADS = ['leading-relaxed', 'leading-2-2', 'leading-2-6', 'leading-3-0'];

export function useArabicSettings() {
    const [settings, setSettings] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    const update = (patch) => {
        setSettings((prev) => {
            const next = { ...prev, ...patch };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    return {
        sizeClass: SIZES[settings.size] || SIZES[1],
        leadClass: LEADS[settings.leading] || LEADS[0],
        size: settings.size,
        leading: settings.leading,
        incSize: () => {
            hapticImpact();
            update({ size: Math.min(settings.size + 1, SIZES.length - 1) });
        },
        decSize: () => {
            hapticImpact();
            update({ size: Math.max(settings.size - 1, 0) });
        },
        incLead: () => {
            hapticImpact();
            update({ leading: Math.min(settings.leading + 1, LEADS.length - 1) });
        },
        decLead: () => {
            hapticImpact();
            update({ leading: Math.max(settings.leading - 1, 0) });
        },
    };
}

export function TextSettingsBar({ settings }) {
    const btnClass = "w-8 h-8 rounded-full bg-primary text-gold flex items-center justify-center disabled:opacity-40 active:scale-95 transition shadow-sm hover:opacity-90";

    return (
        <div className="sticky top-16 z-20 mx-auto max-w-3xl px-4 py-2">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-card border border-border shadow-md px-4 py-2.5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">আরবি সাইজ</span>
                    <button
                        type="button"
                        aria-label="আরবি ছোট করুন"
                        className={btnClass}
                        onClick={settings.decSize}
                        disabled={settings.size === 0}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-arabic text-gold text-lg font-bold px-1 select-none">ع</span>
                    <button
                        type="button"
                        aria-label="আরবি বড় করুন"
                        className={btnClass}
                        onClick={settings.incSize}
                        disabled={settings.size === 3}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">লাইন ব্যবধান</span>
                    <button
                        type="button"
                        aria-label="ব্যবধান কমান"
                        className={btnClass}
                        onClick={settings.decLead}
                        disabled={settings.leading === 0}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <AlignJustify className="w-4 h-4 text-gold" />
                    <button
                        type="button"
                        aria-label="ব্যবধান বাড়ান"
                        className={btnClass}
                        onClick={settings.incLead}
                        disabled={settings.leading === 3}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
