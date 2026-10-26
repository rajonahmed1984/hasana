import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
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

export const initNativeAppHandlers = (navigate) => {
    if (!isNative()) return;

    try {
        CapApp.addListener('backButton', ({ canGoBack }) => {
            if (canGoBack) {
                window.history.back();
            } else {
                CapApp.exitApp();
            }
        });
    } catch {
        // Ignore if plugin unavailable
    }
};
