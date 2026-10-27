import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertTriangle, Trash2, LogOut, Info, CheckCircle2, BellRing, Sparkles, X } from 'lucide-react';
import { hapticImpact } from '../native';
import { App as CapApp } from '@capacitor/app';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'confirm', // 'confirm' | 'alert'
        title: '',
        message: '',
        arabic: '',
        iconType: 'alert', // 'trash' | 'exit' | 'alert' | 'info' | 'success' | 'bell'
        confirmText: 'নিশ্চিত করুন',
        cancelText: 'বাতিল',
        variant: 'primary', // 'primary' | 'danger' | 'warning'
        resolve: null,
    });

    const closeModal = useCallback((result = false) => {
        hapticImpact();
        if (modalState.resolve) {
            modalState.resolve(result);
        }
        setModalState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    }, [modalState]);

    /**
     * Show a confirmation modal (returns Promise<boolean>)
     */
    const confirm = useCallback(({
        title = 'আপনি কি নিশ্চিত?',
        message = '',
        arabic = '',
        iconType = 'alert',
        confirmText = 'হ্যাঁ, নিশ্চিত',
        cancelText = 'বাতিল',
        variant = 'primary',
    }) => {
        hapticImpact();
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                type: 'confirm',
                title,
                message,
                arabic,
                iconType,
                confirmText,
                cancelText,
                variant,
                resolve,
            });
        });
    }, []);

    /**
     * Show an alert modal (returns Promise<void>)
     */
    const alert = useCallback(({
        title = 'বিজ্ঞপ্তি',
        message = '',
        arabic = '',
        iconType = 'info',
        buttonText = 'ঠিক আছে',
    }) => {
        hapticImpact();
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                type: 'alert',
                title,
                message,
                arabic,
                iconType,
                confirmText: buttonText,
                cancelText: '',
                variant: 'primary',
                resolve,
            });
        });
    }, []);

    /**
     * Ask exit app confirmation modal
     */
    const confirmExit = useCallback(async () => {
        const ok = await confirm({
            title: 'অ্যাপ থেকে প্রস্থান',
            arabic: 'إِلَى اللِّقَاءِ مَعَ السَّلَامَة',
            message: 'আপনি কি নিশ্চিত যে আপনি হাসানা অ্যাপ থেকে প্রস্থান করতে চান?',
            iconType: 'exit',
            confirmText: 'হ্যাঁ, প্রস্থান করুন',
            cancelText: 'অ্যাপে থাকুন',
            variant: 'danger',
        });

        if (ok) {
            try {
                await CapApp.exitApp();
            } catch {
                // If on browser
                window.close();
            }
        }
        return ok;
    }, [confirm]);

    // Global listener for exit request (from native back button or menu)
    useEffect(() => {
        const handleExitRequest = () => {
            confirmExit();
        };

        window.addEventListener('hasana-request-exit', handleExitRequest);
        return () => window.removeEventListener('hasana-request-exit', handleExitRequest);
    }, [confirmExit]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && modalState.isOpen) {
                closeModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalState.isOpen, closeModal]);

    // Icon renderer based on iconType
    const renderIcon = () => {
        switch (modalState.iconType) {
            case 'trash':
                return (
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/25 mx-auto flex items-center justify-center mb-3 shadow-md">
                        <Trash2 className="w-7 h-7" />
                    </div>
                );
            case 'exit':
                return (
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/25 mx-auto flex items-center justify-center mb-3 shadow-md">
                        <LogOut className="w-7 h-7" />
                    </div>
                );
            case 'bell':
                return (
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-gold border border-gold/30 mx-auto flex items-center justify-center mb-3 shadow-md">
                        <BellRing className="w-7 h-7" />
                    </div>
                );
            case 'success':
                return (
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-600 border border-green-500/25 mx-auto flex items-center justify-center mb-3 shadow-md">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                );
            case 'info':
                return (
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/25 mx-auto flex items-center justify-center mb-3 shadow-md">
                        <Info className="w-7 h-7" />
                    </div>
                );
            default:
                return (
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/25 mx-auto flex items-center justify-center mb-3 shadow-md">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                );
        }
    };

    return (
        <ModalContext.Provider value={{ confirm, alert, confirmExit }}>
            {children}

            {modalState.isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
                    onClick={() => closeModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div 
                        className="relative w-full max-w-sm rounded-3xl bg-card border-2 border-gold/40 shadow-2xl p-6 text-center transform transition-all animate-scale-in overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ambient glow accent */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

                        {/* Close 'X' button top right */}
                        <button
                            type="button"
                            onClick={() => closeModal(false)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-muted/80 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition"
                            title="বন্ধ করুন"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Top decorative Icon */}
                        {renderIcon()}

                        {/* Arabic text if provided */}
                        {modalState.arabic && (
                            <p className="font-arabic text-xl md:text-2xl text-gold font-bold mb-1 drop-shadow-xs">
                                {modalState.arabic}
                            </p>
                        )}

                        {/* Modal Title */}
                        <h3 
                            id="modal-title" 
                            className="text-lg md:text-xl font-bold text-foreground mb-2"
                        >
                            {modalState.title}
                        </h3>

                        {/* Modal Message */}
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 px-1 whitespace-pre-line">
                            {modalState.message}
                        </p>

                        {/* Buttons Footer */}
                        {modalState.type === 'confirm' ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => closeModal(false)}
                                    className="px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted-foreground/15 text-foreground font-semibold text-xs md:text-sm transition active:scale-95"
                                >
                                    {modalState.cancelText}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => closeModal(true)}
                                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition shadow-md active:scale-95 ${
                                        modalState.variant === 'danger'
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : modalState.variant === 'warning'
                                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                            : 'bg-primary hover:bg-primary-dark text-gold'
                                    }`}
                                >
                                    {modalState.confirmText}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => closeModal(true)}
                                className="w-full px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-dark text-gold font-bold text-xs md:text-sm transition shadow-md active:scale-95"
                            >
                                {modalState.confirmText}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
