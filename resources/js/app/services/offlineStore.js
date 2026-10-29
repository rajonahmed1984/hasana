// Offline data packs for Hasana (Quran, hadith, duas), kept in Cache Storage.
// The service worker (public/sw.js) reads these to answer API requests when there is no internet,
// so pages keep using the normal /api URLs and work offline without changes.

import { isNative } from '../native';

const OFFLINE_DATA = 'hasana-offline-data'; // must match public/sw.js
const META_KEY = '/__offline/meta';
const QURAN_MAX_AGE_DAYS = 30;
// Bump when downloaded texts were corrected on the server, so the app refreshes its copy right away
const DATA_VERSION = 2;

const supported = () => typeof window !== 'undefined' && 'caches' in window;

const putJson = (cache, key, value) =>
    cache.put(`/__offline/${key}`, new Response(JSON.stringify(value), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }));

const fetchJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!res.ok) throw new Error(`ডাউনলোড ব্যর্থ হয়েছে (${res.status})`);
    return res.json();
};

/**
 * @returns {Promise<{quran?: {at:number, count:number}, duas?: {at:number, count:number}, hadith?: {at:number, count:number, categories:number}}>}
 */
export const getOfflineStatus = async () => {
    if (!supported()) return {};
    try {
        const res = await caches.match(META_KEY, { cacheName: OFFLINE_DATA });
        return res ? await res.json() : {};
    } catch {
        return {};
    }
};

const updateMeta = async (cache, pack, value) => {
    const meta = await getOfflineStatus();
    if (value) {
        meta[pack] = value;
    } else {
        delete meta[pack];
    }
    await cache.put(META_KEY, new Response(JSON.stringify(meta), { headers: { 'Content-Type': 'application/json' } }));
    window.dispatchEvent(new CustomEvent('hasana-offline-status', { detail: meta }));
};

/**
 * Download the whole Quran (114 surahs with all ayahs, ~4 MB).
 */
export const downloadQuran = async (onProgress = () => {}) => {
    onProgress(0.05);
    const pack = await fetchJson('/api/offline/quran');
    onProgress(0.6);

    const cache = await caches.open(OFFLINE_DATA);
    await putJson(cache, 'quran/list', pack.list);
    for (let i = 0; i < pack.surahs.length; i++) {
        const surah = pack.surahs[i];
        await putJson(cache, `quran/surah/${surah.data.slug}`, surah);
        onProgress(0.6 + (0.4 * (i + 1)) / pack.surahs.length);
    }

    await updateMeta(cache, 'quran', { at: Date.now(), count: pack.surahs.length, v: DATA_VERSION });
};

/**
 * Download every dua with its categories (small).
 */
export const downloadDuas = async (onProgress = () => {}) => {
    const [categories, pack] = await Promise.all([
        fetchJson('/api/dua/categories'),
        fetchJson('/api/offline/duas'),
    ]);
    onProgress(0.8);

    const cache = await caches.open(OFFLINE_DATA);
    await putJson(cache, 'dua/categories', categories.data || []);
    await putJson(cache, 'dua/all', pack.data || []);
    await updateMeta(cache, 'duas', { at: Date.now(), count: (pack.data || []).length, v: DATA_VERSION });
    onProgress(1);
};

/**
 * Download all hadith, one category at a time (~40 MB in total).
 */
export const downloadHadiths = async (onProgress = () => {}) => {
    const { data: categories = [] } = await fetchJson('/api/hadith/categories');
    const cache = await caches.open(OFFLINE_DATA);
    let count = 0;

    for (let i = 0; i < categories.length; i++) {
        const { slug } = categories[i];
        const pack = await fetchJson(`/api/offline/hadiths/${encodeURIComponent(slug)}`);
        await putJson(cache, `hadith/category/${slug}`, pack.data || []);
        count += (pack.data || []).length;
        onProgress((i + 1) / categories.length);
    }

    // Saved last, so a half-finished download never looks complete
    await putJson(cache, 'hadith/categories', categories);
    await updateMeta(cache, 'hadith', { at: Date.now(), count, categories: categories.length, v: DATA_VERSION });
};

/**
 * Remove one downloaded pack ('quran' | 'duas' | 'hadith') to free space.
 */
export const removeOfflinePack = async (pack) => {
    if (!supported()) return;
    const prefix = { quran: '/__offline/quran/', duas: '/__offline/dua/', hadith: '/__offline/hadith/' }[pack];
    const cache = await caches.open(OFFLINE_DATA);
    const keys = await cache.keys();
    await Promise.all(keys.filter((req) => new URL(req.url).pathname.startsWith(prefix)).map((req) => cache.delete(req)));
    await updateMeta(cache, pack, null);
};

/**
 * Space used by this app on the device, in MB (approximate).
 */
export const getStorageUsageMb = async () => {
    try {
        const { usage } = await navigator.storage.estimate();
        return Math.round((usage / (1024 * 1024)) * 10) / 10;
    } catch {
        return null;
    }
};

/**
 * Register the service worker (offline app shell + push) and keep its cache in step with the latest deploy.
 */
export const registerServiceWorker = async () => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    try {
        await navigator.serviceWorker.register('/sw.js');
        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({ type: 'SYNC_APP_SHELL' });

        // Ask the browser not to clear our offline data when storage runs low
        if (navigator.storage?.persist) {
            navigator.storage.persist().catch(() => {});
        }
    } catch (err) {
        console.warn('[Offline] Service worker registration failed:', err);
    }
};

/**
 * In the Android app, quietly download the Quran and duas once (and refresh monthly),
 * so they are readable offline without the user doing anything.
 */
export const autoDownloadForOffline = async () => {
    if (!isNative() || !supported() || !navigator.onLine) return;

    const status = await getOfflineStatus();
    const stale = (pack, days) => !status[pack]
        || (status[pack].v || 1) < DATA_VERSION
        || Date.now() - status[pack].at > days * 86400000;

    try {
        if (stale('quran', QURAN_MAX_AGE_DAYS)) await downloadQuran();
        if (stale('duas', QURAN_MAX_AGE_DAYS)) await downloadDuas();
    } catch (err) {
        console.warn('[Offline] Automatic download failed, will retry next launch:', err);
    }
};
