const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMultiline = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');

const createLoadingCard = () => `
    <article class="dua-card loading-card">
        <div class="dua-card-body">
            <p class="line shimmer"></p>
            <p class="line shimmer"></p>
            <p class="line shimmer"></p>
        </div>
    </article>
`;

const renderPagination = (meta, container, onPageChange) => {
    if (!container) {
        return;
    }
    container.innerHTML = '';
    if (!meta || meta.last_page <= 1) {
        container.classList.add('d-none');
        return;
    }

    container.classList.remove('d-none');

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'page-btn';
    prev.textContent = '<';
    prev.disabled = meta.current_page <= 1;
    prev.addEventListener('click', () => onPageChange(meta.current_page - 1));

    const info = document.createElement('span');
    info.className = 'pagination-info';
    info.textContent = `Page ${meta.current_page} of ${meta.last_page}`;

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'page-btn';
    next.textContent = '>';
    next.disabled = meta.current_page >= meta.last_page;
    next.addEventListener('click', () => onPageChange(meta.current_page + 1));

    container.append(prev, info, next);
};

const renderDuaCard = (dua) => {
    const arabic = dua.text_ar ? `<p class="dua-arabic">${formatMultiline(dua.text_ar)}</p>` : '';
    const transliteration = dua.transliteration ? `<p class="dua-translation">${formatMultiline(dua.transliteration)}</p>` : '';
    const bangla = dua.text_bn ? `<p class="hadis-text">${formatMultiline(dua.text_bn)}</p>` : '';
    const reference = dua.reference ? `<p class="dua-ref">${escapeHtml(dua.reference)}</p>` : '';

    return `
        <article class="dua-card">
            <h2 class="dua-title">${escapeHtml(dua.title)}</h2>
            ${arabic}
            ${transliteration}
            ${bangla}
            ${reference}
        </article>
    `;
};

const fetchJson = async (url) => {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};

const initDuaPage = () => {
    const app = document.getElementById('dua-app');
    if (!app) {
        return;
    }

    const tabsEl = document.getElementById('dua-tabs');
    const descriptionEl = document.getElementById('dua-description');
    const listEl = document.getElementById('dua-list');
    const emptyEl = document.getElementById('dua-empty');
    const paginationEl = document.getElementById('dua-pagination');

    const state = {
        options: [],
        currentKey: 'all',
        page: 1,
        perPage: Number(app.dataset.perPage || 6),
        categoryEndpoint: app.dataset.categoryEndpoint,
        duaEndpoint: app.dataset.duaEndpoint,
    };

    const findOption = (key) => state.options.find((option) => option.key === key);

    const renderTabs = () => {
        if (!tabsEl) {
            return;
        }
        tabsEl.innerHTML = state.options
            .map((option) => `
                <button type="button" class="tab-btn ${option.key === state.currentKey ? 'active' : ''}" data-key="${option.key}">
                    ${escapeHtml(option.label)}
                </button>
            `)
            .join('');

        tabsEl.querySelectorAll('button[data-key]').forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.dataset.key;
                if (key === state.currentKey) {
                    return;
                }
                state.currentKey = key;
                state.page = 1;
                tabsEl.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                updateDescription();
                loadDuas();
            });
        });
    };

    const updateDescription = () => {
        if (!descriptionEl) {
            return;
        }
        const option = findOption(state.currentKey);
        if (option && option.description) {
            descriptionEl.textContent = option.description;
            descriptionEl.classList.remove('d-none');
        } else {
            descriptionEl.textContent = '';
            descriptionEl.classList.add('d-none');
        }
    };

    const setLoading = () => {
        if (listEl) {
            listEl.innerHTML = `${createLoadingCard()}${createLoadingCard()}`;
        }
        emptyEl?.classList.add('d-none');
    };

    const renderDuas = (items) => {
        if (!listEl) {
            return;
        }
        if (!items.length) {
            listEl.innerHTML = '';
            emptyEl?.classList.remove('d-none');
            return;
        }
        emptyEl?.classList.add('d-none');
        listEl.innerHTML = items.map((item) => renderDuaCard(item)).join('');
    };

    const buildDuaUrl = () => {
        if (!state.duaEndpoint) {
            return null;
        }
        const option = findOption(state.currentKey);
        const url = new URL(state.duaEndpoint, window.location.origin);
        url.searchParams.set('page', String(state.page));
        url.searchParams.set('per_page', String(state.perPage));
        if (option && option.param && option.param !== 'all') {
            url.searchParams.set('category', option.param);
        }
        return url.toString();
    };

    const loadDuas = async () => {
        const url = buildDuaUrl();
        if (!url) {
            return;
        }
        setLoading();
        try {
            const payload = await fetchJson(url);
            const items = Array.isArray(payload.data) ? payload.data : [];
            renderDuas(items);
            renderPagination(payload.meta ?? null, paginationEl, (page) => {
                state.page = page;
                loadDuas();
            });
        } catch (error) {
            console.error('Failed to load duas', error);
            if (listEl) {
                listEl.innerHTML = '<p class="text-center text-danger">দোয়া লোড করতে পারছি না।</p>';
            }
            paginationEl?.classList.add('d-none');
        }
    };

    const loadCategories = async () => {
        state.options = [
            { key: 'all', label: 'সব', param: 'all', description: null },
        ];
        if (state.categoryEndpoint) {
            try {
                const payload = await fetchJson(state.categoryEndpoint);
                const categories = Array.isArray(payload.data) ? payload.data : [];
                categories.forEach((category) => {
                    const key = category.slug ?? (category.id ? `category-${category.id}` : 'uncategorised');
                    const param = category.slug ?? (category.id ? String(category.id) : 'uncategorised');
                    state.options.push({
                        key,
                        label: category.name,
                        param,
                        description: category.description || null,
                    });
                });
            } catch (error) {
                console.error('Failed to load dua categories', error);
            }
        }
        state.currentKey = 'all';
        renderTabs();
        updateDescription();
        loadDuas();
    };

    loadCategories();
};

document.addEventListener('DOMContentLoaded', initDuaPage);
