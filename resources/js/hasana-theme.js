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
const PRAYER_START_PREFIX_BN = 'শুরু: ';
const PRAYER_END_PREFIX_BN = 'শেষ: ';
const BOOKMARK_STORAGE_KEY = 'hasana_bookmarks';
const ARABIC_FONT_KEY = 'hasana_arabic_font_size';
const TRANSLATION_FONT_KEY = 'hasana_translation_font_size';
const TRANSLATION_TOGGLE_KEY = 'hasana_translation_enabled';
let bookmarkListContainer = null;


document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    applyStoredFontSizes();
    applyTranslationVisibility();
    initMenuToggle();
    initDarkModeToggle();
    initDateTimeTicker();
    initPrayerTimes();
    initSurahSearch();
    setupSearchToggle();
    initBookmarkButtons();
    initBookmarkListPage();
    initSettingsPage();
    initShareButtons();
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

        mapping.forEach((entry, index) => {
            const card = document.getElementById(entry.id);
            if (!card) return;
            const timeElem = card.querySelector('.time');
            const endElem = card.querySelector('.end-time');
            const startValue = timings[entry.key];
            const endValue = timings[entry.endKey];
            const startMinutes = toMinutes(startValue);

            card.classList.remove('next-prayer', 'current-prayer');

            if (timeElem) {
                const startText = formatDigits(formatPrayerTime(startValue));
                timeElem.textContent = PRAYER_START_PREFIX_BN + startText;
            }

            if (endElem) {
                const endText = formatDigits(formatPrayerTime(endValue));
                endElem.textContent = PRAYER_END_PREFIX_BN + endText;
            }

            if (startMinutes !== null) {
                let endMinutes = toMinutes(endValue);
                if (endMinutes === null) {
                    const fallback = mapping[(index + 1) % mapping.length];
                    endMinutes = toMinutes(timings[fallback.key]);
                }

                if (endMinutes !== null && endMinutes <= startMinutes) {
                    endMinutes += 1440;
                }

                prayerSchedule.push({ card, startMinutes, endMinutes });
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
        let activeEntry = null;

        for (let i = 0; i < prayerSchedule.length; i++) {
            const current = prayerSchedule[i];
            const next = prayerSchedule[(i + 1) % prayerSchedule.length];
            const start = current.startMinutes;
            let end = current.endMinutes;

            if (end === null || end === undefined) {
                end = next ? next.startMinutes : start;
            }

            if (end <= start) {
                end += 1440;
            }

            const adjustedNow = minutesNow < start ? minutesNow + 1440 : minutesNow;
            if (adjustedNow >= start && adjustedNow < end) {
                activeEntry = current;
                break;
            }
        }

        prayerSchedule.forEach(({ card }) => card.classList.remove('next-prayer', 'current-prayer'));
        if (activeEntry) {
            activeEntry.card.classList.add('current-prayer');
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

function formatPrayerTime(value) {
    if (!value) {
        return '--:-- --';
    }
    const match = String(value).match(/(\d{1,2}):(\d{2})/);
    if (!match) {
        return String(value);
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hourLabel = String(hours).padStart(2, '0');
    return `${hourLabel}:${minutes} ${suffix}`;
}
function formatDigits(input) {
    if (input === undefined || input === null) {
        return '';
    }
    const digits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
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





function applyStoredFontSizes() {
    const arabicSize = localStorage.getItem(ARABIC_FONT_KEY);
    const translationSize = localStorage.getItem(TRANSLATION_FONT_KEY);
    if (arabicSize) {
        document.documentElement.style.setProperty('--ayah-arabic-font-size', `${arabicSize}px`);
    }
    if (translationSize) {
        document.documentElement.style.setProperty('--ayah-translation-font-size', `${translationSize}px`);
    }
}

function applyTranslationVisibility() {
    const stored = localStorage.getItem(TRANSLATION_TOGGLE_KEY);
    const enabled = stored === null ? true : stored === '1';
    document.body.classList.toggle('translation-hidden', !enabled);
}

function getBookmarkSet() {
    try {
        const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (!raw) {
            return new Set();
        }
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
        console.warn('Failed to parse bookmarks', error);
        return new Set();
    }
}

function saveBookmarkSet(set) {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify([...set]));
}

export function refreshBookmarkButtons() {
    const bookmarks = getBookmarkSet();
    document.querySelectorAll('.bookmark-btn[data-ayah]').forEach((button) => {
        setBookmarkButtonState(button, bookmarks.has(button.dataset.ayah));
    });
}

function setBookmarkButtonState(button, isActive) {
    button.classList.toggle('active', isActive);
    const icon = button.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-solid', 'fa-regular', 'fa-bookmark');
        icon.classList.add('bi');
        icon.classList.toggle('bi-bookmark-fill', isActive);
        icon.classList.toggle('bi-bookmark', !isActive);
    }
}

export function initBookmarkButtons() {
    const buttons = document.querySelectorAll('.bookmark-btn[data-ayah]');
    if (!buttons.length) {
        return;
    }
    refreshBookmarkButtons();
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const key = button.dataset.ayah;
            if (!key) {
                return;
            }
            const isActive = toggleBookmark(key);
            setBookmarkButtonState(button, isActive);
            showToast(isActive ? 'বুকমার্কে যোগ করা হয়েছে' : 'বুকমার্ক থেকে সরানো হয়েছে');
        });
    });
}

function toggleBookmark(key) {
    const bookmarks = getBookmarkSet();
    let isActive = false;
    if (bookmarks.has(key)) {
        bookmarks.delete(key);
    } else {
        bookmarks.add(key);
        isActive = true;
    }
    saveBookmarkSet(bookmarks);
    refreshBookmarkButtons();
    renderBookmarkList();
    return isActive;
}

function initBookmarkListPage() {
    const container = document.getElementById('bookmark-list');
    if (!container) {
        return;
    }
    bookmarkListContainer = container;
    container.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.remove-bookmark-btn');
        if (removeBtn) {
            event.preventDefault();
            const key = removeBtn.dataset.ayah;
            if (!key) {
                return;
            }
            const bookmarks = getBookmarkSet();
            if (bookmarks.delete(key)) {
                saveBookmarkSet(bookmarks);
                renderBookmarkList();
                refreshBookmarkButtons();
                showToast('বুকমার্ক সরানো হয়েছে');
            }
            return;
        }
    });
    renderBookmarkList();
}

function renderBookmarkList() {
    if (!bookmarkListContainer) {
        return;
    }
    const emptyState = bookmarkListContainer.querySelector('[data-empty]');
    bookmarkListContainer.querySelectorAll('.bookmark-item').forEach((node) => node.remove());

    const keys = Array.from(getBookmarkSet());
    if (!keys.length) {
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }
    if (emptyState) {
        emptyState.classList.add('hidden');
    }

    const endpoint = bookmarkListContainer.dataset.endpoint;
    if (!endpoint) {
        return;
    }

    fetch(`${endpoint}?keys=${encodeURIComponent(keys.join(','))}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .then((payload) => {
            const items = Array.isArray(payload?.data) ? payload.data : [];
            if (!items.length) {
                if (emptyState) {
                    emptyState.textContent = 'বুকমার্ক লোড করা যায়নি।';
                    emptyState.classList.remove('hidden');
                }
                return;
            }

            const shareBase = bookmarkListContainer.dataset.shareBase || getShareBaseUrl();

            items.forEach((item) => {
                const card = document.createElement('article');
                card.className = 'ayah-card bookmark-item';
                card.dataset.ayahKey = item.key;

                const header = document.createElement('div');
                header.className = 'ayah-header';

                const number = document.createElement('span');
                number.className = 'ayah-number';
                const referenceLabel = item.surah_name ? `${item.surah_name} (${item.reference_bn})` : item.reference_bn;
                number.textContent = referenceLabel;
                header.appendChild(number);

                const actions = document.createElement('div');
                actions.className = 'ayah-actions';

                const shareBtn = document.createElement('button');
                shareBtn.type = 'button';
                shareBtn.className = 'share-btn';
                shareBtn.dataset.ayah = item.key;
                shareBtn.dataset.shareBase = shareBase;
                if (item.text_bn) {
                    shareBtn.dataset.shareText = item.text_bn;
                } else if (item.text_ar) {
                    shareBtn.dataset.shareText = item.text_ar;
                }
                shareBtn.dataset.shareReference = referenceLabel;
                const shareIcon = document.createElement('i');
                shareIcon.className = 'bi bi-share';
                shareBtn.appendChild(shareIcon);
                actions.appendChild(shareBtn);

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-bookmark-btn';
                removeBtn.dataset.ayah = item.key;
                const removeIcon = document.createElement('i');
                removeIcon.className = 'fa-solid fa-trash';
                removeBtn.appendChild(removeIcon);
                actions.appendChild(removeBtn);

                header.appendChild(actions);
                card.appendChild(header);

                const content = document.createElement('div');
                content.className = 'ayah-content';

                if (item.text_ar) {
                    const arabic = document.createElement('p');
                    arabic.className = 'ayah-arabic';
                    arabic.innerHTML = formatWithBreaks(item.text_ar);
                    content.appendChild(arabic);
                }

                if (item.text_bn) {
                    const translation = document.createElement('p');
                    translation.className = 'ayah-translation';
                    translation.innerHTML = formatWithBreaks(item.text_bn);
                    content.appendChild(translation);
                }

                if (item.transliteration) {
                    const transliteration = document.createElement('p');
                    transliteration.className = 'ayah-transliteration text-muted';
                    transliteration.innerHTML = formatWithBreaks(item.transliteration);
                    content.appendChild(transliteration);
                }

                if (item.footnotes) {
                    const footnotes = document.createElement('p');
                    footnotes.className = 'ayah-footnotes text-muted';
                    const small = document.createElement('small');
                    small.innerHTML = formatWithBreaks(item.footnotes);
                    footnotes.appendChild(small);
                    content.appendChild(footnotes);
                }

                card.appendChild(content);
                bookmarkListContainer.appendChild(card);
            });

            applyTranslationVisibility();
        })
        .catch(() => {
            if (emptyState) {
                emptyState.textContent = 'বুকমার্ক লোড করা সম্ভব হয়নি।';
                emptyState.classList.remove('hidden');
            }
        });
}

function initSettingsPage() {
    const group = document.querySelector('.settings-group[data-default-arabic]');
    if (!group) {
        return;
    }

    const arabicSlider = document.getElementById('arabic-font-slider');
    const translationSlider = document.getElementById('translation-font-slider');
    const translationToggle = document.getElementById('translation-toggle');

    const storedArabic = localStorage.getItem(ARABIC_FONT_KEY);
    const storedTranslation = localStorage.getItem(TRANSLATION_FONT_KEY);
    const storedToggle = localStorage.getItem(TRANSLATION_TOGGLE_KEY);

    if (arabicSlider && storedArabic) {
        arabicSlider.value = storedArabic;
    }
    if (translationSlider && storedTranslation) {
        translationSlider.value = storedTranslation;
    }
    if (translationToggle) {
        const enabled = storedToggle === null ? true : storedToggle === '1';
        translationToggle.checked = enabled;
    }

    if (arabicSlider) {
        arabicSlider.addEventListener('input', () => {
            localStorage.setItem(ARABIC_FONT_KEY, arabicSlider.value);
            document.documentElement.style.setProperty('--ayah-arabic-font-size', `${arabicSlider.value}px`);
        });
        arabicSlider.addEventListener('change', () => {
            showToast('আরবি ফন্ট সাইজ হালনাগাদ হয়েছে');
        });
    }

    if (translationSlider) {
        translationSlider.addEventListener('input', () => {
            localStorage.setItem(TRANSLATION_FONT_KEY, translationSlider.value);
            document.documentElement.style.setProperty('--ayah-translation-font-size', `${translationSlider.value}px`);
        });
        translationSlider.addEventListener('change', () => {
            showToast('অনুবাদের ফন্ট সাইজ হালনাগাদ হয়েছে');
        });
    }

    if (translationToggle) {
        translationToggle.addEventListener('change', () => {
            localStorage.setItem(TRANSLATION_TOGGLE_KEY, translationToggle.checked ? '1' : '0');
            applyTranslationVisibility();
        });
    }
}

function initShareButtons() {
    document.addEventListener('click', (event) => {
        const button = event.target.closest('.share-btn');
        if (!button) {
            return;
        }
        event.preventDefault();
        const shareBase = button.dataset.shareBase || getShareBaseUrl();
        const ayahKey = button.dataset.ayah || '';
        // Prefer extracting both Arabic and Bangla separately from the card
        const card = button.closest('.ayah-card');
        const arabicNode = card ? card.querySelector('.ayah-arabic') : null;
        const banglaNode = card ? card.querySelector('.ayah-translation') : null;
        const translitNode = card ? card.querySelector('.ayah-transliteration') : null;

        const arabicText = (arabicNode && arabicNode.textContent.trim())
            ? arabicNode.textContent.trim()
            : (button.dataset.shareText && /[\u0600-\u06FF]/.test(button.dataset.shareText) ? button.dataset.shareText : '');
        const banglaText = (banglaNode && banglaNode.textContent.trim())
            ? banglaNode.textContent.trim()
            : (button.dataset.shareText && /[\u0980-\u09FF]/.test(button.dataset.shareText) ? button.dataset.shareText : '');
        const translitText = (translitNode && translitNode.textContent.trim())
            ? translitNode.textContent.trim()
            : '';

        const shareReference = button.dataset.shareReference || extractShareReference(button, ayahKey);

        if (!arabicText && !banglaText && !shareReference) {
            showToast('শেয়ার করার জন্য তথ্য পাওয়া যায়নি');
            return;
        }

        const url = new URL(shareBase, window.location.origin);
        if (arabicText) {
            url.searchParams.set('text', arabicText);
        } else if (banglaText) {
            // fallback if only bangla present
            url.searchParams.set('text', banglaText);
        }
        if (banglaText) {
            url.searchParams.set('bn', banglaText);
        }
        if (translitText) {
            url.searchParams.set('trans', translitText);
        }
        if (shareReference) {
            url.searchParams.set('ref', shareReference);
        }
        window.location.href = url.toString();
    });
}

function getShareBaseUrl() {
    return document.body.dataset.shareUrl || '/share';
}

function extractShareText(button) {
    const card = button.closest('.ayah-card');
    if (!card) {
        return '';
    }
    const translation = card.querySelector('.ayah-translation');
    if (translation && translation.textContent.trim()) {
        return translation.textContent.trim();
    }
    const arabic = card.querySelector('.ayah-arabic');
    if (arabic && arabic.textContent.trim()) {
        return arabic.textContent.trim();
    }
    return '';
}

function extractShareReference(button, ayahKey) {
    const card = button.closest('.ayah-card');
    if (card) {
        const number = card.querySelector('.ayah-number');
        if (number && number.textContent.trim()) {
            return number.textContent.trim();
        }
    }
    if (ayahKey && /\d+:\d+/.test(ayahKey)) {
        return ayahKey.split(':').map((part) => formatDigits(part)).join(':');
    }
    return ayahKey || '';
}

function showToast(message) {
    if (!message) {
        return;
    }
    let toast = document.getElementById('hasana-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'hasana-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (toast.dataset.timeoutId) {
        clearTimeout(Number(toast.dataset.timeoutId));
    }
    const timeoutId = window.setTimeout(() => {
        toast.classList.remove('show');
        delete toast.dataset.timeoutId;
    }, 2400);
    toast.dataset.timeoutId = timeoutId;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
    }[match] || match));
}

function formatWithBreaks(value) {
    return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

