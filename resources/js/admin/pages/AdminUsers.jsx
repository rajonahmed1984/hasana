import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Plus, 
    Edit, 
    Trash2, 
    ShieldCheck, 
    Mail, 
    KeyRound, 
    Calendar,
    Lock
} from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/AdminLayout';

export default function AdminUsers() {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/users');
            setUsers(res.users || []);
            if (res.currentUser) {
                setCurrentUser(res.currentUser);
            }
        } catch (err) {
            showToast(err.message || 'ব্যবহারকারী লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openCreate = () => {
        setForm({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
        setIsCreateOpen(true);
    };

    const openEdit = (user) => {
        setSelectedUser(user);
        setForm({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
        });
        setIsEditOpen(true);
    };

    const handleSaveCreate = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            showToast('পাসওয়ার্ড দুটি মিলছে না', 'error');
            return;
        }
        setSubmitting(true);
        try {
            await apiPost('/admin/users', form);
            showToast('নতুন অ্যাডমিন সফলভাবে তৈরি করা হয়েছে!');
            setIsCreateOpen(false);
            fetchUsers();
        } catch (err) {
            showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        if (form.password && form.password !== form.password_confirmation) {
            showToast('নতুন পাসওয়ার্ড দুটি মিলছে না', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
            };
            if (form.password) {
                payload.password = form.password;
                payload.password_confirmation = form.password_confirmation;
            }
            await apiPut(`/admin/users/${selectedUser.id}`, payload);
            showToast('অ্যাডমিন তথ্য সফলভাবে আপডেট করা হয়েছে!');
            setIsEditOpen(false);
            fetchUsers();
        } catch (err) {
            showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        if (currentUser && selectedUser.id === currentUser.id) {
            showToast('আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না!', 'error');
            setIsDeleteOpen(false);
            return;
        }
        setSubmitting(true);
        try {
            await apiDelete(`/admin/users/${selectedUser.id}`);
            showToast('ব্যবহারকারী মুছে ফেলা হয়েছে!');
            setIsDeleteOpen(false);
            fetchUsers();
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
                        সিস্টেম অ্যাডমিন ও ব্যবহারকারী
                    </h2>
                    <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                        হাসানা কন্ট্রোল সেন্টারে প্রবেশাধিকারপ্রাপ্ত অ্যাডমিনের তালিকা ও নিরাপত্তা
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all shadow-md shadow-[#125e54]/20 active:scale-98"
                >
                    <Plus className="w-4 h-4 text-[#dfab3b]" />
                    <span>নতুন অ্যাডমিন যোগ করুন</span>
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f7f2] dark:bg-[#162724] border-b border-[#e2dfd5] dark:border-[#233e38] text-[#546e6a] dark:text-[#8aa39f] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-3.5 px-6">ব্যবহারকারী</th>
                                <th className="py-3.5 px-6">ইমেইল</th>
                                <th className="py-3.5 px-6">রোল</th>
                                <th className="py-3.5 px-6">তৈরির তারিখ</th>
                                <th className="py-3.5 px-6 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2dfd5]/60 dark:divide-[#233e38]/60 text-[#14302b] dark:text-[#e4ebe9]">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-[#125e54] border-t-transparent rounded-full animate-spin"></div>
                                            <span>ব্যবহারকারী লোড হচ্ছে...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        কোনো ব্যবহারকারী খুঁজে পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isSelf = currentUser && u.id === currentUser.id;
                                    return (
                                        <tr key={u.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-[#125e54]/10 dark:bg-[#125e54]/20 text-[#125e54] dark:text-[#dfab3b] flex items-center justify-center font-bold text-xs uppercase">
                                                        {u.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-[#14302b] dark:text-[#e4ebe9]">
                                                            {u.name}
                                                            {isSelf && (
                                                                <span className="ml-2 text-[10px] font-bold bg-[#dfab3b]/20 text-[#dfab3b] px-2 py-0.5 rounded-full">
                                                                    আপনি
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 font-mono text-[#546e6a] dark:text-[#8aa39f]">
                                                {u.email}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                    <span>Super Admin</span>
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-[#546e6a] dark:text-[#8aa39f]">
                                                {u.created_at ? new Date(u.created_at).toLocaleDateString('bn-BD', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : '—'}
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(u)}
                                                        className="p-1.5 rounded-lg text-[#546e6a] hover:text-[#125e54] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                                        title="সম্পাদনা করুন"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    {!isSelf && (
                                                        <button
                                                            onClick={() => { setSelectedUser(u); setIsDeleteOpen(true); }}
                                                            className="p-1.5 rounded-lg text-[#546e6a] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                            title="মুছে ফেলুন"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isCreateOpen || isEditOpen}
                onClose={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
                title={isCreateOpen ? 'নতুন অ্যাডমিন তৈরি করুন' : 'অ্যাডমিন তথ্য সম্পাদনা'}
                maxWidth="max-w-md"
            >
                <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            পূর্ণ নাম *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="যেমন: মোঃ আব্দুল্লাহ"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            ইমেইল ঠিকানা *
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="admin@hasana.app"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            {isEditOpen ? 'নতুন পাসওয়ার্ড (পরিবর্তন না করতে চাইলে খালি রাখুন)' : 'পাসওয়ার্ড (নূন্যতম ৮ অক্ষর) *'}
                        </label>
                        <input
                            type="password"
                            required={isCreateOpen}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            পাসওয়ার্ড নিশ্চিত করুন {isCreateOpen ? '*' : ''}
                        </label>
                        <input
                            type="password"
                            required={isCreateOpen || !!form.password}
                            placeholder="••••••••"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
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
                title="অ্যাডমিন মুছে ফেলার নিশ্চিতকরণ"
                message={`আপনি কি নিশ্চিত যে "${selectedUser?.name || ''}" (${selectedUser?.email || ''}) এর অ্যাকাউন্ট মুছে ফেলতে চান?`}
            />
        </div>
    );
}
