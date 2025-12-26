export const adminResourceConfigs = {
    surahs: {
        singular: 'Surah',
        columns: [
            { header: '#', key: 'number', width: '70px', align: 'center' },
            { header: 'Bangla', key: 'meta.name_bn', fallback: '--' },
            { header: 'Arabic', key: 'name_ar' },
            { header: 'Meaning (Bangla)', key: 'meta.meaning_bn', fallback: '--' },
            { header: 'Ayahs', key: 'ayah_count', width: '90px', align: 'center' },
            { header: 'Actions', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'link', label: 'Ayahs', icon: 'bi bi-collection', path: 'links.ayahs' },
            { type: 'delete', confirm: 'Delete this surah? Ayahs attached to it will also be removed.' },
        ],
        form: {
            title: 'Surah',
            fields: [
                { name: 'number', label: 'Number', type: 'number', required: true, min: 1 },
                { name: 'name_ar', label: 'Name (Arabic)', type: 'text', required: true },
                { name: 'meta.name_bn', label: 'Name (Bangla)', type: 'text' },
                { name: 'slug', label: 'Slug', type: 'text', help: 'Auto-generated if left blank.' },
                {
                    name: 'revelation_type',
                    label: 'Revelation Type',
                    type: 'select',
                    options: [
                        { value: '', label: 'Auto detect' },
                        { value: 'meccan', label: 'Meccan' },
                        { value: 'medinan', label: 'Medinan' },
                    ],
                },
                { name: 'meta.summary_bn', label: 'Summary (Bangla)', type: 'textarea' },
                { name: 'meta.meaning_bn', label: 'Meaning (Bangla)', type: 'text' },
                { name: 'meta.revelation_order', label: 'Revelation Order', type: 'number', min: 1 },
            ],
        },
        transformItem: (item, dataset) => {
            const meta = item.meta || {};
            return {
                ...item,
                meta: {
                    ...meta,
                    name_bn: meta.name_bn || '--',
                },
                links: {
                    ayahs: dataset.extra?.links?.ayahs?.replace('__ID__', item.id),
                },
            };
        },
    },
    'hadiths': {
        singular: 'Hadith',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'Title', key: 'title' },
            { header: 'Collection', key: 'category.name', fallback: '--' },
            { header: 'Reference', key: 'reference', fallback: '--' },
            { header: 'Status', key: 'is_active', type: 'status', width: '120px', align: 'center' },
            { header: 'Actions', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'Delete this hadith entry?' },
        ],
        filters: [
            { key: 'category', selector: '[data-admin-filter="category"] select', optionsPath: 'filters.options.categories' },
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'Hadith entry',
            fields: [
                { name: 'title', label: 'Title', type: 'text', required: true },
                {
                    name: 'hadith_category_id',
                    label: 'Collection',
                    type: 'select',
                    optionsSource: 'categories',
                    allowNull: true,
                    nullLabel: 'Uncategorised',
                },
                { name: 'text_ar', label: 'Arabic', type: 'textarea' },
                { name: 'text_bn', label: 'Bangla', type: 'textarea' },
                { name: 'reference', label: 'Reference', type: 'text' },
                { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
                { name: 'is_active', label: 'Visible', type: 'toggle', default: true },
            ],
        },
        transformItem: (item) => ({
            ...item,
            category: item.category || null,
        }),
    },
    'duas': {
        singular: 'Dua',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'Title', key: 'title' },
            { header: 'Category', key: 'category.name', fallback: '--' },
            { header: 'Reference', key: 'reference', fallback: '--' },
            { header: 'Status', key: 'is_active', type: 'status', width: '120px', align: 'center' },
            { header: 'Actions', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'Delete this dua?' },
        ],
        filters: [
            { key: 'category', selector: '[data-admin-filter="category"] select', optionsPath: 'filters.options.categories' },
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'Dua',
            fields: [
                { name: 'title', label: 'Title', type: 'text', required: true },
                {
                    name: 'dua_category_id',
                    label: 'Category',
                    type: 'select',
                    optionsSource: 'categories',
                    allowNull: true,
                    nullLabel: 'Uncategorised',
                },
                { name: 'text_ar', label: 'Arabic', type: 'textarea' },
                { name: 'transliteration', label: 'Transliteration', type: 'textarea' },
                { name: 'text_bn', label: 'Bangla', type: 'textarea' },
                { name: 'reference', label: 'Reference', type: 'text' },
                { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
                { name: 'is_active', label: 'Visible', type: 'toggle', default: true },
            ],
        },
        transformItem: (item) => ({
            ...item,
            category: item.category || null,
        }),
    },
    'hadith-categories': {
        singular: 'Hadith collection',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'Name', key: 'name' },
            { header: 'Slug', key: 'slug', fallback: '--' },
            { header: 'Hadiths', key: 'hadiths_count', width: '110px', align: 'center' },
            { header: 'Status', key: 'is_active', type: 'status', width: '110px', align: 'center' },
            { header: 'Actions', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'Delete this collection? Associated hadiths will become uncategorised.' },
        ],
        filters: [
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'Hadith collection',
            fields: [
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'slug', label: 'Slug', type: 'text', help: 'Auto-generated if left blank.' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
                { name: 'is_active', label: 'Visible', type: 'toggle', default: true },
            ],
        },
    },
    'dua-categories': {
        singular: 'Dua category',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'Name', key: 'name' },
            { header: 'Slug', key: 'slug', fallback: '--' },
            { header: 'Duas', key: 'duas_count', width: '110px', align: 'center' },
            { header: 'Status', key: 'is_active', type: 'status', width: '110px', align: 'center' },
            { header: 'Actions', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'Delete this category? Existing duas will become uncategorised.' },
        ],
        filters: [
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'Dua category',
            fields: [
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'slug', label: 'Slug', type: 'text', help: 'Auto-generated if left blank.' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'sort_order', label: 'Sort Order', type: 'number', min: 0 },
                { name: 'is_active', label: 'Visible', type: 'toggle', default: true },
            ],
        },
    },
    ayahs: {
        singular: 'Ayah',
        columns: [
            { header: '#', key: 'number', width: '70px', align: 'center' },
            { header: 'Bangla', key: 'text_bn', fallback: '--' },
            { header: 'Transliteration', key: 'transliteration', fallback: '--' },
            { header: 'Arabic', key: 'text_ar', fallback: '--' },
            { header: 'Status', key: 'is_active', type: 'status', width: '110px', align: 'center' },
            { header: 'Actions', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'Delete this ayah?' },
        ],
        filters: [
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'Ayah',
            fields: [
                { name: 'number', label: 'Number', type: 'number', min: 1 },
                { name: 'text_bn', label: 'Bangla', type: 'textarea' },
                { name: 'transliteration', label: 'Transliteration', type: 'textarea' },
                { name: 'text_ar', label: 'Arabic', type: 'textarea' },
                { name: 'audio_url', label: 'Audio URL', type: 'url' },
                { name: 'is_active', label: 'Visible', type: 'toggle', default: true },
            ],
        },
    },
};
