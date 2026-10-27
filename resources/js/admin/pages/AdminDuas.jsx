import React, { useState, useEffect } from 'react';
import { 
    HeartHandshake, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle2, 
    XCircle,
    BookOpen
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/AdminLayout';

export default function AdminDuas() {
    const { showToast } = useToast();
    const [duas, setDuas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedDua, setSelectedDua] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        dua_category_id: '',
        title: '',
        text_ar: '',
        text_bn: '',
        transliteration: '',
        meaning_bn: '',
        reference: '',
        virtue_bn: '',
        sort_order: 0,
        is_active: true,
    });

    const fetchDuas = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/duas', {
                search,
                category: categoryFilter,
                page,
            });
            setDuas(res.data || []);
            setMeta(res.meta || {});
            if (res.filters?.options?.categories) {
                setCategories(res.filters.options.categories);
            }
        } catch (err) {
            showToast(err.message || 'দোয়া লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDuas();
    }, [categoryFilter, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchDuas();
    };

    const openCreate = () => {
        setForm({
            dua_category_id: categories[0]?.id || '',
            title: '',
            text_ar: '',
            text_bn: '',
            transliteration: '',
            meaning_bn: '',
            reference: '',
            virtue_bn: '',
            sort_order: (meta.total || 0) + 1,
            is_active: true,
        });
        setIsCreateOpen(true);
    };

    const openEdit = (dua) => {
        setSelectedDua(dua);
        setForm({
            dua_category_id: dua.category?.id || dua.dua_category_id || '',
            title: dua.title || '',
            text_ar: dua.text_ar || '',
            text_bn: dua.text_bn || '',
            transliteration: dua.transliteration || '',
            meaning_bn: dua.meaning_bn || '',
            reference: dua.reference || '',
            virtue_bn: dua.virtue_bn || '',
            sort_order: dua.sort_order ?? 0,
            is_active: dua.is_active ?? true,
        });
        setIsEditOpen(true);
    };

    const handleSaveCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiPost('/admin/duas', form);
            showToast('দোয়া সফলভাবে যোগ করা হয়েছে!');
            setIsCreateOpen(false);
            fetchDuas();
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedDua) return;
        setSubmitting(true);
        try {
            await apiPut(`/admin/duas/${selectedDua.id}`, form);
            showToast('দোয়া সফলভাবে আপডেট করা হয়েছে!');
            setIsEditOpen(false);
            fetchDuas();
        } catch (err) {
            showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedDua) return;
        setSubmitting(true);
        try {
            await apiDelete(`/admin/duas/${selectedDua.id}`);
            showToast('দোয়া সফলভাবে মুছে ফেলা হয়েছে!');
            setIsDeleteOpen(false);
            fetchDuas();
        } catch (err) {
            showToast(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        মাসনুন ও কুরআনী দোয়া
                    </h2>
                    <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                        দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া, জিকির, বিপদ মুক্তি ও মাগফিরাতের দোয়া পরিচালনা করুন
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all shadow-md shadow-[#125e54]/20 active:scale-98"
                >
                    <Plus className="w-4 h-4 text-[#dfab3b]" />
                    <span>নতুন দোয়া যোগ করুন</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="দোয়ার শিরোনাম, অর্থ বা আরবি পাঠ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                    />
                    <Search className="w-4 h-4 text-[#546e6a] absolute left-3 top-3" />
                </form>

                <div className="flex items-center gap-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none"
                    >
                        <option value="">সকল দোয়া ক্যাটাগরি</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Duas Table */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f7f2] dark:bg-[#162724] border-b border-[#e2dfd5] dark:border-[#233e38] text-[#546e6a] dark:text-[#8aa39f] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-3.5 px-6">দোয়া শিরোনাম ও পাঠ</th>
                                <th className="py-3.5 px-6">ক্যাটাগরি</th>
                                <th className="py-3.5 px-6">রেফারেন্স ও ফজিলত</th>
                                <th className="py-3.5 px-6">স্ট্যাটাস</th>
                                <th className="py-3.5 px-6 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2dfd5]/60 dark:divide-[#233e38]/60 text-[#14302b] dark:text-[#e4ebe9]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#125e54] border-t-transparent rounded-full animate-spin"></div>
                                            <span>দোয়া তথ্য লোড হচ্ছে...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : duas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        কোনো দোয়া খুঁজে পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                duas.map((dua) => (
                                    <tr key={dua.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3.5 px-6 max-w-sm">
                                            <div className="font-bold text-sm text-[#14302b] dark:text-[#e4ebe9] mb-1">
                                                {dua.title}
                                            </div>
                                            {dua.text_ar && (
                                                <div className="font-arabic text-sm text-[#dfab3b] line-clamp-1 mb-1 text-right">
                                                    {dua.text_ar}
                                                </div>
                                            )}
                                            <p className="line-clamp-2 text-[#546e6a] dark:text-[#8aa39f] text-[11px] leading-relaxed">
                                                {dua.text_bn}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5] dark:border-[#233e38] font-semibold text-[11px] text-[#125e54] dark:text-[#dfab3b]">
                                                {dua.category?.name || 'সাধারণ'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 text-[#546e6a] dark:text-[#8aa39f] max-w-xs">
                                            <div className="font-semibold text-[#14302b] dark:text-[#e4ebe9]">
                                                {dua.reference || '—'}
                                            </div>
                                            {dua.virtue_bn && (
                                                <div className="text-[10px] line-clamp-1 italic">
                                                    ফজিলত: {dua.virtue_bn}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                                dua.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                                            }`}>
                                                {dua.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                {dua.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(dua)}
                                                    className="p-1.5 rounded-lg text-[#546e6a] hover:text-[#125e54] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                                    title="সম্পাদনা করুন"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedDua(dua); setIsDeleteOpen(true); }}
                                                    className="p-1.5 rounded-lg text-[#546e6a] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                    title="মুছে ফেলুন"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="p-4 border-t border-[#e2dfd5] dark:border-[#233e38] flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f]">
                        <div>
                            মোট {meta.total} টির মধ্যে {meta.from} - {meta.to}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={meta.current_page <= 1}
                                className="p-1.5 rounded-lg border border-[#e2dfd5] dark:border-[#233e38] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="font-semibold">
                                পৃষ্ঠা {meta.current_page} / {meta.last_page}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={meta.current_page >= meta.last_page}
                                className="p-1.5 rounded-lg border border-[#e2dfd5] dark:border-[#233e38] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isCreateOpen || isEditOpen}
                onClose={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
                title={isCreateOpen ? 'নতুন দোয়া যোগ করুন' : 'দোয়া সম্পাদনা করুন'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                দোয়া ক্যাটাগরি *
                            </label>
                            <select
                                required
                                value={form.dua_category_id}
                                onChange={(e) => setForm({ ...form, dua_category_id: e.target.value })}
                                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none"
                            >
                                <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                রেফারেন্স / সূত্র
                            </label>
                            <input
                                type="text"
                                placeholder="তিরমিযী: ৩৩৭৪"
                                value={form.reference}
                                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            দোয়ার শিরোনাম *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="যেমন: ঘুমানোর পূর্বের দোয়া"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            আরবি দোয়া পাঠ (Arabic text)
                        </label>
                        <textarea
                            rows="2"
                            placeholder="اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا"
                            value={form.text_ar}
                            onChange={(e) => setForm({ ...form, text_ar: e.target.value })}
                            className="w-full text-base font-arabic text-right px-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54] leading-relaxed"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            বাংলা অনুবাদ / অর্থ *
                        </label>
                        <textarea
                            rows="2"
                            required
                            placeholder="হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করি (ঘুমাই) এবং জীবিত হই।"
                            value={form.text_bn}
                            onChange={(e) => setForm({ ...form, text_bn: e.target.value })}
                            className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54] leading-relaxed"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                বাংলা উচ্চারণ
                            </label>
                            <input
                                type="text"
                                placeholder="আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহইয়া"
                                value={form.transliteration}
                                onChange={(e) => setForm({ ...form, transliteration: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                ফজিলত / প্রেক্ষাপট
                            </label>
                            <input
                                type="text"
                                placeholder="ঘুমানোর পূর্বে পড়লে শয়তান থেকে সুরক্ষা পাওয়া যায়..."
                                value={form.virtue_bn}
                                onChange={(e) => setForm({ ...form, virtue_bn: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="dua_active"
                            checked={form.is_active}
                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                            className="w-4 h-4 rounded-sm text-[#125e54] focus:ring-[#125e54]"
                        />
                        <label htmlFor="dua_active" className="text-xs font-semibold cursor-pointer">
                            এই দোয়াটি অ্যাপে প্রদর্শন করুন (Active)
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2dfd5] dark:border-[#233e38]">
                        <button
                            type="button"
                            onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
                            className="px-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] text-xs font-semibold text-[#546e6a] hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all disabled:opacity-50 shadow-md shadow-[#125e54]/20"
                        >
                            {submitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            <span>সংরক্ষণ করুন</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={submitting}
                title="দোয়া মুছে ফেলার নিশ্চিতকরণ"
                message={`আপনি কি নিশ্চিত যে "${selectedDua?.title || ''}" দোয়াটি মুছে ফেলতে চান?`}
            />
        </div>
    );
}
