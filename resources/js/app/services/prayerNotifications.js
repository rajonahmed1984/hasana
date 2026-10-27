// Namaz / Prayer Times Notification Manager for Hasana App
// Integrated with Firebase & Web Push Notification APIs

import { requestNotificationPermission } from './firebase';
import { 
    getStoredLocation, 
    calculateSolarPrayerTimes, 
    syncLocationWithBackend 
} from './locationService';

export const PRAYER_SCHEDULE = [
    {
        id: 'fajr',
        name: 'ফজর',
        nameEn: 'Fajr',
        startHour: 5,
        startMin: 5,
        displayTime: '০৫:০৫',
        title: 'ফজরের নামাজের সময় হয়েছে 🌅',
        body: 'আস-সালাতু খাইরুম মিনান নাওম — ঘুম থেকে নামাজ উত্তম। আসুন জামায়াতে নামাজ আদায় করি।',
    },
    {
        id: 'dhuhr',
        name: 'যোহর',
        nameEn: 'Dhuhr',
        startHour: 12,
        startMin: 5,
        displayTime: '১২:০৫',
        title: 'যোহরের নামাজের সময় হয়েছে ☀️',
        body: 'যোহরের নামাজের ওয়াক্ত শুরু হয়েছে। দুনিয়াবী ব্যস্ততা ছেড়ে রবের ডাকে সাড়া দিন।',
    },
    {
        id: 'asr',
        name: 'আসর',
        nameEn: 'Asr',
        startHour: 15,
        startMin: 40,
        displayTime: '০৩:৪০',
        title: 'আসরের নামাজের সময় হয়েছে ⛅',
        body: 'আসরের নামাজের ওয়াক্ত শুরু হয়েছে। সময়মতো নামাজ আদায় করে অপরিসীম সওয়াব অর্জন করুন।',
    },
    {
        id: 'maghrib',
        name: 'মাগরিব',
        nameEn: 'Maghrib',
        startHour: 17,
        startMin: 15,
        displayTime: '০৫:১৫',
        title: 'মাগরিবের নামাজের সময় হয়েছে 🌇',
        body: 'সূর্যাস্তের সাথে সাথে মাগরিবের ওয়াক্ত শুরু হয়েছে। বিলম্ব না করে দ্রুত নামাজ আদায় করুন।',
    },
    {
        id: 'isha',
        name: 'ইশা',
        nameEn: 'Isha',
        startHour: 18,
        startMin: 25,
        displayTime: '০৬:২৫',
        title: 'ইশার নামাজের সময় হয়েছে 🌙',
        body: 'ইশার নামাজের ওয়াক্ত শুরু হয়েছে। জামায়াতে নামাজ ও রাতের বিতর সালাত আদায় করুন।',
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

/**
 * Check if notifications are enabled
 */
export const isPrayerNotificationEnabled = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    return Notification.permission === 'granted' && localStorage.getItem(STORAGE_KEY) === 'enabled';
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
 * Save prayer preference
 */
export const savePrayerPreference = (prayerId, isEnabled) => {
    const prefs = getPrayerPreferences();
    prefs[prayerId] = isEnabled;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    return prefs;
};

/**
 * Trigger a browser or service worker notification
 */
export const showPrayerNotification = async (title, body, tag = 'namaz-alert') => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission !== 'granted') return false;

    const options = {
        body,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag,
        renotify: true,
        vibrate: [300, 150, 300, 150, 400],
        data: { url: '/' },
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
 * Send an immediate test notification
 */
export const sendTestPrayerNotification = async () => {
    if (Notification.permission !== 'granted') {
        const result = await requestNotificationPermission();
        if (!result.success) {
            return { success: false, message: result.error || 'অনুমতি পাওয়া যায়নি' };
        }
    }

    const sent = await showPrayerNotification(
        'হাসানা — নামাজের নোটিফিকেশন সচল আছে 🕌',
        'আলহামদুলিল্লাহ! আপনার ডিভাইসে প্রতিটি নামাজের ওয়াক্তে সময়মতো নোটিফিকেশন পৌঁছাবে ইনশাআল্লাহ।',
        'namaz-test-' + Date.now()
    );

    return {
        success: sent,
        message: sent 
            ? 'টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!' 
            : 'নোটিফিকেশন পাঠানো যায়নি। ব্রাউজার পারমিশন পরীক্ষা করুন।'
    };
};

/**
 * Enable prayer notifications and register FCM token
 */
export const enablePrayerNotifications = async () => {
    const res = await requestNotificationPermission();
    if (res.success) {
        localStorage.setItem(STORAGE_KEY, 'enabled');
        initPrayerScheduler();
    }
    return res;
};

/**
 * Disable prayer notifications
 */
export const disablePrayerNotifications = () => {
    localStorage.setItem(STORAGE_KEY, 'disabled');
};

const AYAH_STORAGE_KEY = 'hasana-daily-ayah-notifications';
const AYAH_LOG_KEY = 'hasana-last-notified-ayah';

/**
 * Fetch today's Ayah from backend
 */
export const fetchDailyAyah = async () => {
    try {
        const response = await fetch('/api/notifications/daily-ayah', {
            headers: {
                'Accept': 'application/json'
            }
        });
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
 * Check if Daily Ayah notification is enabled
 */
export const isDailyAyahNotificationEnabled = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    return Notification.permission === 'granted' && localStorage.getItem(AYAH_STORAGE_KEY) !== 'disabled';
};

/**
 * Toggle Daily Ayah notification
 */
export const setDailyAyahNotificationEnabled = (enabled) => {
    localStorage.setItem(AYAH_STORAGE_KEY, enabled ? 'enabled' : 'disabled');
};

/**
 * Send an immediate test daily ayah notification
 */
export const sendTestDailyAyahNotification = async () => {
    if (Notification.permission !== 'granted') {
        const result = await requestNotificationPermission();
        if (!result.success) {
            return { success: false, message: result.error || 'অনুমতি পাওয়া যায়নি' };
        }
    }

    const ayah = await fetchDailyAyah();
    const sent = await showPrayerNotification(
        `আজকের দিনের আয়াত 📖 (${ayah.surah_name})`,
        `${ayah.text_bn}\n— ${ayah.reference}`,
        'daily-ayah-test-' + Date.now()
    );

    return {
        success: sent,
        ayah,
        message: sent 
            ? 'আজকের আয়াতের টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!' 
            : 'নোটিফিকেশন পাঠানো যায়নি। ব্রাউজার পারমিশন পরীক্ষা করুন।'
    };
};

/**
 * Check and notify Daily Ayah
 */
export const checkDailyAyahAndNotify = async () => {
    if (!isDailyAyahNotificationEnabled()) return;

    const now = new Date();
    const currentHour = now.getHours();
    const dateStr = now.toISOString().slice(0, 10);

    // Notify at or after 8 AM (or when app first opened in morning/day)
    if (currentHour >= 8) {
        const lastNotified = localStorage.getItem(AYAH_LOG_KEY);
        if (lastNotified !== dateStr) {
            localStorage.setItem(AYAH_LOG_KEY, dateStr);
            const ayah = await fetchDailyAyah();
            if (ayah) {
                showPrayerNotification(
                    `আজকের দিনের আয়াত 📖 (${ayah.surah_name})`,
                    `${ayah.text_bn}\n— ${ayah.reference}`,
                    `daily-ayah-${dateStr}`
                );
            }
        }
    }
};

/**
 * Check and fire prayer notifications
 */
export const checkPrayerTimeAndNotify = () => {
    // Check prayer times
    if (isPrayerNotificationEnabled()) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const dateStr = now.toISOString().slice(0, 10);

        const prefs = getPrayerPreferences();
        const schedule = getDynamicPrayerSchedule();

        for (const prayer of schedule) {
            if (!prefs[prayer.id]) continue;

            // Check if current hour and minute match within 1-minute window
            if (currentHour === prayer.startHour && currentMin === prayer.startMin) {
                const lastNotifiedKey = `${LOG_KEY}-${prayer.id}`;
                const lastNotifiedDate = localStorage.getItem(lastNotifiedKey);

                if (lastNotifiedDate !== dateStr) {
                    // Not notified yet today for this prayer
                    localStorage.setItem(lastNotifiedKey, dateStr);
                    showPrayerNotification(
                        prayer.title,
                        prayer.body,
                        `namaz-${prayer.id}-${dateStr}`
                    );
                    break;
                }
            }
        }
    }

    // Check daily ayah notification
    checkDailyAyahAndNotify();
};

let schedulerInterval = null;

/**
 * Initialize background interval checker for prayer & daily ayah notifications
 */
export const initPrayerScheduler = () => {
    if (typeof window === 'undefined') return;

    if (schedulerInterval) {
        clearInterval(schedulerInterval);
    }

    // Check immediately and then every 30 seconds
    checkPrayerTimeAndNotify();
    schedulerInterval = setInterval(checkPrayerTimeAndNotify, 30000);
};
