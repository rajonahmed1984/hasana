import React, { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    KeyRound, 
    Save, 
    ShieldCheck, 
    CheckCircle2, 
    Lock,
    Calendar
} from 'lucide-react';
import { apiGet, apiPut } from '../api';
import { useToast } from '../components/AdminLayout';

export default function AdminProfile() {
    const { showToast } = useToast();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingPassword, setSubmittingPassword] = useState(false);

    // Profile form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin/profile');
            const u = res.user || {};
            setUser(u);
            setName(u.name || '');
            setEmail(u.email || '');
        } catch (err) {
            showToast(err.message || 'প্রোফাইল লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSubmittingProfile(true);
        try {
            const res = await apiPut('/admin/profile', { name, email });
            showToast(res.message || 'প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!');
            if (window.AdminConfig && window.AdminConfig.user) {
                window.AdminConfig.user.name = name;
                window.AdminConfig.user.email = email;
            }
        } catch (err) {
            showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmittingProfile(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== newPasswordConfirmation) {
            showToast('নতুন পাসওয়ার্ড দুটি মিলছে না', 'error');
            return;
        }
        setSubmittingPassword(true);
        try {
            const res = await apiPut('/admin/profile/password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: newPasswordConfirmation,
            });
            showToast(res.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
            setCurrentPassword('');
            setNewPassword('');
            setNewPasswordConfirmation('');
        } catch (err) {
            showToast(err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', 'error');
        } finally {
            setSubmittingPassword(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                    প্রোফাইল ও নিরাপত্তা সেটিংস
                </h2>
                <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                    আপনার ব্যক্তিগত অ্যাডমিন অ্যাকাউন্টের বিবরণ ও পাসওয়ার্ড পরিচালনা করুন
                </p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#125e54] to-[#0a3a34] text-white flex items-center justify-center font-bold text-3xl uppercase shadow-md shadow-[#125e54]/25 shrink-0">
                    {name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            {name || 'অ্যাডমিন'}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dfab3b]/15 text-[#dfab3b] w-fit mx-auto sm:mx-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>সিস্টেম অ্যাডমিনিস্ট্রেটর</span>
                        </span>
                    </div>
                    <p className="text-xs text-[#546e6a] dark:text-[#8aa39f] font-mono">
                        {email}
                    </p>
                    <p className="text-[11px] text-[#546e6a] mt-2 flex items-center justify-center sm:justify-start gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>অ্যাকাউন্ট তৈরি: {user?.created_at ? new Date(user.created_at).toLocaleDateString('bn-BD-u-nu-latn', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : '—'}</span>
                    </p>
                </div>
            </div>

            {/* 1. Edit Profile Form */}
            <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2dfd5] dark:border-[#233e38]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#125e54] dark:text-emerald-400 flex items-center justify-center">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            ব্যক্তিগত বিবরণ পরিবর্তন
                        </h3>
                        <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                            আপনার নাম এবং লগইন ইমেইল ঠিকানা আপডেট করুন
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                পূর্ণ নাম *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                ইমেইল ঠিকানা *
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-xs font-mono font-semibold px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submittingProfile}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all disabled:opacity-50 shadow-md shadow-[#125e54]/20"
                        >
                            {submittingProfile && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            <span>প্রোফাইল আপডেট করুন</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. Change Password Form */}
            <div className="bg-white dark:bg-[#13221f] rounded-3xl p-6 sm:p-8 border border-[#e2dfd5] dark:border-[#233e38] shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e2dfd5] dark:border-[#233e38]">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            পাসওয়ার্ড পরিবর্তন
                        </h3>
                        <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                            অ্যাকাউন্টের সুরক্ষায় নিয়মিত শক্তিশালী নতুন পাসওয়ার্ড ব্যবহার করুন
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                            বর্তমান পাসওয়ার্ড *
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full text-xs px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                নতুন পাসওয়ার্ড (নূন্যতম 8 অক্ষর) *
                            </label>
                            <input
                                type="password"
                                required
                                minLength="8"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full text-xs px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#546e6a] dark:text-[#8aa39f] mb-1">
                                নতুন পাসওয়ার্ড নিশ্চিত করুন *
                            </label>
                            <input
                                type="password"
                                required
                                minLength="8"
                                placeholder="••••••••"
                                value={newPasswordConfirmation}
                                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                className="w-full text-xs px-4 py-3 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submittingPassword}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#125e54] text-white text-xs font-bold hover:bg-[#187468] transition-all disabled:opacity-50 shadow-md shadow-[#125e54]/20"
                        >
                            {submittingPassword && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
