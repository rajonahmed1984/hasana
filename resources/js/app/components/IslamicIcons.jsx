import React from 'react';

/**
 * Islamic Kaaba Icon (Holy Kaaba at Makkah)
 * Features 3D cubic isometric structure, golden embroidered Kiswah belt (Al-Hizam), and the Golden Door (Bab al-Kaaba).
 */
export function KaabaIcon({ className = "w-5 h-5", strokeWidth = 1.8, ...props }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Kaaba 3D Isometric Cube Outline */}
            <path d="M12 2.5L20.5 7v10L12 21.5 3.5 17V7L12 2.5z" />
            
            {/* Front vertical corner crease */}
            <path d="M12 11.5v10" />
            
            {/* Roof facet lines */}
            <path d="M12 11.5L20.5 7" />
            <path d="M12 11.5L3.5 7" />
            
            {/* Kiswah Golden Embroidered Belt (Al-Hizam) */}
            <path d="M3.5 10.5l8.5 4 8.5-4" strokeWidth={strokeWidth + 0.3} />
            
            {/* Golden Door of Kaaba (Bab al-Kaaba) on the right visible wall */}
            <path d="M14.5 15.2v3.3l3.2-1.5v-3.3l-3.2 1.5z" fill="currentColor" fillOpacity="0.35" />
        </svg>
    );
}

/**
 * Islamic Dua Hands Icon (two open palms raised in supplication / Munajat)
 * Stroke-based, 24x24 grid, so it stays as crisp as the Lucide icons at small sizes.
 */
export function DuaHandsIcon({ className = "w-5 h-5", strokeWidth = 1.8, ...props }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Left hand: three fingers + cupped palm */}
            <path d="M3 11V7a1.25 1.25 0 0 1 2.5 0v4" />
            <path d="M5.5 11V4.75a1.25 1.25 0 0 1 2.5 0V11" />
            <path d="M8 11V5.5a1.25 1.25 0 0 1 2.5 0V13" />
            <path d="M3 11v5.5a4 4 0 0 0 4 4a3.5 3.5 0 0 0 3.5-3.5V13" />

            {/* Right hand (mirrored) */}
            <path d="M21 11V7a1.25 1.25 0 0 0-2.5 0v4" />
            <path d="M18.5 11V4.75a1.25 1.25 0 0 0-2.5 0V11" />
            <path d="M16 11V5.5a1.25 1.25 0 0 0-2.5 0V13" />
            <path d="M21 11v5.5a4 4 0 0 1-4 4a3.5 3.5 0 0 1-3.5-3.5V13" />
        </svg>
    );
}

// Aliases
export const DuaIcon = DuaHandsIcon;
export const UmrahIcon = KaabaIcon;

/**
 * Islamic Tasbih / Misbaha Icon (Prayer beads with Imam bead and tassel)
 */
export function TasbihIcon({ className = "w-5 h-5", strokeWidth = 2, ...props }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Subtle connecting thread */}
            <ellipse cx="12" cy="11.5" rx="7.2" ry="7" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1.5" opacity="0.5" />
            
            {/* Beads along the misbaha circle */}
            <circle cx="12" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="16.5" cy="6" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="19.2" cy="9.8" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="19.2" cy="14" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="16.2" cy="17.3" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="12" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="7.8" cy="17.3" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="4.8" cy="14" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="4.8" cy="9.8" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="7.5" cy="6" r="1.4" fill="currentColor" stroke="none" />
            
            {/* Imam bead connector & tassel */}
            <path d="M12 18.5v3" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="22" r="1" fill="currentColor" stroke="none" />
            <path d="M10.2 23.5h3.6" stroke="currentColor" strokeWidth="1.4" />
        </svg>
    );
}

