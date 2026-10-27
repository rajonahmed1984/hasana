import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'নিশ্চিতকরণ', 
    message = 'আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান? এই পরিবর্তনটি পুনরুদ্ধার করা যাবে না।',
    confirmText = 'হ্যাঁ, মুছে ফেলুন',
    cancelText = 'বাতিল করুন',
    isDanger = true,
    loading = false 
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="flex flex-col items-center text-center p-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                    isDanger ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                }`}>
                    {isDanger ? <Trash2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                </div>

                <p className="text-sm text-[#546e6a] dark:text-[#8aa39f] mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] text-sm font-semibold text-[#546e6a] dark:text-[#8aa39f] hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                            isDanger 
                                ? 'bg-red-600 hover:bg-red-700 active:scale-98 shadow-red-500/20' 
                                : 'bg-[#125e54] hover:bg-[#187468] active:scale-98 shadow-emerald-500/20'
                        }`}
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        )}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
