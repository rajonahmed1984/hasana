import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Eye, 
    Clock, 
    TrendingUp, 
    BookOpen, 
    FileText, 
    HeartHandshake, 
    Smartphone, 
    Monitor, 
    Tablet, 
    Search, 
    Filter, 
    RefreshCw, 
    Calendar,
    ChevronLeft,
    ChevronRight,
    Compass
} from 'lucide-react';
import { apiGet } from '../api';
import { useToast } from '../components/AdminLayout';

export default function AdminDashboard() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    // Filters for visitor history table
    const [range, setRange] = useState('all');
    const [type, setType] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await apiGet('/admin', {
                range,
                type,
                q: search,
                page,
            });
            setData(res);
        } catch (err) {
            showToast(err.message || 'ড্যাশবোর্ড তথ্য লোড করতে ব্যর্থ হয়েছে', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [range, type, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchStats();
    };

    const formatSeconds = (sec) => {
        if (!sec) return '0 সেকেন্ড';
        if (sec < 60) return `${sec} সেকেন্ড`;
        const min = Math.floor(sec / 60);
        const rem = sec % 60;
        if (rem === 0) return `${min} মিনিট`;
        return `${min} মি. ${rem} সে.`;
    };

    const metrics = data?.metrics || {};
    const chartData = data?.chartData || [];
    const topSurahs = data?.topSurahs || [];
    const topHadiths = data?.topHadiths || [];
    const topDuas = data?.topDuas || [];
    const sections = data?.sections || {};
    const deviceShare = data?.deviceShare || { mobile: 0, desktop: 0, tablet: 0 };
    const logs = data?.logs || { data: [], current_page: 1, last_page: 1, total: 0 };

    // Max views for chart normalization
    const maxChartViews = Math.max(...chartData.map(d => d.views || 0), 10);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header / Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        ভিজিটর ও অ্যানালিটিক্স ড্যাশবোর্ড
                    </h2>
                    <p className="text-sm text-[#546e6a] dark:text-[#8aa39f]">
                        হাসানা ইসলামিক অ্যাপের রিয়েল-টাইম ভিজিটর হিস্ট্রি, কনটেন্ট ব্যবহার ও পরিসংখ্যান
                    </p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#13221f] border border-[#e2dfd5] dark:border-[#233e38] text-xs font-semibold text-[#14302b] dark:text-[#e4ebe9] hover:bg-[#eeede6] dark:hover:bg-[#1a2f2b] transition-all shadow-xs"
                >
                    <RefreshCw className={`w-4 h-4 text-[#dfab3b] ${loading ? 'animate-spin' : ''}`} />
                    <span>রিফ্রেশ ডেটা</span>
                </button>
            </div>

            {/* 4 Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Today */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-5 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs relative overflow-hidden group hover:border-[#125e54] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#546e6a] dark:text-[#8aa39f]">
                            আজকের ভিজিটর
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        {metrics.todayVisitors ?? 0} <span className="text-xs font-normal text-[#546e6a]">জন</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f] pt-2 border-t border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            {metrics.todayViews ?? 0} ভিউ
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#dfab3b]" />
                            গড়: {formatSeconds(metrics.todayAvgSec)}
                        </span>
                    </div>
                </div>

                {/* Week */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-5 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs relative overflow-hidden group hover:border-blue-500 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#546e6a] dark:text-[#8aa39f]">
                            এই সপ্তাহের ভিজিটর
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        {metrics.weekVisitors ?? 0} <span className="text-xs font-normal text-[#546e6a]">জন</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f] pt-2 border-t border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            {metrics.weekViews ?? 0} ভিউ
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#dfab3b]" />
                            গড়: {formatSeconds(metrics.weekAvgSec)}
                        </span>
                    </div>
                </div>

                {/* Month */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-5 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs relative overflow-hidden group hover:border-amber-500 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#546e6a] dark:text-[#8aa39f]">
                            এই মাসের ভিজিটর
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        {metrics.monthVisitors ?? 0} <span className="text-xs font-normal text-[#546e6a]">জন</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f] pt-2 border-t border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-amber-600" />
                            {metrics.monthViews ?? 0} ভিউ
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#dfab3b]" />
                            গড়: {formatSeconds(metrics.monthAvgSec)}
                        </span>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-5 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs relative overflow-hidden group hover:border-[#dfab3b] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#dfab3b]/5 rounded-full blur-2xl group-hover:bg-[#dfab3b]/10 transition-all"></div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#546e6a] dark:text-[#8aa39f]">
                            সর্বমোট ভিজিটর
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-[#dfab3b]/10 text-[#dfab3b] flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-[#14302b] dark:text-[#e4ebe9]">
                        {metrics.totalVisitors ?? 0} <span className="text-xs font-normal text-[#546e6a]">জন</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f] pt-2 border-t border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#dfab3b]" />
                            {metrics.totalViews ?? 0} মোট ভিউ
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#125e54] dark:text-[#dfab3b]">
                            {metrics.totalHours ?? 0} ঘণ্টা ব্যয়
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Summary Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            {metrics.totalSurahs ?? 114} টি
                        </div>
                        <div className="text-xs text-[#546e6a] dark:text-[#8aa39f]">মোট কুরআন সূরা</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            {metrics.totalHadiths ?? 0} টি
                        </div>
                        <div className="text-xs text-[#546e6a] dark:text-[#8aa39f]">সংগৃহীত সহীহ হাদিস</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-4 border border-[#e2dfd5] dark:border-[#233e38] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                        <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            {metrics.totalDuas ?? 0} টি
                        </div>
                        <div className="text-xs text-[#546e6a] dark:text-[#8aa39f]">মাসনুন ও কুরআনী দোয়া</div>
                    </div>
                </div>
            </div>

            {/* Visual Charts & Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 14 Days Visual Trend Chart (2 columns) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#13221f] rounded-2xl p-6 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-[#14302b] dark:text-[#e4ebe9]">
                                বিগত 14 দিনের ভিজিটর ও ভিউ ট্রেন্ড
                            </h3>
                            <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                                প্রতিদিনের অনন্য ভিজিটর এবং পেজ ভিউ পরিসংখ্যান
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-[#125e54]"></span>
                                ভিউ
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-[#dfab3b]"></span>
                                ভিজিটর
                            </span>
                        </div>
                    </div>

                    {/* Chart Bars */}
                    <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 border-b border-[#e2dfd5] dark:border-[#233e38]">
                        {chartData.map((item, idx) => {
                            const viewHeight = Math.max(4, Math.round(((item.views || 0) / maxChartViews) * 100));
                            const visitorHeight = Math.max(4, Math.round(((item.visitors || 0) / maxChartViews) * 100));
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 bg-black/80 text-white text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        <div>{item.label} ({item.day_name})</div>
                                        <div>ভিউ: {item.views} | ভিজিটর: {item.visitors}</div>
                                    </div>
                                    {/* Bars Pair */}
                                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-44">
                                        <div 
                                            style={{ height: `${viewHeight}%` }}
                                            className="w-full max-w-[12px] bg-[#125e54] rounded-t-sm transition-all group-hover:bg-[#187468]"
                                        />
                                        <div 
                                            style={{ height: `${visitorHeight}%` }}
                                            className="w-full max-w-[12px] bg-[#dfab3b] rounded-t-sm transition-all group-hover:bg-[#eec055]"
                                        />
                                    </div>
                                    {/* Day Label */}
                                    <span className="text-[10px] text-[#546e6a] dark:text-[#8aa39f] truncate w-full text-center">
                                        {item.day_name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section & Device Distribution (1 column) */}
                <div className="space-y-6">
                    {/* Sections Breakdown */}
                    <div className="bg-white dark:bg-[#13221f] rounded-2xl p-6 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs">
                        <h3 className="text-base font-bold text-[#14302b] dark:text-[#e4ebe9] mb-4">
                            জনপ্রিয় বিভাগসমূহ
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(sections).map(([key, sec]) => (
                                <div key={key} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-[#14302b] dark:text-[#e4ebe9]">
                                            {sec.label}
                                        </span>
                                        <span className="text-[#546e6a] dark:text-[#8aa39f]">
                                            {sec.count} বার ({sec.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#f8f7f2] dark:bg-[#162724] overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${sec.percentage}%`,
                                                backgroundColor: sec.color || '#125e54'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Device Share */}
                    <div className="bg-white dark:bg-[#13221f] rounded-2xl p-6 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs">
                        <h3 className="text-base font-bold text-[#14302b] dark:text-[#e4ebe9] mb-4">
                            ডিভাইস ব্যবহারকারী
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-3 rounded-xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                                <Smartphone className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                                <div className="text-sm font-bold">{deviceShare.mobile}%</div>
                                <div className="text-[10px] text-[#546e6a]">মোবাইল</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                                <Monitor className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                                <div className="text-sm font-bold">{deviceShare.desktop}%</div>
                                <div className="text-[10px] text-[#546e6a]">ডেস্কটপ</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#f8f7f2] dark:bg-[#162724] border border-[#e2dfd5]/60 dark:border-[#233e38]/60">
                                <Tablet className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                                <div className="text-sm font-bold">{deviceShare.tablet}%</div>
                                <div className="text-[10px] text-[#546e6a]">ট্যাবলেট</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Visited Content: Surahs, Hadiths, Duas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Surahs */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-6 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            শীর্ষ পঠিত সূরা
                        </h3>
                    </div>
                    {topSurahs.length === 0 ? (
                        <div className="text-xs text-[#546e6a] text-center py-6">কোনো রেকর্ড নেই</div>
                    ) : (
                        <div className="space-y-3">
                            {topSurahs.map((surah, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-[#e2dfd5]/40 dark:border-[#233e38]/40 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="w-5 h-5 rounded-full bg-[#f8f7f2] dark:bg-[#162724] font-bold flex items-center justify-center text-[10px] text-[#dfab3b]">
                                            {idx + 1}
                                        </span>
                                        <span className="font-semibold text-[#14302b] dark:text-[#e4ebe9] truncate">
                                            {surah.item_name}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                            {surah.views} ভিউ
                                        </span>
                                        <span className="text-[10px] text-[#546e6a] block">
                                            গড়: {surah.avg_formatted}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Hadiths */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-6 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            শীর্ষ পঠিত হাদিস
                        </h3>
                    </div>
                    {topHadiths.length === 0 ? (
                        <div className="text-xs text-[#546e6a] text-center py-6">কোনো রেকর্ড নেই</div>
                    ) : (
                        <div className="space-y-3">
                            {topHadiths.map((hadith, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-[#e2dfd5]/40 dark:border-[#233e38]/40 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="w-5 h-5 rounded-full bg-[#f8f7f2] dark:bg-[#162724] font-bold flex items-center justify-center text-[10px] text-blue-600">
                                            {idx + 1}
                                        </span>
                                        <span className="font-semibold text-[#14302b] dark:text-[#e4ebe9] truncate">
                                            {hadith.item_name}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">
                                            {hadith.views} ভিউ
                                        </span>
                                        <span className="text-[10px] text-[#546e6a] block">
                                            গড়: {hadith.avg_formatted}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Duas */}
                <div className="bg-white dark:bg-[#13221f] rounded-2xl p-6 border border-[#e2dfd5] dark:border-[#233e38] shadow-xs">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                            <HeartHandshake className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            শীর্ষ পঠিত দোয়া
                        </h3>
                    </div>
                    {topDuas.length === 0 ? (
                        <div className="text-xs text-[#546e6a] text-center py-6">কোনো রেকর্ড নেই</div>
                    ) : (
                        <div className="space-y-3">
                            {topDuas.map((dua, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-[#e2dfd5]/40 dark:border-[#233e38]/40 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="w-5 h-5 rounded-full bg-[#f8f7f2] dark:bg-[#162724] font-bold flex items-center justify-center text-[10px] text-amber-600">
                                            {idx + 1}
                                        </span>
                                        <span className="font-semibold text-[#14302b] dark:text-[#e4ebe9] truncate">
                                            {dua.item_name}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="font-bold text-amber-600 dark:text-amber-400">
                                            {dua.views} ভিউ
                                        </span>
                                        <span className="text-[10px] text-[#546e6a] block">
                                            গড়: {dua.avg_formatted}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Visitor History Table */}
            <div className="bg-white dark:bg-[#13221f] rounded-2xl border border-[#e2dfd5] dark:border-[#233e38] shadow-xs overflow-hidden">
                {/* Table Header / Filters */}
                <div className="p-6 border-b border-[#e2dfd5] dark:border-[#233e38] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-[#14302b] dark:text-[#e4ebe9]">
                            বিস্তারিত ভিজিটর হিস্ট্রি ও অ্যাক্টিভিটি লগ
                        </h3>
                        <p className="text-xs text-[#546e6a] dark:text-[#8aa39f]">
                            ভিজিটরের ব্যবহৃত কনটেন্ট, সময়কাল, আইপি ও ডিভাইসের সম্পূর্ণ তালিকা
                        </p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Time range */}
                        <select
                            value={range}
                            onChange={(e) => { setRange(e.target.value); setPage(1); }}
                            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none"
                        >
                            <option value="all">সকল সময়</option>
                            <option value="today">আজকের</option>
                            <option value="week">এই সপ্তাহের</option>
                            <option value="month">এই মাসের</option>
                        </select>

                        {/* Section type */}
                        <select
                            value={type}
                            onChange={(e) => { setType(e.target.value); setPage(1); }}
                            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none"
                        >
                            <option value="all">সকল বিভাগ</option>
                            <option value="surah">কুরআন / সূরা</option>
                            <option value="hadith">হাদিস</option>
                            <option value="dua">দোয়া</option>
                            <option value="umrah">উমরাহ</option>
                            <option value="home">হোম / সাধারণ</option>
                        </select>

                        {/* Search input */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="আইপি, কনটেন্ট বা ব্রাউজার..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-[#e2dfd5] dark:border-[#233e38] bg-[#f8f7f2] dark:bg-[#162724] text-[#14302b] dark:text-[#e4ebe9] outline-none focus:border-[#125e54] w-48"
                            />
                            <Search className="w-3.5 h-3.5 text-[#546e6a] absolute left-2.5 top-2.5" />
                        </form>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f7f2] dark:bg-[#162724] border-b border-[#e2dfd5] dark:border-[#233e38] text-[#546e6a] dark:text-[#8aa39f] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="py-3 px-6">পৃষ্ঠা / কনটেন্ট</th>
                                <th className="py-3 px-6">বিভাগ</th>
                                <th className="py-3 px-6">ডিভাইস ও ব্রাউজার</th>
                                <th className="py-3 px-6">আইপি অ্যাড্রেস</th>
                                <th className="py-3 px-6">সময়কাল</th>
                                <th className="py-3 px-6 text-right">তারিখ ও সময়</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2dfd5]/60 dark:divide-[#233e38]/60 text-[#14302b] dark:text-[#e4ebe9]">
                            {logs.data?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-[#546e6a] dark:text-[#8aa39f]">
                                        কোনো ভিজিটর হিস্ট্রি পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                logs.data?.map((log) => (
                                    <tr key={log.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-6 font-semibold">
                                            <div className="truncate max-w-[200px]" title={log.item_name || log.path}>
                                                {log.item_name || log.path || '/'}
                                            </div>
                                            <div className="text-[10px] text-[#546e6a] font-mono truncate max-w-[200px]">
                                                {log.path}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                log.page_type === 'surah' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                                                log.page_type === 'hadith' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                                                log.page_type === 'dua' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' :
                                                log.page_type === 'umrah' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {log.page_type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-[#546e6a] dark:text-[#8aa39f]">
                                            <span className="font-semibold text-[#14302b] dark:text-[#e4ebe9] capitalize">
                                                {log.device_type || 'Unknown'}
                                            </span>
                                            <span className="text-[10px] block">
                                                {log.browser} on {log.platform}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 font-mono text-[#546e6a] dark:text-[#8aa39f]">
                                            {log.ip_address || '—'}
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {formatSeconds(log.duration_seconds)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right text-[#546e6a] dark:text-[#8aa39f]">
                                            {log.visited_at ? new Date(log.visited_at).toLocaleString('bn-BD-u-nu-latn', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="p-4 border-t border-[#e2dfd5] dark:border-[#233e38] flex items-center justify-between text-xs text-[#546e6a] dark:text-[#8aa39f]">
                        <div>
                            মোট {logs.total} টির মধ্যে {logs.from} - {logs.to}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={logs.current_page <= 1}
                                className="p-1.5 rounded-lg border border-[#e2dfd5] dark:border-[#233e38] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="font-semibold">
                                পৃষ্ঠা {logs.current_page} / {logs.last_page}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(logs.last_page, p + 1))}
                                disabled={logs.current_page >= logs.last_page}
                                className="p-1.5 rounded-lg border border-[#e2dfd5] dark:border-[#233e38] disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
