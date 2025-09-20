import { initBookmarkButtons } from './hasana-theme.js';

const digitsMapBn = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };\n\nconst formatBanglaDigits = (value) => String(value ?? '').replace(/[0-9]/g, (digit) => digitsMapBn[digit] ?? digit);\n\nconst debounce = (fn, delay = 320) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

const convertToHtml = (value) => {
    if (!value) {
        return '';
    }
    return String(value).replace(/\n/g, '<br>');
};

const renderSurahInfo = (cardEl, surah) => {
    if (!cardEl || !surah) {
        return;
    }
    const headerTitle = document.getElementById('surah-header-title');
    if (headerTitle) {
        headerTitle.textContent = surah.name_bn || surah.name_en;
    }

    cardEl.innerHTML = `
        <h2>${surah.name_bn || surah.name_en}</h2>
        ${surah.meaning_bn ? `<p>"${surah.meaning_bn}"</p>` : ''}
        <div class="surah-info-divider"></div>
        <p class="surah-info-meta">
            ${surah.revelation_label_bn || ''} • মোট আয়াত ${surah.ayah_count_bn}
            ${surah.revelation_order_bn ? ` • অবতরণের ধারায়: ${surah.revelation_order_bn}` : ''}
        </p>
        ${surah.summary_bn ? `<p class="surah-info-details">${convertToHtml(surah.summary_bn)}</p>` : ''}
    `;
};

const renderAyahs = (container, surahNumber, ayahs) => { keyBn = formatBanglaDigits(key);
            const audioMarkup = ayah.audio_url
                ? `<a href="${ayah.audio_url}" target="_blank" rel="noopener" class="play-btn" title="অডিও শুনুন"><i class="bi bi-play-circle"></i></a>`
                : '';
            const translation = ayah.text_bn ? `<p class="ayah-translation">${convertToHtml(ayah.text_bn)}</p>` : '';
            const transliteration = ayah.transliteration
                ? `<p class="ayah-transliteration text-muted">${convertToHtml(ayah.transliteration)}</p>`
                : '';
            const footnotes = ayah.footnotes
                ? `<p class="ayah-footnotes text-muted"><small>${convertToHtml(ayah.footnotes)}</small></p>`
                : '';

            return `
                <article class="ayah-card" id="ayah-${ayah.number}" data-ayah-key="${key}">
                    <div class="ayah-header">
                        <span class="ayah-number">${keyBn}</span>
                        <div class="ayah-actions">
                            ${audioMarkup}
                            <button type="button" class="bookmark-btn" data-ayah="${key}" title="বুকমার্ক">
                                <i class="bi bi-bookmark"></i>
                            </button>
                            <button type="button" class="share-btn" data-ayah="${key}" title="শেয়ার">
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
\n    initBookmarkButtons();
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
    const buttons = [];
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(lastPage, currentPage + windowSize);

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
            if (item.active) classes.push('active');
            if (item.disabled) classes.push('disabled');
            const dataAttr = item.page ? `data-page="${item.page}"` : '';
            return `<button type="button" class="${classes.join(' ')}" ${dataAttr} ${item.disabled ? 'disabled' : ''}>${item.label}</button>`;
        })
        .join('');

    container.classList.remove('d-none');
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
    const surahNumber = Number(appEl.dataset.surahNumber || 0);

    const state = {
        page: 1,
        perPage,
        query: '',
        loading: false,
        surahNumber,
    };

    const fetchSurah = async () => {
        if (!endpoint) {
            return;
        }

        state.loading = true;
        renderAyahSkeleton(ayahContainer);
        if (emptyEl) {
            emptyEl.classList.add('d-none');
        }

        const url = new URL(endpoint, window.location.origin);
        url.searchParams.set('page', String(state.page));
        url.searchParams.set('per_page', String(state.perPage));
        if (state.query) {
            url.searchParams.set('query', state.query);
        }

        try {
            const response = await fetch(url.toString(), {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const payload = await response.json();
            if (payload.data) {
                renderSurahInfo(infoCard, payload.data);
                state.surahNumber = payload.data.number || state.surahNumber;
            }

            const ayahsPayload = payload.ayahs ?? {};
            const ayahs = Array.isArray(ayahsPayload.data) ? ayahsPayload.data : [];

            if (!ayahs.length) {
                if (ayahContainer) {
                    ayahContainer.innerHTML = '';
                }
                if (emptyEl) {
                    emptyEl.classList.remove('d-none');
                }
            } else {
                renderAyahs(ayahContainer, state.surahNumber, ayahs);
            }

            renderPagination(ayahsPayload.meta ?? null, paginationEl);
        } catch (error) {
            console.error('Failed to load surah details', error);
            if (ayahContainer) {
                ayahContainer.innerHTML = '<p class="text-center text-danger">আয়াত লোড করতে সমস্যা হচ্ছে।</p>';
            }
            if (paginationEl) {
                paginationEl.innerHTML = '';
            }
        } finally {
            state.loading = false;
        }
    };

    const debouncedSearch = debounce((value) => {
        state.query = value.trim();
        state.page = 1;
        fetchSurah();
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
            fetchSurah();
        });
    }

    fetchSurah();
};

document.addEventListener('DOMContentLoaded', initSurahPage);



