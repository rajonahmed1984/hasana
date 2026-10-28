// Native (Capacitor Android/iOS) notifications for Hasana.
// Prayer times & the daily ayah are scheduled on the device with local notifications,
// so they fire on time even when the app is closed or offline.
// Push notifications (FCM) are registered for server announcements.

import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { isNative } from '../native';
import { getStoredLocation, calculateSolarPrayerTimes } from './locationService';

const DAYS_AHEAD = 7;
const ID_BASE = 1000; // Our scheduled ids live in 1000-1999: ID_BASE + day * 10 + slot
const AYAH_SLOT = 9;
const AYAH_HOUR = 8;
const PRAYER_CHANNEL = 'hasana-prayer';
const GENERAL_CHANNEL = 'hasana-general';
const SMALL_ICON = 'ic_stat_hasana';

let channelsReady = false;
let listenersReady = false;

const ensureChannels = async () => {
    if (channelsReady) return;
    channelsReady = true;
    try {
        await LocalNotifications.createChannel({
            id: PRAYER_CHANNEL,
            name: 'নামাজ ও আয়াত',
            description: 'নামাজের সময় ও প্রতিদিনের আয়াতের নোটিফিকেশন',
            importance: 5,
            visibility: 1,
            vibration: true,
        });
        await LocalNotifications.createChannel({
            id: GENERAL_CHANNEL,
            name: 'ঘোষণা',
            description: 'হাসানা থেকে গুরুত্বপূর্ণ ঘোষণা',
            importance: 4,
            visibility: 1,
        });
    } catch {
        // createChannel is Android only
    }
};

/**
 * Ask for notification permission (Android 13+ / iOS) and, on Android 12+,
 * for exact alarms so prayer notifications are not delayed.
 */
export const requestNativeNotificationPermission = async () => {
    try {
        let { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
            ({ display } = await LocalNotifications.requestPermissions());
        }
        if (display !== 'granted') {
            return { success: false, error: 'নোটিফিকেশনের অনুমতি প্রদান করা হয়নি। ফোনের সেটিংস থেকে অনুমতি দিন।' };
        }

        try {
            const { exact_alarm } = await LocalNotifications.checkExactNotificationSetting();
            if (exact_alarm !== 'granted') {
                await LocalNotifications.changeExactNotificationSetting();
            }
        } catch {
            // Not needed below Android 12 / on iOS
        }

        registerNativePush();
        return { success: true };
    } catch (err) {
        return { success: false, error: err?.message || 'অনুমতি গ্রহণে ত্রুটি হয়েছে।' };
    }
};

const pad = (n) => String(n).padStart(2, '0');
const localDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fetchAyahForDate = async (dateKey) => {
    try {
        const res = await fetch(`/api/notifications/daily-ayah?date=${dateKey}`, { headers: { Accept: 'application/json' } });
        const data = await res.json();
        return data.success ? data.ayah : null;
    } catch {
        return null;
    }
};

/**
 * Cancel and re-create all scheduled prayer / daily ayah notifications for the next DAYS_AHEAD days.
 */
export const rescheduleNativeNotifications = async ({ prayerEnabled, ayahEnabled, prefs }) => {
    if (!isNative()) return;

    try {
        const { notifications: pending } = await LocalNotifications.getPending();
        const ours = pending.filter((n) => n.id >= ID_BASE && n.id < ID_BASE + 1000);
        if (ours.length) {
            await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });
        }

        if (!prayerEnabled && !ayahEnabled) return;

        const { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') return;

        await ensureChannels();

        const loc = getStoredLocation();
        const now = new Date();
        const toSchedule = [];

        const days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            return d;
        });

        const ayahs = ayahEnabled
            ? await Promise.all(days.map((d) => fetchAyahForDate(localDateKey(d))))
            : [];

        days.forEach((day, dayIndex) => {
            if (prayerEnabled) {
                const schedule = calculateSolarPrayerTimes(loc.latitude, loc.longitude, day);
                schedule.forEach((prayer, slot) => {
                    if (prefs[prayer.id] === false) return;
                    const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), prayer.startHour, prayer.startMin);
                    if (at <= now) return;
                    toSchedule.push({
                        id: ID_BASE + dayIndex * 10 + slot,
                        title: prayer.title,
                        body: prayer.body,
                        channelId: PRAYER_CHANNEL,
                        smallIcon: SMALL_ICON,
                        schedule: { at, allowWhileIdle: true },
                        extra: { url: '/', type: 'prayer' },
                    });
                });
            }

            if (ayahEnabled) {
                const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), AYAH_HOUR, 0);
                if (at <= now) return;
                const ayah = ayahs[dayIndex];
                toSchedule.push({
                    id: ID_BASE + dayIndex * 10 + AYAH_SLOT,
                    title: ayah ? `আজকের দিনের আয়াত 📖 (${ayah.surah_name})` : 'আজকের দিনের আয়াত 📖',
                    body: ayah ? `${ayah.text_bn}\n— ${ayah.reference}` : 'আজকের দিনের কোরআনিক বাণী পড়ুন।',
                    largeBody: ayah ? `${ayah.text_bn}\n— ${ayah.reference}` : undefined,
                    channelId: PRAYER_CHANNEL,
                    smallIcon: SMALL_ICON,
                    schedule: { at, allowWhileIdle: true },
                    extra: { url: ayah?.deep_link || '/', type: 'daily_ayah' },
                });
            }
        });

        if (toSchedule.length) {
            await LocalNotifications.schedule({ notifications: toSchedule });
        }
    } catch (err) {
        console.warn('[NativeNotifications] Scheduling failed:', err);
    }
};

/**
 * Show a notification right away (used by the "test notification" buttons).
 */
export const showNativeNotificationNow = async (title, body) => {
    try {
        await ensureChannels();
        await LocalNotifications.schedule({
            notifications: [{
                id: Math.floor(Math.random() * 100000) + 5000,
                title,
                body,
                largeBody: body,
                channelId: PRAYER_CHANNEL,
                smallIcon: SMALL_ICON,
                schedule: { at: new Date(Date.now() + 500), allowWhileIdle: true },
            }],
        });
        return true;
    } catch {
        return false;
    }
};

/**
 * Register for FCM push in the native app and send the token to the backend (platform "android"/"ios").
 */
export const registerNativePush = async () => {
    if (!isNative()) return;
    try {
        const { receive } = await PushNotifications.checkPermissions();
        if (receive !== 'granted') return;
        await ensureChannels();
        await PushNotifications.register();
    } catch (err) {
        console.warn('[NativeNotifications] Push registration failed:', err);
    }
};

/**
 * Wire up tap handlers & push token listener once at app start.
 * @param {(url: string) => void} navigate
 * @param {(token: string) => void} onPushToken
 */
export const initNativeNotificationListeners = (navigate, onPushToken) => {
    if (!isNative() || listenersReady) return;
    listenersReady = true;

    LocalNotifications.addListener('localNotificationActionPerformed', ({ notification }) => {
        const url = notification?.extra?.url;
        if (url) navigate(url);
    });

    PushNotifications.addListener('registration', ({ value }) => {
        if (value) onPushToken(value);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', ({ notification }) => {
        const url = notification?.data?.url;
        if (!url) return;
        // External links (e.g. the Play Store for an app update) leave the app; app paths navigate inside it
        if (/^https?:\/\//.test(url)) {
            window.location.href = url;
        } else {
            navigate(url);
        }
    });

    // Push messages that arrive while the app is open are not shown by Android, so show them locally
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        showNativeNotificationNow(
            notification.title || notification.data?.title || 'হাসানা',
            notification.body || notification.data?.body || ''
        );
    });

    registerNativePush();
};
