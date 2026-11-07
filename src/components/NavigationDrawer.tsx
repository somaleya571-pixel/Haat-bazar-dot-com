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
import { BrandLogo } from './BrandLogo';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentPage, navigateTo, language, orders, theme, setTheme, officialContact } = useShop();

  if (!isOpen) return null;

  const allPages: Array<{
    id: PageId;
    titleBn: string;
    subtitleBn: string;
    titleEn: string;
    icon: React.ReactNode;
    iconBg: string;
    badge?: string;
  }> = [
    {
      id: 'home',
      titleBn: 'প্রধান বাজার (হোম পেজ)',
      subtitleBn: 'টাটকা দেশীয় পণ্য ও সেরা অফার',
      titleEn: 'Home Marketplace',
      icon: <Home className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    },
    {
      id: 'categories',
      titleBn: 'সকল পণ্য বিভাগ (ক্যাটাগরি)',
      subtitleBn: 'নিত্য প্রয়োজনীয় সকল গ্রোসারি',
      titleEn: 'All Categories',
      icon: <Grid className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
    },
    {
      id: 'search',
      titleBn: 'পণ্য অনুসন্ধান ও ফিল্টার',
      subtitleBn: 'স্মার্ট সার্চ ও মূল্য ফিল্টার',
      titleEn: 'Search & Filters',
      icon: <Search className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-cyan-600 to-blue-600',
    },
    {
      id: 'product-details',
      titleBn: 'পণ্যের বিস্তারিত বিবরণ',
      subtitleBn: 'গুণগত মান, মেয়াদ ও স্টক তথ্য',
      titleEn: 'Product Details',
      icon: <FileText className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    },
    {
      id: 'wishlist',
      titleBn: 'পছন্দের তালিকা (উইশলিস্ট)',
      subtitleBn: 'আপনার সংরক্ষিত প্রিয় সামগ্রী',
      titleEn: 'Wishlist',
      icon: <Heart className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-rose-500 to-red-600',
    },
    {
      id: 'cart',
      titleBn: 'আপনার শপিং কার্ট',
      subtitleBn: 'নির্বাচিত আইটেম ও মোট মূল্য',
      titleEn: 'Shopping Cart',
      icon: <ShoppingCart className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      id: 'checkout',
      titleBn: 'নিরাপদ চেকআউট ও পেমেন্ট',
      subtitleBn: 'ক্যাশ অন ডেলিভারি ও দ্রুত অর্ডার',
      titleEn: 'Checkout & Payment',
      icon: <CreditCard className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-700',
    },
    {
      id: 'delivery-address',
      titleBn: 'ডেলিভারি ঠিকানা ও এলাকা',
      subtitleBn: 'বিভাগ, জেলা ও সঠিক ড্রপ-পয়েন্ট',
      titleEn: 'Delivery Address',
      icon: <MapPin className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
    },
    {
      id: 'order-confirmation',
      titleBn: 'অর্ডার নিশ্চিতকরণ ভাউচার',
      subtitleBn: 'অর্ডার স্লিপ ও ট্র্যাকিং কোড',
      titleEn: 'Order Confirmation',
      icon: <CheckCircle2 className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    },
    {
      id: 'my-orders',
      titleBn: 'আমার সকল অর্ডারের ইতিহাস',
      subtitleBn: 'বিগত ও বর্তমান ক্রয়ের বিবরণ',
      titleEn: 'My Orders',
      icon: <Package className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    },
    {
      id: 'order-tracking',
      titleBn: 'লাইভ অর্ডার ট্র্যাকিং (৬ ধাপ)',
      subtitleBn: 'রিয়েল-টাইম ডেলিভারি আপডেট',
      titleEn: 'Live Order Tracking',
      icon: <Truck className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    },
    {
      id: 'profile',
      titleBn: 'ব্যক্তিগত প্রোফাইল ও অ্যাকাউন্ট',
      subtitleBn: 'গ্রাহকের তথ্য ও নিরাপত্তা সেটিংস',
      titleEn: 'Customer Profile',
      icon: <User className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    },
    {
      id: 'returns',
      titleBn: 'সহজ রিটার্ন ও দ্রুত রিফান্ড',
      subtitleBn: '৭ দিনের সহজ পণ্য ফেরত নিশ্চয়তা',
      titleEn: 'Returns & Refunds',
      icon: <RotateCcw className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
    },
    {
      id: 'reviews',
      titleBn: 'গ্রাহক রিভিউ ও স্টার রেটিং',
      subtitleBn: 'যাচাইকৃত ক্রেতাদের বাস্তব প্রতিক্রিয়া',
      titleEn: 'Product Reviews',
      icon: <Star className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    },
    {
      id: 'customer-service',
      titleBn: '২৪/৭ গ্রাহক সহায়তা কেন্দ্র',
      subtitleBn: 'হটলাইন, লাইভ চ্যাট ও সার্বক্ষণিক সেবা',
      titleEn: '24/7 Customer Service',
      icon: <Headphones className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      id: 'notifications',
      titleBn: 'বিজ্ঞপ্তি ও অফার আপডেট',
      subtitleBn: 'বিশেষ ছাড় ও অর্ডারের মেসেজ',
      titleEn: 'Notifications',
      icon: <Bell className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
    {
      id: 'help-center',
      titleBn: 'হেল্প সেন্টার ও সাধারণ জিজ্ঞাসা (FAQ)',
      subtitleBn: 'কেনাকাটা সংক্রান্ত প্রশ্নের সহজ উত্তর',
      titleEn: 'Help Center & FAQ',
      icon: <HelpCircle className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      id: 'privacy-terms',
      titleBn: 'নিরাপত্তা নীতি ও ব্যবহারের শর্তাবলী',
      subtitleBn: 'শতভাগ নিরাপদ ও সুরক্ষিত সেবা',
      titleEn: 'Privacy & Terms',
      icon: <Shield className="w-4 h-4 text-white" />,
      iconBg: 'bg-gradient-to-br from-slate-600 to-gray-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-50">
        {/* Drawer Header: Brand Logo */}
        <div className="p-3.5 bg-gradient-to-r from-[#007A3D] to-[#005a2d] text-white flex items-center justify-between shadow-md">
          <BrandLogo variant="drawer" size="sm" onClick={() => { navigateTo('home'); onClose(); }} />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentic & Exclusive Navigation Directory (All customer marketplace pages) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {allPages.map((page) => {
            const isActive = currentPage === page.id;
            return (
              <button
                key={page.id}
                onClick={() => {
                  navigateTo(page.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50/90 text-[#007A3D] font-bold border-l-4 border-[#007A3D] shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-50/80 font-medium border border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Distinctive, Premium Icon Badge */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${page.iconBg}`}>
                    {page.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs truncate ${isActive ? 'font-bold text-[#007A3D]' : 'font-semibold text-gray-800'}`}>
                      {language === 'bn' ? page.titleBn : page.titleEn}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                      {language === 'bn' ? page.subtitleBn : page.titleEn}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <span className="text-[10px] bg-[#007A3D] text-white px-2 py-0.5 rounded-full font-bold shrink-0 ml-2">
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

        {/* Drawer Footer with Hotline & Admin Access */}
        <div className="p-3 bg-white border-t border-gray-200 space-y-2">
          <a
            href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-[#007A3D] hover:bg-[#006030] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>সরাসরি কল করুন: {officialContact.hotline}</span>
          </a>

          <button
            onClick={() => {
              navigateTo('admin-dashboard');
              onClose();
            }}
            className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#007A3D] border border-emerald-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#007A3D]" />
            <span>অ্যাডমিন ড্যাশবোর্ড (Admin Control Panel)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
