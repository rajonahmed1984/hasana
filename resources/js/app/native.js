import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { closeTopOverlay } from './services/backHandler';
import { App as CapApp } from '@capacitor/app';

export const isNative = () => {
    try {
        return Capacitor.isNativePlatform();
    } catch {
        return false;
    }
};

export const hapticImpact = async (style = ImpactStyle.Light) => {
    try {
        if (isNative()) {
            await Haptics.impact({ style });
        } else if (navigator.vibrate) {
            navigator.vibrate(15);
        }
    } catch {
        // Ignore on unsupported platforms
    }
};

export const nativeShare = async ({ title, text, url }) => {
    try {
        if (isNative()) {
            await Share.share({
                title: title || 'হাসানা',
                text: text || '',
                url: url || window.location.href,
                dialogTitle: 'শেয়ার করুন',
            });
            return true;
        } else if (navigator.share) {
            await navigator.share({
                title: title || 'হাসানা',
                text: text || '',
                url: url || window.location.href,
            });
            return true;
        } else {
            await navigator.clipboard.writeText(`${title ? title + '\n\n' : ''}${text ? text + '\n\n' : ''}${url || window.location.href}`);
            return 'copied';
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            try {
                await navigator.clipboard.writeText(`${title ? title + '\n\n' : ''}${text ? text + '\n\n' : ''}${url || window.location.href}`);
                return 'copied';
            } catch {
                return false;
            }
        }
        return false;
    }
};

// Shares only an image (no text/link) from the native app: writes it to the cache dir, then opens the share sheet
export const shareImageNative = async (blob, fileName) => {
    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const { uri } = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
    });

    await Share.share({ files: [uri], dialogTitle: 'ছবি শেয়ার করুন' });
};

let nativeHandlersReady = false;

export const initNativeAppHandlers = (navigate) => {
    if (!isNative() || nativeHandlersReady) return;
    nativeHandlersReady = true;

    try {
        // Back: close an open dialog/menu first, then go back a page; on Home ask before exiting
        CapApp.addListener('backButton', ({ canGoBack }) => {
            if (closeTopOverlay()) return;

            if (window.location.pathname === '/') {
                window.dispatchEvent(new CustomEvent('hasana-request-exit'));
            } else if (canGoBack) {
                window.history.back();
            } else {
                // Opened directly on an inner page (e.g. from a notification): go Home instead of closing the app
                navigate('/', { replace: true });
            }
        });
    } catch {
        // Ignore if plugin unavailable
    }
};
