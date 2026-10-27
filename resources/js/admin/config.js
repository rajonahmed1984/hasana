export const adminResourceConfigs = {
    surahs: {
        singular: 'সূরা',
        columns: [
            { header: '#', key: 'number', width: '70px', align: 'center' },
            { header: 'বাংলা নাম', key: 'meta.name_bn', fallback: '--' },
            { header: 'আরবি নাম', key: 'name_ar' },
            { header: 'বাংলা অর্থ', key: 'meta.meaning_bn', fallback: '--' },
            { header: 'মোট আয়াত', key: 'ayah_count', width: '95px', align: 'center' },
            { header: 'অ্যাকশন', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'link', label: 'আয়াত সমূহ', icon: 'fa-solid fa-layer-group', path: 'links.ayahs' },
            { type: 'delete', confirm: 'এই সূরাটি ডিলিট করতে চান? এর সাথে সংযুক্ত সকল আয়াতও মুছে যাবে।' },
        ],
        form: {
            title: 'সূরা সম্পাদনা / তৈরি',
            fields: [
                { name: 'number', label: 'সূরা নম্বর (Number)', type: 'number', required: true, min: 1, placeholder: '১ থেকে ১১৪' },
                { name: 'name_ar', label: 'আরবি নাম (Arabic Name)', type: 'text', required: true, placeholder: 'যেমন: الفاتحة' },
                { name: 'meta.name_bn', label: 'বাংলা নাম (Bangla Name)', type: 'text', placeholder: 'যেমন: আল-ফাতিহা' },
                { name: 'slug', label: 'স্লাগ (URL Slug)', type: 'text', help: 'খালি রাখলে ইংরেজি নাম থেকে স্বয়ংক্রিয়ভাবে তৈরি হবে।', placeholder: 'al-fatiha' },
                {
                    name: 'revelation_type',
                    label: 'অবতীর্ণের স্থান (Revelation Type)',
                    type: 'select',
                    options: [
                        { value: '', label: 'স্বয়ংক্রিয় (Auto detect)' },
                        { value: 'meccan', label: 'মাক্কী (Meccan)' },
                        { value: 'medinan', label: 'মাদানী (Medinan)' },
                    ],
                },
                { name: 'meta.meaning_bn', label: 'বাংলা অর্থ (Bangla Meaning)', type: 'text', placeholder: 'যেমন: সূচনা' },
                { name: 'meta.revelation_order', label: 'অবতীর্ণের ক্রম (Order)', type: 'number', min: 1, placeholder: 'যেমন: ৫' },
                { name: 'meta.summary_bn', label: 'সংক্ষিপ্ত পরিচিতি ও সারসংক্ষেপ (Summary)', type: 'textarea', placeholder: 'সূরাটির মূল বিষয়বস্তু ও ফযিলত...' },
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
        singular: 'হাদিস',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'শিরোনাম', key: 'title' },
            { header: 'সংকলন / অধ্যায়', key: 'category.name', fallback: '--' },
            { header: 'রেফারেন্স', key: 'reference', fallback: '--' },
            { header: 'স্ট্যাটাস', key: 'is_active', type: 'status', width: '120px', align: 'center' },
            { header: 'অ্যাকশন', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'এই হাদিসটি ডিলিট করতে চান?' },
        ],
        filters: [
            { key: 'category', selector: '[data-admin-filter="category"] select', optionsPath: 'filters.options.categories' },
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'হাদিস এন্ট্রি',
            fields: [
                { name: 'title', label: 'হাদিস শিরোনাম (Title)', type: 'text', required: true, placeholder: 'যেমন: হালাল ও হারাম খাদ্য' },
                {
                    name: 'hadith_category_id',
                    label: 'হাদিস সংকলন / অধ্যায় (Category)',
                    type: 'select',
                    optionsSource: 'categories',
                    allowNull: true,
                    nullLabel: 'ক্যাটাগরি নির্ধারণ করুন...',
                },
                { name: 'text_ar', label: 'আরবি হাদিস (Arabic Text)', type: 'textarea', placeholder: 'عَنْ أَبِي هُرَيْرَةَ...' },
                { name: 'text_bn', label: 'বাংলা অনুবাদ (Bangla Translation)', type: 'textarea', placeholder: 'হাদিসের বাংলা অর্থ...' },
                { name: 'reference', label: 'রেফারেন্স / গ্রন্থসূত্র (Reference)', type: 'text', placeholder: 'সহীহ বুখারী, হাদিস নং...' },
                { name: 'sort_order', label: 'সিরিয়াল নম্বর (Sort Order)', type: 'number', min: 0, default: 0 },
                { name: 'is_active', label: 'ওয়েবসাইটে প্রদর্শন করুন (Visible)', type: 'toggle', default: true },
            ],
        },
        transformItem: (item) => ({
            ...item,
            category: item.category || null,
        }),
    },
    'duas': {
        singular: 'দোয়া',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'শিরোনাম', key: 'title' },
            { header: 'ক্যাটাগরি', key: 'category.name', fallback: '--' },
            { header: 'রেফারেন্স', key: 'reference', fallback: '--' },
            { header: 'স্ট্যাটাস', key: 'is_active', type: 'status', width: '120px', align: 'center' },
            { header: 'অ্যাকশন', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'এই দোয়াটি ডিলিট করতে চান?' },
        ],
        filters: [
            { key: 'category', selector: '[data-admin-filter="category"] select', optionsPath: 'filters.options.categories' },
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'দোয়া এন্ট্রি',
            fields: [
                { name: 'title', label: 'দোয়ার শিরোনাম (Title)', type: 'text', required: true, placeholder: 'যেমন: সকালের জিকির' },
                {
                    name: 'dua_category_id',
                    label: 'দোয়ার ক্যাটাগরি (Category)',
                    type: 'select',
                    optionsSource: 'categories',
                    allowNull: true,
                    nullLabel: 'ক্যাটাগরি নির্বাচন করুন...',
                },
                { name: 'text_ar', label: 'আরবি দোয়া (Arabic Text)', type: 'textarea', placeholder: 'اللَّهُمَّ...' },
                { name: 'transliteration', label: 'বাংলা উচ্চারণ (Transliteration)', type: 'textarea', placeholder: 'আল্লাহুম্মা...' },
                { name: 'text_bn', label: 'বাংলা অনুবাদ (Bangla Meaning)', type: 'textarea', placeholder: 'হে আল্লাহ...' },
                { name: 'reference', label: 'রেফারেন্স / গ্রন্থসূত্র (Reference)', type: 'text', placeholder: 'হাদিস বা কুরআনের রেফারেন্স...' },
                { name: 'sort_order', label: 'সিরিয়াল নম্বর (Sort Order)', type: 'number', min: 0, default: 0 },
                { name: 'is_active', label: 'ওয়েবসাইটে প্রদর্শন করুন (Visible)', type: 'toggle', default: true },
            ],
        },
        transformItem: (item) => ({
            ...item,
            category: item.category || null,
        }),
    },
    'hadith-categories': {
        singular: 'হাদিস ক্যাটাগরি',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'নাম', key: 'name' },
            { header: 'স্লাগ', key: 'slug', fallback: '--' },
            { header: 'হাদিস সংখ্যা', key: 'hadiths_count', width: '110px', align: 'center' },
            { header: 'স্ট্যাটাস', key: 'is_active', type: 'status', width: '110px', align: 'center' },
            { header: 'অ্যাকশন', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'এই ক্যাটাগরিটি মুছে ফেলতে চান? এর অন্তর্ভুক্ত হাদিসগুলো আনক্যাটাগোরাইজড হয়ে যাবে।' },
        ],
        filters: [
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'হাদিস ক্যাটাগরি',
            fields: [
                { name: 'name', label: 'ক্যাটাগরি নাম (Name)', type: 'text', required: true, placeholder: 'যেমন: হালাল ও হারাম খাদ্য' },
                { name: 'slug', label: 'স্লাগ (URL Slug)', type: 'text', help: 'খালি রাখলে স্বয়ংক্রিয়ভাবে তৈরি হবে।', placeholder: 'haram-food' },
                { name: 'description', label: 'বিবরণ (Description)', type: 'textarea', placeholder: 'ক্যাটাগরির সংক্ষিপ্ত বিবরণ...' },
                { name: 'sort_order', label: 'সিরিয়াল নম্বর (Sort Order)', type: 'number', min: 0, default: 0 },
                { name: 'is_active', label: 'সক্রিয় রাখুন (Visible)', type: 'toggle', default: true },
            ],
        },
    },
    'dua-categories': {
        singular: 'দোয়া ক্যাটাগরি',
        columns: [
            { header: 'ID', key: 'id', width: '70px', align: 'center' },
            { header: 'নাম', key: 'name' },
            { header: 'স্লাগ', key: 'slug', fallback: '--' },
            { header: 'দোয়া সংখ্যা', key: 'duas_count', width: '110px', align: 'center' },
            { header: 'স্ট্যাটাস', key: 'is_active', type: 'status', width: '110px', align: 'center' },
            { header: 'অ্যাকশন', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'এই ক্যাটাগরিটি মুছে ফেলতে চান?' },
        ],
        filters: [
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'দোয়া ক্যাটাগরি',
            fields: [
                { name: 'name', label: 'ক্যাটাগরি নাম (Name)', type: 'text', required: true, placeholder: 'যেমন: দৈনন্দিন জীবনের দোয়া' },
                { name: 'slug', label: 'স্লাগ (URL Slug)', type: 'text', help: 'খালি রাখলে স্বয়ংক্রিয়ভাবে তৈরি হবে।', placeholder: 'daily-duas' },
                { name: 'description', label: 'বিবরণ (Description)', type: 'textarea', placeholder: 'ক্যাটাগরির বিবরণ...' },
                { name: 'sort_order', label: 'সিরিয়াল নম্বর (Sort Order)', type: 'number', min: 0, default: 0 },
                { name: 'is_active', label: 'সক্রিয় রাখুন (Visible)', type: 'toggle', default: true },
            ],
        },
    },
    ayahs: {
        singular: 'আয়াত',
        columns: [
            { header: '#', key: 'number', width: '70px', align: 'center' },
            { header: 'বাংলা অনুবাদ', key: 'text_bn', fallback: '--' },
            { header: 'উচ্চারণ', key: 'transliteration', fallback: '--' },
            { header: 'আরবি পাঠ', key: 'text_ar', fallback: '--' },
            { header: 'স্ট্যাটাস', key: 'is_active', type: 'status', width: '110px', align: 'center' },
            { header: 'অ্যাকশন', type: 'actions', width: '200px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'এই আয়াতটি মুছে ফেলতে চান?' },
        ],
        filters: [
            { key: 'is_active', selector: '[data-admin-filter="is_active"] select' },
        ],
        form: {
            title: 'আয়াত এন্ট্রি / সম্পাদনা',
            fields: [
                { name: 'number', label: 'আয়াত নম্বর (Ayah Number)', type: 'number', min: 1, required: true, placeholder: 'যেমন: ১' },
                { name: 'text_ar', label: 'আরবি আয়াত (Arabic Ayah)', type: 'textarea', required: true, placeholder: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
                { name: 'text_bn', label: 'বাংলা অনুবাদ (Bangla Translation)', type: 'textarea', required: true, placeholder: 'পরম করুণাময় অতি দয়ালু আল্লাহর নামে শুরু করছি।' },
                { name: 'transliteration', label: 'উচ্চারণ (Transliteration)', type: 'textarea', placeholder: 'বিসমিল্লাহির রাহমানির রাহিম' },
                { name: 'is_active', label: 'সক্রিয় রাখুন (Visible)', type: 'toggle', default: true },
            ],
        },
    },
    users: {
        singular: 'ব্যবহারকারী',
        columns: [
            { header: '#', key: 'id', width: '70px', align: 'center' },
            { header: 'নাম', key: 'name' },
            { header: 'ইমেইল', key: 'email' },
            { header: 'তৈরির তারিখ', key: 'created_at', width: '150px' },
            { header: 'অ্যাকশন', type: 'actions', width: '150px' },
        ],
        actions: [
            { type: 'edit' },
            { type: 'delete', confirm: 'এই ব্যবহারকারী অ্যাকাউন্টটি ডিলিট করতে চান?' },
        ],
        form: {
            title: 'ব্যবহারকারী অ্যাকাউন্ট',
            fields: [
                { name: 'name', label: 'পুরো নাম (Full Name)', type: 'text', required: true, placeholder: 'যেমন: অ্যাডমিন' },
                { name: 'email', label: 'ইমেইল (Email Address)', type: 'email', required: true, placeholder: 'admin@hasana.app' },
                { name: 'password', label: 'পাসওয়ার্ড (Password)', type: 'password', required: true, help: 'নূন্যতম ৮ অক্ষর হতে হবে।' },
                { name: 'password_confirmation', label: 'পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)', type: 'password', required: true },
            ],
        },
        transformItem: (item) => {
            return {
                ...item,
                created_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : '--',
            };
        },
    },
};
