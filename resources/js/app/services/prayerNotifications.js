// Namaz / Prayer Times Notification Manager for Hasana App
// Web: Firebase push from the server + in-page checker. Native app: on-device local notifications.

import { App as CapApp } from '@capacitor/app';
import { requestNotificationPermission } from './firebase';
import { isNative } from '../native';
import { getStoredLocation, calculateSolarPrayerTimes } from './locationService';
import { syncDeviceWithBackend, savePushToken } from './deviceRegistration';
import {
    requestNativeNotificationPermission,
    rescheduleNativeNotifications,
    showNativeNotificationNow,
    initNativeNotificationListeners,
    toBnDigits,
    formatBnTime,
} from './nativeNotifications';

export const PRAYER_SCHEDULE = [
    {
        id: 'fajr',
        name: 'ফজর',
        nameEn: 'Fajr',
        startHour: 5,
        startMin: 5,
        displayTime: '05:05',
        title: 'ফজর : ওয়াক্ত শুরু @ ০৫:০৫',
        body: 'আস-সালাতু খাইরুম মিনান নাওম — ঘুম থেকে নামাজ উত্তম। ওযু করে জামায়াতে যোগ দিন।',
    },
    {
        id: 'dhuhr',
        name: 'যোহর',
        nameEn: 'Dhuhr',
        startHour: 12,
        startMin: 5,
        displayTime: '12:05',
        title: 'যোহর : ওয়াক্ত শুরু @ ১২:০৫',
        body: 'মিসওয়াক করে ওযু করুন। জামায়াতে যোহরের সালাত আদায় করুন।',
    },
    {
        id: 'asr',
        name: 'আসর',
        nameEn: 'Asr',
        startHour: 15,
        startMin: 40,
        displayTime: '03:40',
        title: 'আসর : ওয়াক্ত শুরু @ ০৩:৪০',
        body: 'আসরের ওয়াক্ত শুরু হয়েছে। সময়মতো নামাজ আদায় করে অপরিসীম সওয়াব অর্জন করুন।',
    },
    {
        id: 'maghrib',
        name: 'মাগরিব',
        nameEn: 'Maghrib',
        startHour: 17,
        startMin: 23,
        displayTime: '05:23',
        title: 'মাগরিব : ওয়াক্ত শুরু @ ০৫:২৩',
        body: 'মিসওয়াক করে ওযু করুন। নামাজের প্রস্তুতি নিন। দ্রুত মাগরিব আদায় করুন।',
    },
    {
        id: 'isha',
        name: 'ইশা',
        nameEn: 'Isha',
        startHour: 18,
        startMin: 38,
        displayTime: '06:38',
        title: 'ইশা : ওয়াক্ত শুরু @ ০৬:৩৮',
        body: 'ইশার ওয়াক্ত শুরু হয়েছে। জামায়াতে নামাজ ও রাতের বিতর সালাত আদায় করুন।',
    },
];

/**
 * Get dynamic prayer schedule for current user GPS location
 */
export const getDynamicPrayerSchedule = () => {
    try {
        const cached = localStorage.getItem('hasana-dynamic-prayer-schedule');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length === 5) {
                return parsed;
            }
        }
    } catch {
        // Fallback
    }

    // Calculate dynamically from stored location
    const loc = getStoredLocation();
    const dynamic = calculateSolarPrayerTimes(loc.latitude, loc.longitude);
    return dynamic || PRAYER_SCHEDULE;
};

const STORAGE_KEY = 'hasana-namaz-notifications';
const PREFS_KEY = 'hasana-prayer-prefs';
const LOG_KEY = 'hasana-last-notified-prayer';
const AYAH_STORAGE_KEY = 'hasana-daily-ayah-notifications';
const AYAH_LOG_KEY = 'hasana-last-notified-ayah';
const NATIVE_PERMISSION_KEY = 'hasana-native-notif-permission';

const pad = (n) => String(n).padStart(2, '0');
// Local calendar date (not UTC), so Fajr before 6 AM in Bangladesh counts as "today"
const localDateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const hasPermission = () => {
    if (isNative()) return localStorage.getItem(NATIVE_PERMISSION_KEY) === 'granted';
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Check if notifications are enabled.
 * Defaults to true unless explicitly disabled by user.
 */
export const isPrayerNotificationEnabled = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) !== 'disabled';
};

/**
 * Get prayer preference list (which prayers are active)
 */
export const getPrayerPreferences = () => {
    try {
        const saved = localStorage.getItem(PREFS_KEY);
        if (saved) return JSON.parse(saved);
    } catch {
        // Fallback default
    }
    return {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
    };
};

/**
 * Re-apply notification settings everywhere: reschedule native local notifications
 * and push the preferences + location to the backend (which sends web push).
 */
export const refreshNotifications = async () => {
    const prayerEnabled = isPrayerNotificationEnabled();
    const ayahEnabled = isDailyAyahNotificationEnabled();
    const prefs = getPrayerPreferences();

    await rescheduleNativeNotifications({ prayerEnabled, ayahEnabled, prefs });

    const loc = getStoredLocation();
    await syncDeviceWithBackend({
        prayer_enabled: prayerEnabled,
        ayah_enabled: ayahEnabled,
        prayer_prefs: prefs,
        latitude: loc.latitude,
        longitude: loc.longitude,
        city_name: loc.cityName,
    });
};

/**
 * Save prayer preference
 */
export const savePrayerPreference = (prayerId, isEnabled) => {
    const prefs = getPrayerPreferences();
    prefs[prayerId] = isEnabled;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    refreshNotifications();
    return prefs;
};

/**
 * Ask the user for notification permission (native app or browser) and get a push token.
 */
export const requestNotifPermission = async () => {
    if (isNative()) {
        const res = await requestNativeNotificationPermission();
        if (res.success) {
            localStorage.setItem(NATIVE_PERMISSION_KEY, 'granted');
            localStorage.setItem(STORAGE_KEY, 'enabled');
        }
        return res;
    }
    const res = await requestNotificationPermission();
    if (res.success) {
        localStorage.setItem(STORAGE_KEY, 'enabled');
    }
    return res;
};

/**
 * Trigger a browser, service worker or native notification right away
 */
export const showPrayerNotification = async (title, body, tag = 'namaz-alert', url = '/') => {
    if (isNative()) return showNativeNotificationNow(title, body);

    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission !== 'granted') return false;

    const options = {
        body,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag,
        renotify: false,
        vibrate: [300, 150, 300, 150, 400],
        data: { url },
    };

    try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(title, options);
            return true;
        } else {
            new Notification(title, options);
            return true;
        }
    } catch (err) {
        console.warn('[PrayerNotifications] Direct notification fallback:', err);
        try {
            new Notification(title, options);
            return true;
        } catch {
            return false;
        }
    }
};

/**
 * Send an immediate test notification matching Muslims Day layout
 */
export const sendTestPrayerNotification = async () => {
    if (!hasPermission()) {
        const result = await requestNotifPermission();
        if (!result.success) {
            return { success: false, message: result.error || 'অনুমতি পাওয়া যায়নি' };
        }
    }

    const sent = await showPrayerNotification(
        'মাগরিব : ওয়াক্ত শুরু @ ০৫:২৩',
        'মিসওয়াক করে ওযু করুন। নামাজের প্রস্তুতি নিন।',
        'namaz-test-' + Date.now()
    );

    return {
        success: sent,
        message: sent
            ? 'টেস্ট নামাজের নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!'
            : 'নোটিফিকেশন পাঠানো যায়নি। পারমিশন পরীক্ষা করুন।'
    };
};

/**
 * Enable prayer notifications and register the push token
 */
export const enablePrayerNotifications = async () => {
    const res = await requestNotifPermission();
    if (res.success) {
        localStorage.setItem(STORAGE_KEY, 'enabled');
        await refreshNotifications();
    }
    return res;
};

/**
 * Disable prayer notifications
 */
export const disablePrayerNotifications = () => {
    localStorage.setItem(STORAGE_KEY, 'disabled');
    refreshNotifications();
};

/**
 * Fetch today's Ayah from backend
 */
export const fetchDailyAyah = async () => {
    try {
        const baseUrl = isNative() ? 'https://hasanaa.com' : '';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const response = await fetch(`${baseUrl}/api/notifications/daily-ayah`, {
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await response.json();
        if (data.success && data.ayah) {
            return data.ayah;
        }
    } catch (err) {
        console.warn('[PrayerNotifications] Failed to fetch daily ayah:', err);
    }

    // High quality offline fallback
    return {
        id: 6,
        surah_number: 1,
        surah_name: 'আল-ফাতিহা',
        surah_name_ar: 'الفاتحة',
        surah_slug: 'al-fatiha',
        ayah_number: 6,
        text_ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        text_bn: 'তুমি আমাদের (সরল ও) অবিচল পথটি দেখিয়ে দাও-',
        reference: 'সূরা আল-ফাতিহা, ১:৬',
        deep_link: '/surah/al-fatiha?ayah=6',
    };
};

/**
 * Check if Daily Ayah notification is enabled. Defaults to true.
 */
export const isDailyAyahNotificationEnabled = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AYAH_STORAGE_KEY) !== 'disabled';
};

/**
 * Toggle Daily Ayah notification
 */
export const setDailyAyahNotificationEnabled = (enabled) => {
    localStorage.setItem(AYAH_STORAGE_KEY, enabled ? 'enabled' : 'disabled');
    refreshNotifications();
};

/**
 * Send an immediate test daily ayah notification
 */
export const sendTestDailyAyahNotification = async () => {
    if (!hasPermission()) {
        const result = await requestNotifPermission();
        if (!result.success) {
            return { success: false, message: result.error || 'অনুমতি পাওয়া যায়নি' };
        }
    }

    const ayah = await fetchDailyAyah();
    const sent = await showPrayerNotification(
        'আজকের নোটিফিকেশন',
        `পবিত্র কুরআনে আল্লাহ তাআলা বলেছেন :\n"${ayah.text_bn}"\n— ${ayah.reference}`,
        'daily-ayah-test-' + Date.now(),
        ayah.deep_link || '/'
    );

    return {
        success: sent,
        ayah,
        message: sent
            ? 'কুরআনের আয়াত টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!'
            : 'নোটিফিকেশন পাঠানো যায়নি। পারমিশন পরীক্ষা করুন।'
    };
};

/**
 * Check and notify Daily Ayah (web, while the page is open)
 */
export const checkDailyAyahAndNotify = async () => {
    if (!isDailyAyahNotificationEnabled()) return;

    const now = new Date();
    const dateStr = localDateKey(now);

    // Notify at or after 8 AM (or when app first opened in morning/day)
    if (now.getHours() >= 8) {
        const lastNotified = localStorage.getItem(AYAH_LOG_KEY);
        if (lastNotified !== dateStr) {
            localStorage.setItem(AYAH_LOG_KEY, dateStr);
            const ayah = await fetchDailyAyah();
            if (ayah) {
                showPrayerNotification(
                    'আজকের নোটিফিকেশন',
                    `পবিত্র কুরআনে আল্লাহ তাআলা বলেছেন :\n"${ayah.text_bn}"\n— ${ayah.reference}`,
                    `daily-ayah-${dateStr}`,
                    ayah.deep_link || '/'
                );
            }
        }
    }
};

/**
 * Check and fire prayer notifications (web, while the page is open)
 */
export const checkPrayerTimeAndNotify = () => {
    if (isPrayerNotificationEnabled()) {
        const now = new Date();
        const dateStr = localDateKey(now);

        const prefs = getPrayerPreferences();
        const schedule = getDynamicPrayerSchedule();

        for (const prayer of schedule) {
            if (!prefs[prayer.id]) continue;

            // Check if current hour and minute match within 1-minute window
            if (now.getHours() === prayer.startHour && now.getMinutes() === prayer.startMin) {
                const lastNotifiedKey = `${LOG_KEY}-${prayer.id}`;
                const lastNotifiedDate = localStorage.getItem(lastNotifiedKey);

                if (lastNotifiedDate !== dateStr) {
                    localStorage.setItem(lastNotifiedKey, dateStr);
                    const formattedTime = formatBnTime(prayer.startHour, prayer.startMin);
                    showPrayerNotification(
                        `${prayer.name} : ওয়াক্ত শুরু @ ${formattedTime}`,
                        prayer.body || 'মিসওয়াক করে ওযু করুন। নামাজের প্রস্তুতি নিন।',
                        `namaz-${prayer.id}-${dateStr}`
                    );
                    break;
                }
            }
        }
    }

    checkDailyAyahAndNotify();
};

let schedulerInterval = null;
let schedulerStarted = false;

/**
 * Start notifications at app launch.
 * - Native app: schedule the next 7 days of local notifications (refreshed on every resume / location change).
 * - Web: server push delivers them in the background; this in-page checker covers the open tab.
 * @param {(url: string) => void} navigate
 */
export const initPrayerScheduler = async (navigate = () => {}) => {
    if (typeof window === 'undefined' || schedulerStarted) return;
    schedulerStarted = true;

    if (isNative()) {
        initNativeNotificationListeners(navigate, (token) => {
            savePushToken(token);
            refreshNotifications();
        });

        CapApp.addListener('resume', () => refreshNotifications());

        // On first native app launch: if permission is not yet asked, auto-request it
        // so notifications are enabled right away out-of-the-box
        if (!localStorage.getItem(NATIVE_PERMISSION_KEY)) {
            try {
                const res = await requestNotifPermission();
                if (res.success) {
                    await refreshNotifications();
                }
            } catch (err) {
                console.warn('[PrayerScheduler] Auto permission request error:', err);
            }
        } else {
            refreshNotifications();
        }
    } else {
        if (schedulerInterval) {
            clearInterval(schedulerInterval);
        }
        checkPrayerTimeAndNotify();
        schedulerInterval = setInterval(checkPrayerTimeAndNotify, 30000);
        refreshNotifications();
    }

    window.addEventListener('hasana-location-changed', () => refreshNotifications());
};
