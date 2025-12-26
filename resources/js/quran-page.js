const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

const templateSurahCard = (surah, urlBase) => {
    const meaning = surah.meaning_bn ? `অর্থ: ${surah.meaning_bn}` : '';

    return `
        <a href="${urlBase}/${encodeURIComponent(surah.slug)}" class="surah-card">
            <div class="surah-card-info">
                <div class="surah-number-bg">${surah.number_bn}</div>
                <div>
                    <p class="surah-name">${surah.name_bn}</p>
                    ${meaning ? `<p class="surah-meaning">${meaning}</p>` : ''}
                </div>
            </div>
            <div class="surah-card-right">
                <p class="surah-arabic-name">${surah.name_ar ?? ''}</p>
                <p class="surah-ayat-count">আয়াত ${surah.ayah_count_bn}</p>
            </div>
        </a>
    `;
};

const renderLoading = (listEl) => {
    listEl.innerHTML = `
        <div class="surah-card loading-card">
            <div class="surah-card-info">
                <div class="surah-number-bg shimmer"></div>
                <div class="loading-lines">
                    <span class="line shimmer"></span>
                    <span class="line shimmer"></span>
                </div>
            </div>
            <div class="surah-card-right">
                <span class="line shimmer"></span>
                <span class="line shimmer"></span>
            </div>
        </div>
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
    const pages = [];
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(lastPage, currentPage + windowSize);

    pages.push({ label: '‹', page: currentPage - 1, disabled: currentPage === 1, type: 'prev' });

    if (start > 1) {
        pages.push({ label: '1', page: 1, active: currentPage === 1 });
        if (start > 2) {
            pages.push({ label: '…', page: null, disabled: true });
        }
    }

    for (let page = start; page <= end; page += 1) {
        pages.push({ label: String(page), page, active: currentPage === page });
    }

    if (end < lastPage) {
        if (end < lastPage - 1) {
            pages.push({ label: '…', page: null, disabled: true });
        }
        pages.push({ label: String(lastPage), page: lastPage, active: currentPage === lastPage });
    }

    pages.push({ label: '›', page: currentPage + 1, disabled: currentPage === lastPage, type: 'next' });

    container.innerHTML = pages
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

const initQuranPage = () => {
    const appEl = document.getElementById('quran-app');
    if (!appEl) {
        return;
    }

    const listEl = document.getElementById('quran-surah-list');
    const emptyEl = document.getElementById('quran-empty-message');
    const paginationEl = document.getElementById('quran-pagination');
    const searchInput = document.querySelector('[data-surah-search]');

    const endpoint = appEl.dataset.endpoint;
    const perPage = Number(appEl.dataset.perPage || 30);
    const surahUrlBase = appEl.dataset.surahUrl ?? '/surah';

    const state = {
        page: 1,
        perPage,
        query: '',
        loading: false,
    };

    const fetchSurahs = async () => {
        if (!endpoint) {
            return;
        }

        state.loading = true;
        if (listEl) {
            renderLoading(listEl);
        }
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
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const payload = await response.json();
            const items = Array.isArray(payload.data) ? payload.data : [];

            if (items.length === 0) {
                if (listEl) {
                    listEl.innerHTML = '';
                }
                if (emptyEl) {
                    emptyEl.classList.remove('d-none');
                }
            } else {
                if (emptyEl) {
                    emptyEl.classList.add('d-none');
                }
                if (listEl) {
                    listEl.innerHTML = items.map((item) => templateSurahCard(item, surahUrlBase)).join('');
                }
            }

            renderPagination(payload.meta ?? null, paginationEl);
        } catch (error) {
            console.error('Failed to load surahs', error);
            if (listEl) {
                listEl.innerHTML = '<p class="text-center text-danger">তথ্য লোড করতে সমস্যা হচ্ছে।</p>';
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
        fetchSurahs();
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
            const targetPage = Number(button.dataset.page);
            if (Number.isNaN(targetPage) || targetPage === state.page) {
                return;
            }
            state.page = targetPage;
            fetchSurahs();
        });
    }

    fetchSurahs();
};

document.addEventListener('DOMContentLoaded', initQuranPage);
