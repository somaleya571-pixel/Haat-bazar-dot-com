import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export const CategoriesPage: React.FC = () => {
  const { products, pageParams, navigateTo, language } = useShop();

  const [activeCategory, setActiveCategory] = useState<string>(
    pageParams.category || 'all'
  );

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category.toLowerCase() === activeCategory.toLowerCase() ||
            p.categoryBn === activeCategory
        );

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'সকল ক্যাটাগরি (All Categories)' : 'All Product Categories'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? '৯টি সুনির্দিষ্ট ডিপার্টমেন্ট থেকে পণ্য বাছাই করুন' : 'Browse through 9 essential departments'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('search')}
          className="text-xs font-bold text-[#007A3D] bg-emerald-50 px-3 py-1.5 rounded-full border border-[#007A3D]/20 hover:bg-emerald-100 transition-colors"
        >
          {language === 'bn' ? 'ফিল্টার করুন' : 'Advanced Filters'}
        </button>
      </div>

      {/* Category Pills / Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeCategory === 'all'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
          }`}
        >
          {language === 'bn' ? 'সব পণ্য (All)' : 'All Products'} ({products.length})
        </button>

        {INITIAL_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.name;
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-[#007A3D] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#007A3D]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Cards Overview */}
      {activeCategory === 'all' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {INITIAL_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#007A3D] hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#007A3D] transition-colors truncate">
                    {language === 'bn' ? cat.nameBn : cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">{cat.name}</p>
                  <span className="text-[11px] text-emerald-600 font-semibold inline-block mt-0.5">
                    {count} {language === 'bn' ? 'টি আইটেম' : 'items'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products under Selected Category */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {activeCategory === 'all'
                ? language === 'bn'
                  ? 'উপলব্ধ সকল পণ্য'
                  : 'Available Products'
                : language === 'bn'
                ? `${activeCategory} বিভাগের পণ্য`
                : `Products in ${activeCategory}`}
            </h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#007A3D] mx-auto flex items-center justify-center text-xl">
              📦
            </div>
            <h3 className="font-bold text-gray-800 text-base">এই ক্যাটাগরিতে কোনো পণ্য নেই</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              নতুন স্টক খুব শীঘ্রই যুক্ত করা হবে। অন্য কোনো বিভাগ দেখুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
