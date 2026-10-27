import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { QuranPage } from './pages/QuranPage';
import { SurahPage } from './pages/SurahPage';
import { HadithPage } from './pages/HadithPage';
import { DuasPage } from './pages/DuasPage';
import { UmrahGuidePage } from './pages/UmrahGuidePage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { initNativeAppHandlers } from './native';
import { initPrayerScheduler } from './services/prayerNotifications';
import { setupForegroundNotifications } from './services/firebase';
import { useModal } from './context/ModalContext';

export function App() {
    const navigate = useNavigate();
    const { confirm: customConfirm } = useModal();

    useEffect(() => {
        // Initialize Capacitor hardware back button and app handlers
        initNativeAppHandlers(navigate);

        // Initialize prayer time notification schedule
        initPrayerScheduler();

        // Listen for foreground Firebase push notifications
        const unsubscribe = setupForegroundNotifications((payload) => {
            const title = payload.notification?.title || payload.data?.title || 'নামাজের সময় হয়েছে 🕌';
            const body = payload.notification?.body || payload.data?.body || 'আসুন নামাজের প্রস্তুতি গ্রহণ করি।';
            const url = payload.data?.url || payload.data?.deep_link;

            customConfirm({
                title,
                message: body,
                arabic: 'حَسَنَة',
                iconType: 'bell',
                confirmText: url ? 'এখনই দেখুন' : 'ঠিক আছে',
                cancelText: 'বন্ধ করুন',
                variant: 'primary',
            }).then((ok) => {
                if (ok && url) {
                    navigate(url);
                }
            });
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/surah/:slug" element={<SurahPage />} />
            <Route path="/hadith" element={<HadithPage />} />
            <Route path="/duas" element={<DuasPage />} />
            <Route path="/umrah" element={<UmrahGuidePage />} />
            <Route path="/umrah-guide" element={<UmrahGuidePage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
