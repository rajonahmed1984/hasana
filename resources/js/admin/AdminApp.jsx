import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminSurahs from './pages/AdminSurahs';
import AdminAyahs from './pages/AdminAyahs';
import AdminHadiths from './pages/AdminHadiths';
import AdminHadithCategories from './pages/AdminHadithCategories';
import AdminDuas from './pages/AdminDuas';
import AdminDuaCategories from './pages/AdminDuaCategories';
import AdminSettings from './pages/AdminSettings';
import AdminUsers from './pages/AdminUsers';
import AdminProfile from './pages/AdminProfile';

export default function AdminApp() {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/surahs" element={<AdminSurahs />} />
                <Route path="/surahs/:surahId/ayahs" element={<AdminAyahs />} />
                <Route path="/hadiths" element={<AdminHadiths />} />
                <Route path="/hadith-categories" element={<AdminHadithCategories />} />
                <Route path="/duas" element={<AdminDuas />} />
                <Route path="/dua-categories" element={<AdminDuaCategories />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="/profile" element={<AdminProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AdminLayout>
    );
}
