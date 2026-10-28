// Back button (Android hardware/gesture back, browser back) handling for overlays.
// Open overlays (dialogs, the side menu, the share card) register a close function here;
// "back" closes the most recently opened one before it navigates or asks to exit.

import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

const stack = [];

/**
 * Close the top-most open overlay.
 * @returns {boolean} true if an overlay was closed (the back press is handled)
 */
export const closeTopOverlay = () => {
    // Not popped here: the overlay unregisters itself when it actually closes
    // (a dialog that can't be dismissed stays on top and keeps absorbing back presses)
    const close = stack[stack.length - 1];
    if (!close) return false;
    close();
    return true;
};

/**
 * While `active` is true, a back press calls `onClose` instead of navigating.
 */
export function useCloseOnBack(active, onClose) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!active) return undefined;
        const entry = () => onCloseRef.current();
        stack.push(entry);
        return () => {
            const index = stack.lastIndexOf(entry);
            if (index !== -1) stack.splice(index, 1);
        };
    }, [active]);
}

const isTouchOrInstalled = () =>
    window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(display-mode: standalone)').matches;

/**
 * Mobile browsers: on Home, keep one extra history entry so the back gesture can be caught.
 * Back then closes an open overlay, or asks "exit?" (confirmExit leaves on yes, we re-arm on no).
 * The Android app handles its hardware back button natively (see initNativeAppHandlers).
 * @param {string} pathname current route
 * @param {() => Promise<boolean>} confirmExit
 */
export function useWebBackGuard(pathname, confirmExit) {
    useEffect(() => {
        if (Capacitor.isNativePlatform() || pathname !== '/' || !isTouchOrInstalled()) return undefined;

        const arm = () => {
            if (!window.history.state?.hasanaGuard) {
                window.history.pushState({ ...window.history.state, hasanaGuard: true }, '');
            }
        };
        arm();

        const onPopState = async () => {
            if (window.location.pathname !== '/' || window.history.state?.hasanaGuard) return;
            if (closeTopOverlay()) {
                arm();
                return;
            }
            const leaving = await confirmExit();
            if (!leaving) arm();
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [pathname, confirmExit]);
}
