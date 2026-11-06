import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Star,
  Check,
  Tag,
  DollarSign,
  Package,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { calculateEffectivePrice } from '../utils/pricing';

export const SearchResultsPage: React.FC = () => {
  const { products, searchQuery, setSearchQuery, pageParams, language } = useShop();

  const [term, setTerm] = useState<string>(pageParams.query || searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(pageParams.category || 'all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Filtered & Sorted products
  const results = useMemo(() => {
    return products
      .filter((product) => {
        // Name & Description filter
        if (term.trim()) {
          const lowerTerm = term.toLowerCase();
          const matchName = product.name.toLowerCase().includes(lowerTerm);
          const matchBn = product.nameBn.includes(term);
          const matchDesc = product.description.toLowerCase().includes(lowerTerm);
          if (!matchName && !matchBn && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (
            product.category.toLowerCase() !== selectedCategory.toLowerCase() &&
            product.categoryBn !== selectedCategory
          ) {
            return false;
          }
        }

        // Price filter
        const priceCalc = calculateEffectivePrice(
          product.regularPrice,
          product.discountPercentage,
          product.discountStartDate,
          product.discountEndDate
        );
        if (priceCalc.effectivePrice > maxPrice) return false;

        // Rating filter
        if (minRating > 0 && product.rating < minRating) return false;

        // Discount filter
        if (onlyDiscounted && (!priceCalc.isDiscountActive || priceCalc.discountPercentage <= 0)) {
          return false;
        }

        // Stock availability filter
        if (inStockOnly && product.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = calculateEffectivePrice(a.regularPrice, a.discountPercentage).effectivePrice;
        const priceB = calculateEffectivePrice(b.regularPrice, b.discountPercentage).effectivePrice;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
        return 0; // featured
      });
  }, [products, term, selectedCategory, maxPrice, minRating, onlyDiscounted, inStockOnly, sortBy]);

  const resetFilters = () => {
    setTerm('');
    setSearchQuery('');
    setSelectedCategory('all');
    setMinRating(0);
    setOnlyDiscounted(false);
    setInStockOnly(false);
    setMaxPrice(2000);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            {language === 'bn' ? 'সার্চ ও অ্যাডভান্সড ফিল্টার' : 'Search & Filter Products'}
          </h1>
          <p className="text-xs text-gray-500">
            {language === 'bn'
              ? 'নাম, মূল্য, ক্যাটাগরি এবং রেটিং অনুসারে পণ্য খুঁজুন'
              : 'Find products by exact specifications, prices, discounts, and ratings'}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder={
              language === 'bn'
                ? 'পণ্যের নাম লিখুন (যেমন: মধু, তেল, চাল, ঘি, ডাল...)'
                : 'Search products by name, ingredients, or brand...'
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#007A3D] focus:ring-2 focus:ring-[#007A3D]/20 text-sm outline-hidden bg-gray-50/50"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-[#007A3D]"
            >
              <option value="all">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              {INITIAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {language === 'bn' ? cat.nameBn : cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1">
              <span>{language === 'bn' ? 'সর্বোচ্চ মূল্য:' : 'Max Price:'}</span>
              <span className="text-[#007A3D] font-bold">৳{maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#007A3D] cursor-pointer"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'bn' ? 'ন্যূনতম রেটিং' : 'Minimum Rating'}
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-[#007A3D]"
            >
              <option value="0">{language === 'bn' ? 'সকল রেটিং' : 'Any Rating'}</option>
              <option value="4.5">★ 4.5 এবং তার উপরে</option>
              <option value="4.0">★ 4.0 এবং তার উপরে</option>
              <option value="3.5">★ 3.5 এবং তার উপরে</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {language === 'bn' ? 'সাজানোর ক্রম' : 'Sort By'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-[#007A3D]"
            >
              <option value="featured">{language === 'bn' ? 'বিশেষ পছন্দ (Featured)' : 'Featured'}</option>
              <option value="price-low">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price-high">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
              <option value="discount">{language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Biggest Discount'}</option>
            </select>
          </div>
        </div>

        {/* Toggles & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="w-4 h-4 text-[#007A3D] rounded border-gray-300 focus:ring-emerald-500"
              />
              <span>{language === 'bn' ? 'কেবলমাত্র ছাড়যুক্ত পণ্য' : 'Discounted Only'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#007A3D] rounded border-gray-300 focus:ring-emerald-500"
              />
              <span>{language === 'bn' ? 'স্টকে আছে এমন' : 'In Stock Only'}</span>
            </label>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}</span>
          </button>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {language === 'bn' ? 'পাওয়া গেছে:' : 'Found:'}{' '}
            <strong className="text-gray-900 font-bold">{results.length}</strong>{' '}
            {language === 'bn' ? 'টি পণ্য' : 'products'}
          </span>
          {term && (
            <span className="italic">
              &ldquo;{term}&rdquo; {language === 'bn' ? 'এর ফলাফল' : 'results'}
            </span>
          )}
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-xl">
              🔍
            </div>
            <h3 className="font-bold text-gray-800 text-base">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              আপনার ফিল্টার পরিবর্তন করুন অথবা ভিন্ন কোনো কী-ওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#007A3D] text-white rounded-xl text-xs font-bold"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
