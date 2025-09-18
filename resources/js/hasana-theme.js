const THEME_STORAGE_KEY = 'hasana-theme';

document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    initMenuToggle();
    initDarkModeToggle();
    initSurahSearch();
    initDateTimeTicker();
    initPrayerTimes();
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

function initSurahSearch() {
    const searchInput = document.querySelector('[data-surah-search]');
    const items = Array.from(document.querySelectorAll('[data-surah-item]'));
    if (!searchInput || !items.length) {
        return;
    }

    const filterItems = value => {
        const term = value.trim().toLowerCase();
        items.forEach(item => {
            const haystack = (item.dataset.search || '').toLowerCase();
            const match = !term || haystack.includes(term);
            item.classList.toggle('hidden', !match);
        });
    };

    searchInput.addEventListener('input', event => filterItems(event.target.value));
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
            timeElem.textContent = now.toLocaleTimeString('bn-BD', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
        }

        if (gregorianElem) {
            gregorianElem.textContent = now.toLocaleDateString('bn-BD', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }

        if (islamicElem) {
            try {
                const options = {
                    calendar: 'islamic-umalqura',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    numberingSystem: 'beng',
                };
                islamicElem.textContent = `${new Intl.DateTimeFormat('bn-BD', options).format(now)} 	`;
            } catch (error) {
                islamicElem.textContent = '';
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

    const applyTimings = timings => {
        const mapping = [
            { id: 'fajr', key: 'Fajr', endKey: 'Sunrise' },
            { id: 'dhuhr', key: 'Dhuhr', endKey: 'Asr' },
            { id: 'asr', key: 'Asr', endKey: 'Maghrib' },
            { id: 'maghrib', key: 'Maghrib', endKey: 'Isha' },
            { id: 'isha', key: 'Isha', endKey: 'Midnight' },
        ];

        mapping.forEach(entry => {
            const card = document.getElementById(entry.id);
            if (!card) return;
            const timeElem = card.querySelector('.time');
            const endElem = card.querySelector('.end-time');
            if (timeElem && timings[entry.key]) {
                timeElem.textContent = timings[entry.key];
            }
            if (endElem && timings[entry.endKey]) {
                endElem.textContent = `??? ???: ${timings[entry.endKey]}`;
            }
            card.classList.remove('next-prayer');
        });

        const now = new Date();
        let nextPrayerCard = null;
        mapping.forEach(entry => {
            const time = timings[entry.key];
            const card = document.getElementById(entry.id);
            if (!time || !card) return;
            const [hourStr, minuteStr] = time.split(':');
            const prayerDate = new Date();
            prayerDate.setHours(parseInt(hourStr, 10));
            prayerDate.setMinutes(parseInt(minuteStr, 10));
            prayerDate.setSeconds(0);
            if (prayerDate > now && !nextPrayerCard) {
                nextPrayerCard = card;
            }
        });

        if (nextPrayerCard) {
            nextPrayerCard.classList.add('next-prayer');
        }
    };

    const fetchByCity = async (city, country) => {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
            const result = await response.json();
            if (result?.code === 200) {
                applyTimings(result.data.timings);
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
            locationElem.textContent = 'Dhaka, Bangladesh';
            fetchByCity('Dhaka', 'Bangladesh');
        }
    };

    const handleError = () => {
        locationElem.textContent = 'Dhaka, Bangladesh';
        fetchByCity('Dhaka', 'Bangladesh');
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition, handleError, { timeout: 8000 });
    } else {
        handleError();
    }
}

