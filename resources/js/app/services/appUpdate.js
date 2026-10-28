// "New version available" prompt for the Android app.
// The latest/minimum build numbers are set in Admin → Settings and served by /api/app/version.
// Website users always get the newest version automatically, so this only runs in the native app.

import { App as CapApp } from '@capacitor/app';
import { isNative } from '../native';

const DISMISS_KEY = 'hasana-update-dismissed';
const REMIND_AFTER_MS = 3 * 24 * 60 * 60 * 1000; // ask again 3 days after "later"
const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

let lastCheck = 0;
let prompting = false;

const openStore = (url) => {
    // Not an app URL, so the Android WebView hands it to the Play Store app
    window.location.href = url;
};

const wasDismissedRecently = (build) => {
    try {
        const saved = JSON.parse(localStorage.getItem(DISMISS_KEY) || 'null');
        return saved && saved.build === build && Date.now() - saved.at < REMIND_AFTER_MS;
    } catch {
        return false;
    }
};

/**
 * Compare the installed build with the server and show the update dialog when needed.
 * @param {{ confirm: Function, alert: Function }} modal from useModal()
 * @param {{ force?: boolean }} options force: skip the 6-hour throttle
 */
export const checkForAppUpdate = async (modal, { force = false } = {}) => {
    if (!isNative() || prompting || !navigator.onLine) return;
    if (!force && Date.now() - lastCheck < CHECK_INTERVAL_MS) return;
    lastCheck = Date.now();

    try {
        const [{ build, version }, res] = await Promise.all([
            CapApp.getInfo(),
            fetch('/api/app/version', { headers: { Accept: 'application/json' }, cache: 'no-store' }),
        ]);
        if (!res.ok) return;
        const latest = await res.json();
        const installedBuild = parseInt(build, 10) || 0;

        if (installedBuild >= latest.latest_build) return;

        const message = [
            latest.message,
            `আপনার ভার্সন: ${version} → নতুন ভার্সন: ${latest.latest_version}`,
        ].filter(Boolean).join('\n\n');

        prompting = true;

        if (installedBuild < latest.min_build) {
            // Required update: the dialog can't be closed; it comes back each time the app is opened
            lastCheck = 0;
            await modal.alert({
                title: 'আপডেট করা আবশ্যক',
                arabic: 'تَحْدِيثٌ جَدِيد',
                message: `${message}\n\nঅ্যাপটি ব্যবহার চালিয়ে যেতে নতুন ভার্সনে আপডেট করুন।`,
                iconType: 'bell',
                buttonText: 'এখনই আপডেট করুন',
                dismissible: false,
            });
            openStore(latest.store_url);
            return;
        }

        if (wasDismissedRecently(latest.latest_build)) return;

        const update = await modal.confirm({
            title: 'নতুন ভার্সন এসেছে 🎉',
            arabic: 'تَحْدِيثٌ جَدِيد',
            message,
            iconType: 'bell',
            confirmText: 'আপডেট করুন',
            cancelText: 'পরে',
            variant: 'primary',
        });

        if (update) {
            openStore(latest.store_url);
        } else {
            localStorage.setItem(DISMISS_KEY, JSON.stringify({ build: latest.latest_build, at: Date.now() }));
        }
    } catch (err) {
        console.warn('[AppUpdate] Version check failed:', err);
    } finally {
        prompting = false;
    }
};

let initialized = false;

/**
 * Check on launch and whenever the app comes back to the foreground.
 */
export const initAppUpdateChecks = (modal) => {
    if (!isNative() || initialized) return;
    initialized = true;
    setTimeout(() => checkForAppUpdate(modal, { force: true }), 4000);
    CapApp.addListener('resume', () => checkForAppUpdate(modal));
};
