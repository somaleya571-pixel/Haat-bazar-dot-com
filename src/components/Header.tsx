import React, { useState } from 'react';
import {
  Phone,
  Search,
  ShoppingCart,
  Heart,
  Menu,
  ShieldCheck,
  Globe,
  Bell,
  X,
  User,
  Sun,
  Moon,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDrawer }) => {
  const {
    currentPage,
    navigateTo,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    customer,
    cart,
    wishlist,
    notifications,
    searchQuery,
    setSearchQuery,
    officialContact,
  } = useShop();

  const [inputVal, setInputVal] = useState(searchQuery);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    navigateTo('search', { query: inputVal });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* 1. TOP HOTLINE BAR */}
      <div className="bg-[#007A3D] text-white px-3 sm:px-6 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 hover:underline font-semibold focus:outline-hidden"
            title="কল করতে ক্লিক করুন"
          >
            <Phone className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>হটলাইন: <strong>{officialContact.hotline}</strong></span>
          </a>
          <span className="hidden md:inline text-emerald-200">|</span>
          <span className="hidden md:inline text-emerald-100">
            {language === 'bn' ? officialContact.supportHours : '8:00 AM - 11:00 PM'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customer Profile Navigation Button */}
          <button
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-1.5 hover:text-yellow-200 text-xs font-bold px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-all cursor-pointer shadow-xs"
            title="আমার প্রোফাইল ও অ্যাকাউন্ট"
          >
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[120px] truncate">
              {customer.name || (language === 'bn' ? 'আমার প্রোফাইল' : 'Profile')}
            </span>
          </button>

          <button
            onClick={() => navigateTo('notifications')}
            className="flex items-center gap-1 hover:text-yellow-200 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notifs'}</span>
            {unreadNotifs > 0 && (
              <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadNotifs}
              </span>
            )}
          </button>

          <button
            onClick={() => navigateTo('customer-service')}
            className="hover:underline hidden sm:inline"
          >
            {language === 'bn' ? 'সহায়তা' : 'Support'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 space-y-2">
        {/* ROW 1: Search Bar, Theme Toggle & Language Pill */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full flex-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'bn'
                  ? '১,০০০+ নিত্যপ্রয়োজনীয় বাজার, টাটকা সবজি, মসলা খুঁজুন...'
                  : 'Search 1,000+ daily groceries, fresh produce, spices...'
              }
              className="w-full pl-9 sm:pl-10 pr-20 sm:pr-24 py-1.5 sm:py-2 border-2 border-[#007A3D] rounded-full text-xs sm:text-sm focus:outline-hidden bg-gray-50/50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 sm:px-4 bg-[#007A3D] hover:bg-[#006030] text-white rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'Search' : 'Search'}
            </button>
          </form>

          {/* Theme & Language Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Theme Toggle Button (Light Mode / Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 hover:border-[#007A3D] text-gray-800 dark:text-gray-100 transition-colors bg-white dark:bg-[#141f17] shadow-2xs cursor-pointer"
              title={theme === 'dark' ? 'ব্রাইট মোড করুন' : 'ডার্ক মোড করুন'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-amber-400">লাইট</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-bold text-gray-700">ডার্ক</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border border-[#007A3D]/40 text-gray-800 hover:border-[#007A3D] hover:text-[#007A3D] transition-colors bg-white shadow-2xs cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#007A3D]" />
              <span className="font-bold">{language === 'bn' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Haat Bazar Logo on Left, Wishlist, Cart & Hamburger Menu on Right */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          {/* Left: Replaceable Official Haat Bazar Logo */}
          <BrandLogo
            variant="header"
            size="md"
            onClick={() => navigateTo('home')}
            showSlogan
          />

          {/* Right: Wishlist, Cart & Three-Line Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => navigateTo('wishlist')}
              className={`p-2 rounded-full border border-gray-200 text-gray-700 hover:text-[#007A3D] hover:border-[#007A3D] relative transition-colors bg-white ${
                currentPage === 'wishlist' ? 'bg-emerald-50 text-[#007A3D] border-[#007A3D]' : ''
              }`}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#a82020] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => navigateTo('cart')}
              className={`p-2 rounded-full border border-gray-200 text-gray-700 hover:text-[#007A3D] hover:border-[#007A3D] relative transition-colors bg-white ${
                currentPage === 'cart' ? 'bg-emerald-50 text-[#007A3D] border-[#007A3D]' : ''
              }`}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#007A3D] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Three-Line Hamburger Menu Button (Moved to right side of header as requested) */}
            <button
              onClick={onOpenDrawer}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 text-gray-800 hover:text-[#007A3D] hover:border-[#007A3D] hover:bg-emerald-50/60 transition-all bg-white shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="মেনু (Navigation Menu)"
              aria-label="Navigation Menu"
            >
              <Menu className="w-5 h-5 text-gray-900" />
              <span className="hidden md:inline text-xs font-bold text-gray-800">মেনু</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
