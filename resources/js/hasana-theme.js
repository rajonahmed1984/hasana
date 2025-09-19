const THEME_STORAGE_KEY = 'hasana-theme';
let prayerSchedule = [];
let prayerUpdateTimer = null;
const HIJRI_MONTHS_BN = {
    'Muharram': 'মুহাররম',
    'Safar': 'সফর',
    'Rabi Al-Awwal': 'রবিউল আউয়াল',
    'Rabi Al-Thani': 'রবিউস সানি',
    'Jumada Al-Awwal': 'জমাদিউল আউয়াল',
    'Jumada Al-Thani': 'জমাদিউস সানি',
    'Rajab': 'রজব',
    'Sha\'ban': 'শাবান',
    'Ramadan': 'রমজান',
    'Shawwal': 'শাওয়াল',
    'Dhu Al-Qadah': 'জিলকদ',
    'Dhu Al-Hijjah': 'জিলহজ',
};
let hasIslamicCalendarSupport = true;


document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    initMenuToggle();
    initDarkModeToggle();
    initDateTimeTicker();
    initPrayerTimes();
    initSurahSearch();
    setupSearchToggle();
});

function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('close-menu-btn');
    const offcanvasMenu = document.getElementById('offcanvas-menu');
    const overlay = document.getElementById('offcanvas-overlay');

    if (!menuToggle || !offcanvasMenu || !overlay) {
        return;
    }

    const openMenu = () => {
        offcanvasMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('overflow-hidden');
    };

    const closeMenu = () => {
        offcanvasMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    menuToggle.addEventListener('click', openMenu);
    overlay.addEventListener('click', closeMenu);
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('.offcanvas-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

function applyStoredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
}

function initDarkModeToggle() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) {
        return;
    }

    toggle.checked = document.body.classList.contains('dark-mode');
    toggle.addEventListener('change', () => {
        const enableDark = toggle.checked;
        document.body.classList.toggle('dark-mode', enableDark);
        localStorage.setItem(THEME_STORAGE_KEY, enableDark ? 'dark' : 'light');
    });
}

function initDateTimeTicker() {
    const timeElem = document.getElementById('current-time');
    const gregorianElem = document.getElementById('current-date');
    const islamicElem = document.getElementById('islamic-date');

    if (!timeElem && !gregorianElem && !islamicElem) {
        return;
    }

    const update = () => {
        const now = new Date();
        if (timeElem) {
            timeElem.textContent = formatDigits(now.toLocaleTimeString('bn-BD', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }));
        }

        if (gregorianElem) {
            gregorianElem.textContent = formatDigits(now.toLocaleDateString('bn-BD', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }));
        }

        if (islamicElem && hasIslamicCalendarSupport) {
            try {
                const options = {
                    calendar: 'islamic-umalqura',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    numberingSystem: 'beng',
                };
                const formatted = new Intl.DateTimeFormat('bn-BD', options).format(now);
                updateIslamicDate(formatted);
            } catch (error) {
                hasIslamicCalendarSupport = false;
            }
        }
    };

    update();
    setInterval(update, 1000);
}

function initPrayerTimes() {
    const locationElem = document.getElementById('location-text');
    const cards = document.querySelectorAll('.prayer-time-card');
    if (!locationElem || !cards.length) {
        return;
    }
    locationElem.textContent = 'লোকেশন নির্ধারণ করা হচ্ছে...';

    const applyTimings = (timings, hijriLabel = null) => {
        prayerSchedule = [];
        const mapping = [
            { id: 'fajr', key: 'Fajr', endKey: 'Sunrise' },
            { id: 'dhuhr', key: 'Dhuhr', endKey: 'Asr' },
            { id: 'asr', key: 'Asr', endKey: 'Maghrib' },
            { id: 'maghrib', key: 'Maghrib', endKey: 'Isha' },
            { id: 'isha', key: 'Isha', endKey: 'Fajr' },
        ];

        mapping.forEach(entry => {
            const card = document.getElementById(entry.id);
            if (!card) return;
            const timeElem = card.querySelector('.time');
            const endElem = card.querySelector('.end-time');
            const startMinutes = toMinutes(timings[entry.key]);

            card.classList.remove('next-prayer', 'current-prayer');

            if (timeElem && timings[entry.key]) {
                timeElem.textContent = 'শুরু: ' + formatDigits(timings[entry.key]);
            }

            if (endElem && timings[entry.endKey]) {
                endElem.textContent = 'শেষ: ' + formatDigits(timings[entry.endKey]);
            }

            if (startMinutes !== null) {
                prayerSchedule.push({ card, startMinutes });
            }
        });

        prayerSchedule.sort((a, b) => a.startMinutes - b.startMinutes);
        updateActivePrayer();

        if (!prayerUpdateTimer) {
            prayerUpdateTimer = setInterval(updateActivePrayer, 60000);
        }

        if (hijriLabel && !hasIslamicCalendarSupport) {
            updateIslamicDate(hijriLabel);
        }
    };

    const updateActivePrayer = () => {
        if (!prayerSchedule.length) {
            return;
        }

        const now = new Date();
        const minutesNow = now.getHours() * 60 + now.getMinutes();
        let active = prayerSchedule[0];

        for (let i = 0; i < prayerSchedule.length; i++) {
            const current = prayerSchedule[i];
            const next = prayerSchedule[(i + 1) % prayerSchedule.length];
            const currentStart = current.startMinutes;
            let windowEnd = next.startMinutes;

            if (next.startMinutes <= currentStart) {
                windowEnd += 1440;
            }

            const adjustedNow = minutesNow < currentStart ? minutesNow + 1440 : minutesNow;
            if (adjustedNow >= currentStart && adjustedNow < windowEnd) {
                active = current;
                break;
            }
        }

        prayerSchedule.forEach(({ card }) => card.classList.remove('next-prayer', 'current-prayer'));
        if (active) {
            active.card.classList.add('current-prayer', 'next-prayer');
        }
    };

    const useFallbackLocation = () => {
        locationElem.textContent = 'Dhaka, Bangladesh';
        fetchByCity('Dhaka', 'Bangladesh');
    };

    const fetchByIp = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('IP lookup failed');
            }
            const result = await response.json();
            const city = result.city || result.region || 'Dhaka';
            const country = result.country_name || result.country || 'Bangladesh';
            locationElem.textContent = `${city}, ${country}`;
            fetchByCity(city, country);
        } catch (error) {
            useFallbackLocation();
        }
    };

    const fetchByCity = async (city, country) => {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
            const result = await response.json();
            if (result?.code === 200) {
                const hijriLabel = formatHijriDate(result.data?.date?.hijri);
                applyTimings(result.data.timings, hijriLabel);
            }
        } catch (error) {
            console.warn('Prayer times fetch failed', error);
        }
    };

    const handlePosition = async position => {
        const { latitude, longitude } = position.coords;
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const result = await response.json();
            const city = result.city || 'Dhaka';
            const country = result.countryName || 'Bangladesh';
            locationElem.textContent = `${city}, ${country}`;
            fetchByCity(city, country);
        } catch (error) {
            useFallbackLocation();
        }
    };

    const handleError = () => {
        fetchByIp();
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition, handleError, { timeout: 8000 });
    } else {
        handleError();
    }
}

function initSurahSearch() {
    const inputs = Array.from(document.querySelectorAll('[data-surah-search]'));
    const items = Array.from(document.querySelectorAll('[data-surah-item]'));
    if (!inputs.length || !items.length) {
        return;
    }

    const filterItems = (term) => {
        const query = term.trim().toLowerCase();
        items.forEach((item) => {
            const haystack = (item.dataset.search || '').toLowerCase();
            item.classList.toggle('hidden', query.length > 0 && !haystack.includes(query));
        });
    };

    inputs.forEach((input) => {
        input.addEventListener('input', (event) => filterItems(event.target.value));
    });

    filterItems(inputs[0].value || '');
}

function setupSearchToggle() {
    const toggle = document.getElementById('search-toggle');
    const container = document.getElementById('header-search-container');
    if (!toggle || !container) {
        return;
    }

    const input = container.querySelector('[data-surah-search]');

    const close = () => {
        container.classList.remove('active');
        document.body.classList.remove('search-active');
    };

    toggle.addEventListener('click', (event) => {
        event.preventDefault();
        const willOpen = !container.classList.contains('active');
        container.classList.toggle('active', willOpen);
        document.body.classList.toggle('search-active', willOpen);
        if (willOpen && input) {
            requestAnimationFrame(() => input.focus());
        }
    });

    document.addEventListener('click', (event) => {
        if (!container.classList.contains('active')) {
            return;
        }
        if (!container.contains(event.target) && !toggle.contains(event.target)) {
            close();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && container.classList.contains('active')) {
            close();
        }
    });
}

function toMinutes(value) {
    if (!value) return null;
    const match = value.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours * 60 + minutes;
}

function formatDigits(input) {
    if (input === undefined || input === null) {
        return '';
    }
    const digits = [''০'', ''১'', ''২'', ''৩'', ''৪'', ''৫'', ''৬'', ''৭'', ''৮'', ''৯''];
    return String(input).replace(/\d/g, digit => digits[Number(digit)] ?? digit);
}















function formatHijriDate(hijri) {
    if (!hijri) {
        return null;
    }
    const day = hijri.day ? formatDigits(hijri.day) : '';
    const monthSource = hijri.month?.bn || hijri.month?.en || hijri.month || '';
    const monthName = typeof monthSource === 'string' ? (HIJRI_MONTHS_BN[monthSource] || monthSource) : '';
    const year = hijri.year ? formatDigits(hijri.year) : '';
    const parts = [day, monthName, year].filter(Boolean);
    return parts.length ? parts.join(' ') : null;
}

function updateIslamicDate(rawText, options = {}) {
    const islamicElem = document.getElementById('islamic-date');
    if (!islamicElem) {
        return;
    }
    const { appendSuffix = true } = options;
    const baseText = typeof rawText === 'string' ? rawText.trim() : '';
    if (!baseText) {
        return;
    }
    const normalized = formatDigits(baseText);
    const needsSuffix = appendSuffix && !normalized.endsWith('হিজরি');
    islamicElem.textContent = needsSuffix ? `${normalized} হিজরি` : normalized;
}


