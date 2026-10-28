import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    Layers,
    Compass,
    Check
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/AdminLayout';

export default function AdminSurahs() {
    const { showToast } = useToast();
    const [surahs, setSurahs] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [revelation, setRevelation] = useState('');
    const [page, setPage] = useState(1);

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        number: '',
        name_ar: '',
        name_en: '',
        slug: '',
        revelation_type: 'Meccan',
        summary: '',
        meta: {
            name_bn: '',
            meaning_bn: '',
            summary_bn: '',
            revelation_order: '',
        }
    });

    const fetchSurahs = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/surahs', {
                search,
                revelation_type: revelation,
                page,
            });
            setSurahs(res.data || []);
            setMeta(res.meta || {});
        } catch (err) {
            showToast(err.message || 'সূরা লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurahs();
    }, [revelation, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchSurahs();
    };

    const openCreate = () => {
        setForm({
            number: (meta.total || 0) + 1,
            name_ar: '',
            name_en: '',
            slug: '',
            revelation_type: 'Meccan',
            summary: '',
            meta: {
                name_bn: '',
                meaning_bn: '',
                summary_bn: '',
                revelation_order: '',
            }
        });
        setIsCreateOpen(true);
    };

    const openEdit = (surah) => {
        setSelectedSurah(surah);
        setForm({
            number: surah.number,
            name_ar: surah.name_ar,
            name_en: surah.name_en,
            slug: surah.slug,
            revelation_type: surah.revelation_type || 'Meccan',
            summary: surah.summary || '',
            meta: {
                name_bn: surah.meta?.name_bn || '',
                meaning_bn: surah.meta?.meaning_bn || '',
                summary_bn: surah.meta?.summary_bn || '',
                revelation_order: surah.meta?.revelation_order || '',
            }
        });
        setIsEditOpen(true);
    };

    const handleSaveCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiPost('/admin/surahs', form);
            showToast('নতুন সূরা সফলভাবে যোগ করা হয়েছে!');
            setIsCreateOpen(false);
            fetchSurahs();
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedSurah) return;
        setSubmitting(true);
        try {
            await apiPut(`/admin/surahs/${selectedSurah.id}`, form);
            showToast('সূরা সফলভাবে আপডেট করা হয়েছে!');
            setIsEditOpen(false);
            fetchSurahs();
        } catch (err) {
            showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSurah) return;
        setSubmitting(true);
        try {
            await apiDelete(`/admin/surahs/${selectedSurah.id}`);
            showToast('সূরা সফলভাবে মুছে ফেলা হয়েছে!');
            setIsDeleteOpen(false);
            fetchSurahs();
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
                        কুরআন ও সূরা ব্যবস্থাপনা
                    </h2>
                    <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                        পবিত্র আল কুরআনের 114টি সূরা ও তাদের আয়াতসমূহ সম্পাদনা ও পরিচালনা করুন
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all shadow-md shadow-[#125e54]/20 active:scale-98"
                >
                    <Plus className="w-4 h-4 text-[#dfab3b]" />
                    <span>নতুন সূরা যোগ করুন</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="সূরার নাম (বাংলা, আরবি, ইংরেজি) বা নম্বর..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                    />
                    <Search className="w-4 h-4 text-[#546e6a] absolute left-3 top-3" />
                </form>

                <div className="flex items-center gap-3">
                    <select
                        value={revelation}
                        onChange={(e) => { setRevelation(e.target.value); setPage(1); }}
                        className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none"
                    >
                        <option value="">সকল অবতীর্ণ স্থান</option>
                        <option value="Meccan">মাক্কী (Meccan)</option>
                        <option value="Medinan">মাদানী (Medinan)</option>
                    </select>
                </div>
            </div>

            {/* Surahs Table */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f7f2] dark:bg-[#162724] border-b border-[#e2dfd5] dark:border-[#233e38] text-[#546e6a] dark:text-[#8aa39f] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-3.5 px-6 w-16">#</th>
                                <th className="py-3.5 px-6">নাম (আরবি ও বাংলা)</th>
                                <th className="py-3.5 px-6">ইংরেজি ও অর্থ</th>
                                <th className="py-3.5 px-6">অবতীর্ণ</th>
                                <th className="py-3.5 px-6">আয়াত সংখ্যা</th>
                                <th className="py-3.5 px-6 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2dfd5]/60 dark:divide-[#233e38]/60 text-[#14302b] dark:text-[#e4ebe9]">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#125e54] border-t-transparent rounded-full animate-spin"></div>
                                            <span>সূরা তথ্য লোড হচ্ছে...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : surahs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        কোনো সূরা খুঁজে পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                surahs.map((surah) => (
                                    <tr key={surah.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3.5 px-6">
                                            <span className="w-8 h-8 rounded-xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5] dark:border-[#233e38] flex items-center justify-center font-bold text-xs text-[#125e54] dark:text-[#dfab3b]">
                                                {surah.number}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 font-semibold">
                                            <div className="flex items-center gap-3">
                                                <span className="font-arabic text-lg text-[#125e54] dark:text-[#dfab3b]">
                                                    {surah.name_ar}
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {surah.meta?.name_bn || surah.name_en}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-6 text-[#546e6a] dark:text-[#8aa39f]">
                                            <div className="font-semibold text-[#14302b] dark:text-[#e4ebe9]">
                                                {surah.name_en}
                                            </div>
                                            <div className="text-[11px]">
                                                {surah.meta?.meaning_bn || '—'}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                surah.revelation_type === 'Meccan' 
                                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' 
                                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                            }`}>
                                                {surah.revelation_type === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 font-semibold">
                                            <span className="font-mono">{surah.ayah_count}</span> টি
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/surahs/${surah.id}/ayahs`}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5] dark:border-[#233e38] text-[11px] font-semibold text-[#125e54] dark:text-[#dfab3b] hover:bg-[#eeede6] transition-colors"
                                                    title="আয়াতসমূহ পরিচালনা করুন"
                                                >
                                                    <Layers className="w-3.5 h-3.5" />
                                                    <span>আয়াত সমূহ</span>
                                                </Link>
                                                <button
                                                    onClick={() => openEdit(surah)}
                                                    className="p-1.5 rounded-lg text-[#546e6a] hover:text-[#125e54] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                                    title="সম্পাদনা করুন"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedSurah(surah); setIsDeleteOpen(true); }}
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
                title={isCreateOpen ? 'নতুন সূরা যোগ করুন' : 'সূরা সম্পাদনা করুন'}
            >
                <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                সূরা নম্বর *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="250"
                                value={form.number}
                                onChange={(e) => setForm({ ...form, number: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                আরবি নাম *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="الفاتحة"
                                value={form.name_ar}
                                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                                className="w-full text-xs font-arabic text-right px-3 py-2 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                বাংলা নাম *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="আল-ফাতিহা"
                                value={form.meta.name_bn}
                                onChange={(e) => setForm({ ...form, meta: { ...form.meta, name_bn: e.target.value } })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                ইংরেজি নাম
                            </label>
                            <input
                                type="text"
                                placeholder="Al-Faatiha"
                                value={form.name_en}
                                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                বাংলা অর্থ
                            </label>
                            <input
                                type="text"
                                placeholder="সূচনা"
                                value={form.meta.meaning_bn}
                                onChange={(e) => setForm({ ...form, meta: { ...form.meta, meaning_bn: e.target.value } })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                অবতীর্ণ স্থান
                            </label>
                            <select
                                value={form.revelation_type}
                                onChange={(e) => setForm({ ...form, revelation_type: e.target.value })}
                                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none"
                            >
                                <option value="Meccan">মাক্কী (Meccan)</option>
                                <option value="Medinan">মাদানী (Medinan)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            সংক্ষিপ্ত পরিচিতি / সারসংক্ষেপ
                        </label>
                        <textarea
                            rows="3"
                            placeholder="সূরার পটভূমি ও ফজিলত..."
                            value={form.meta.summary_bn}
                            onChange={(e) => setForm({ ...form, meta: { ...form.meta, summary_bn: e.target.value } })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        ></textarea>
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
                title="সূরা মুছে ফেলার নিশ্চিতকরণ"
                message={`আপনি কি নিশ্চিত যে সূরা "${selectedSurah?.meta?.name_bn || selectedSurah?.name_en || ''}" এবং এর সকল আয়াত মুছে ফেলতে চান?`}
            />
        </div>
    );
}
