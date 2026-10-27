import { adminResourceConfigs } from './config';

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
let toastTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initTables();
});

function initSidebar() {
    const sidebar = document.querySelector('[data-admin-sidebar]');
    if (!sidebar) {
        return;
    }

    const toggle = document.querySelector('[data-admin-sidebar-toggle]');
    const close = document.querySelector('[data-admin-sidebar-close]');
    const backdrop = document.querySelector('[data-admin-sidebar-backdrop]');

    const openSidebar = () => {
        sidebar.classList.add('active');
        backdrop?.classList.add('active');
        document.body.style.overflow = window.innerWidth <= 992 ? 'hidden' : '';
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        backdrop?.classList.remove('active');
        document.body.style.overflow = '';
    };

    toggle?.addEventListener('click', openSidebar);
    close?.addEventListener('click', closeSidebar);
    backdrop?.addEventListener('click', closeSidebar);

    sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
        link.addEventListener('click', closeSidebar);
    });
}

function initTables() {
    document.querySelectorAll('[data-admin-table]').forEach((node) => {
        const table = new AdminTable(node);
        if (!table.isValid) {
            console.warn('Skipping admin table because no config exists for:', node.dataset.adminTable);
        }
    });
}

function parseJson(value) {
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value);
    } catch (error) {
        console.warn('Unable to parse dataset JSON', value, error);
        return null;
    }
}

function resolveValue(source, path, fallback = null) {
    if (!path) {
        return source ?? fallback;
    }
    const segments = path.split('.');
    let current = source;
    for (const segment of segments) {
        if (current == null) {
            return fallback;
        }
        current = current[segment];
    }
    return current ?? fallback;
}

function setNestedValue(target, path, value) {
    const segments = path.split('.');
    let current = target;
    segments.forEach((segment, index) => {
        if (index === segments.length - 1) {
            current[segment] = value;
        } else {
            if (typeof current[segment] !== 'object' || current[segment] === null) {
                current[segment] = {};
            }
            current = current[segment];
        }
    });
}

async function fetchJson(url, options = {}) {
    const config = { ...options };
    config.headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(config.headers ?? {}),
    };
    if (config.method && config.method.toUpperCase() !== 'GET' && csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    if (config.body && !(config.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(config.body);
    }

    console.log('fetchJson:', { url, method: config.method, hasCsrf: !!csrfToken, body: config.body });

    const response = await fetch(url, config);
    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        let validation = null;
        try {
            const payload = await response.json();
            message = payload.message || message;
            validation = payload.errors || null;
        } catch (error) {
            /* ignore */
        }
        const err = new Error(message);
        err.status = response.status;
        err.validation = validation;
        throw err;
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
}

function showToast(message, isError = false) {
    const toast = document.getElementById('admin-toast');
    if (!toast || !message) {
        return;
    }
    toast.textContent = message;
    toast.classList.toggle('error', Boolean(isError));
    toast.classList.add('show');
    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }
    toastTimer = window.setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

function debounce(fn, delay = 250) {
    let timer = null;
    return (...args) => {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = window.setTimeout(() => fn(...args), delay);
    };
}

function updateSelectOptions(select, options, config) {
    if (!select) {
        return;
    }
    const previous = select.value;
    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = config.nullLabel || 'All';
    select.appendChild(placeholder);

    (options || []).forEach((option) => {
        const opt = document.createElement('option');
        const valueKey = config.valueKey || 'id';
        const labelKey = config.labelKey || 'name';
        opt.value = String(option[valueKey]);
        opt.textContent = option[labelKey];
        select.appendChild(opt);
    });

    if (previous && select.querySelector(`option[value="${previous}"]`)) {
        select.value = previous;
    }
}

function renderStatusBadge(value) {
    const active = value === true || value === 1 || value === '1';
    const label = active ? 'Active' : 'Hidden';
    const className = active ? 'badge badge-success' : 'badge badge-muted';
    return `<span class="${className}">${label}</span>`;
}

class AdminTable {
    constructor(container) {
        this.container = container;
        this.resource = container.dataset.adminTable;
        this.config = adminResourceConfigs[this.resource];
        this.extra = parseJson(container.dataset.extra) || {};

        if (!this.config) {
            this.isValid = false;
            return;
        }

        this.endpoint = container.dataset.endpoint || '';
        this.storeEndpoint = container.dataset.storeEndpoint || this.endpoint;
        this.createEndpoint = container.dataset.createEndpoint || '';
        this.editTemplate = container.dataset.editTemplate || '';
        this.updateTemplate = container.dataset.updateTemplate || '';
        this.deleteTemplate = container.dataset.deleteTemplate || '';

        this.tableBody = container.querySelector('[data-admin-tbody]');
        this.tableInfo = container.querySelector('[data-admin-table-info]');
        this.pagination = container.querySelector('[data-admin-pagination]');
        this.searchInput = container.querySelector('[data-admin-search]');
        this.createButton = container.querySelector('[data-admin-create]');

        this.params = {
            page: 1,
            per_page: Number(container.dataset.perPage || 15),
            search: '',
        };

        this.isValid = true;
        this.attachEvents();
        this.load();
    }

    attachEvents() {
        if (this.searchInput) {
            const debounced = debounce((value) => {
                this.params.search = value.trim();
                this.params.page = 1;
                this.load();
            }, 320);
            this.searchInput.addEventListener('input', (event) => debounced(event.target.value));
        }

        if (this.createButton && this.createEndpoint) {
            this.createButton.addEventListener('click', () => this.openCreate());
        }

        (this.config.filters || []).forEach((filter) => {
            const select = this.container.querySelector(filter.selector);
            if (!select) {
                return;
            }
            select.addEventListener('change', () => {
                const value = select.value;
                this.params[filter.key] = value === '' ? null : value;
                this.params.page = 1;
                this.load();
            });
        });
    }

    setLoading(isLoading) {
        this.container.classList.toggle('loading', Boolean(isLoading));
        if (isLoading && this.tableBody) {
            const colspan = this.config?.columns?.length ?? 1;
            this.tableBody.innerHTML = `<tr class="table-empty"><td colspan="${colspan}">Loading...</td></tr>`;
        }
    }

    buildQueryString() {
        const params = new URLSearchParams();
        Object.entries(this.params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.set(key, value);
            }
        });
        return params.toString();
    }

    async load(page) {
        if (page) {
            this.params.page = page;
        }
        if (!this.endpoint) {
            return;
        }

        this.setLoading(true);
        const query = this.buildQueryString();
        const url = query ? `${this.endpoint}?${query}` : this.endpoint;

        try {
            const payload = await fetchJson(url);
            this.render(payload || {});
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Unable to load data.', true);
            if (this.tableBody) {
                const colspan = this.config?.columns?.length ?? 1;
                this.tableBody.innerHTML = `<tr class="table-empty"><td colspan="${colspan}">Failed to load data.</td></tr>`;
            }
        } finally {
            this.setLoading(false);
        }
    }

    render(response) {
        const items = Array.isArray(response.data) ? response.data : [];
        const meta = response.meta || {};
        const filters = response.filters || meta.filters || {};

        this.lastMeta = meta;
        this.applyFilters(filters);
        this.renderRows(items.map((item) => this.transformItem(item)));
        this.renderInfo(meta);
        this.renderPagination(meta);
    }

    transformItem(item) {
        if (typeof this.config.transformItem === 'function') {
            return this.config.transformItem({ ...item }, { extra: this.extra });
        }
        return item;
    }

    renderRows(items) {
        if (!this.tableBody) {
            return;
        }
        if (!items.length) {
            const colspan = this.config?.columns?.length ?? 1;
            this.tableBody.innerHTML = `<tr class="table-empty"><td colspan="${colspan}">No records found.</td></tr>`;
            return;
        }
        const fragment = document.createDocumentFragment();
        items.forEach((item) => fragment.appendChild(this.buildRow(item)));
        this.tableBody.innerHTML = '';
        this.tableBody.appendChild(fragment);
    }

    buildRow(item) {
        const tr = document.createElement('tr');
        this.config.columns.forEach((column) => {
            const td = document.createElement('td');
            if (column.align) {
                td.style.textAlign = column.align;
            }
            if (column.width) {
                td.style.width = column.width;
            }

            if (column.type === 'actions') {
                td.appendChild(this.buildActions(item));
            } else if (column.type === 'status') {
                td.innerHTML = renderStatusBadge(resolveValue(item, column.key));
            } else {
                let value = resolveValue(item, column.key, column.fallback ?? '--');
                if (value === null || value === undefined || value === '') {
                    value = column.fallback ?? '--';
                }
                td.textContent = String(value);
            }

            tr.appendChild(td);
        });
        return tr;
    }

    buildActions(item) {
        const wrapper = document.createElement('div');
        wrapper.className = 'row-actions';

        (this.config.actions || []).forEach((action) => {
            if (action.type === 'edit') {
                if (!this.editTemplate) {
                    return;
                }
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn-muted';
                button.innerHTML = '<i class="fa-solid fa-pen"></i><span>Edit</span>';
                button.addEventListener('click', () => this.openEdit(item));
                wrapper.appendChild(button);
                return;
            }

            if (action.type === 'delete') {
                if (!this.deleteTemplate) {
                    return;
                }
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn-muted danger';
                button.innerHTML = '<i class="fa-solid fa-trash"></i><span>Delete</span>';
                button.addEventListener('click', () => this.deleteItem(item, action.confirm));
                wrapper.appendChild(button);
                return;
            }

            if (action.type === 'link') {
                const url = resolveValue(item, action.path);
                if (!url) {
                    return;
                }
                const anchor = document.createElement('a');
                anchor.className = 'btn-secondary';
                anchor.href = url;
                const icon = action.icon || 'fa-solid fa-arrow-up-right-from-square';
                const label = action.label || 'Open';
                anchor.innerHTML = `<i class="${icon}"></i><span>${label}</span>`;
                if (action.target) {
                    anchor.target = action.target;
                    anchor.rel = 'noopener';
                }
                wrapper.appendChild(anchor);
            }
        });

        if (!wrapper.children.length) {
            wrapper.textContent = '--';
        }
        return wrapper;
    }

    renderInfo(meta) {
        if (!this.tableInfo) {
            return;
        }
        if (!meta || meta.total === undefined) {
            this.tableInfo.textContent = '';
            return;
        }
        const from = meta.from ?? 0;
        const to = meta.to ?? 0;
        const total = meta.total ?? 0;
        this.tableInfo.textContent = `Showing ${from} - ${to} of ${total}`;
    }

    renderPagination(meta) {
        if (!this.pagination) {
            return;
        }
        this.pagination.innerHTML = '';
        if (!meta || !meta.total || meta.last_page <= 1) {
            return;
        }

        const prevButton = createPaginationButton('Prev', meta.current_page <= 1, () => this.load(meta.current_page - 1));
        const info = document.createElement('span');
        info.className = 'pagination-info';
        info.textContent = `Page ${meta.current_page} of ${meta.last_page}`;
        const nextButton = createPaginationButton('Next', meta.current_page >= meta.last_page, () => this.load(meta.current_page + 1));
        this.pagination.append(prevButton, info, nextButton);
    }

    applyFilters(filters) {
        (this.config.filters || []).forEach((filter) => {
            const select = this.container.querySelector(filter.selector);
            if (!select) {
                return;
            }

            if (filter.optionsPath) {
                const options = resolveValue(filters, filter.optionsPath) || [];
                updateSelectOptions(select, options, filter);
            }

            const active = resolveValue(filters, `active.${filter.key}`);
            if (active !== undefined && active !== null) {
                select.value = String(active);
            } else if (this.params[filter.key] !== undefined && this.params[filter.key] !== null) {
                select.value = String(this.params[filter.key]);
            } else {
                select.value = '';
            }
        });
    }

    async openCreate() {
        const formEndpoint = this.createEndpoint || this.storeEndpoint;
        if (!formEndpoint) {
            return;
        }
        try {
            const payload = await fetchJson(formEndpoint);
            this.openForm('create', payload?.data || {}, payload?.meta || {});
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Unable to load create form.', true);
        }
    }

    async openEdit(item) {
        if (!this.editTemplate) {
            return;
        }
        const url = this.editTemplate.replace('__ID__', item.id);
        try {
            const payload = await fetchJson(url);
            this.openForm('edit', payload?.data || item, payload?.meta || {}, item);
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Unable to load record.', true);
        }
    }

    openForm(mode, values, meta = {}, originalItem = null) {
        const isEdit = mode === 'edit';
        const singular = this.config.singular || 'তথ্য';
        const title = isEdit ? `${singular} সম্পাদনা` : `নতুন ${singular} যোগ করুন`;
        const submitText = isEdit ? 'আপডেট সংরক্ষণ' : 'তৈরি করুন';
        
        let fields = this.config.form?.fields || [];
        if (this.resource === 'users' && isEdit) {
            fields = fields.map(f => {
                if (f.name === 'password' || f.name === 'password_confirmation') {
                    return { ...f, required: false, help: 'পাসওয়ার্ড অপরিবর্তিত রাখতে চাইলে খালি রাখুন।' };
                }
                return f;
            });
        }

        const resourceIcons = {
            surahs: 'fa-solid fa-book-quran',
            hadiths: 'fa-solid fa-book-open-reader',
            duas: 'fa-solid fa-hands-praying',
            'hadith-categories': 'fa-solid fa-folder-tree',
            'dua-categories': 'fa-solid fa-folder-tree',
            ayahs: 'fa-solid fa-align-right',
            users: 'fa-solid fa-user-shield',
        };
        const icon = resourceIcons[this.resource] || (isEdit ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-plus');

        createFormModal({
            title,
            icon,
            fields,
            values,
            meta,
            submitText,
            onSubmit: async (payload, helpers) => {
                // For surahs, ensure name_en is set (auto-generate from name_ar if not provided)
                if (this.resource === 'surahs' && !payload.name_en && payload.name_ar) {
                    payload.name_en = payload.name_ar;
                }

                console.log('Submitting payload:', payload);
                console.log('Resource:', this.resource);

                let url = isEdit
                    ? this.updateTemplate.replace('__ID__', originalItem.id)
                    : this.storeEndpoint;
                url = url.replace('__ID__', originalItem?.id ?? '');
                const method = isEdit ? 'PUT' : 'POST';

                console.log('URL:', url, 'Method:', method);

                try {
                    const response = await fetchJson(url, { method, body: payload });
                    console.log('Response:', response);
                    helpers.setSubmitting(false);
                    helpers.close();
                    showToast(response?.message || `${this.config.singular || 'তথ্য'} সংরক্ষণ করা হয়েছে`);
                    this.load(isEdit ? this.params.page : 1);
                } catch (error) {
                    console.error('Error:', error);
                    helpers.setSubmitting(false);
                    if (error.validation) {
                        console.error('Validation errors:', error.validation);
                        helpers.setErrors(error.validation);
                    } else {
                        showToast(error.message || 'সংরক্ষণ ব্যর্থ হয়েছে।', true);
                    }
                }
            },
        });
    }

    async deleteItem(item, confirmMessage) {
        if (!this.deleteTemplate) {
            return;
        }
        const promptMessage = confirmMessage || `আপনি কি নিশ্চিতভাবে এই ${this.config.singular || 'তথ্যটি'} মুছে ফেলতে চান?`;
        const confirmed = await createConfirmModal({
            title: `${this.config.singular || 'আইটেম'} মুছে ফেলা`,
            message: promptMessage,
            confirmText: 'হ্যাঁ, ডিলিট করুন',
            cancelText: 'বাতিল'
        });
        if (!confirmed) {
            return;
        }

        const url = this.deleteTemplate.replace('__ID__', item.id);
        try {
            const response = await fetchJson(url, { method: 'DELETE' });
            showToast(response?.message || `${this.config.singular || 'তথ্য'} মুছে ফেলা হয়েছে`);
            if (this.lastMeta && this.lastMeta.from === this.lastMeta.to && this.params.page > 1) {
                this.params.page = Math.max(1, this.params.page - 1);
            }
            this.load(this.params.page);
        } catch (error) {
            console.error(error);
            showToast(error.message || 'ডিলিট ব্যর্থ হয়েছে।', true);
        }
    }
}

function createPaginationButton(label, disabled, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    if (disabled) {
        button.disabled = true;
    } else {
        button.addEventListener('click', handler);
    }
    return button;
}

function createConfirmModal({ title = 'নিশ্চিতকরণ', message = 'আপনি কি নিশ্চিত?', confirmText = 'মুছে ফেলুন', cancelText = 'বাতিল' }) {
    return new Promise((resolve) => {
        const root = document.getElementById('admin-dialog-root') || document.body;
        const overlay = document.createElement('div');
        overlay.className = 'admin-dialog-overlay active';

        const dialog = document.createElement('div');
        dialog.className = 'admin-dialog admin-dialog-confirm';

        dialog.innerHTML = `
            <div class="admin-dialog-header admin-dialog-header-danger">
                <div class="dialog-title-box">
                    <div class="dialog-header-icon danger">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 class="admin-dialog-title">${title}</h3>
                </div>
                <button type="button" class="admin-dialog-close" data-action="cancel" aria-label="Close modal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="admin-dialog-body" style="padding: 24px;">
                <p class="confirm-message" style="font-size: 15px; color: var(--admin-text); line-height: 1.6; margin: 0;">${message}</p>
            </div>
            <div class="admin-dialog-footer">
                <button type="button" class="btn-secondary" data-action="cancel">
                    <i class="fa-solid fa-xmark"></i> ${cancelText}
                </button>
                <button type="button" class="btn-danger" data-action="confirm">
                    <i class="fa-solid fa-trash-can"></i> ${confirmText}
                </button>
            </div>
        `;

        const close = (result) => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                resolve(result);
            }, 200);
        };

        dialog.querySelectorAll('[data-action="cancel"]').forEach(btn => btn.addEventListener('click', () => close(false)));
        dialog.querySelector('[data-action="confirm"]').addEventListener('click', () => close(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close(false);
        });

        overlay.appendChild(dialog);
        root.appendChild(overlay);
    });
}

function createFormModal({ title, icon = 'fa-solid fa-pen-fancy', fields = [], values = {}, meta = {}, submitText = 'Save', onSubmit }) {
    console.log('createFormModal called with:', { title, fields: fields.length, submitText });
    const root = document.getElementById('admin-dialog-root') || document.body;
    
    const overlay = document.createElement('div');
    overlay.className = 'admin-dialog-overlay active';

    const dialog = document.createElement('div');
    dialog.className = 'admin-dialog';
    overlay.appendChild(dialog);

    const fieldMap = new Map();

    const helpers = {
        setErrors: (errors) => {
            fieldMap.forEach(({ errorEl, input }) => {
                errorEl.textContent = '';
                input.classList.remove('is-invalid');
            });
            if (!errors) {
                return;
            }
            Object.entries(errors).forEach(([key, messages]) => {
                const entry = fieldMap.get(key);
                if (entry) {
                    entry.input.classList.add('is-invalid');
                    entry.errorEl.textContent = Array.isArray(messages) ? messages.join(', ') : String(messages);
                }
            });
        },
        setSubmitting: (state) => {
            submitBtn.disabled = Boolean(state);
            cancelBtn.disabled = Boolean(state);
            if (state) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> অপেক্ষা করুন...';
            } else {
                submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${submitText}`;
            }
        },
        close: () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 200);
        },
    };

    // 1. Header with Islamic styling and close button
    const header = document.createElement('div');
    header.className = 'admin-dialog-header';

    const titleBox = document.createElement('div');
    titleBox.className = 'dialog-title-box';

    const iconBox = document.createElement('div');
    iconBox.className = 'dialog-header-icon';
    iconBox.innerHTML = `<i class="${icon}"></i>`;

    const heading = document.createElement('h3');
    heading.className = 'admin-dialog-title';
    heading.textContent = title;

    titleBox.append(iconBox, heading);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'admin-dialog-close';
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.addEventListener('click', () => helpers.close());

    header.append(titleBox, closeBtn);
    dialog.appendChild(header);

    // 2. Form container
    const form = document.createElement('form');
    form.className = 'admin-dialog-form';

    // 3. Scrollable Dialog Body
    const body = document.createElement('div');
    body.className = 'admin-dialog-body form-grid';
    form.appendChild(body);

    // Build fields
    fields.forEach((field) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = field.label || field.name;
        if (field.required) {
            const reqStar = document.createElement('span');
            reqStar.className = 'text-danger';
            reqStar.style.color = 'var(--admin-danger)';
            reqStar.textContent = ' *';
            label.appendChild(reqStar);
        }
        wrapper.appendChild(label);

        const path = field.name;
        const initialValue = resolveValue(values, path, field.default ?? (field.type === 'toggle' ? false : ''));

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.className = 'form-control';
            input.rows = field.rows || 3;
            input.value = initialValue ?? '';
        } else if (field.type === 'select') {
            input = document.createElement('select');
            input.className = 'form-control form-select';
            if (field.allowNull) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = field.nullLabel || 'বাছাই করুন...';
                input.appendChild(option);
            }
            if (Array.isArray(field.options)) {
                field.options.forEach((option) => {
                    const opt = document.createElement('option');
                    opt.value = option.value ?? '';
                    opt.textContent = option.label ?? String(option.value ?? '');
                    input.appendChild(opt);
                });
            }
            if (field.optionsSource && meta[field.optionsSource]) {
                const labelKey = field.labelKey || 'name';
                const valueKey = field.valueKey || 'id';
                meta[field.optionsSource].forEach((option) => {
                    const opt = document.createElement('option');
                    opt.value = String(option[valueKey]);
                    opt.textContent = option[labelKey];
                    input.appendChild(opt);
                });
            }
            input.value = initialValue === null || initialValue === undefined ? '' : String(initialValue);
        } else if (field.type === 'toggle') {
            wrapper.className = 'form-group form-group-toggle';
            const toggleLabel = document.createElement('label');
            toggleLabel.className = 'toggle-switch';

            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = Boolean(initialValue);

            const slider = document.createElement('span');
            slider.className = 'toggle-slider';

            toggleLabel.append(input, slider);
            wrapper.appendChild(toggleLabel);
        } else {
            input = document.createElement('input');
            input.className = 'form-control';
            input.type = field.type || 'text';
            if (field.min !== undefined) {
                input.min = field.min;
            }
            if (field.max !== undefined) {
                input.max = field.max;
            }
            input.value = initialValue ?? '';
        }

        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }
        if (field.required) {
            input.required = true;
        }
        if (field.allowNull) {
            input.dataset.allowNull = 'true';
        }
        if (field.type === 'number') {
            input.dataset.numeric = 'true';
        }

        input.dataset.fieldPath = path;
        wrapper.appendChild(input);

        if (field.help) {
            const helper = document.createElement('small');
            helper.className = 'form-helper';
            helper.textContent = field.help;
            wrapper.appendChild(helper);
        }

        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        wrapper.appendChild(errorEl);

        body.appendChild(wrapper);
        fieldMap.set(path, { input, field, errorEl });
    });

    // 4. Footer with action buttons AT THE BOTTOM
    const footer = document.createElement('div');
    footer.className = 'admin-dialog-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-secondary';
    cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> বাতিল';
    cancelBtn.addEventListener('click', () => helpers.close());

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn-primary';
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${submitText}`;

    footer.append(cancelBtn, submitBtn);
    form.appendChild(footer);
    dialog.appendChild(form);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            helpers.close();
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        helpers.setErrors(null);
        helpers.setSubmitting(true);

        const payload = {};
        fieldMap.forEach(({ input, field }) => {
            let value;
            if (field.type === 'toggle') {
                value = input.checked;
            } else if (field.type === 'number') {
                value = input.value === '' ? null : Number(input.value);
            } else if (field.allowNull && input.value === '') {
                value = null;
            } else {
                value = input.value;
            }
            setNestedValue(payload, field.name, value);
        });

        console.log('Payload constructed:', payload);

        try {
            await onSubmit(payload, helpers);
        } catch (error) {
            console.error(error);
            showToast(error.message || 'সংরক্ষণ সম্পন্ন করা যায়নি।', true);
            helpers.setSubmitting(false);
        }
    });

    root.appendChild(overlay);
    return helpers;
}

