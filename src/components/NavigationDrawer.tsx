import React from 'react';
import {
  X,
  Home,
  Grid,
  Search,
  FileText,
  Heart,
  ShoppingCart,
  CreditCard,
  MapPin,
  CheckCircle2,
  Package,
  Truck,
  User,
  RotateCcw,
  Star,
  Headphones,
  Bell,
  HelpCircle,
  Shield,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PageId } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentPage, navigateTo, language, orders, theme, setTheme } = useShop();

  if (!isOpen) return null;

  const allPages: Array<{
    id: PageId;
    num: string;
    titleBn: string;
    titleEn: string;
    icon: React.ReactNode;
    badge?: string;
    isPrimary?: boolean;
  }> = [
    { id: 'home', num: '01', titleBn: 'হোম পেজ', titleEn: 'Home Page', icon: <Home className="w-4 h-4 text-emerald-600" /> },
    { id: 'categories', num: '02', titleBn: 'সকল ক্যাটাগরি', titleEn: 'All Categories', icon: <Grid className="w-4 h-4 text-teal-600" /> },
    { id: 'search', num: '03', titleBn: 'সার্চ ও ফিল্টার', titleEn: 'Search & Filters', icon: <Search className="w-4 h-4 text-cyan-600" /> },
    { id: 'product-details', num: '04', titleBn: 'পণ্যের বিস্তারিত', titleEn: 'Product Details', icon: <FileText className="w-4 h-4 text-blue-600" /> },
    { id: 'wishlist', num: '05', titleBn: 'পছন্দের তালিকা', titleEn: 'Wishlist', icon: <Heart className="w-4 h-4 text-rose-600" /> },
    { id: 'cart', num: '06', titleBn: 'শপিং কার্ট', titleEn: 'Shopping Cart', icon: <ShoppingCart className="w-4 h-4 text-amber-600" /> },
    { id: 'checkout', num: '07', titleBn: 'চেকআউট ও পেমেন্ট', titleEn: 'Checkout & Payment', icon: <CreditCard className="w-4 h-4 text-emerald-700" /> },
    { id: 'delivery-address', num: '08', titleBn: 'ডেলিভারি ঠিকানা', titleEn: 'Delivery Address (Cascading)', icon: <MapPin className="w-4 h-4 text-red-600" /> },
    { id: 'order-confirmation', num: '09', titleBn: 'অর্ডার কনফার্মেশন', titleEn: 'Order Confirmation', icon: <CheckCircle2 className="w-4 h-4 text-green-600" /> },
    { id: 'my-orders', num: '10', titleBn: 'আমার অর্ডার সমূহ', titleEn: 'My Orders', icon: <Package className="w-4 h-4 text-indigo-600" /> },
    { id: 'order-tracking', num: '11', titleBn: 'অর্ডার ট্র্যাকিং (৬ ধাপ)', titleEn: 'Order Tracking (6 Stages)', icon: <Truck className="w-4 h-4 text-sky-600" /> },
    { id: 'profile', num: '12', titleBn: 'কাস্টমার প্রোফাইল', titleEn: 'Customer Profile', icon: <User className="w-4 h-4 text-purple-600" /> },
    { id: 'returns', num: '13', titleBn: 'রিটার্ন ও রিফান্ড', titleEn: 'Returns & Refunds', icon: <RotateCcw className="w-4 h-4 text-orange-600" /> },
    { id: 'reviews', num: '14', titleBn: 'পণ্য রিভিউ ও রেটিং', titleEn: 'Product Reviews', icon: <Star className="w-4 h-4 text-amber-500" /> },
    { id: 'customer-service', num: '15', titleBn: 'কাস্টমার সার্ভিস', titleEn: 'Customer Service', icon: <Headphones className="w-4 h-4 text-emerald-600" /> },
    { id: 'notifications', num: '16', titleBn: 'নোটিফিকেশন', titleEn: 'Notifications', icon: <Bell className="w-4 h-4 text-yellow-600" /> },
    { id: 'help-center', num: '17', titleBn: 'হেল্প সেন্টার ও FAQ', titleEn: 'Help Center & FAQs', icon: <HelpCircle className="w-4 h-4 text-blue-500" /> },
    { id: 'privacy-terms', num: '18', titleBn: 'গোপনীয়তা ও শর্তাবলী', titleEn: 'Privacy & Terms', icon: <Shield className="w-4 h-4 text-slate-600" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-50">
        {/* Drawer Header: Logo first, then hadbazar.com, without the 18 pages subtext */}
        <div className="p-4 bg-[#007A3D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/haat_bazar_logo_solid.png"
              alt="hadbazar.com"
              className="h-8 w-auto brightness-0 invert object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-extrabold text-base tracking-wide text-white">hadbazar.com</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Admin Access Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <button
            onClick={() => {
              navigateTo('admin-dashboard');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#003822] hover:bg-[#002717] text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>অ্যাডমিন ড্যাশবোর্ড (Admin Control Panel)</span>
          </button>
        </div>

        {/* 18 Pages List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {language === 'bn' ? 'সকল পেজ নির্দেশিকা (১৮টি পেজ)' : 'All 18 Dedicated Pages'}
          </div>

          {allPages.map((page) => {
            const isActive = currentPage === page.id;
            return (
              <button
                key={page.id}
                onClick={() => {
                  navigateTo(page.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-[#007A3D] font-bold border-l-4 border-[#007A3D]'
                    : 'text-gray-700 hover:bg-gray-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    P{page.num}
                  </span>
                  <div className="p-1 rounded-md bg-gray-50">{page.icon}</div>
                  <span className="truncate">
                    {language === 'bn' ? page.titleBn : page.titleEn}
                  </span>
                </div>
                {isActive && (
                  <span className="text-[10px] bg-[#007A3D] text-white px-2 py-0.5 rounded-full font-bold">
                    সক্রিয়
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Theme Settings: Bright Mode & Dark Mode */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>{language === 'bn' ? 'থিম সেটিংস:' : 'Theme Mode:'}</span>
          </div>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#007A3D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="ব্রাইট মোড"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ব্রাইট মোড' : 'Bright'}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="ডার্ক মোড"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডার্ক মোড' : 'Dark'}</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer with Hotline */}
        <div className="p-3 bg-white border-t border-gray-200">
          <a
            href="tel:+8801700123456"
            className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>সরাসরি কল করুন: +880 1700-123456</span>
          </a>
        </div>
      </div>
    </div>
  );
};
