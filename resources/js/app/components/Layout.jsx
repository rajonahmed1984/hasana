import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    BookOpen, 
    ScrollText, 
    Heart, 
    MapPin, 
    Bookmark, 
    Moon, 
    Sun, 
    Menu, 
    X, 
    Settings, 
    Info, 
    Share2 
} from 'lucide-react';
import { hapticImpact } from '../native';

const navItems = [
    { to: '/', label: 'হোম', icon: Home },
    { to: '/quran', label: 'কুরআন', icon: BookOpen },
    { to: '/hadith', label: 'হাদিস', icon: ScrollText },
    { to: '/duas', label: 'দোয়া', icon: Heart },
    { to: '/umrah-guide', label: 'উমরা', icon: MapPin },
];

export function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
            localStorage.getItem('hasana-theme') === 'dark';
    });

    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);

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
                            <span className="font-arabic text-3xl text-gold font-bold transition-transform group-hover:scale-105">حسنة</span>
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

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-primary text-primary-foreground border-t border-gold/30 grid grid-cols-5 pb-safe shadow-2xl">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={() => hapticImpact()}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-2.5 text-xs transition-all ${
                                isActive
                                    ? 'text-gold font-bold opacity-100 scale-105'
                                    : 'text-primary-foreground/75 opacity-80 hover:opacity-100'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Desktop Footer */}
            <footer className="hidden md:block bg-primary text-primary-foreground/80 text-center py-8 text-sm mt-12 border-t border-gold/20">
                <p className="font-arabic text-2xl text-gold mb-2 font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <p className="text-primary-foreground/75 text-xs">© ২০২৬ হাসানা — ইসলামিক অ্যাপ্লিকেশন • সর্বস্বত্ব সংরক্ষিত</p>
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
                                    <span className="font-arabic text-4xl text-gold font-bold">حسنة</span>
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
                            <p className="text-xs font-semibold text-muted-foreground uppercase px-3 py-2">অন্যান্য</p>
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
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-border bg-muted/30">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>ভার্সন: ২.৪ (নেটিভ স্পা)</span>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-1.5 font-medium text-primary hover:underline"
                                >
                                    {isDark ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4" />}
                                    <span>{isDark ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
