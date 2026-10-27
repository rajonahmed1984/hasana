import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div className={`relative w-full ${maxWidth} bg-white dark:bg-[#13221f] rounded-2xl shadow-2xl border border-[#e2dfd5] dark:border-[#233e38] overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2]/50 dark:bg-[#162724]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#dfab3b]"></span>
                        <h3 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            {title}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 text-[#546e6a] dark:text-[#8aa39f] hover:text-[#14302b] dark:hover:text-[#ffffff] rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[calc(85vh-120px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
