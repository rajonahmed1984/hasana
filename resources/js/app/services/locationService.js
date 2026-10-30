import { syncDeviceWithBackend } from './deviceRegistration';

// Location & Astronomical Prayer Times Engine for Hasana App
// Provides GPS detection, Bengali reverse-geocoding, and offline/online astronomical prayer calculations.

export const toBengaliDigits = (numOrStr) => {
    const bnDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return String(numOrStr).replace(/\d/g, (d) => bnDigits[Number(d)]);
};

export const DEFAULT_LOCATION = {
    latitude: 23.8103,
    longitude: 90.4125,
    cityName: 'ঢাকা, বাংলাদেশ',
    city: 'ঢাকা',
    country: 'বাংলাদেশ',
    timezone: 6, // UTC+6
    isDefault: true,
};

const LOCATION_STORAGE_KEY = 'hasana-user-location';
const PRAYER_CACHE_KEY = 'hasana-cached-prayer-times';

/**
 * Convert number to 2-digit Bengali numeral string with leading zero
 */
export const formatBengaliTime = (hours, minutes) => {
    // 12-hour format
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    const hStr = h12 < 10 ? `0${h12}` : `${h12}`;
    const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return toBengaliDigits(`${hStr}:${mStr}`);
};

/**
 * Convert radians to degrees and vice versa
 */
const radToDeg = (rad) => (rad * 180) / Math.PI;
const degToRad = (deg) => (deg * Math.PI) / 180;

/**
 * High-precision Solar Astronomical Prayer Calculation (Karachi Method / South Asia Hanafi standard)
 * Zero external dependencies, works 100% offline.
 */
export const calculateSolarPrayerTimes = (latitude, longitude, date = new Date(), timezoneOffsetHours = null) => {
    const lat = latitude;
    const lng = longitude;
    
    // Timezone in hours (e.g. +6 for BD, or detected from browser)
    const tz = timezoneOffsetHours !== null 
        ? timezoneOffsetHours 
        : -(date.getTimezoneOffset() / 60);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Day of the year
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const currentUTC = new Date(Date.UTC(year, month - 1, day));
    const dayOfYear = Math.floor((currentUTC - startOfYear) / 86400000) + 1;

    // Fractional year in radians
    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

    // Equation of time (in minutes)
    const eqtime = 229.18 * (
        0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma)
    );

    // Solar declination (in radians)
    const decl = 
        0.006918 -
        0.399912 * Math.cos(gamma) +
        0.070257 * Math.sin(gamma) -
        0.006758 * Math.cos(2 * gamma) +
        0.000907 * Math.sin(2 * gamma) -
        0.002697 * Math.cos(3 * gamma) +
        0.00148 * Math.sin(3 * gamma);

    // Solar noon (Dhuhr) in hours
    const timeOffset = eqtime + 4 * lng - 60 * tz;
    const solarNoon = 12 - timeOffset / 60;

    // Hour angle helper
    const getHourAngle = (angleDeg) => {
        const latRad = degToRad(lat);
        const angleRad = degToRad(angleDeg);
        const cosHA = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decl)) / 
                      (Math.cos(latRad) * Math.cos(decl));

        if (cosHA > 1 || cosHA < -1) return null; // Extreme latitudes
        return radToDeg(Math.acos(cosHA));
    };

    // 1. Fajr (Karachi angle: -18°)
    const fajrHA = getHourAngle(-18) || 108;
    const fajrHours = solarNoon - fajrHA / 15;

    // 2. Sunrise (Angle: -0.833°)
    const sunriseHA = getHourAngle(-0.833) || 90;
    const sunriseHours = solarNoon - sunriseHA / 15;

    // 3. Dhuhr (Solar noon + 2 min buffer)
    const dhuhrHours = solarNoon + (2 / 60);

    // 4. Asr (Hanafi shadow factor = 2.0)
    const latRad = degToRad(lat);
    const asrAngleRad = Math.atan(1 / (2 + Math.tan(Math.abs(latRad - decl))));
    const asrAngleDeg = radToDeg(asrAngleRad);
    const asrHA = getHourAngle(asrAngleDeg) || 55;
    const asrHours = solarNoon + asrHA / 15;

    // 5. Maghrib (Sunset: -0.833° + 2 min safety buffer)
    const sunsetHA = getHourAngle(-0.833) || 90;
    const maghribHours = solarNoon + sunsetHA / 15 + (2 / 60);

    // 6. Isha (Karachi angle: -18°)
    const ishaHA = getHourAngle(-18) || 108;
    const ishaHours = solarNoon + ishaHA / 15;

    const parseHoursToObj = (timeDecimal) => {
        let t = (timeDecimal + 24) % 24;
        const h = Math.floor(t);
        const m = Math.floor((t - h) * 60);
        return { hour: h, minute: m, formatted: formatBengaliTime(h, m) };
    };

    const fajr = parseHoursToObj(fajrHours);
    const sunrise = parseHoursToObj(sunriseHours);
    const dhuhr = parseHoursToObj(dhuhrHours);
    const asr = parseHoursToObj(asrHours);
    const maghrib = parseHoursToObj(maghribHours);
    const isha = parseHoursToObj(ishaHours);

    return [
        {
            id: 'fajr',
            name: 'ফজর',
            nameEn: 'Fajr',
            startHour: fajr.hour,
            startMin: fajr.minute,
            start: fajr.formatted,
            end: sunrise.formatted,
            endHour: sunrise.hour,
            endMin: sunrise.minute,
            title: 'ফজরের নামাজের সময় হয়েছে 🌅',
            body: 'আস-সালাতু খাইরুম মিনান নাওম — ঘুম থেকে নামাজ উত্তম। আসুন জামায়াতে নামাজ আদায় করি।',
        },
        {
            id: 'dhuhr',
            name: 'যোহর',
            nameEn: 'Dhuhr',
            startHour: dhuhr.hour,
            startMin: dhuhr.minute,
            start: dhuhr.formatted,
            end: asr.formatted,
            title: 'যোহরের নামাজের সময় হয়েছে ☀️',
            body: 'যোহরের নামাজের ওয়াক্ত শুরু হয়েছে। দুনিয়াবী ব্যস্ততা ছেড়ে রবের ডাকে সাড়া দিন।',
        },
        {
            id: 'asr',
            name: 'আসর',
            nameEn: 'Asr',
            startHour: asr.hour,
            startMin: asr.minute,
            start: asr.formatted,
            end: maghrib.formatted,
            title: 'আসরের নামাজের সময় হয়েছে ⛅',
            body: 'আসরের নামাজের ওয়াক্ত শুরু হয়েছে। সময়মতো নামাজ আদায় করে অপরিসীম সওয়াব অর্জন করুন।',
        },
        {
            id: 'maghrib',
            name: 'মাগরিব',
            nameEn: 'Maghrib',
            startHour: maghrib.hour,
            startMin: maghrib.minute,
            start: maghrib.formatted,
            end: isha.formatted,
            title: 'মাগরিবের নামাজের সময় হয়েছে 🌇',
            body: 'সূর্যাস্তের সাথে সাথে মাগরিবের ওয়াক্ত শুরু হয়েছে। বিলম্ব না করে দ্রুত নামাজ আদায় করুন।',
        },
        {
            id: 'isha',
            name: 'ইশা',
            nameEn: 'Isha',
            startHour: isha.hour,
            startMin: isha.minute,
            start: isha.formatted,
            end: fajr.formatted,
            title: 'ইশার নামাজের সময় হয়েছে 🌙',
            body: 'ইশার নামাজের ওয়াক্ত শুরু হয়েছে। জামায়াতে নামাজ ও রাতের বিতর সালাত আদায় করুন।',
        },
    ];
};

/**
 * Fetch online prayer times with AlAdhan API, fallback to local astronomical calculator
 */
export const getAccuratePrayerTimes = async (latitude, longitude, date = new Date()) => {
    const lat = latitude || DEFAULT_LOCATION.latitude;
    const lng = longitude || DEFAULT_LOCATION.longitude;
    const dateStr = date.toISOString().slice(0, 10);
    const cacheKey = `${PRAYER_CACHE_KEY}_${lat.toFixed(2)}_${lng.toFixed(2)}_${dateStr}`;

    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const schedule = JSON.parse(cached);
            // Older cached schedules lack Fajr's sunrise end time; refetch those
            if (schedule?.[0]?.endHour != null) return schedule;
        }
    } catch {
        // Continue
    }

    // Try AlAdhan API (Method 1 = Karachi)
    try {
        const timestamp = Math.floor(date.getTime() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=1`;
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
            const json = await res.json();
            const timings = json?.data?.timings;
            if (timings) {
                const parseTimeStr = (timeStr) => {
                    const [hStr, mStr] = timeStr.split(' ')[0].split(':');
                    const h = parseInt(hStr, 10);
                    const m = parseInt(mStr, 10);
                    return { hour: h, minute: m, formatted: formatBengaliTime(h, m) };
                };

                const fajr = parseTimeStr(timings.Fajr);
                const sunrise = parseTimeStr(timings.Sunrise);
                const dhuhr = parseTimeStr(timings.Dhuhr);
                const asr = parseTimeStr(timings.Asr);
                const maghrib = parseTimeStr(timings.Maghrib);
                const isha = parseTimeStr(timings.Isha);

                const schedule = [
                    {
                        id: 'fajr',
                        name: 'ফজর',
                        nameEn: 'Fajr',
                        startHour: fajr.hour,
                        startMin: fajr.minute,
                        start: fajr.formatted,
                        end: sunrise.formatted,
                        endHour: sunrise.hour,
                        endMin: sunrise.minute,
                        title: 'ফজরের নামাজের সময় হয়েছে 🌅',
                        body: 'আস-সালাতু খাইরুম মিনান নাওম — ঘুম থেকে নামাজ উত্তম। আসুন জামায়াতে নামাজ আদায় করি।',
                    },
                    {
                        id: 'dhuhr',
                        name: 'যোহর',
                        nameEn: 'Dhuhr',
                        startHour: dhuhr.hour,
                        startMin: dhuhr.minute,
                        start: dhuhr.formatted,
                        end: asr.formatted,
                        title: 'যোহরের নামাজের সময় হয়েছে ☀️',
                        body: 'যোহরের নামাজের ওয়াক্ত শুরু হয়েছে। দুনিয়াবী ব্যস্ততা ছেড়ে রবের ডাকে সাড়া দিন।',
                    },
                    {
                        id: 'asr',
                        name: 'আসর',
                        nameEn: 'Asr',
                        startHour: asr.hour,
                        startMin: asr.minute,
                        start: asr.formatted,
                        end: maghrib.formatted,
                        title: 'আসরের নামাজের সময় হয়েছে ⛅',
                        body: 'আসরের নামাজের ওয়াক্ত শুরু হয়েছে। সময়মতো নামাজ আদায় করে অপরিসীম সওয়াব অর্জন করুন।',
                    },
                    {
                        id: 'maghrib',
                        name: 'মাগরিব',
                        nameEn: 'Maghrib',
                        startHour: maghrib.hour,
                        startMin: maghrib.minute,
                        start: maghrib.formatted,
                        end: isha.formatted,
                        title: 'মাগরিবের নামাজের সময় হয়েছে 🌇',
                        body: 'সূর্যাস্তের সাথে সাথে মাগরিবের ওয়াক্ত শুরু হয়েছে। বিলম্ব না করে দ্রুত নামাজ আদায় করুন।',
                    },
                    {
                        id: 'isha',
                        name: 'ইশা',
                        nameEn: 'Isha',
                        startHour: isha.hour,
                        startMin: isha.minute,
                        start: isha.formatted,
                        end: fajr.formatted,
                        title: 'ইশার নামাজের সময় হয়েছে 🌙',
                        body: 'ইশার নামাজের ওয়াক্ত শুরু হয়েছে। জামায়াতে নামাজ ও রাতের বিতর সালাত আদায় করুন।',
                    },
                ];

                try {
                    localStorage.setItem(cacheKey, JSON.stringify(schedule));
                } catch {
                    // Ignore quota errors
                }

                return schedule;
            }
        }
    } catch (err) {
        // Fallback to local offline astronomical calculator
    }

    // Mathematical Solar fallback
    const offlineSchedule = calculateSolarPrayerTimes(lat, lng, date);
    try {
        localStorage.setItem(cacheKey, JSON.stringify(offlineSchedule));
    } catch {
        // Ignore
    }
    return offlineSchedule;
};

/**
 * Get current stored location or fallback
 */
export const getStoredLocation = () => {
    try {
        const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch {
        // Ignore
    }
    return DEFAULT_LOCATION;
};

/**
 * Reverse geocode latitude & longitude into localized Bengali City Name
 */
export const reverseGeocodeBengali = async (lat, lng) => {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=bn`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || 'অজ্ঞাত এলাকা';
            const country = data.countryName || 'বাংলাদেশ';
            return {
                city,
                country,
                cityName: `${city}, ${country}`,
            };
        }
    } catch (err) {
        console.warn('[LocationService] Reverse geocode error:', err);
    }

    // Default approximation
    return {
        city: 'আপনার এলাকা',
        country: 'বাংলাদেশ',
        cityName: 'আপনার এলাকা, বাংলাদেশ',
    };
};

/**
 * Request user GPS Location and save it
 */
export const requestUserLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
        return {
            success: false,
            error: 'ডিভাইসে লোকেশন সুবিধা সমর্থিত নয়।',
            location: getStoredLocation(),
        };
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                const geo = await reverseGeocodeBengali(lat, lng);
                const locObj = {
                    latitude: lat,
                    longitude: lng,
                    city: geo.city,
                    country: geo.country,
                    cityName: geo.cityName,
                    timezone: -(new Date().getTimezoneOffset() / 60),
                    updatedAt: Date.now(),
                    isDefault: false,
                };

                localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locObj));

                // Recalculate and update schedule
                const schedule = await getAccuratePrayerTimes(lat, lng);
                localStorage.setItem('hasana-dynamic-prayer-schedule', JSON.stringify(schedule));

                // Sync with backend API if a push token exists, and let notification schedulers recalculate
                syncLocationWithBackend(locObj);
                window.dispatchEvent(new CustomEvent('hasana-location-changed'));

                resolve({
                    success: true,
                    location: locObj,
                    schedule,
                });
            },
            (err) => {
                console.warn('[LocationService] Geolocation denied or failed:', err);
                resolve({
                    success: false,
                    error: err.message || 'লোকেশন অনুমতি পাওয়া যায়নি।',
                    location: getStoredLocation(),
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 3600000, // 1 hour
            }
        );
    });
};

/**
 * Sync location with backend (if this device has a push token)
 */
export const syncLocationWithBackend = (location) => syncDeviceWithBackend({
    latitude: location.latitude,
    longitude: location.longitude,
    city_name: location.cityName,
});

// On Fridays the Dhuhr waqt is prayed as Jumu'ah (জুমা)
export const isJumuahDay = (date = new Date()) => date.getDay() === 5;

export const dhuhrNameFor = (date = new Date()) => (isJumuahDay(date) ? 'জুমা' : 'যোহর');

export const JUMUAH_REMINDER = 'গোসল করে পরিচ্ছন্ন পোশাক ও সুগন্ধি নিয়ে আগে আগে মসজিদে যান। মনোযোগ দিয়ে খুতবা শুনুন।';

/**
 * Same schedule with Dhuhr renamed to Jumu'ah when `date` is a Friday.
 */
export const withJumuah = (schedule, date = new Date()) => {
    if (!schedule || !isJumuahDay(date)) return schedule;
    return schedule.map((p) => (p.id === 'dhuhr'
        ? { ...p, name: 'জুমা', nameEn: "Jumu'ah", title: 'জুমার নামাজের সময় হয়েছে 🕌', body: JUMUAH_REMINDER }
        : p));
};

/**
 * Calculates live real-time countdown to the next prayer / end of current waqt.
 * Runs second-by-second and updates live.
 */
export const calculatePrayerCountdown = (prayerTimes, now = new Date()) => {
    if (!prayerTimes || prayerTimes.length < 5) {
        return {
            currentPrayerName: 'নামাজ',
            nextPrayerName: '',
            nextPrayerTime: '',
            remainingSeconds: 0,
            formattedCountdown: '00:00:00',
            label: 'পরবর্তী ওয়াক্তের বাকি সময়',
        };
    }

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    const getPrayerDate = (prayer, dayOffset = 0) => {
        return new Date(currentYear, currentMonth, currentDate + dayOffset, prayer.startHour, prayer.startMin, 0, 0);
    };

    const fajrStart = getPrayerDate(prayerTimes[0]);
    const sunriseEnd = new Date(
        currentYear,
        currentMonth,
        currentDate,
        prayerTimes[0].endHour ?? prayerTimes[0].startHour + 1,
        prayerTimes[0].endMin ?? prayerTimes[0].startMin + 20,
        0, 0
    );
    const dhuhrStart = getPrayerDate(prayerTimes[1]);
    const asrStart = getPrayerDate(prayerTimes[2]);
    const maghribStart = getPrayerDate(prayerTimes[3]);
    const ishaStart = getPrayerDate(prayerTimes[4]);
    const nextFajrStart = getPrayerDate(prayerTimes[0], 1);

    const dhuhrName = dhuhrNameFor(now);
    let currentPrayerName = '';
    let nextPrayerName = '';
    let nextPrayerTime = '';
    let targetEndDate = null;
    let label = 'ওয়াক্ত শেষ হতে বাকি';

    if (now < fajrStart) {
        currentPrayerName = 'ইশা / তাহাজ্জুদ';
        nextPrayerName = 'ফজর';
        nextPrayerTime = prayerTimes[0].start;
        targetEndDate = fajrStart;
        label = 'ফজর ওয়াক্ত শুরু হতে বাকি';
    } else if (now >= fajrStart && now < sunriseEnd) {
        currentPrayerName = 'ফজর';
        nextPrayerName = 'সূর্যোদয়';
        nextPrayerTime = prayerTimes[0].end;
        targetEndDate = sunriseEnd;
        label = 'ফজর ওয়াক্ত শেষ হতে বাকি';
    } else if (now >= sunriseEnd && now < dhuhrStart) {
        currentPrayerName = 'ইশরাক / চাশত';
        nextPrayerName = dhuhrName;
        nextPrayerTime = prayerTimes[1].start;
        targetEndDate = dhuhrStart;
        label = `${dhuhrName} ওয়াক্ত শুরু হতে বাকি`;
    } else if (now >= dhuhrStart && now < asrStart) {
        currentPrayerName = dhuhrName;
        nextPrayerName = 'আসর';
        nextPrayerTime = prayerTimes[2].start;
        targetEndDate = asrStart;
        label = `${dhuhrName} ওয়াক্ত শেষ হতে বাকি`;
    } else if (now >= asrStart && now < maghribStart) {
        currentPrayerName = 'আসর';
        nextPrayerName = 'মাগরিব';
        nextPrayerTime = prayerTimes[3].start;
        targetEndDate = maghribStart;
        label = 'আসর ওয়াক্ত শেষ হতে বাকি';
    } else if (now >= maghribStart && now < ishaStart) {
        currentPrayerName = 'মাগরিব';
        nextPrayerName = 'ইশা';
        nextPrayerTime = prayerTimes[4].start;
        targetEndDate = ishaStart;
        label = 'মাগরিব ওয়াক্ত শেষ হতে বাকি';
    } else {
        currentPrayerName = 'ইশা';
        nextPrayerName = 'ফজর';
        nextPrayerTime = prayerTimes[0].start;
        targetEndDate = nextFajrStart;
        label = 'ইশা ওয়াক্ত শেষ হতে বাকি';
    }

    const diffMs = Math.max(0, targetEndDate.getTime() - now.getTime());
    const totalSec = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const pad = (n) => String(n).padStart(2, '0');
    const formattedCountdown = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return {
        currentPrayerName,
        nextPrayerName,
        nextPrayerTime,
        remainingSeconds: totalSec,
        formattedCountdown,
        label,
    };
};
