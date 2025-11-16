import { initBookmarkButtons } from './hasana-theme.js';
const digitsMapBn = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatBanglaDigits = (value) => String(value ?? '').replace(/[0-9]/g, (digit) => digitsMapBn[digit] ?? digit);

const debounce = (fn, delay = 320) => {
    let timer;
    return (...args) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), delay);
    };
};

const convertToHtml = (value) => {
    if (!value) {
        return '';
    }
    return String(value).replace(/\r?\n/g, '<br>');
};

const renderSurahInfo = (cardEl, surah) => {
    if (!cardEl || !surah) {
        return;
    }
    const title = document.getElementById('surah-header-title');
    if (title) {
        title.textContent = surah.name_bn || surah.name_en || '';
    }

    const ayahLabel = surah.ayah_count_bn || surah.ayah_count || '';
    const revelationLabel = surah.revelation_label_bn || surah.revelation_label || '';
    const orderLabel = surah.revelation_order_bn || surah.revelation_order || '';

    cardEl.innerHTML = `
        <h2>${escapeHtml(surah.name_bn || surah.name_en || '')}</h2>
        ${surah.meaning_bn ? `<p>"${escapeHtml(surah.meaning_bn)}"</p>` : ''}
        <div class="surah-info-divider"></div>
        <p class="surah-info-meta">
            ${revelationLabel ? `${escapeHtml(revelationLabel)} • ` : ''}মোট আয়াত ${escapeHtml(ayahLabel)}
            ${orderLabel ? ` • অবতরণের ধারায়: ${escapeHtml(orderLabel)}` : ''}
        </p>
        ${surah.summary_bn ? `<p class="surah-info-details">${convertToHtml(surah.summary_bn)}</p>` : ''}
    `;
};

const renderAyahs = (container, surahNumber, ayahs) => {
    if (!container) {
        return;
    }
    if (!Array.isArray(ayahs) || ayahs.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = ayahs
        .map((ayah) => {
            const key = `${surahNumber}:${ayah.number}`;
            const keyBn = formatBanglaDigits(key);
            const audioMarkup = ayah.audio_url
                ? `<a href="${escapeHtml(ayah.audio_url)}" target="_blank" rel="noopener" class="play-btn" title="অডিও শুনুন"><i class="bi bi-play-circle"></i></a>`
                : '';
            const translation = ayah.text_bn ? `<p class="ayah-translation">${convertToHtml(ayah.text_bn)}</p>` : '';
            const transliteration = ayah.transliteration
                ? `<p class="ayah-transliteration text-muted">${convertToHtml(ayah.transliteration)}</p>`
                : '';
            const footnotes = ayah.footnotes
                ? `<p class="ayah-footnotes text-muted"><small>${convertToHtml(ayah.footnotes)}</small></p>`
                : '';

            return `
                <article class="ayah-card" id="ayah-${ayah.number}" data-ayah-key="${escapeHtml(key)}">
                    <div class="ayah-header">
                        <span class="ayah-number">${keyBn}</span>
                        <div class="ayah-actions">
                            ${audioMarkup}
                            <button type="button" class="bookmark-btn" data-ayah="${escapeHtml(key)}" title="বুকমার্ক">
                                <i class="bi bi-bookmark"></i>
                            </button>
                            <button type="button" class="share-btn" data-ayah="${escapeHtml(key)}" title="শেয়ার">
                                <i class="bi bi-share"></i>
                            </button>
                        </div>
                    </div>
                    <div class="ayah-content">
                        ${translation}
                        ${transliteration}
                        <p class="ayah-arabic">${convertToHtml(ayah.text_ar)}</p>
                        ${footnotes}
                    </div>
                </article>
            `;
        })
        .join('');

    initBookmarkButtons();
};

const renderAyahSkeleton = (container) => {
    if (!container) {
        return;
    }
    container.innerHTML = `
        <article class="ayah-card loading-card">
            <div class="ayah-header">
                <span class="ayah-number shimmer"></span>
            </div>
            <div class="ayah-content">
                <p class="line shimmer"></p>
                <p class="line shimmer"></p>
                <p class="line shimmer"></p>
            </div>
        </article>
    `;
};

const renderPagination = (meta, container) => {
    if (!container) {
        return;
    }
    if (!meta || meta.last_page <= 1) {
        container.innerHTML = '';
        container.classList.add('d-none');
        return;
    }

    const { current_page: currentPage, last_page: lastPage } = meta;
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(lastPage, currentPage + windowSize);
    const buttons = [];

    buttons.push({ label: '‹', page: currentPage - 1, disabled: currentPage === 1 });

    if (start > 1) {
        buttons.push({ label: '1', page: 1, active: currentPage === 1 });
        if (start > 2) {
            buttons.push({ label: '…', page: null, disabled: true });
        }
    }

    for (let page = start; page <= end; page += 1) {
        buttons.push({ label: String(page), page, active: currentPage === page });
    }

    if (end < lastPage) {
        if (end < lastPage - 1) {
            buttons.push({ label: '…', page: null, disabled: true });
        }
        buttons.push({ label: String(lastPage), page: lastPage, active: currentPage === lastPage });
    }

    buttons.push({ label: '›', page: currentPage + 1, disabled: currentPage === lastPage });

    container.innerHTML = buttons
        .map((item) => {
            const classes = ['page-btn'];
            if (item.active) {
                classes.push('active');
            }
            if (item.disabled) {
                classes.push('disabled');
            }
            const dataAttr = item.page ? `data-page="${item.page}"` : '';
            const disabledAttr = item.disabled ? 'disabled' : '';
            return `<button type="button" class="${classes.join(' ')}" ${dataAttr} ${disabledAttr}>${item.label}</button>`;
        })
        .join('');

    container.classList.remove('d-none');
};

const fetchJson = async (url) => {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};

const initSurahPage = () => {
    const appEl = document.getElementById('surah-app');
    if (!appEl) {
        return;
    }

    const infoCard = document.getElementById('surah-info-card');
    const ayahContainer = document.getElementById('ayah-container');
    const emptyEl = document.getElementById('ayah-empty');
    const paginationEl = document.getElementById('surah-pagination');
    const searchInput = document.querySelector('[data-ayah-search]');

    const endpoint = appEl.dataset.endpoint;
    const perPage = Number(appEl.dataset.perPage || 20);
    const initialSurahNumber = Number(appEl.dataset.surahNumber || 0);

    const state = {
        page: 1,
        perPage,
        query: '',
        surahNumber: initialSurahNumber,
    };

    const loadSurah = async () => {
        if (!endpoint) {
            return;
        }
        renderAyahSkeleton(ayahContainer);
        emptyEl?.classList.add('d-none');

        const url = new URL(endpoint, window.location.origin);
        url.searchParams.set('page', String(state.page));
        url.searchParams.set('per_page', String(state.perPage));
        if (state.query) {
            url.searchParams.set('query', state.query);
        }

        try {
            const payload = await fetchJson(url.toString());
            const surah = payload.data || {};
            if (surah.number) {
                state.surahNumber = surah.number;
            }
            renderSurahInfo(infoCard, surah);

            const ayahsPayload = payload.ayahs ?? {};
            const ayahs = Array.isArray(ayahsPayload.data) ? ayahsPayload.data : [];

            if (!ayahs.length) {
                if (ayahContainer) {
                    ayahContainer.innerHTML = '';
                }
                emptyEl?.classList.remove('d-none');
            } else {
                renderAyahs(ayahContainer, state.surahNumber, ayahs);
            }

            renderPagination(ayahsPayload.meta ?? null, paginationEl);
        } catch (error) {
            console.error('Failed to load surah details', error);
            if (ayahContainer) {
                ayahContainer.innerHTML = '<p class="text-center text-danger">আয়াত লোড করতে সমস্যা হচ্ছে।</p>';
            }
            paginationEl.innerHTML = '';
        }
    };

    const debouncedSearch = debounce((value) => {
        state.query = value.trim();
        state.page = 1;
        loadSurah();
    }, 350);

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            debouncedSearch(event.target.value);
        });
    }

    if (paginationEl) {
        paginationEl.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-page]');
            if (!button) {
                return;
            }
            const nextPage = Number(button.dataset.page);
            if (!Number.isFinite(nextPage) || nextPage === state.page) {
                return;
            }
            state.page = nextPage;
            loadSurah();
        });
    }

    loadSurah();
};

document.addEventListener('DOMContentLoaded', initSurahPage);
