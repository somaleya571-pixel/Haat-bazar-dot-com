import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Zap,
  Star,
  Calendar,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateEffectivePrice, formatCurrency, isProductExpired, getDaysUntilExpiry } from '../utils/pricing';

export const ProductDetailsPage: React.FC = () => {
  const {
    products,
    pageParams,
    navigateTo,
    language,
    addToCart,
    isInWishlist,
    toggleWishlist,
    reviews,
    showToast,
  } = useShop();

  const [quantity, setQuantity] = useState<number>(1);

  // Get current product
  const productId = pageParams.productId || products[0]?.id || 'hb-prod-1';
  const product = products.find((p) => p.id === productId) || products[0];

  if (!product) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-gray-500">পণ্যটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-[#007A3D] text-white rounded-xl text-xs font-bold"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  const priceCalc = calculateEffectivePrice(
    product.regularPrice,
    product.discountPercentage,
    product.discountStartDate,
    product.discountEndDate
  );

  const isExpired = isProductExpired(product.expiryDate);
  const daysLeft = getDaysUntilExpiry(product.expiryDate);
  const inWishlist = isInWishlist(product.id);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'bn' ? 'পণ্যের লিংক কপি করা হয়েছে' : 'Product link copied');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#007A3D]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 bg-white"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-full border border-gray-200 bg-white transition-colors ${
              inWishlist ? 'text-rose-600 border-rose-200 bg-rose-50' : 'text-gray-500 hover:text-rose-500'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs">
        {/* Left: Product Images with watermark */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center relative overflow-hidden group">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {priceCalc.isDiscountActive && priceCalc.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-[#e11d48] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                -{priceCalc.discountPercentage}% {language === 'bn' ? 'ছাড়' : 'OFF'}
              </span>
            )}
            {/* Subtle logo behind image */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <img src="/assets/haat_bazar_official_logo.png" alt="" className="w-2/3" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-16 h-16 rounded-xl border-2 border-[#007A3D] p-1 bg-gray-50 flex items-center justify-center">
              <img src={product.image} alt="" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {language === 'bn' ? product.categoryBn : product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold">
                {product.stock > 0 && !isExpired ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? `স্টক আছে (${product.stock} টি)` : `In Stock (${product.stock})`}</span>
                  </span>
                ) : (
                  <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md font-bold">
                    {language === 'bn' ? 'স্টক শেষ (Out of Stock)' : 'Out of Stock'}
                  </span>
                )}
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {language === 'bn' ? product.nameBn : product.name}
            </h1>
            <p className="text-xs text-gray-500 font-medium">{product.name} • {product.unit}</p>

            {/* Rating & Reviews Bar */}
            <div className="flex items-center gap-3 py-1 border-b border-gray-100">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-900 ml-1.5">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigateTo('reviews', { productId: product.id })}
                className="text-xs font-semibold text-[#007A3D] hover:underline"
              >
                {product.reviewCount} {language === 'bn' ? 'টি কাস্টমার রিভিউ' : 'Customer Reviews'}
              </button>
            </div>

            {/* Price Box */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#007A3D]">
                  {formatCurrency(priceCalc.effectivePrice, language)}
                </span>
                {priceCalc.isDiscountActive && (
                  <span className="text-sm sm:text-base text-gray-400 line-through font-semibold">
                    {formatCurrency(priceCalc.regularPrice, language)}
                  </span>
                )}
                {priceCalc.isDiscountActive && (
                  <span className="text-xs font-bold text-[#e11d48] bg-rose-100 px-2 py-0.5 rounded">
                    {priceCalc.discountPercentage}% ছাড়
                  </span>
                )}
              </div>

              {priceCalc.savings > 0 && (
                <p className="text-xs text-emerald-700 font-bold">
                  {language === 'bn'
                    ? `আপনি সাশ্রয় করছেন: ${formatCurrency(priceCalc.savings, language)}`
                    : `You save: ${formatCurrency(priceCalc.savings, language)}`}
                </p>
              )}
            </div>

            {/* Expiry Date Alert */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong>{language === 'bn' ? 'মেয়াদ উত্তীর্ণের তারিখ:' : 'Expiry Date:'}</strong>{' '}
                {new Date(product.expiryDate).toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {daysLeft <= 30 && !isExpired && (
                  <span className="text-amber-600 font-bold ml-1.5">
                    (আর মাত্র {daysLeft} দিন বাকি)
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">
                {language === 'bn' ? 'পরিমাণ নির্বাচন:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-l-xl transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-r-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {language === 'bn' ? `মোট: ${formatCurrency(priceCalc.effectivePrice * quantity, language)}` : `Subtotal: ${formatCurrency(priceCalc.effectivePrice * quantity, language)}`}
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0 || isExpired}
              className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-[#007A3D] text-[#007A3D] hover:bg-emerald-50 transition-all ${
                product.stock <= 0 || isExpired ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0 || isExpired}
              className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-[#007A3D] hover:bg-[#006030] text-white shadow-md hover:shadow-lg transition-all ${
                product.stock <= 0 || isExpired ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'bn' ? 'এখনই কিনুন (Buy Now)' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">
            {language === 'bn' ? 'পণ্যের বিবরণ ও বৈশিষ্ট্য' : 'Description & Specifications'}
          </h2>
          <div className="pt-4 text-sm text-gray-700 leading-relaxed space-y-2">
            <p>{product.descriptionBn}</p>
            <p className="text-gray-500 text-xs italic">{product.description}</p>
          </div>
        </div>

        {/* Specifications Table */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {language === 'bn' ? 'প্রোডাক্ট স্পেসিফিকেশন' : 'Technical Specifications'}
          </h3>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden text-xs">
            {Object.entries(product.specifications).map(([key, val], idx) => (
              <div
                key={key}
                className={`grid grid-cols-3 p-3 ${idx % 2 === 0 ? 'bg-gray-50/60' : 'bg-white'}`}
              >
                <span className="font-bold text-gray-700 col-span-1">{key}</span>
                <span className="text-gray-600 col-span-2">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Snapshot */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">
              {language === 'bn' ? 'গ্রাহকদের মতামত ও রেটিং' : 'Customer Feedback'}
            </h3>
            <button
              onClick={() => navigateTo('reviews', { productId: product.id })}
              className="text-xs font-bold text-[#007A3D] hover:underline"
            >
              রিভিউ লিখুন বা দেখুন →
            </button>
          </div>

          <div className="space-y-3">
            {productReviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{rev.customerName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        ✓ যাচাইকৃত ক্রেতা
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400">{rev.date}</span>
                </div>
                <div className="flex items-center text-amber-400 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
