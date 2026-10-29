import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    BookOpen, 
    FileText, 
    FolderGit2, 
    HeartHandshake, 
    Tags, 
    Users, 
    Settings, 
    Menu, 
    X, 
    ExternalLink, 
    Moon, 
    Sun, 
    LogOut, 
    User, 
    ChevronDown, 
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [toasts, setToasts] = useState([]);
    const location = useLocation();

    const config = window.AdminConfig || {};
    const currentUser = config.user || { name: 'অ্যাডমিন', email: 'admin@hasana.app' };
    const [brand, setBrand] = useState(config.brand || {});

    // Settings page fires this after brand images are saved: refresh the sidebar logo and the tab icon
    useEffect(() => {
        const onLogoUpdated = (e) => {
            setBrand(e.detail);
            const favicon = document.getElementById('site-favicon');
            if (favicon && e.detail.favicon) favicon.href = e.detail.favicon;
        };
        window.addEventListener('hasana-logo-updated', onLogoUpdated);
        return () => window.removeEventListener('hasana-logo-updated', onLogoUpdated);
    }, []);

    // Initialize Theme
    useEffect(() => {
        const storedTheme = localStorage.getItem('hasana-admin-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const activeDark = storedTheme === 'dark' || (!storedTheme && systemDark);
        setIsDark(activeDark);
        if (activeDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            localStorage.setItem('hasana-admin-theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            localStorage.setItem('hasana-admin-theme', 'light');
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
        }
    };

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
        setUserDropdownOpen(false);
    }, [location.pathname]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = config.logoutUrl || '/logout';
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = config.csrfToken || '';
        form.appendChild(csrfInput);
        document.body.appendChild(form);
        form.submit();
    };

    const navItems = [
        { name: 'ড্যাশবোর্ড', path: '/', icon: LayoutDashboard },
        { name: 'কুরআন ও সূরা', path: '/surahs', icon: BookOpen },
        { name: 'সহীহ হাদিস', path: '/hadiths', icon: FileText },
        { name: 'হাদিস ক্যাটাগরি', path: '/hadith-categories', icon: FolderGit2 },
        { name: 'মাসনুন দোয়া', path: '/duas', icon: HeartHandshake },
        { name: 'দোয়া ক্যাটাগরি', path: '/dua-categories', icon: Tags },
        { name: 'ব্যবহারকারী', path: '/users', icon: Users },
        { name: 'সেটিংস ও লোগো', path: '/settings', icon: Settings },
    ];

    return (
        <ToastContext.Provider value={{ showToast }}>
            <div className="min-h-screen bg-[#f8f7f2] dark:bg-[#0b1413] text-[#14302b] dark:text-[#e4ebe9] flex font-sans antialiased selection:bg-[#dfab3b]/30">
                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#101c19] border-r border-[#e2dfd5] dark:border-[#1a2f2b] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    {/* Brand header */}
                    <div className="h-20 px-6 flex items-center justify-between border-b border-[#e2dfd5] dark:border-[#1a2f2b]">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#125e54] to-[#0a3a34] p-1.5 flex items-center justify-center shadow-md shadow-[#125e54]/20 group-hover:scale-105 transition-transform">
                                {(isDark ? brand.logo_dark : brand.logo) ? (
                                    <img
                                        key={isDark ? brand.logo_dark : brand.logo}
                                        src={isDark ? brand.logo_dark : brand.logo}
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                <span className={`${(isDark ? brand.logo_dark : brand.logo) ? 'hidden' : ''} font-serif font-bold text-lg text-[#dfab3b]`}>ح</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight tracking-tight text-[#14302b] dark:text-[#e4ebe9]">
                                    {config.siteTitle || 'হাসানা'}
                                </span>
                                <span className="text-xs text-[#546e6a] dark:text-[#8aa39f] font-medium">
                                    ইসলামিক অ্যাডমিন পোর্টাল
                                </span>
                            </div>
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-[#546e6a] hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Bismillah Banner */}
                    <div className="py-2.5 px-4 text-center bg-[#fdfbf6] dark:bg-[#0c1816] border-b border-[#e2dfd5]/60 dark:border-[#1a2f2b]/60">
                        <span className="font-arabic text-sm text-[#dfab3b] font-semibold tracking-wider select-none">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </span>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/'}
                                    className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                                        isActive 
                                            ? 'bg-[#125e54] text-white shadow-md shadow-[#125e54]/20 font-semibold' 
                                            : 'text-[#546e6a] dark:text-[#8aa39f] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#14302b] dark:hover:text-[#ffffff]'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span>{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer Link */}
                    <div className="p-4 border-t border-[#e2dfd5] dark:border-[#1a2f2b]">
                        <a 
                            href={config.appUrl || '/'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#f8f7f2] dark:bg-[#162724] hover:bg-[#eeede6] dark:hover:bg-[#1d3531] border border-[#e2dfd5] dark:border-[#233e38] text-xs font-semibold text-[#14302b] dark:text-[#e4ebe9] transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-[#dfab3b]" />
                                <span>মূল অ্যাপ দেখুন</span>
                            </span>
                            <span className="text-[10px] bg-[#dfab3b]/20 text-[#b5851f] dark:text-[#dfab3b] px-1.5 py-0.5 rounded-sm font-bold">
                                LIVE
                            </span>
                        </a>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
                    {/* Topbar */}
                    <header className="sticky top-0 z-30 h-20 bg-white/85 dark:bg-[#101c19]/85 backdrop-blur-md border-b border-[#e2dfd5] dark:border-[#1a2f2b] px-4 sm:px-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-[#546e6a] hover:bg-black/5 dark:hover:bg-white/5"
                                aria-label="Open Sidebar"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                    হাসানা কন্ট্রোল সেন্টার
                                </h1>
                                <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                    {config.siteTagline || 'পবিত্র কুরআন, হাদিস ও দোয়া'}
                                </p>
                            </div>
                        </div>

                        {/* Top Center Islamic Badge */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5] dark:border-[#233e38]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#dfab3b] animate-pulse"></span>
                            <span className="font-arabic text-sm text-[#125e54] dark:text-[#dfab3b] font-bold">
                                حسنة — الرقابة الإدارية
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] text-[#546e6a] dark:text-[#8aa39f] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#dfab3b] transition-colors"
                                title={isDark ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
                            >
                                {isDark ? <Sun className="w-5 h-5 text-[#dfab3b]" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* View App Button */}
                            <a 
                                href={config.appUrl || '/'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] text-xs font-semibold text-[#546e6a] dark:text-[#8aa39f] hover:text-[#125e54] dark:hover:text-[#ffffff] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4 text-[#dfab3b]" />
                                <span>ভিউ অ্যাপ</span>
                            </a>

                            {/* User Menu Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-[#e2dfd5] dark:hover:border-[#233e38] transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#125e54] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                        {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                                    </div>
                                    <span className="hidden md:inline font-semibold text-xs text-[#14302b] dark:text-[#e4ebe9]">
                                        {currentUser.name}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#546e6a]" />
                                </button>

                                {userDropdownOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-30" 
                                            onClick={() => setUserDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#13221f] rounded-2xl shadow-xl border border-[#e2dfd5] dark:border-[#233e38] py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                                            <div className="px-4 py-2.5 border-b border-[#e2dfd5] dark:border-[#233e38]">
                                                <p className="text-xs font-bold text-[#14302b] dark:text-[#e4ebe9] truncate">
                                                    {currentUser.name}
                                                </p>
                                                <p className="text-[11px] text-[#546e6a] dark:text-[#8aa39f] truncate">
                                                    {currentUser.email}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#546e6a] dark:text-[#8aa39f] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#125e54] dark:hover:text-[#ffffff] transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-[#dfab3b]" />
                                                    <span>প্রোফাইল সেটিংস</span>
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#546e6a] dark:text-[#8aa39f] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#125e54] dark:hover:text-[#ffffff] transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 text-[#dfab3b]" />
                                                    <span>ওয়েবসাইট কনফিগ</span>
                                                </Link>
                                            </div>

                                            <div className="pt-1 border-t border-[#e2dfd5] dark:border-[#233e38]">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>লগআউট করুন</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
                        {children}
                    </main>
                </div>

                {/* Toast Notification Container */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map(toast => (
                        <div 
                            key={toast.id}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
                                toast.type === 'error'
                                    ? 'bg-red-600 text-white border-red-500 shadow-red-500/20'
                                    : 'bg-[#125e54] text-white border-[#187468] shadow-emerald-900/30'
                            }`}
                        >
                            {toast.type === 'error' ? (
                                <AlertCircle className="w-5 h-5 shrink-0" />
                            ) : (
                                <CheckCircle2 className="w-5 h-5 text-[#dfab3b] shrink-0" />
                            )}
                            <span>{toast.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}
