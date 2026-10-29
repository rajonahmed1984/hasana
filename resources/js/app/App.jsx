import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { QuranPage } from './pages/QuranPage';
import { SurahPage } from './pages/SurahPage';
import { HadithPage } from './pages/HadithPage';
import { DuasPage } from './pages/DuasPage';
import { UmrahGuidePage } from './pages/UmrahGuidePage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { ExplorePage } from './pages/ExplorePage';
import { initNativeAppHandlers } from './native';
import { initPrayerScheduler, showPrayerNotification } from './services/prayerNotifications';
import { setupForegroundNotifications } from './services/firebase';
import { useModal } from './context/ModalContext';
import { useWebBackGuard } from './services/backHandler';
import { initAppUpdateChecks } from './services/appUpdate';

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const modal = useModal();
    const { confirm: customConfirm, confirmExit } = modal;

    // Mobile browsers: back on Home asks before leaving (the Android app does this natively)
    useWebBackGuard(location.pathname, confirmExit);

    // Android app: "new version available" prompt on launch and on resume
    useEffect(() => {
        initAppUpdateChecks(modal);
    }, []);

    useEffect(() => {
        // Initialize Capacitor hardware back button and app handlers
        initNativeAppHandlers(navigate);

        // Initialize prayer time & daily ayah notifications (native local notifications / web push)
        initPrayerScheduler(navigate);

        // Foreground Firebase push (web): prayer/ayah pushes become a normal notification with the
        // same tag as the in-page checker, so they never show twice; announcements open a dialog
        const unsubscribePromise = setupForegroundNotifications((payload) => {
            const title = payload.notification?.title || payload.data?.title || 'নামাজের সময় হয়েছে 🕌';
            const body = payload.notification?.body || payload.data?.body || 'আসুন নামাজের প্রস্তুতি গ্রহণ করি।';
            const url = payload.data?.url || payload.data?.deep_link;

            if (payload.data?.type === 'prayer' || payload.data?.type === 'daily_ayah') {
                showPrayerNotification(title, body, payload.data.tag, url || '/');
                return;
            }

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
                    if (/^https?:\/\//.test(url)) {
                        window.location.href = url;
                    } else {
                        navigate(url);
                    }
                }
            });
        });

        return () => {
            Promise.resolve(unsubscribePromise).then((unsubscribe) => {
                if (typeof unsubscribe === 'function') unsubscribe();
            });
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
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
