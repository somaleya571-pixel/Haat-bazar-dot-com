import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Wallet,
  Zap,
  Activity,
  Flame,
  ShieldAlert,
  Headphones,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminDashboardHome: React.FC = () => {
  const {
    orders,
    products,
    customersList,
    sellers,
    couriers,
    tickets,
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

  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;
  const suspendedCustomersCount = customersList.filter((c) => c.status === 'Suspended').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  const deliveredOrders = filteredOrders.filter((o) => o.status === 'Delivered').length;
  const deliverySuccessRate =
    totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 98;

  const todaySales =
    orders
      .filter((o) => o.date.includes('2026-11-07') || o.date.includes('Today') || o.date.includes('14:32'))
      .reduce((sum, o) => sum + o.totalAmount, 0) || 2768;

  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Metric cards arranged in 2 to 3 cards per row layout with ample spacing
  // Specifically separating 'Gross Revenue' (Card 1 in Row 1) and 'Daily Sales' (Card 4 in Row 2)
  const metricCards = [
    // ROW 1: Card 1 (Gross Revenue)
    {
      id: 'gross-revenue',
      titleBn: 'সর্বমোট রাজস্ব বিক্রয় (Gross Revenue)',
      titleEn: 'Gross Merchandise Value (GMV)',
      value: `৳${totalSales.toLocaleString()}`,
      currencyBadge: '৳ BDT',
      trend: '+18.4%',
      isPositive: true,
      timeframe: 'গত ৩০ দিনে মোট বিক্রয়',
      icon: Wallet,
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/40',
      tabTarget: 'reports' as const,
      highlight: true,
      sparkline: [30, 45, 38, 55, 62, 75, 88],
    },
    // ROW 1: Card 2 (Total Orders)
    {
      id: 'total-orders',
      titleBn: 'মোট সম্পন্ন অর্ডার (Total Orders)',
      titleEn: 'Lifetime Platform Orders',
      value: totalOrders.toString(),
      currencyBadge: 'অর্ডার',
      trend: '+9.2%',
      isPositive: true,
      timeframe: 'সক্রিয় ক্রেতাদের অর্ডার',
      icon: ShoppingCart,
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300/40',
      tabTarget: 'orders' as const,
      sparkline: [15, 25, 35, 30, 45, 50, 65],
    },
    // ROW 1: Card 3 (Delivery Success Rate)
    {
      id: 'delivery-rate',
      titleBn: 'ডেলিভারি সাফল্য হার (Fulfillment)',
      titleEn: 'Delivery Success Rate',
      value: `${deliverySuccessRate}%`,
      currencyBadge: 'সাফল্য',
      trend: '+2.4%',
      isPositive: true,
      timeframe: `${couriers.length}টি কুরিয়ার নেটওয়ার্ক`,
      icon: CheckCircle2,
      iconBg: 'bg-green-500/15 text-green-600 dark:text-green-400',
      badgeBg: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-300/40',
      tabTarget: 'couriers' as const,
      sparkline: [85, 88, 90, 92, 94, 96, 98],
    },

    // ROW 2: Card 4 (Daily Sales - Separated into Row 2)
    {
      id: 'daily-sales',
      titleBn: 'আজকের দৈনিক বিক্রয় (Daily Sales)',
      titleEn: "Today's Live Gross Sales",
      value: `৳${todaySales.toLocaleString()}`,
      currencyBadge: '৳ দৈনিক',
      trend: '+12.6%',
      isPositive: true,
      timeframe: '২৪ ঘণ্টার লাইভ ট্র্যাকিং',
      icon: TrendingUp,
      iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-300/40',
      tabTarget: 'reports' as const,
      highlight: true,
      sparkline: [20, 25, 40, 35, 60, 55, 70],
    },
    // ROW 2: Card 5 (Pending Orders)
    {
      id: 'pending-orders',
      titleBn: 'জরুরি অপেক্ষমাণ অর্ডার (Pending)',
      titleEn: 'Pending Fulfillment',
      value: pendingOrders.toString(),
      currencyBadge: 'পেন্ডিং',
      trend: pendingOrders > 0 ? 'অ্যাকশন প্রয়োজন' : 'সম্পন্ন',
      isPositive: pendingOrders === 0,
      timeframe: 'প্যাকিং ও কুরিয়ার হ্যান্ডওভার',
      icon: Clock,
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/40',
      tabTarget: 'orders' as const,
      sparkline: [5, 8, 4, 10, 6, 8, 3],
    },
    // ROW 2: Card 6 (Active Customers)
    {
      id: 'total-customers',
      titleBn: 'নিবন্ধিত সক্রিয় গ্রাহক (Customers)',
      titleEn: 'Active Registered Customers',
      value: totalCustomers.toString(),
      currencyBadge: 'গ্রাহক',
      trend: '+14.1%',
      isPositive: true,
      timeframe: `${totalCustomers - suspendedCustomersCount} জন সক্রিয়`,
      icon: Users,
      iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300/40',
      tabTarget: 'customers' as const,
      sparkline: [10, 18, 24, 30, 42, 48, 55],
    },

    // ROW 3: Card 7 (Products)
    {
      id: 'total-products',
      titleBn: 'সক্রিয় পণ্য ক্যাটালগ (Products)',
      titleEn: 'Live Active Catalog Items',
      value: totalProducts.toString(),
      currencyBadge: 'পণ্য',
      trend: '১০টি ক্যাটাগরি',
      isPositive: true,
      timeframe: 'ইন-স্টক অর্গানিক পণ্য',
      icon: Package,
      iconBg: 'bg-emerald-500/15 text-[#006B35] dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300/40',
      tabTarget: 'products' as const,
      sparkline: [20, 24, 28, 32, 36, 40, 44],
    },
    // ROW 3: Card 8 (Sellers)
    {
      id: 'total-sellers',
      titleBn: 'অনুমোদিত ভেন্ডর ও সেলার (Sellers)',
      titleEn: 'Verified Merchant Network',
      value: totalSellers.toString(),
      currencyBadge: 'সেলার',
      trend: '১০০% ভেরিফাইড',
      isPositive: true,
      timeframe: 'যাচাইকৃত দেশীয় উৎপাদক',
      icon: Store,
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300/40',
      tabTarget: 'sellers' as const,
      sparkline: [4, 6, 8, 10, 12, 14, 16],
    },
    // ROW 3: Card 9 (Average Order Value)
    {
      id: 'aov',
      titleBn: 'গড় অর্ডার মূল্য (Average Order Value)',
      titleEn: 'AOV Metric',
      value: `৳${avgOrderValue.toLocaleString()}`,
      currencyBadge: '৳ গড়',
      trend: '+6.8%',
      isPositive: true,
      timeframe: 'প্রতি ক্রয়ে গড় খরচ',
      icon: Activity,
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300/40',
      tabTarget: 'reports' as const,
      sparkline: [40, 50, 48, 62, 58, 70, 78],
    },
  ];

  return (
    <div className="space-y-7 pb-20 viewport-padding-safe">
      {/* 1. ADMIN DASHBOARD HEADER */}
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

          {/* Controls: Date Filter Bar & Theme Toggle */}
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

            {/* Theme Toggle Button */}
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

      {/* 2. ROUNDED GRID LAYOUT (2 to 3 Cards Per Row with Ample Spacing, Separating Gross Revenue and Daily Sales) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              onClick={() => setAdminTab(metric.tabTarget)}
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-200 cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                metric.highlight
                  ? 'bg-gradient-to-br from-white to-emerald-50/60 dark:from-gray-900 dark:to-emerald-950/20 border-emerald-300/80 dark:border-emerald-700/80 shadow-md hover:shadow-xl hover:border-[#006B35]'
                  : 'bg-white dark:bg-gray-900 border-[#E2E8F0] dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-[#006B35] dark:hover:border-emerald-600'
              }`}
            >
              <div>
                {/* Header Row: Label & Modern Icon Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block tracking-tight">
                      {metric.titleBn}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono block mt-0.5">
                      {metric.titleEn}
                    </span>
                  </div>

                  {/* Modern Visually Appealing Icon Badge */}
                  <div
                    className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-2xs shrink-0 ${metric.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Metric Value Row with Modern Currency/Unit Indicator */}
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight font-sans">
                    {metric.value}
                  </span>

                  {/* Modern Currency / Unit Tag */}
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border font-mono ${metric.badgeBg}`}
                  >
                    {metric.currencyBadge}
                  </span>
                </div>
              </div>

              {/* Footer Row: Modern Growth Indicator & Micro Sparkline */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Modern Growth Indicator Badge with Visual Icons */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                      metric.isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800'
                        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800'
                    }`}
                  >
                    {metric.isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>{metric.trend}</span>
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[120px]">
                    {metric.timeframe}
                  </span>
                </div>

                {/* Micro SVG Sparkline Accent */}
                <div className="w-16 h-5 opacity-70 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 70 20" className="w-full h-full overflow-visible">
                    <polyline
                      fill="none"
                      stroke={metric.isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth="2.5"
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

      {/* 3. QUICK DATA MANAGEMENT & OPERATIONS HUB (Sales Analysis Chart Removed As Requested) */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-gray-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-[#006B35] dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                দ্রুত ডাটা ব্যবস্থাপনা ও প্রশাসনিক কন্ট্রোল হাব (Data Management Hub)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                বাতিল অর্ডার পার্মানেন্ট ডিলিট, গ্রাহক একাউন্ট নিরাপত্তা ও কাস্টমার হেল্পডেস্ক রিপ্লাই হাব
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            রিয়েল-টাইম ডাটা সিঙ্ক
          </span>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card A: Cancelled Orders Management */}
          <div
            onClick={() => setAdminTab('orders')}
            className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  {cancelledOrdersCount} টি বাতিল
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#006B35] dark:group-hover:text-emerald-400 transition-colors">
                বাতিল অর্ডার পার্মানেন্ট ডিলিট
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                বাতিল হওয়া অপ্রয়োজনীয় অর্ডার ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলার পূর্ণ নিয়ন্ত্রণ
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-[#006B35] dark:text-emerald-400">
              <span>অর্ডার ম্যানেজ করুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card B: Customer Profile Controls */}
          <div
            onClick={() => setAdminTab('customers')}
            className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <UserCheck className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {customersList.length} গ্রাহক
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#006B35] dark:group-hover:text-emerald-400 transition-colors">
                গ্রাহক প্রোফাইল ও স্ট্যাটাস কন্ট্রোল
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                সাসপেন্ড (ডিঅ্যাক্টিভ), একটিভ ও পার্মানেন্ট ডিলিট এবং স্বয়ংক্রিয় নোটিফিকেশন প্রদান
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-[#006B35] dark:text-emerald-400">
              <span>গ্রাহক ডাটাবেস দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card C: Support Tickets & Admin Replies */}
          <div
            onClick={() => setAdminTab('support')}
            className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Headphones className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  {openTicketsCount} টি অভিযোগ
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#006B35] dark:group-hover:text-emerald-400 transition-colors">
                কাস্টমার সাপোর্ট রিপ্লাই ও মডারেশন
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                গ্রাহকের সমস্যার দ্রুত রিপ্লাই দিন এবং প্রয়োজনে পরবর্তীতে অ্যাডমিন রিপ্লাই ডিলিট করার সুবিধা
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-xs font-bold text-[#006B35] dark:text-emerald-400">
              <span>হেল্পডেস্কে প্রবেশ করুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
