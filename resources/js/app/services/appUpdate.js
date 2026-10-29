import { App as CapApp } from '@capacitor/app';
import { isNative } from '../native';
import { showNativeNotificationNow } from './nativeNotifications';

const DISMISS_KEY = 'hasana-update-dismissed';
const NOTIFIED_KEY = 'hasana-update-notified-version';
const REMIND_AFTER_MS = 24 * 60 * 60 * 1000; // Remind after 24 hours if dismissed
const CHECK_INTERVAL_MS = 60 * 60 * 1000; // Check hourly

let lastCheck = 0;
let prompting = false;
let currentUpdateInfo = null;
const listeners = new Set();

export const subscribeToUpdateState = (callback) => {
    listeners.add(callback);
    callback(currentUpdateInfo);
    return () => listeners.delete(callback);
};

const notifyListeners = (info) => {
    currentUpdateInfo = info;
    listeners.forEach((cb) => {
        try { cb(info); } catch (e) {}
    });
};

export const compareVersions = (v1, v2) => {
    if (!v1 || !v2) return 0;
    const clean1 = (v1 + '').replace(/[^0-9.]/g, '').split('.').map((n) => parseInt(n, 10) || 0);
    const clean2 = (v2 + '').replace(/[^0-9.]/g, '').split('.').map((n) => parseInt(n, 10) || 0);
    const len = Math.max(clean1.length, clean2.length);
    for (let i = 0; i < len; i++) {
        const num1 = clean1[i] || 0;
        const num2 = clean2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
};

export const openPlayStore = (url) => {
    const targetUrl = url || 'https://play.google.com/store/apps/details?id=com.hasanaa.app';
    window.location.href = targetUrl;
};

const wasDismissedRecently = (buildOrVer) => {
    try {
        const saved = JSON.parse(localStorage.getItem(DISMISS_KEY) || 'null');
        return saved && (saved.key === buildOrVer) && Date.now() - saved.at < REMIND_AFTER_MS;
    } catch {
        return false;
    }
};

/**
 * Compare the installed version/build with server/Play Store and show update notification.
 */
export const checkForAppUpdate = async (modal = null, { force = false, silent = false } = {}) => {
    if (prompting) return { status: 'prompting' };
    if (!force && Date.now() - lastCheck < CHECK_INTERVAL_MS) {
        return { status: 'throttled', info: currentUpdateInfo };
    }
    lastCheck = Date.now();

    try {
        let installedBuild = 0;
        let installedVersion = '1.0';

        if (isNative()) {
            try {
                const info = await CapApp.getInfo();
                installedBuild = parseInt(info.build, 10) || 0;
                installedVersion = info.version || '1.0';
            } catch (e) {
                console.warn('[AppUpdate] Failed getting CapApp info:', e);
            }
        }

        const res = await fetch('/api/app/version', {
            headers: { Accept: 'application/json' },
            cache: 'no-store'
        });
        if (!res.ok) return { status: 'error' };

        const latest = await res.json();

        // Compare both semantic version and build code
        const isBuildOutdated = latest.latest_build && installedBuild > 0 && installedBuild < latest.latest_build;
        const isVersionOutdated = latest.latest_version && compareVersions(installedVersion, latest.latest_version) < 0;
        const hasUpdate = isBuildOutdated || isVersionOutdated;

        const updateDetails = {
            hasUpdate,
            installedVersion,
            installedBuild,
            latestVersion: latest.latest_version,
            latestBuild: latest.latest_build,
            minBuild: latest.min_build,
            message: latest.message,
            storeUrl: latest.store_url || 'https://play.google.com/store/apps/details?id=com.hasanaa.app',
            isRequired: installedBuild > 0 && installedBuild < (latest.min_build || 0),
        };

        notifyListeners(hasUpdate ? updateDetails : null);

        if (!hasUpdate) {
            return { status: 'up-to-date', installedVersion };
        }

        // Trigger native notification tray alert once per version
        if (isNative()) {
            try {
                const lastNotified = localStorage.getItem(NOTIFIED_KEY);
                if (lastNotified !== latest.latest_version) {
                    localStorage.setItem(NOTIFIED_KEY, latest.latest_version);
                    showNativeNotificationNow(
                        'হাসানা অ্যাপের নতুন আপডেট এসেছে 🎉',
                        `নতুন ভার্সন (${latest.latest_version}) প্লে-স্টোরে পাওয়া যাচ্ছে। নতুন ফিচার ও সুবিধার জন্য এখনই আপডেট করুন।`
                    );
                }
            } catch (e) {}
        }

        // If silent check or no modal, stop here (listeners are already updated)
        if (silent || !modal) {
            return { status: 'update-available', details: updateDetails };
        }

        // Check if recently dismissed
        const dismissId = `${latest.latest_version}-${latest.latest_build}`;
        if (!force && wasDismissedRecently(dismissId) && !updateDetails.isRequired) {
            return { status: 'dismissed', details: updateDetails };
        }

        prompting = true;
        const displayMessage = [
            latest.message,
            `আপনার ভার্সন: v${installedVersion} ➔ নতুন ভার্সন: v${latest.latest_version}`,
        ].filter(Boolean).join('\n\n');

        if (updateDetails.isRequired) {
            await modal.alert({
                title: 'আপডেট করা আবশ্যক',
                arabic: 'تَحْدِيثٌ جَدِيد',
                message: `${displayMessage}\n\nঅ্যাপটি ব্যবহার চালিয়ে যেতে নতুন ভার্সনে আপডেট করুন।`,
                iconType: 'bell',
                buttonText: 'এখনই আপডেট করুন',
                dismissible: false,
            });
            openPlayStore(updateDetails.storeUrl);
        } else {
            const confirmed = await modal.confirm({
                title: 'নতুন ভার্সন এসেছে 🎉',
                arabic: 'تَحْدِيثٌ جَدِيد',
                message: displayMessage,
                iconType: 'bell',
                confirmText: 'প্লে-স্টোরে যান',
                cancelText: 'পরে',
                variant: 'primary',
            });

            if (confirmed) {
                openPlayStore(updateDetails.storeUrl);
            } else {
                localStorage.setItem(DISMISS_KEY, JSON.stringify({ key: dismissId, at: Date.now() }));
            }
        }

        return { status: 'prompted', details: updateDetails };
    } catch (err) {
        console.warn('[AppUpdate] Version check error:', err);
        return { status: 'error', error: err };
    } finally {
        prompting = false;
    }
};

let initialized = false;

export const initAppUpdateChecks = (modal) => {
    if (initialized) return;
    initialized = true;

    // First check after 3 seconds on launch
    setTimeout(() => {
        checkForAppUpdate(modal, { force: true });
    }, 3000);

    // On app resume / foreground
    if (isNative()) {
        CapApp.addListener('resume', () => {
            checkForAppUpdate(modal);
        });
    }
};
