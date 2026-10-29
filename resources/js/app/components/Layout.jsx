import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    BookOpen, 
    ScrollText, 
    Bookmark, 
    Moon, 
    Sun, 
    Menu, 
    X, 
    Settings, 
    Info, 
    Share2,
    ExternalLink,
    LogOut,
    WifiOff
} from 'lucide-react';
import { DuaHandsIcon, KaabaIcon } from './IslamicIcons';
import { hapticImpact, isNative } from '../native';
import { trackPageView } from '../services/analytics';
import { useModal } from '../context/ModalContext';
import { useCloseOnBack } from '../services/backHandler';

const navItems = [
    { to: '/', label: 'হোম', icon: Home },
    { to: '/quran', label: 'কুরআন', icon: BookOpen },
    { to: '/hadith', label: 'হাদিস', icon: ScrollText },
    { to: '/duas', label: 'দোয়া', icon: DuaHandsIcon },
    { to: '/umrah-guide', label: 'উমরা', icon: KaabaIcon },
];

// Logo uploaded from Admin → Settings (separate ones for the app / website and light / dark mode);
// falls back to the Arabic wordmark when none is set or it can't load (e.g. offline)
function BrandLogo({ isDark, size, fallbackClass }) {
    const brand = window.HasanaConfig?.brand || {};
    const logoUrl = isNative()
        ? (isDark ? brand.app_logo_dark : brand.app_logo)
        : (isDark ? brand.logo_dark : brand.logo);
    const [failedUrl, setFailedUrl] = useState(null);

    if (!logoUrl || failedUrl === logoUrl) {
        return <span className={`font-arabic text-gold font-bold ${fallbackClass}`}>حسنة</span>;
    }
    return (
        <img
            src={logoUrl}
            alt="হাসানা"
            className={`${size} w-auto max-w-[120px] object-contain shrink-0 transition-transform group-hover:scale-105`}
            onError={() => setFailedUrl(logoUrl)}
        />
    );
}

export function Layout({ children }) {
    const { confirmExit } = useModal();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useCloseOnBack(sidebarOpen, () => setSidebarOpen(false));
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
            localStorage.getItem('hasana-theme') === 'dark';
    });

    const location = useLocation();
    const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

    useEffect(() => {
        const update = () => setIsOffline(!navigator.onLine);
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        };
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
        window.scrollTo(0, 0);
        trackPageView(location);
    }, [location.pathname, location.search]);

    const toggleTheme = () => {
        hapticImpact();
        const nextTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        if (nextTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('hasana-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('hasana-theme', 'light');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground pb-20 md:pb-0">
            {/* Sticky Top Header */}
            <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md transition-colors">
                <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="মেনু খুলুন"
                            onClick={() => { hapticImpact(); setSidebarOpen(true); }}
                            className="p-2 rounded-xl hover:bg-primary-foreground/10 active:scale-95 transition"
                        >
                            <Menu className="w-5 h-5 text-primary-foreground" />
                        </button>
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 select-none group"
                            onClick={() => hapticImpact()}
                        >
                            <BrandLogo isDark={isDark} size="h-9" fallbackClass="text-3xl transition-transform group-hover:scale-105" />
                            <span className="font-bold text-lg text-primary-foreground tracking-wide">হাসানা</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => hapticImpact()}
                                className={({ isActive }) =>
                                    `px-4 py-1.5 rounded-full transition-all ${
                                        isActive
                                            ? 'bg-gold text-primary font-bold shadow-sm'
                                            : 'text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Header Right Actions */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            aria-label="ডার্ক মোড পরিবর্তন"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-primary-foreground/90 hover:bg-primary-foreground/10 active:scale-95 transition"
                            title={isDark ? 'লাইট মোড' : 'ডার্ক মোড'}
                        >
                            {isDark ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <Link
                            to="/bookmarks"
                            onClick={() => hapticImpact()}
                            aria-label="বুকমার্ক"
                            className="p-2 rounded-xl text-primary-foreground/90 hover:bg-primary-foreground/10 active:scale-95 transition"
                            title="বুকমার্ক"
                        >
                            <Bookmark className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Offline notice */}
            {isOffline && (
                <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-800 dark:text-amber-300 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2" role="status">
                    <WifiOff className="w-3.5 h-3.5 shrink-0" />
                    <span>আপনি অফলাইনে আছেন — ডাউনলোড করা কুরআন, হাদিস ও দোয়া পড়তে পারবেন</span>
                </div>
            )}

            {/* Main Content with native page motion */}
            <main key={location.pathname} className="flex-1 w-full animate-page-enter">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar with Ultra-Clean Native Capsule UI/UX */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-primary/95 backdrop-blur-xl text-primary-foreground border-t border-gold/25 grid grid-cols-5 px-1 py-1 pb-safe shadow-[0_-8px_25px_rgba(0,0,0,0.3)]">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={() => hapticImpact()}
                        className={({ isActive }) =>
                            `relative flex flex-col items-center justify-center select-none native-press py-1 transition-all duration-300 ${
                                isActive
                                    ? 'text-gold'
                                    : 'text-primary-foreground/65 hover:text-primary-foreground/90'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <div className="flex flex-col items-center gap-0.5 w-full">
                                {/* Elevated Frosted Pill Capsule for Active Tab */}
                                <div className={`relative px-3.5 py-1 rounded-full transition-all duration-300 flex items-center justify-center ${
                                    isActive
                                        ? 'bg-gradient-to-b from-gold/25 to-gold/10 border border-gold/40 shadow-[0_2px_12px_rgba(223,171,59,0.35)] -translate-y-0.5 scale-105'
                                        : 'bg-transparent border border-transparent'
                                }`}>
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                                        isActive 
                                            ? 'text-gold scale-110 drop-shadow-[0_1px_4px_rgba(223,171,59,0.4)]' 
                                            : 'text-primary-foreground/65'
                                    }`} />
                                </div>

                                {/* Label */}
                                <span className={`text-[11px] tracking-tight transition-all duration-200 ${
                                    isActive
                                        ? 'font-bold text-gold drop-shadow-xs'
                                        : 'font-medium text-primary-foreground/70'
                                }`}>
                                    {label}
                                </span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Desktop Footer */}
            <footer className="hidden md:block bg-primary text-primary-foreground/80 text-center py-8 text-sm mt-12 border-t border-gold/20">
                <p className="font-arabic text-2xl text-gold mb-2 font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                
                {/* Official Facebook Community Link */}
                <div className="flex items-center justify-center gap-3 my-3">
                    <a
                        href="https://www.facebook.com/page.hasana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-gold hover:text-white text-xs font-semibold transition-all border border-gold/30 shadow-xs group"
                    >
                        <svg className="w-4 h-4 fill-current text-[#1877F2] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>অফিসিয়াল ফেসবুক পেজে যুক্ত থাকুন (page.hasana)</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                </div>

                <p className="text-primary-foreground/75 text-xs">© 2026 হাসানা — ইসলামিক অ্যাপ্লিকেশন • সর্বস্বত্ব সংরক্ষিত</p>
            </footer>

            {/* Offcanvas Drawer Menu */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative w-80 max-w-[85vw] bg-card text-card-foreground shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
                        {/* Drawer Header */}
                        <div className="bg-hero p-5 text-primary-foreground relative overflow-hidden">
                            <div className="absolute inset-0 pattern opacity-30" />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BrandLogo isDark={isDark} size="h-12" fallbackClass="text-4xl" />
                                    <div>
                                        <h2 className="font-bold text-lg leading-tight">হাসানা</h2>
                                        <p className="text-xs text-primary-foreground/80">ইসলামিক গাইড ও কুরআন</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-1.5 rounded-lg bg-black/20 text-white hover:bg-black/40"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Drawer Links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">মূল পেজ সমূহ</p>
                            {navItems.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted font-medium text-sm transition"
                                >
                                    <Icon className="w-5 h-5 text-primary" />
                                    <span>{label}</span>
                                </Link>
                            ))}

                            <div className="my-3 border-t border-border" />
                            <p className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">অন্যান্য ও সোশ্যাল</p>
                            <Link
                                to="/bookmarks"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted font-medium text-sm transition"
                            >
                                <Bookmark className="w-5 h-5 text-primary" />
                                <span>বুকমার্কস</span>
                            </Link>
                            <Link
                                to="/settings"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted font-medium text-sm transition"
                            >
                                <Settings className="w-5 h-5 text-primary" />
                                <span>সেটিংস</span>
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted font-medium text-sm transition"
                            >
                                <Info className="w-5 h-5 text-primary" />
                                <span>অ্যাপ পরিচিতি</span>
                            </Link>

                            {/* Official Facebook Page Link */}
                            <a
                                href="https://www.facebook.com/page.hasana"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-muted font-medium text-sm transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </div>
                                    <span className="text-[#1877F2] font-semibold">ফেসবুক পেজ</span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#1877F2]" />
                            </a>

                            {/* Exit App Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSidebarOpen(false);
                                    confirmExit();
                                }}
                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 font-medium text-sm transition"
                            >
                                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span>অ্যাপ থেকে প্রস্থান</span>
                            </button>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-border bg-muted/30 space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>ভার্সন: 2.4 (নেটিভ স্পা)</span>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-1.5 font-medium text-primary hover:underline"
                                >
                                    {isDark ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4" />}
                                    <span>{isDark ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
                                </button>
                            </div>
                            <div className="pt-2 border-t border-border/50 text-center">
                                <a
                                    href="https://apptimatic.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-muted-foreground hover:text-primary transition font-medium inline-flex items-center gap-1"
                                >
                                    <span>Developed by</span>
                                    <strong className="text-primary font-bold">Apptimatic</strong>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
