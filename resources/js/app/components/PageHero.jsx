import React from 'react';

export function PageHero({ ar, title, sub, children }) {
    return (
        <section className="bg-hero text-primary-foreground relative overflow-hidden py-10 md:py-16">
            <div className="absolute inset-0 pattern opacity-35 pointer-events-none" />
            <div className="relative mx-auto max-w-6xl px-4 text-center">
                {ar && <p className="font-arabic text-3xl md:text-5xl text-gold font-bold tracking-wide drop-shadow-sm">{ar}</p>}
                <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight">{title}</h1>
                {sub && <p className="mt-2 text-sm md:text-base opacity-85 max-w-xl mx-auto">{sub}</p>}
                {children}
            </div>
        </section>
    );
}
