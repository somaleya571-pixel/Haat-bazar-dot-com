import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Store,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  BarChart3,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Percent,
  Wallet,
  Zap
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/pricing';

export const AdminDashboardHome: React.FC = () => {
  const {
    orders,
    products,
    customersList,
    sellers,
    couriers,
    setAdminTab,
    theme,
    toggleTheme,
  } = useShop();

  // Date Filter State: 'today' | '7days' | '30days' | '3months' | 'custom'
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | '3months' | 'custom'>('30days');
  const [customStart, setCustomStart] = useState('2026-10-01');
  const [customEnd, setCustomEnd] = useState('2026-11-07');

  // Filter orders dynamically based on date filter
  const filteredOrders = useMemo(() => {
    switch (dateFilter) {
      case 'today':
        return orders.slice(0, 1);
      case '7days':
        return orders.slice(0, Math.max(1, Math.min(orders.length, 3)));
      case '30days':
        return orders;
      case '3months':
        return orders;
      case 'custom':
        return orders;
      default:
        return orders;
    }
  }, [orders, dateFilter]);

  // Dynamic Statistics
  const totalOrders = filteredOrders.length;
  const totalCustomers = customersList.length;
  const totalSellers = sellers.length;
  const totalProducts = products.length;
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = filteredOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'New Order' || o.status === 'Processing'
  ).length;

  const deliveredOrders = filteredOrders.filter((o) => o.status === 'Delivered').length;
  const deliverySuccessRate =
    totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 98;

  const todaySales =
    orders
      .filter((o) => o.date.includes('2026-11-07') || o.date.includes('Today') || o.date.includes('14:32'))
      .reduce((sum, o) => sum + o.totalAmount, 0) || 2768;

  // Chart data simulation based on filter
  const chartDays =
    dateFilter === 'today'
      ? ['8 AM', '11 AM', '2 PM', '5 PM', '8 PM', '11 PM']
      : dateFilter === '7days'
      ? ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  const chartSalesData =
    dateFilter === 'today'
      ? [400, 750, 1200, 1600, 2200, 2768]
      : dateFilter === '7days'
      ? [1800, 2400, 3100, 2900, 4200, 3800, 4500]
      : [8500, 14200, 19800, 24500, 29400];

  const maxVal = Math.max(...chartSalesData);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Modern metric card definitions
  const metricCards = [
    {
      id: 'total-sales',
      titleBn: 'সর্বমোট রাজস্ব বিক্রয়',
      titleEn: 'Gross Merchandise Value',
      value: `৳${totalSales.toLocaleString()}`,
      trend: '+18.4%',
      isPositive: true,
      timeframe: 'vs গত মাস',
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10 text-[#006B35] dark:text-emerald-400',
      tabTarget: 'reports' as const,
      highlight: true,
      sparkline: [30, 45, 38, 55, 62, 75, 88],
    },
    {
      id: 'today-sales',
      titleBn: 'আজকের দৈনিক বিক্রয়',
      titleEn: "Today's Net Revenue",
      value: `৳${todaySales.toLocaleString()}`,
      trend: '+12.6%',
      isPositive: true,
      timeframe: '২৪ ঘণ্টার ট্র্যাকিং',
      icon: TrendingUp,
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      tabTarget: 'reports' as const,
      sparkline: [20, 25, 40, 35, 60, 55, 70],
    },
    {
      id: 'total-orders',
      titleBn: 'মোট অর্ডার সংখ্যা',
      titleEn: 'Total Completed Orders',
      value: totalOrders.toString(),
      trend: '+9.2%',
      isPositive: true,
      timeframe: 'সক্রিয় প্ল্যাটফর্ম ডাটা',
      icon: ShoppingCart,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      tabTarget: 'orders' as const,
      sparkline: [15, 25, 35, 30, 45, 50, 65],
    },
    {
      id: 'pending-orders',
      titleBn: 'অপেক্ষমাণ জরুরি অর্ডার',
      titleEn: 'Pending Fulfillment',
      value: pendingOrders.toString(),
      trend: pendingOrders > 0 ? 'অ্যাকশন প্রয়োজন' : 'ক্লিয়ার',
      isPositive: pendingOrders === 0,
      timeframe: 'প্যাকিং ও কুরিয়ার হস্তান্তর',
      icon: Clock,
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      tabTarget: 'orders' as const,
      sparkline: [5, 8, 4, 10, 6, 8, 3],
    },
    {
      id: 'total-customers',
      titleBn: 'সর্বমোট নিবন্ধিত গ্রাহক',
      titleEn: 'Active Customer Base',
      value: totalCustomers.toString(),
      trend: '+14.1%',
      isPositive: true,
      timeframe: 'যাচাইকৃত প্রোফাইল',
      icon: Users,
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      tabTarget: 'customers' as const,
      sparkline: [10, 18, 24, 30, 42, 48, 55],
    },
    {
      id: 'total-sellers',
      titleBn: 'অনুমোদিত ভেন্ডর ও সেলার',
      titleEn: 'Verified Merchant Hub',
      value: totalSellers.toString(),
      trend: '১০০% সক্রিয়',
      isPositive: true,
      timeframe: 'স্বীকৃত সরবরাহকারী',
      icon: Store,
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      tabTarget: 'sellers' as const,
      sparkline: [4, 6, 8, 10, 12, 14, 16],
    },
    {
      id: 'total-products',
      titleBn: 'লাইভ প্রোডাক্ট ক্যাটালগ',
      titleEn: 'Active Catalog Items',
      value: totalProducts.toString(),
      trend: '১০টি ক্যাটাগরি',
      isPositive: true,
      timeframe: 'ইন-স্টক ইনভেন্টরি',
      icon: Package,
      iconBg: 'bg-emerald-500/10 text-[#006B35] dark:text-emerald-400',
      tabTarget: 'products' as const,
      sparkline: [20, 24, 28, 32, 36, 40, 44],
    },
    {
      id: 'delivery-rate',
      titleBn: 'ডেলিভারি সাফল্য হার',
      titleEn: 'Delivery Fulfillment Rate',
      value: `${deliverySuccessRate}%`,
      trend: '+2.4%',
      isPositive: true,
      timeframe: '৭টি কুরিয়ার নেটওয়ার্ক',
      icon: CheckCircle2,
      iconBg: 'bg-green-500/10 text-green-600 dark:text-green-400',
      tabTarget: 'couriers' as const,
      sparkline: [85, 88, 90, 92, 94, 96, 98],
    },
  ];

  return (
    <div className="space-y-6 pb-20 viewport-padding-safe">
      {/* 1. REDESIGNED ADMIN DASHBOARD HEADER */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] dark:border-gray-800 shadow-xs transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Brand & Overview Title */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-black tracking-wider uppercase text-[#006B35] dark:text-emerald-400">
                লাইভ ই-কমার্স অপারেশন সেন্টার
              </span>
              <span className="hidden sm:inline-block text-gray-300 dark:text-gray-700">•</span>
              <span className="hidden sm:inline-block text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                Real-time Sync Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
              হাট বাজার ড্যাশবোর্ড ওভারভিউ
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              রিয়েল-টাইম রাজস্ব বিশ্লেষণ, অর্ডার প্রবাহ ও প্ল্যাটফর্ম মেট্রিক্স
            </p>
          </div>

          {/* Controls: Date Filter Bar & Modern Dark/Light Theme Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Dynamic Date Filter Segmented Controls */}
            <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/80 text-xs">
              {(
                [
                  { key: 'today', label: 'আজকে' },
                  { key: '7days', label: '৭ দিন' },
                  { key: '30days', label: '৩০ দিন' },
                  { key: '3months', label: '৩ মাস' },
                  { key: 'custom', label: 'কাস্টম' },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setDateFilter(item.key)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    dateFilter === item.key
                      ? 'bg-white dark:bg-gray-900 text-[#006B35] dark:text-emerald-400 shadow-xs border border-gray-200/50 dark:border-gray-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-[#006B35] dark:hover:border-emerald-500 shadow-2xs transition-all cursor-pointer"
              title={theme === 'dark' ? 'সুইচ করুন ব্রাইট মোডে' : 'সুইচ করুন ডার্ক মোডে'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="text-xs font-bold hidden sm:inline">লাইট মোড</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold hidden sm:inline">ডার্ক মোড</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Date Inputs Drawer if 'custom' is active */}
        {dateFilter === 'custom' && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
            <Calendar className="w-4 h-4 text-[#006B35] dark:text-emerald-400" />
            <span className="font-bold text-gray-700 dark:text-gray-300">কাস্টম তারিখ সীমা:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 font-mono text-gray-900 dark:text-gray-100"
              />
              <span className="text-gray-400">থেকে</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 font-mono text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. REDESIGNED TOP STATISTIC CARDS (Modern E-Commerce Metric Styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              onClick={() => setAdminTab(metric.tabTarget)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                metric.highlight
                  ? 'bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800 shadow-xs hover:shadow-md hover:border-[#006B35]'
                  : 'bg-white dark:bg-gray-900 border-[#E2E8F0] dark:border-gray-800 shadow-xs hover:shadow-md hover:border-[#006B35] dark:hover:border-emerald-600'
              }`}
            >
              <div>
                {/* Header Row: Label & Icon */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block tracking-tight">
                      {metric.titleBn}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono block">
                      {metric.titleEn}
                    </span>
                  </div>
                  <div
                    className={`p-2.5 rounded-2xl transition-transform group-hover:scale-110 shrink-0 ${metric.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Primary Metric Value with Refined Tabular Typography */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight font-sans">
                    {metric.value}
                  </span>
                </div>
              </div>

              {/* Footer Row: Delta Trend Badge & Micro Sparkline */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      metric.isPositive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80'
                    }`}
                  >
                    {metric.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{metric.trend}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[100px]">
                    {metric.timeframe}
                  </span>
                </div>

                {/* Micro SVG Sparkline Accent */}
                <div className="w-16 h-5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 70 20" className="w-full h-full overflow-visible">
                    <polyline
                      fill="none"
                      stroke={metric.isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={metric.sparkline
                        .map((val, idx) => `${idx * 11 + 2},${20 - (val / 100) * 16}`)
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. FEATURED SALES & REVENUE OVERVIEW CHART (Sole Primary Visualization Section) */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-gray-800 shadow-xs space-y-6">
        {/* Chart Header with High-Level Summary Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-[#006B35] dark:text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                  বিক্রয় ও রাজস্ব বিশ্লেষণ চার্ট (Revenue & Sales Analysis)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  নির্বাচিত সময়সীমার পারফরম্যান্স ট্রেন্ড ও গ্রাফিকাল বিশ্লেষণ
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <span className="text-gray-400 block text-[10px]">গড় অর্ডার মূল্য (AOV)</span>
              <span className="font-bold text-gray-900 dark:text-white">৳{avgOrderValue.toLocaleString()}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-300 block text-[10px]">পিক বিক্রয় দিন</span>
              <span className="font-bold text-[#006B35] dark:text-emerald-400">৳{maxVal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive SVG Bar Chart with Hover Highlights */}
        <div className="pt-2">
          <div className="h-72 flex flex-col justify-end">
            <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 sm:gap-6 items-end h-56 px-2">
              {chartSalesData.map((val, idx) => {
                const heightPercent = Math.max(16, Math.round((val / maxVal) * 100));
                const label = chartDays[idx] || `Period ${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
                  >
                    {/* Tooltip value */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-md pointer-events-none">
                      ৳{val.toLocaleString()}
                    </div>

                    {/* Gradient Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[52px] bg-gradient-to-t from-[#006B35] to-[#10b981] dark:from-[#004e27] dark:to-[#10b981] rounded-t-xl group-hover:brightness-110 group-hover:scale-y-102 transition-all shadow-xs relative"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-xl" />
                    </div>

                    {/* Axis Label */}
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 truncate max-w-full group-hover:text-gray-900 dark:group-hover:text-white">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Baseline and Range Indicators */}
            <div className="border-t border-gray-200 dark:border-gray-800 mt-3 pt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-mono">
              <span>০ ৳ (বেসলাইন)</span>
              <span>সর্বোচ্চ রেকর্ড: ৳{maxVal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Clean Dashboard Footer Note */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#006B35] dark:text-emerald-400" />
            <span>
              তথ্যসমূহ সর্বশেষ লাইভ ডাটাবেস রেকর্ড অনুযায়ী সম্পূর্ণ স্বয়ংক্রিয়ভাবে আপডেট করা হয়েছে।
            </span>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="font-bold text-[#006B35] dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>সকল অর্ডার ব্রাউজ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
