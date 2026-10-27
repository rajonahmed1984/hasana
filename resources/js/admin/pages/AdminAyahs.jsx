import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    BookOpen, 
    CheckCircle2, 
    XCircle 
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/AdminLayout';

export default function AdminAyahs() {
    const { surahId } = useParams();
    const { showToast } = useToast();

    const [ayahs, setAyahs] = useState([]);
    const [surah, setSurah] = useState(null);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAyah, setSelectedAyah] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        number: '',
        text_ar: '',
        text_bn: '',
        transliteration: '',
        is_active: true,
    });

    const fetchAyahs = async () => {
        setLoading(true);
        try {
            const res = await apiGet(`/admin/surahs/${surahId}/ayahs`, {
                search,
                page,
            });
            setAyahs(res.data || []);
            setMeta(res.meta || {});
            if (res.meta?.surah) {
                setSurah(res.meta.surah);
            }
        } catch (err) {
            showToast(err.message || 'আয়াত লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAyahs();
    }, [surahId, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchAyahs();
    };

    const openCreate = () => {
        setForm({
            number: (meta.total || 0) + 1,
            text_ar: '',
            text_bn: '',
            transliteration: '',
            is_active: true,
        });
        setIsCreateOpen(true);
    };

    const openEdit = (ayah) => {
        setSelectedAyah(ayah);
        setForm({
            number: ayah.number,
            text_ar: ayah.text_ar || '',
            text_bn: ayah.text_bn || '',
            transliteration: ayah.transliteration || '',
            is_active: ayah.is_active ?? true,
        });
        setIsEditOpen(true);
    };

    const handleSaveCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiPost(`/admin/surahs/${surahId}/ayahs`, form);
            showToast('আয়াত সফলভাবে যোগ করা হয়েছে!');
            setIsCreateOpen(false);
            fetchAyahs();
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedAyah) return;
        setSubmitting(true);
        try {
            await apiPut(`/admin/surahs/${surahId}/ayahs/${selectedAyah.id}`, form);
            showToast('আয়াত সফলভাবে আপডেট করা হয়েছে!');
            setIsEditOpen(false);
            fetchAyahs();
        } catch (err) {
            showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedAyah) return;
        setSubmitting(true);
        try {
            await apiDelete(`/admin/surahs/${surahId}/ayahs/${selectedAyah.id}`);
            showToast('আয়াত সফলভাবে মুছে ফেলা হয়েছে!');
            setIsDeleteOpen(false);
            fetchAyahs();
        } catch (err) {
            showToast(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Back link & Header */}
            <div>
                <Link
                    to="/surahs"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#125e54] dark:text-[#dfab3b] hover:underline mb-3"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>সকল সূরার তালিকায় ফিরে যান</span>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#125e54]/10 dark:bg-[#125e54]/20 border border-[#125e54]/20 flex items-center justify-center font-arabic text-2xl text-[#125e54] dark:text-[#dfab3b]">
                            {surah?.number || '—'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                                    {surah?.name_bn || surah?.name_en || 'সূরা'}
                                </h2>
                                <span className="font-arabic text-xl text-[#dfab3b]">
                                    {surah?.name_ar}
                                </span>
                            </div>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                অর্থ: {surah?.meaning_bn || '—'} | অবতীর্ণ: {surah?.revelation_type === 'Meccan' ? 'মাক্কী' : 'মাদানী'} | মোট আয়াত: {meta.total || 0} টি
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreate}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all shadow-md shadow-[#125e54]/20 active:scale-98"
                    >
                        <Plus className="w-4 h-4 text-[#dfab3b]" />
                        <span>নতুন আয়াত যোগ করুন</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs flex items-center justify-between">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="আয়াত নম্বর বা বাংলা/আরবি অর্থ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                    />
                    <Search className="w-4 h-4 text-[#546e6a] absolute left-3 top-3" />
                </form>
            </div>

            {/* Ayahs List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white dark:bg-[#13221f] rounded-2xl p-12 border border-[#e2dfd5] dark:border-[#233e38] text-center text-[#546e6a] dark:text-[#8aa39f]">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-[#125e54] border-t-transparent rounded-full animate-spin"></div>
                            <span>আয়াত লোড হচ্ছে...</span>
                        </div>
                    </div>
                ) : ayahs.length === 0 ? (
                    <div className="bg-white dark:bg-[#13221f] rounded-2xl p-12 border border-[#e2dfd5] dark:border-[#233e38] text-center text-[#546e6a] dark:text-[#8aa39f]">
                        কোনো আয়াত খুঁজে পাওয়া যায়নি
                    </div>
                ) : (
                    ayahs.map((ayah) => (
                        <div 
                            key={ayah.id} 
                            className="bg-white dark:bg-[#13221f] rounded-2xl p-5 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs space-y-3 hover:border-[#125e54]/50 transition-all"
                        >
                            <div className="flex items-center justify-between border-b border-[#e2dfd5]/60 dark:border-[#233e38]/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5] dark:border-[#233e38] flex items-center justify-center font-bold text-xs text-[#125e54] dark:text-[#dfab3b]">
                                        {ayah.number}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                        ayah.is_active 
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                            : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                                    }`}>
                                        {ayah.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {ayah.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEdit(ayah)}
                                        className="p-1.5 rounded-lg text-[#546e6a] hover:text-[#125e54] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        title="সম্পাদনা করুন"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedAyah(ayah); setIsDeleteOpen(true); }}
                                        className="p-1.5 rounded-lg text-[#546e6a] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                        title="মুছে ফেলুন"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Arabic Text */}
                            <p className="font-arabic text-xl sm:text-2xl text-right leading-loose text-[#14302b] dark:text-[#dfab3b] pt-1">
                                {ayah.text_ar}
                            </p>

                            {/* Bengali Translation */}
                            <p className="text-sm font-medium text-[#14302b] dark:text-[#e4ebe9] leading-relaxed">
                                {ayah.text_bn}
                            </p>

                            {/* Transliteration if exists */}
                            {ayah.transliteration && (
                                <p className="text-xs text-[#546e6a] dark:text-[#8aa39f] italic">
                                    উচ্চারণ: {ayah.transliteration}
                                </p>
                            )}
                        </div>
                    ))
                )}

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="p-4 bg-white dark:bg-[#13221f] rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f]">
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
                title={isCreateOpen ? 'নতুন আয়াত যোগ করুন' : 'আয়াত সম্পাদনা করুন'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="w-1/3">
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                আয়াত নম্বর *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={form.number}
                                onChange={(e) => setForm({ ...form, number: e.target.value })}
                                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                            <input
                                type="checkbox"
                                id="ayah_active"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="w-4 h-4 rounded-sm text-[#125e54] focus:ring-[#125e54]"
                            />
                            <label htmlFor="ayah_active" className="text-xs font-semibold cursor-pointer">
                                এই আয়াতটি প্রদর্শন করুন (Active)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            আরবি আয়াত পাঠ *
                        </label>
                        <textarea
                            rows="3"
                            required
                            placeholder="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
                            value={form.text_ar}
                            onChange={(e) => setForm({ ...form, text_ar: e.target.value })}
                            className="w-full text-base font-arabic text-right px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54] leading-loose"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            বাংলা অনুবাদ *
                        </label>
                        <textarea
                            rows="3"
                            required
                            placeholder="পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।"
                            value={form.text_bn}
                            onChange={(e) => setForm({ ...form, text_bn: e.target.value })}
                            className="w-full text-xs px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54] leading-relaxed"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            বাংলা উচ্চারণ / Transliteration
                        </label>
                        <input
                            type="text"
                            placeholder="বিসমিল্লাহির রাহমানির রাহিম"
                            value={form.transliteration}
                            onChange={(e) => setForm({ ...form, transliteration: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        />
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
                title="আয়াত মুছে ফেলার নিশ্চিতকরণ"
                message={`আপনি কি নিশ্চিত যে আয়াত নং ${selectedAyah?.number} মুছে ফেলতে চান?`}
            />
        </div>
    );
}
