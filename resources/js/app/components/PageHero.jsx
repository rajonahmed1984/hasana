import React from 'react';

export function PageHero({ ar, title, sub, children }) {
    return (
        <section className="bg-hero text-primary-foreground relative overflow-hidden py-9 md:py-16 border-b border-gold/20">
            {/* Ambient Gold Radial Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gold/15 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute inset-0 pattern opacity-30 pointer-events-none" />

            <div className="relative mx-auto max-w-6xl px-4 text-center">
                {ar && (
                    <p className="font-arabic text-3xl md:text-5xl text-gold font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                        {ar}
                    </p>
                )}
                <h1 className="mt-2.5 text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {title}
                </h1>
                {sub && (
                    <p className="mt-2 text-xs sm:text-sm md:text-base text-emerald-100/85 max-w-xl mx-auto leading-relaxed">
                        {sub}
                    </p>
                )}
                {children}
            </div>
        </section>
    );
}
