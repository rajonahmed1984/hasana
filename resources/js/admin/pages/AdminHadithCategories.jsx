import React, { useState, useEffect } from 'react';
import { 
    FolderGit2, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    ChevronLeft,
    ChevronRight,
    FileText
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/AdminLayout';

export default function AdminHadithCategories() {
    const { showToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: '',
        name_ar: '',
        slug: '',
        description: '',
        icon: '',
        sort_order: 0,
        is_active: true,
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/hadith-categories', {
                search,
                page,
            });
            setCategories(res.data || []);
            setMeta(res.meta || {});
        } catch (err) {
            showToast(err.message || 'ক্যাটাগরি লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCategories();
    };

    const openCreate = () => {
        setForm({
            name: '',
            name_ar: '',
            slug: '',
            description: '',
            icon: '',
            sort_order: (meta.total || 0) + 1,
            is_active: true,
        });
        setIsCreateOpen(true);
    };

    const openEdit = (cat) => {
        setSelectedCat(cat);
        setForm({
            name: cat.name,
            name_ar: cat.name_ar || '',
            slug: cat.slug || '',
            description: cat.description || '',
            icon: cat.icon || '',
            sort_order: cat.sort_order ?? 0,
            is_active: cat.is_active ?? true,
        });
        setIsEditOpen(true);
    };

    const handleSaveCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiPost('/admin/hadith-categories', form);
            showToast('হাদিস গ্রন্থ / ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে!');
            setIsCreateOpen(false);
            fetchCategories();
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedCat) return;
        setSubmitting(true);
        try {
            await apiPut(`/admin/hadith-categories/${selectedCat.id}`, form);
            showToast('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!');
            setIsEditOpen(false);
            fetchCategories();
        } catch (err) {
            showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCat) return;
        setSubmitting(true);
        try {
            await apiDelete(`/admin/hadith-categories/${selectedCat.id}`);
            showToast('ক্যাটাগরি মুছে ফেলা হয়েছে!');
            setIsDeleteOpen(false);
            fetchCategories();
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
                        হাদিস গ্রন্থ ও ক্যাটাগরি
                    </h2>
                    <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                        সহীহ বুখারী, সহীহ মুসলিম, সুনানসহ বিভিন্ন হাদিস সংকলনের তালিকা পরিচালনা করুন
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all shadow-md shadow-[#125e54]/20 active:scale-98"
                >
                    <Plus className="w-4 h-4 text-[#dfab3b]" />
                    <span>নতুন ক্যাটাগরি যোগ করুন</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs flex items-center justify-between">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="ক্যাটাগরির নাম বা স্লাগ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                    />
                    <Search className="w-4 h-4 text-[#546e6a] absolute left-3 top-3" />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f7f2] dark:bg-[#162724] border-b border-[#e2dfd5] dark:border-[#233e38] text-[#546e6a] dark:text-[#8aa39f] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-3.5 px-6">নাম (বাংলা ও আরবি)</th>
                                <th className="py-3.5 px-6">স্লাগ</th>
                                <th className="py-3.5 px-6">হাদিস সংখ্যা</th>
                                <th className="py-3.5 px-6">ক্রম (Order)</th>
                                <th className="py-3.5 px-6">স্ট্যাটাস</th>
                                <th className="py-3.5 px-6 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2dfd5]/60 dark:divide-[#233e38]/60 text-[#14302b] dark:text-[#e4ebe9]">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#125e54] border-t-transparent rounded-full animate-spin"></div>
                                            <span>ক্যাটাগরি লোড হচ্ছে...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        কোনো ক্যাটাগরি খুঁজে পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3.5 px-6">
                                            <div className="font-bold text-sm text-[#14302b] dark:text-[#e4ebe9]">
                                                {cat.name}
                                            </div>
                                            {cat.name_ar && (
                                                <div className="font-arabic text-sm text-[#dfab3b]">
                                                    {cat.name_ar}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-6 font-mono text-[#546e6a] dark:text-[#8aa39f]">
                                            {cat.slug}
                                        </td>
                                        <td className="py-3.5 px-6 font-semibold">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5] dark:border-[#233e38]">
                                                <FileText className="w-3.5 h-3.5 text-[#125e54] dark:text-[#dfab3b]" />
                                                <span>{cat.hadiths_count ?? 0} টি</span>
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 font-mono">
                                            {cat.sort_order}
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                                cat.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                                            }`}>
                                                {cat.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                {cat.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(cat)}
                                                    className="p-1.5 rounded-lg text-[#546e6a] hover:text-[#125e54] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                                    title="সম্পাদনা করুন"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedCat(cat); setIsDeleteOpen(true); }}
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
                title={isCreateOpen ? 'নতুন হাদিস ক্যাটাগরি তৈরি করুন' : 'ক্যাটাগরি সম্পাদনা করুন'}
            >
                <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                ক্যাটাগরি নাম (বাংলা) *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="সহীহ বুখারী"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                আরবি নাম
                            </label>
                            <input
                                type="text"
                                placeholder="صحيح البخاري"
                                value={form.name_ar}
                                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                                className="w-full text-xs font-arabic text-right px-3 py-2 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                স্লাগ (Slug)
                            </label>
                            <input
                                type="text"
                                placeholder="sahih-bukhari"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                সাজানোর ক্রম (Sort Order)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            সংক্ষিপ্ত বিবরণ
                        </label>
                        <textarea
                            rows="2"
                            placeholder="এই হাদিস সংকলনের সংক্ষিপ্ত পরিচয়..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="cat_active"
                            checked={form.is_active}
                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                            className="w-4 h-4 rounded-sm text-[#125e54] focus:ring-[#125e54]"
                        />
                        <label htmlFor="cat_active" className="text-xs font-semibold cursor-pointer">
                            এই ক্যাটাগরি সক্রিয় রাখুন (Active)
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
                title="ক্যাটাগরি মুছে ফেলার নিশ্চিতকরণ"
                message={`আপনি কি নিশ্চিত যে "${selectedCat?.name || ''}" ক্যাটাগরি মুছে ফেলতে চান?`}
            />
        </div>
    );
}
