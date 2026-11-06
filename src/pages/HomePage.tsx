import React, { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  Sparkles,
  ThumbsUp,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Clock,
  Sparkle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_CATEGORIES } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { products, navigateTo, language, setSelectedCategoryFilter } = useShop();

  // Flash sale countdown timer simulation (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by sections
  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const popularProducts = products.filter((p) => p.isPopular);
  const newArrivals = products.filter((p) => p.isNewArrival || p.stock > 100);
  const recommendedProducts = products.filter((p) => p.isRecommended);

  const formatTimerDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="space-y-6 pb-20">
      {/* 1. TRUST BADGE PILL (Matches exact user mobile screenshot) */}
      <div className="max-w-xl sm:max-w-2xl mx-auto flex items-center justify-between sm:justify-center gap-2 sm:gap-6 px-3.5 sm:px-5 py-2 bg-white rounded-full border border-emerald-500/30 shadow-2xs text-[11px] sm:text-xs font-bold text-gray-800">
        <span className="flex items-center gap-1.5 text-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <ShieldCheck className="w-3.5 h-3.5 text-[#007A3D] shrink-0" />
          <span>নির্ভরযোগ্য পণ্য</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5 text-emerald-900">
          <span className="shrink-0 text-sm leading-none">🛒</span>
          <span>সাশ্রয়ী দাম</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5 text-emerald-900">
          <Truck className="w-3.5 h-3.5 text-[#007A3D] shrink-0" />
          <span>দ্রুত ডেলিভারি</span>
        </span>
      </div>

      {/* 2. COMPACT & FULLY VISIBLE HOMEPAGE BANNER WITH MULTICOLOR SLOGAN */}
      <section className="max-w-xl sm:max-w-2xl mx-auto w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/25 shadow-xs bg-white">
        {/* Banner Image: 100% fully visible (no cropping) at a neat, compact size */}
        <div
          className="relative w-full cursor-pointer bg-emerald-50/20 flex items-center justify-center p-1 sm:p-2"
          onClick={() => navigateTo('categories')}
          title="হাট বাজার - পণ্য দেখুন"
        >
          <img
            src="/assets/haat_bazar_banner.png"
            alt="হাট বাজার ডট কম - Haat Bazar.com"
            className="w-full max-h-48 sm:max-h-60 md:max-h-64 object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/aistudio/Bangladeshi_Marketplace_Grocery_Banner_af4d101b.png';
            }}
          />
        </div>

        {/* Text Area: Exact Multicolor Slogan + Action Buttons Directly Underneath */}
        <div className="bg-gradient-to-b from-white to-emerald-50/50 border-t border-emerald-100/80 px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col items-center justify-center text-center gap-2">
          {/* Exact Multicolor Gradient Slogan as requested */}
          <h2 className="font-black text-xs sm:text-sm md:text-base tracking-tight leading-snug">
            <span className="bg-gradient-to-r from-[#007A3D] via-teal-600 to-amber-600 bg-clip-text text-transparent">
              &ldquo;দেশীয় পণ্য গ্রহণ করুন,
            </span>{' '}
            <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-[#007A3D] bg-clip-text text-transparent">
              নিজের স্বাস্থ্য ও পরিবারকে সুস্থ রাখুন।&rdquo;
            </span>
          </h2>

          {/* Buttons directly under the slogan: পণ্য কেনা এবং ট্র্যাকিং */}
          <div className="flex items-center justify-center gap-2.5">
            <button
              onClick={() => navigateTo('categories')}
              className="px-4 py-1.5 bg-[#007A3D] hover:bg-[#006030] text-white font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>পণ্য কেনা</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateTo('order-tracking')}
              className="px-4 py-1.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl text-xs border border-gray-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span>ট্র্যাকিং</span>
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES GRID (Matches screenshot: 3 columns x 3 rows with watermark background) */}
      <section className="relative space-y-3 p-1">
        {/* Subtle Watermark Logo Background from Screenshot */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url('/assets/haat_bazar_logo_solid.png')` }}
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {language === 'bn' ? 'Explore Categories' : 'Explore Categories'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              {language === 'bn' ? 'Shop by essential daily grocery departments' : 'Shop by essential daily grocery departments'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryFilter(cat.name);
                navigateTo('categories', { category: cat.name });
              }}
              className="bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200/80 hover:border-[#007A3D] hover:shadow-sm transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-50 mb-2 p-0.5 border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              <span className="font-medium text-[11px] sm:text-xs text-gray-800 group-hover:text-[#007A3D] transition-colors leading-tight line-clamp-2">
                {language === 'bn' ? cat.name : cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED GROCERIES (Matches exact section from approved screenshot) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {language === 'bn' ? 'Featured Groceries' : 'Featured Groceries'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              {language === 'bn'
                ? 'Top-rated items handpicked for quality and freshness'
                : 'Top-rated items handpicked for quality and freshness'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real Fresh Groceries Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FLASH SALE WITH COUNTDOWN TIMER */}
      <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 rounded-3xl p-4 sm:p-6 border border-amber-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  {language === 'bn' ? 'ফ্ল্যাশ সেল (সীমিত সময়)' : 'Flash Sale'}
                </h2>
                <span className="bg-[#e11d48] text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {language === 'bn' ? 'আজকের সেরা মূল্যে বিশেষ ছাড়' : 'Top discounts available for limited hours'}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-gray-700 mr-1">
              {language === 'bn' ? 'শেষ হতে বাকি:' : 'Ends in:'}
            </span>
            <span className="bg-gray-900 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded">
              {formatTimerDigits(timeLeft.hours)}
            </span>
            <span className="font-bold text-gray-700">:</span>
            <span className="bg-gray-900 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded">
              {formatTimerDigits(timeLeft.minutes)}
            </span>
            <span className="font-bold text-gray-700">:</span>
            <span className="bg-rose-600 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded">
              {formatTimerDigits(timeLeft.seconds)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {flashSaleProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {language === 'bn' ? 'জনপ্রিয় পণ্য সমূহ' : 'Popular Products'}
              </h2>
              <p className="text-xs text-gray-500">গ্রাহকদের সবচেয়ে পছন্দের পণ্য তালিকা</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('search', { sort: 'popular' })}
            className="text-xs font-bold text-[#007A3D] hover:underline flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'সব দেখুন' : 'See more'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {popularProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {language === 'bn' ? 'নতুন সংগৃহীত পণ্য' : 'New Arrivals'}
              </h2>
              <p className="text-xs text-gray-500">সদ্য খামার ও চাষীদের থেকে আসা টাটকা আইটেম</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('search', { sort: 'newest' })}
            className="text-xs font-bold text-[#007A3D] hover:underline flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'সব দেখুন' : 'See more'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {language === 'bn' ? 'সুপারিশকৃত পণ্য' : 'Recommended Products'}
              </h2>
              <p className="text-xs text-gray-500">আপনার স্বাস্থ্য ও পরিবারের জন্য বিশেষজ্ঞদের বাছাই</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-[#007A3D] hover:underline flex items-center gap-1"
          >
            <span>{language === 'bn' ? 'সব দেখুন' : 'See more'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {recommendedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
