// Native (Capacitor Android/iOS) notifications for Hasana.
// Prayer times, Quran verse, Durood & Hadith are scheduled locally on device,
// so they fire reliably and on-time even when the app is closed or offline.
// Formatted matching Muslims Day notification style.

import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { isNative } from '../native';
import { getStoredLocation, calculateSolarPrayerTimes, withJumuah, JUMUAH_REMINDER } from './locationService';
import { playNotificationSound } from './soundService';

const DAYS_AHEAD = 7;
const ID_BASE = 1000;
const AYAH_SLOT = 5;
const DUROOD_SLOT = 6;
const HADITH_SLOT = 7;

const AYAH_HOUR = 8;
const AYAH_MIN = 30;
const DUROOD_HOUR = 13;
const DUROOD_MIN = 30;
const HADITH_HOUR = 20;
const HADITH_MIN = 30;

const PRAYER_CHANNEL = 'hasana-prayer-soothing';
const GENERAL_CHANNEL = 'hasana-general-soothing';
const NOTIFICATION_SOUND = 'hasana_notification.wav';
const SMALL_ICON = 'ic_stat_hasana';

let channelsReady = false;
let listenersReady = false;

export const toBnDigits = (num) => {
    const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return String(num).replace(/[0-9]/g, (d) => bn[Number(d)]);
};

export const formatBnTime = (hour, minute) => {
    const h12 = hour % 12 || 12;
    const hStr = String(h12).padStart(2, '0');
    const mStr = String(minute).padStart(2, '0');
    return toBnDigits(`${hStr}:${mStr}`);
};

/**
 * Curated offline pool of authentic Quranic verses
 */
const OFFLINE_AYAHS = [
    {
        surah_name: 'সূরা আল-বাকারা',
        reference: 'সূরা আল-বাকারা, ২:১৫২',
        text_bn: 'অতএব তোমরা আমাকে স্মরণ কর, আমিও তোমাদেরকে স্মরণ করব এবং আমার শোকর গোজারি কর, অকৃতজ্ঞ হয়ো না।',
        deep_link: '/surah/al-baqarah?ayah=152',
    },
    {
        surah_name: 'সূরা আর-রাদ',
        reference: 'সূরা আর-রাদ, ১৩:২৮',
        text_bn: 'যারা ঈমান এনেছে এবং যাদের অন্তর আল্লাহর স্মরণে প্রশান্তি লাভ করে। জেনে রাখ, আল্লাহর স্মরণেই অন্তরসমূহ প্রশান্ত হয়।',
        deep_link: '/surah/ar-rad?ayah=28',
    },
    {
        surah_name: 'সূরা আল-বাকারা',
        reference: 'সূরা আল-বাকারা, ২:২৮৬',
        text_bn: 'আল্লাহ কাউকে তার সাধ্যাতীত কোন কাজের ভার দেন না। সে যা ভাল করে তা তার জন্য এবং সে যা খারাপ করে তা তারই উপর বর্তায়।',
        deep_link: '/surah/al-baqarah?ayah=286',
    },
    {
        surah_name: 'সূরা আলে-ইমরান',
        reference: 'সূরা আলে-ইমরান, ৩:১৩৯',
        text_bn: 'তোমরা নিরাশ হয়ো না এবং দুঃখিত হয়ো না; তোমরাই বিজয়ী হবে, যদি তোমরা সত্যিকারের মুমিন হও।',
        deep_link: '/surah/ali-imran?ayah=139',
    },
    {
        surah_name: 'সূরা আল-ইনশিরাহ',
        reference: 'সূরা আল-ইনশিরাহ, ৯৪:৫-৬',
        text_bn: 'নিশ্চয় কষ্টের সাথেই রয়েছে স্বস্তি। নিশ্চয় কষ্টের সাথেই রয়েছে স্বস্তি।',
        deep_link: '/surah/ash-sharh?ayah=5',
    },
    {
        surah_name: 'সূরা আত-তালাক',
        reference: 'সূরা আত-তালাক, ৬৫:২-৩',
        text_bn: 'যে ব্যক্তি আল্লাহকে ভয় করে, আল্লাহ তার জন্য নিষ্কৃতির পথ তৈরি করে দেন এবং তাকে এমন স্থান থেকে রিজিক দেন যার কল্পনাও সে করে না।',
        deep_link: '/surah/at-talaq?ayah=2',
    },
    {
        surah_name: 'সূরা আল-বাকারা',
        reference: 'সূরা আল-বাকারা, ২:১৮৬',
        text_bn: 'আমার বান্দারা যখন আমার সম্পর্কে আপনাকে জিজ্ঞেস করে, তখন বলুন: আমি তো তাদের নিকটেই আছি। আহ্বানকারী যখনই আমাকে ডাকে, আমি তার ডাকে সাড়া দেই।',
        deep_link: '/surah/al-baqarah?ayah=186',
    },
    {
        surah_name: 'সূরা আল-হাশর',
        reference: 'সূরা আল-হাশর, ৫৯:২২',
        text_bn: 'তিনিই আল্লাহ, তিনি ব্যতীত কোন সত্য উপাস্য নেই; তিনি দৃশ্য ও অদৃশ্যের জ্ঞাতা, তিনি পরম করুণাময়, অতি দয়ালু।',
        deep_link: '/surah/al-hashr?ayah=22',
    },
];

/**
 * Curated offline pool of authentic Hadiths
 */
const OFFLINE_HADITHS = [
    {
        narrator: 'আবু হুরায়রা (রা.)',
        text_bn: 'যে ব্যক্তি আমার প্রতি একবার দুরূদ পাঠ করবে, আল্লাহ তাআলা তার প্রতি দশটি রহমত বর্ষণ করবেন।',
        reference: 'সহিহ মুসলিম, হাদিস: ৪০৮',
    },
    {
        narrator: 'উসমান ইবনে আফফান (রা.)',
        text_bn: 'তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে নিজে কুরআন শিখে এবং অন্যকে শিক্ষা দেয়।',
        reference: 'সহিহ বুখারি, হাদিস: ৫০২৭',
    },
    {
        narrator: 'আবু হুরায়রা (রা.)',
        text_bn: 'মুমিন ব্যক্তি প্রীতি ও ভালোবাসার প্রতীক; যার মাঝে প্রীতি নেই এবং যাকে ভালোবাসা যায় না তার মাঝে কোনো কল্যাণ নেই।',
        reference: 'মুসনাদে আহমাদ, হাদিস: ৯১৮৭',
    },
    {
        narrator: 'আনাস ইবনে মালিক (রা.)',
        text_bn: 'তোমাদের কেউ ততক্ষণ পর্যন্ত পূর্ণ ঈমানদার হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তাই পছন্দ করে যা সে নিজের জন্য পছন্দ করে।',
        reference: 'সহিহ বুখারি, হাদিস: ১৩',
    },
    {
        narrator: 'আবু হুরায়রা (রা.)',
        text_bn: 'আল্লাহ তাআলা তোমাদের চেহারা এবং ধন-সম্পদের দিকে তাকান না, বরং তিনি তোমাদের অন্তর এবং আমলসমূহের দিকে তাকান।',
        reference: 'সহিহ মুসলিম, হাদিস: ২৫৬৪',
    },
];

export const getOfflineAyahForDate = (dateKey) => {
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
        hash = (hash << 5) - hash + dateKey.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % OFFLINE_AYAHS.length;
    return OFFLINE_AYAHS[index];
};

export const getOfflineHadithForDate = (dateKey) => {
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
        hash = (hash << 5) - hash + dateKey.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash + 3) % OFFLINE_HADITHS.length;
    return OFFLINE_HADITHS[index];
};

const ensureChannels = async () => {
    if (channelsReady) return;
    channelsReady = true;
    try {
        await LocalNotifications.createChannel({
            id: PRAYER_CHANNEL,
            name: 'নামাজের ওয়াক্ত ও ইসলামিক রিমাইন্ডার',
            description: 'নামাজের ওয়াক্ত শুরু, পবিত্র কুরআন ও হাদিসের নোটিফিকেশন',
            importance: 5, // High importance for heads-up alert + sound
            visibility: 1, // Visible on lockscreen
            vibration: true,
            sound: NOTIFICATION_SOUND,
        });
        await LocalNotifications.createChannel({
            id: GENERAL_CHANNEL,
            name: 'সাধারণ ঘোষণা',
            description: 'হাসানা থেকে গুরুত্বপূর্ণ ঘোষণা ও আপডেট',
            importance: 4,
            visibility: 1,
            sound: NOTIFICATION_SOUND,
        });
    } catch {
        // Android only
    }
};

/**
 * Ask for notification permission (Android 13+ / iOS) and, on Android 12+,
 * for exact alarms so prayer notifications fire at the exact minute.
 */
export const requestNativeNotificationPermission = async () => {
    try {
        let { display } = await LocalNotifications.checkPermissions();
        if (display !== 'granted') {
            ({ display } = await LocalNotifications.requestPermissions());
        }
        if (display !== 'granted') {
            return { success: false, error: 'নোটিফিকেশনের অনুমতি প্রদান করা হয়নি। ফোনের সেটিংস থেকে হাসানা অ্যাপের নোটিফিকেশন চালু করুন।' };
        }

        try {
            const { exact_alarm } = await LocalNotifications.checkExactNotificationSetting();
            if (exact_alarm !== 'granted') {
                await LocalNotifications.changeExactNotificationSetting();
            }
        } catch {
            // Android 12+ setting
        }

        registerNativePush();
        return { success: true };
    } catch (err) {
        return { success: false, error: err?.message || 'অনুমতি গ্রহণে ত্রুটি হয়েছে।' };
    }
};

const pad = (n) => String(n).padStart(2, '0');
const localDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Day's ayah, hadith and occasion from the backend, or null offline
const fetchDailyForDate = async (dateKey) => {
    try {
        const baseUrl = isNative() ? 'https://hasanaa.com' : '';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${baseUrl}/api/notifications/daily-ayah?date=${dateKey}`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();
        if (data?.success && data.ayah) return data;
    } catch {
        // Fall back to offline pool
    }
    return null;
};

const getPrayerRemindBody = (prayerId) => {
    switch (prayerId) {
        case 'fajr':
            return 'আস-সালাতু খাইরুম মিনান নাওম — ঘুম থেকে নামাজ উত্তম। ওযু করে জামায়াতে যোগ দিন।';
        case 'dhuhr':
            return 'মিসওয়াক করে ওযু করুন। জামায়াতে যোহরের সালাত আদায় করুন।';
        case 'asr':
            return 'আসরের ওয়াক্ত শুরু হয়েছে। সময়মতো নামাজ আদায় করে অপরিসীম সওয়াব অর্জন করুন।';
        case 'maghrib':
            return 'মিসওয়াক করে ওযু করুন। নামাজের প্রস্তুতি নিন। দ্রুত মাগরিব আদায় করুন।';
        case 'isha':
            return 'ইশার ওয়াক্ত শুরু হয়েছে। জামায়াতে নামাজ ও রাতের বিতর সালাত আদায় করুন।';
        default:
            return 'মিসওয়াক করে ওযু করুন। নামাজের প্রস্তুতি নিন।';
    }
};

/**
 * Cancel and re-create all scheduled prayer / daily ayah / durood / hadith notifications
 * for the next DAYS_AHEAD days on device.
 */
export const rescheduleNativeNotifications = async ({ prayerEnabled = true, ayahEnabled = true, prefs = {} }) => {
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
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        });

        const daily = ayahEnabled
            ? await Promise.all(days.map((d) => fetchDailyForDate(localDateKey(d))))
            : [];

        days.forEach((day, dayIndex) => {
            const dateStr = localDateKey(day);

            // 1. Prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha)
            if (prayerEnabled) {
                const schedule = withJumuah(calculateSolarPrayerTimes(loc.latitude, loc.longitude, day), day);
                schedule.forEach((prayer, slot) => {
                    if (prefs[prayer.id] === false) return;
                    const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), prayer.startHour, prayer.startMin, 0);
                    if (at <= now) return;

                    const formattedTime = formatBnTime(prayer.startHour, prayer.startMin);
                    const title = `${prayer.name} : ওয়াক্ত শুরু @ ${formattedTime}`;
                    const body = prayer.nameEn === "Jumu'ah" ? JUMUAH_REMINDER : getPrayerRemindBody(prayer.id);

                    toSchedule.push({
                        id: ID_BASE + dayIndex * 10 + slot,
                        title,
                        body,
                        largeBody: body,
                        channelId: PRAYER_CHANNEL,
                        smallIcon: SMALL_ICON,
                        sound: NOTIFICATION_SOUND,
                        schedule: { at, allowWhileIdle: true },
                        extra: { url: '/', type: 'prayer' },
                    });
                });
            }

            // 2. Daily Quran Ayah (Morning 08:30)
            if (ayahEnabled) {
                const ayahAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), AYAH_HOUR, AYAH_MIN, 0);
                if (ayahAt > now) {
                    const ayah = daily[dayIndex]?.ayah || getOfflineAyahForDate(dateStr);
                    toSchedule.push({
                        id: ID_BASE + dayIndex * 10 + AYAH_SLOT,
                        title: 'আজকের নোটিফিকেশন',
                        body: `পবিত্র কুরআনে আল্লাহ তাআলা বলেছেন :\n"${ayah.text_bn}"\n— ${ayah.reference}`,
                        largeBody: `পবিত্র কুরআনে আল্লাহ তাআলা বলেছেন :\n"${ayah.text_bn}"\n— ${ayah.reference}`,
                        channelId: PRAYER_CHANNEL,
                        smallIcon: SMALL_ICON,
                        sound: NOTIFICATION_SOUND,
                        schedule: { at: ayahAt, allowWhileIdle: true },
                        extra: { url: ayah?.deep_link || '/quran', type: 'daily_ayah' },
                    });
                }

                // 3. Daily Durood Reminder (Afternoon 13:30)
                const duroodAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), DUROOD_HOUR, DUROOD_MIN, 0);
                if (duroodAt > now) {
                    toSchedule.push({
                        id: ID_BASE + dayIndex * 10 + DUROOD_SLOT,
                        title: 'নবীজির ﷺ উপর দুরূদ পড়ুন',
                        body: 'সারাদিন ব্যাপী দুরূদ পড়ার অভ্যাস গড়তে দুরূদ রিমাইন্ডার ফিচারটি চালু করুন। আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ।',
                        largeBody: 'সারাদিন ব্যাপী দুরূদ পড়ার অভ্যাস গড়তে দুরূদ রিমাইন্ডার ফিচারটি চালু করুন। আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ।',
                        channelId: PRAYER_CHANNEL,
                        smallIcon: SMALL_ICON,
                        sound: NOTIFICATION_SOUND,
                        schedule: { at: duroodAt, allowWhileIdle: true },
                        extra: { url: '/duas', type: 'durood' },
                    });
                }

                // 4. Daily Hadith (Night 20:30)
                const hadithAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), HADITH_HOUR, HADITH_MIN, 0);
                if (hadithAt > now) {
                    const hadith = daily[dayIndex]?.hadith || getOfflineHadithForDate(dateStr);
                    toSchedule.push({
                        id: ID_BASE + dayIndex * 10 + HADITH_SLOT,
                        title: 'আজকের নোটিফিকেশন',
                        body: `${hadith.narrator} থেকে বর্ণিত, রাসূলুল্লাহ ﷺ বলেছেন :\n"${hadith.text_bn}"\n— ${hadith.reference}`,
                        largeBody: `${hadith.narrator} থেকে বর্ণিত, রাসূলুল্লাহ ﷺ বলেছেন :\n"${hadith.text_bn}"\n— ${hadith.reference}`,
                        channelId: PRAYER_CHANNEL,
                        smallIcon: SMALL_ICON,
                        sound: NOTIFICATION_SOUND,
                        schedule: { at: hadithAt, allowWhileIdle: true },
                        extra: { url: '/hadith', type: 'daily_hadith' },
                    });
                }
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
        playNotificationSound();
        await LocalNotifications.schedule({
            notifications: [{
                id: Math.floor(Math.random() * 100000) + 5000,
                title,
                body,
                largeBody: body,
                channelId: PRAYER_CHANNEL,
                smallIcon: SMALL_ICON,
                sound: NOTIFICATION_SOUND,
                schedule: { at: new Date(Date.now() + 500), allowWhileIdle: true },
            }],
        });
        return true;
    } catch {
        return false;
    }
};

/**
 * Register for FCM push in the native app and send the token to the backend.
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
