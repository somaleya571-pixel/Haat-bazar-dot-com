import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Truck,
  TicketPercent,
  BarChart3,
  Star,
  Headphones,
  History,
  Settings,
  Globe,
  UserCheck,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Plus,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AdminMenuTab } from '../../types';
import { BrandLogo } from '../../components/BrandLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItemConfig {
  id: AdminMenuTab | 'logout';
  labelBn: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: () => string | number | null;
  badgeColor?: string;
  section: 'core' | 'commerce' | 'growth' | 'system';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminTab,
    setAdminTab,
    adminProfile,
    updateAdminProfile,
    orders,
    products,
    couriers,
    tickets,
    navigateTo,
    language,
    logoutAdmin,
    showToast,
    ownerSession,
    triggerSimulatedConcurrentSession,
    theme,
    toggleTheme,
  } = useShop();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Clock in Bangladeshi Standard Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'New Order'
  ).length;
  const openTicketsCount = tickets.filter(
    (t) => t.status === 'Open' || t.status === 'In Progress'
  ).length;

  const menuItems: MenuItemConfig[] = [
    // 1. Core Operations
    {
      id: 'dashboard',
      labelBn: 'ড্যাশবোর্ড ওভারভিউ',
      labelEn: 'Dashboard Home',
      icon: LayoutDashboard,
      section: 'core',
    },
    {
      id: 'products',
      labelBn: 'পণ্য ব্যবস্থাপনা',
      labelEn: 'Product Management',
      icon: Package,
      badge: () => products.length,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      section: 'core',
    },
    {
      id: 'orders',
      labelBn: 'অর্ডার ব্যবস্থাপনা',
      labelEn: 'Order Management',
      icon: ShoppingCart,
      badge: () => (pendingOrdersCount > 0 ? pendingOrdersCount : null),
      badgeColor: 'bg-rose-500 text-white',
      section: 'core',
    },
    {
      id: 'customers',
      labelBn: 'গ্রাহক ব্যবস্থাপনা',
      labelEn: 'Customer Management',
      icon: Users,
      section: 'core',
    },

    // 2. Commerce & Logistics
    {
      id: 'sellers',
      labelBn: 'সেলার / ভেন্ডর হাব',
      labelEn: 'Seller Management',
      icon: Store,
      section: 'commerce',
    },
    {
      id: 'couriers',
      labelBn: 'কুরিয়ার ও ডেলিভারি',
      labelEn: 'Courier & Delivery',
      icon: Truck,
      badge: () => couriers.filter((c) => c.isActive).length,
      badgeColor: 'bg-blue-100 text-blue-800',
      section: 'commerce',
    },
    {
      id: 'coupons',
      labelBn: 'কুপন ও অফারসমূহ',
      labelEn: 'Coupons & Offers',
      icon: TicketPercent,
      section: 'commerce',
    },
    {
      id: 'settings',
      labelBn: 'পেমেন্ট ও সিওডি সেটিংস',
      labelEn: 'Payment & COD Settings',
      icon: Settings,
      section: 'commerce',
    },

    // 3. Growth & Quality
    {
      id: 'reports',
      labelBn: 'রিপোর্ট ও অ্যানালিটিক্স',
      labelEn: 'Reports & Analytics',
      icon: BarChart3,
      section: 'growth',
    },
    {
      id: 'reviews',
      labelBn: 'রিভিউ ও রেটিং মডারেশন',
      labelEn: 'Reviews & Ratings',
      icon: Star,
      section: 'growth',
    },
    {
      id: 'website',
      labelBn: 'ওয়েবসাইট ও ব্যানার',
      labelEn: 'Website Management',
      icon: Globe,
      section: 'growth',
    },

    // 4. Assistance & Audit
    {
      id: 'support',
      labelBn: 'হেল্পডেস্ক ও অভিযোগ',
      labelEn: 'Support & Helpdesk',
      icon: Headphones,
      badge: () => (openTicketsCount > 0 ? openTicketsCount : null),
      badgeColor: 'bg-amber-500 text-white',
      section: 'system',
    },
    {
      id: 'activity-logs',
      labelBn: 'অ্যাক্টিভিটি লগস',
      labelEn: 'Activity Logs',
      icon: History,
      section: 'system',
    },
    {
      id: 'profile',
      labelBn: 'অ্যাডমিন প্রোফাইল',
      labelEn: 'Admin Profile',
      icon: UserCheck,
      section: 'system',
    },
    {
      id: 'logout',
      labelBn: 'নিরাপদ লগআউট',
      labelEn: 'Logout',
      icon: LogOut,
      section: 'system',
    },
  ];

  const handleMenuClick = (item: MenuItemConfig) => {
    if (item.id === 'logout') {
      setShowLogoutModal(true);
    } else {
      setAdminTab(item.id);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleStatus = () => {
    const nextStatus = adminProfile.status === 'Online' ? 'Offline' : 'Online';
    updateAdminProfile({ status: nextStatus });
    showToast(`স্ট্যাটাস পরিবর্তিত হয়েছে: ${nextStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans text-gray-900 selection:bg-[#006B35] selection:text-white">
      {/* 1. TOP ADMIN GLOBAL BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5 text-gray-800" />
            </button>

            {/* Replaceable Brand Logo */}
            <BrandLogo
              variant="admin"
              size="md"
              onClick={() => setAdminTab('dashboard')}
            />

            {/* Role & Hub Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EC] text-[#006B35] text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>এডমিন কন্ট্রোল হাব (Seller Central)</span>
            </div>
          </div>

          {/* Right: Quick actions, Live Clock, Online status, Customer View Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Bangladesh Time */}
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentTimeStr}</span>
              <span className="text-[10px] text-gray-400">BST</span>
            </div>

            {/* Single Session Security Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#006B35] border border-emerald-300 text-[11px] font-bold" title={`সক্রিয় সেশন আইডি: ${ownerSession?.sessionId || 'Active'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>একক সেশন: <span className="font-mono">{ownerSession?.sessionId ? `${ownerSession.sessionId.slice(-6)}` : 'Active'}</span></span>
            </div>

            {/* Simulate Concurrent Session Test Button */}
            <button
              onClick={() => {
                if (window.confirm('একক-সেশন পরীক্ষা: আপনি কি অন্য ডিভাইস থেকে লগইন সিমুলেট করতে চান? এটি সাথে সাথে বর্তমান সেশনটি টার্মিনেট করবে।')) {
                  triggerSimulatedConcurrentSession();
                }
              }}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-[10px] font-bold transition-all cursor-pointer"
              title="অন্য ডিভাইস থেকে নতুন লগইন সিমুলেট করুন (পূর্বের সেশন টার্মিনেশন টেস্ট)"
            >
              <span>সেশন ইনভ্যালিডেশন টেস্ট</span>
            </button>

            {/* Online / Offline status badge */}
            <button
              onClick={toggleStatus}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                adminProfile.status === 'Online'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
              title="Click to toggle Online/Offline status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  adminProfile.status === 'Online'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-gray-400'
                }`}
              />
              <span>{adminProfile.status}</span>
            </button>

            {/* Dark / Light Mode Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-[#006B35] transition-all cursor-pointer"
              title={theme === 'dark' ? 'সুইচ করুন ব্রাইট মোডে' : 'সুইচ করুন ডার্ক মোডে'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Switch to Customer Storefront button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState(null, '', '/');
                }
                navigateTo('home');
              }}
              className="px-3 sm:px-3.5 py-1.5 bg-[#006B35] hover:bg-[#005229] text-white text-xs font-bold rounded-xl shadow-xs transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
              title="Return to Customer Marketplace View"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">গ্রাহক প্যানেলে ফিরুন</span>
              <span className="sm:hidden">কাস্টমার ভিউ</span>
            </button>

            {/* Admin Avatar */}
            <div
              onClick={() => setAdminTab('profile')}
              className="flex items-center gap-2 pl-2 border-l border-gray-200 cursor-pointer group"
              title="Admin Profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500 shadow-xs">
                <img
                  src={
                    adminProfile.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={adminProfile.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-gray-900 group-hover:text-[#006B35] transition-colors leading-tight">
                  {adminProfile.name}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {adminProfile.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN ADMIN BODY WITH MULTI-LAYER SIDEBAR & CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex gap-6">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 bg-white border border-[#E2E8F0] rounded-3xl p-3 shadow-xs transition-all duration-300 self-start sticky top-24 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Sidebar Collapse Toggle */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 px-2">
            {!isSidebarCollapsed && (
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                মেইন নেভিগেশন
              </span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer ml-auto"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {menuItems.map((item) => {
              const isActive = adminTab === item.id;
              const Icon = item.icon;
              const badgeVal = item.badge ? item.badge() : null;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-xs font-bold transition-all text-left group cursor-pointer ${
                    isActive
                      ? 'bg-[#006B35] text-white shadow-xs'
                      : item.id === 'logout'
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-gray-700 hover:bg-[#E8F7EC]/70 hover:text-[#006B35]'
                  } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                  title={`${item.labelBn} (${item.labelEn})`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : item.id === 'logout'
                        ? 'text-rose-600'
                        : 'text-gray-500 group-hover:text-[#006B35]'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <>
                      <div className="flex-1 truncate">
                        <span className="block truncate">{item.labelBn}</span>
                        <span
                          className={`block text-[10px] font-normal truncate ${
                            isActive ? 'text-emerald-100' : 'text-gray-400'
                          }`}
                        >
                          {item.labelEn}
                        </span>
                      </div>
                      {badgeVal !== null && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isActive
                              ? 'bg-white text-[#006B35]'
                              : item.badgeColor || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {badgeVal}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Admin Page Container with Mobile Viewport Padding */}
        <main className="flex-1 min-w-0 pb-32 sm:pb-12 viewport-padding-safe">{children}</main>
      </div>

      {/* 3. MOBILE SLIDE-OUT DRAWER FOR FULL 15-ITEM MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50">
            <div className="p-4 bg-[#006B35] text-white flex items-center justify-between">
              <BrandLogo
                variant="admin"
                size="sm"
                onClick={() => {
                  setAdminTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-800">
                {adminProfile.name} ({adminProfile.role})
              </span>
              <button
                onClick={toggleStatus}
                className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold"
              >
                {adminProfile.status}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = adminTab === item.id;
                const Icon = item.icon;
                const badgeVal = item.badge ? item.badge() : null;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#006B35] text-white shadow-xs'
                        : item.id === 'logout'
                        ? 'text-rose-600 hover:bg-rose-50'
                        : 'text-gray-700 hover:bg-[#E8F7EC]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <div className="truncate">
                        <span className="block truncate">{item.labelBn}</span>
                        <span
                          className={`block text-[10px] font-normal truncate ${
                            isActive ? 'text-emerald-100' : 'text-gray-400'
                          }`}
                        >
                          {item.labelEn}
                        </span>
                      </div>
                    </div>
                    {badgeVal !== null && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                          isActive
                            ? 'bg-white text-[#006B35]'
                            : item.badgeColor || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {badgeVal}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => {
                  navigateTo('home');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] text-xs font-bold rounded-xl transition-colors border border-emerald-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>গ্রাহক প্যানেলে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FIXED BOTTOM NAVIGATION BAR FOR MOBILE (As requested in Section 19: Home, Products, Orders, Customers, Profile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-2 px-3 shadow-lg flex items-center justify-around">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
            adminTab === 'dashboard' ? 'text-[#006B35]' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>ড্যাশবোর্ড</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
            adminTab === 'products' ? 'text-[#006B35]' : 'text-gray-500'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>পণ্য</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors relative cursor-pointer ${
            adminTab === 'orders' ? 'text-[#006B35]' : 'text-gray-500'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>অর্ডার</span>
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('customers')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
            adminTab === 'customers' ? 'text-[#006B35]' : 'text-gray-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>গ্রাহক</span>
        </button>

        <button
          onClick={() => setAdminTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
            adminTab === 'profile' ? 'text-[#006B35]' : 'text-gray-500'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>প্রোফাইল</span>
        </button>
      </nav>

      {/* 5. LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50">
                <LogOut className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  অ্যাডমিন লগআউট
                </h3>
                <p className="text-xs text-gray-500">
                  সুরক্ষিত সেশন সমাপ্ত করুন
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              আপনি কি নিশ্চিত যে অ্যাডমিন কন্ট্রোল প্যানেল থেকে লগআউট করতে চান? পুনরায় প্রবেশ করতে বৈধ অ্যাডমিন প্রমাণপত্র লাগবে।
            </p>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutAdmin();
                }}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                হ্যাঁ, লগআউট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
