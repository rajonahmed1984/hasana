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

export function App() {
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Capacitor hardware back button and app handlers
        initNativeAppHandlers(navigate);
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
