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
  const { products, navigateTo, language, setSelectedCategoryFilter, websiteSettings } = useShop();

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
      {/* PRODUCT CATEGORIES GRID (Matches screenshot: 3 columns x 3 rows with watermark background) */}
      <section className="relative space-y-3 p-1">
        {/* Subtle Watermark Logo Background from Screenshot */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url('/assets/haat_bazar_official_logo.png')` }}
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
