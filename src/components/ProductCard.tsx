import React from 'react';
import { Heart, ShoppingCart, Star, Calendar, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { calculateEffectivePrice, formatCurrency, isProductExpired, getDaysUntilExpiry } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, language, addToCart, isInWishlist, toggleWishlist } = useShop();

  const priceInfo = calculateEffectivePrice(
    product.regularPrice,
    product.discountPercentage,
    product.discountStartDate,
    product.discountEndDate
  );

  const isExpired = isProductExpired(product.expiryDate);
  const daysLeft = getDaysUntilExpiry(product.expiryDate);
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    navigateTo('product-details', { productId: product.id });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/90 hover:border-[#007A3D]/50 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Discount Badge */}
      {priceInfo.isDiscountActive && priceInfo.discountPercentage > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-[#e11d48] text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
          -{priceInfo.discountPercentage}% {language === 'bn' ? 'ছাড়' : 'OFF'}
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
          inWishlist
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image Container */}
      <div
        onClick={handleCardClick}
        className="w-full aspect-square bg-gray-50/70 p-3 flex items-center justify-center cursor-pointer overflow-hidden relative"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Subtle watermark logo behind product images */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
          <img
            src="/assets/haat_bazar_logo_solid.png"
            alt=""
            className="w-3/4 object-contain"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
            {language === 'bn' ? product.categoryBn : product.category}
          </span>

          {/* Product Name */}
          <h3
            onClick={handleCardClick}
            className="font-bold text-gray-900 text-sm line-clamp-2 cursor-pointer hover:text-[#007A3D] transition-colors leading-snug"
            title={language === 'bn' ? product.nameBn : product.name}
          >
            {language === 'bn' ? product.nameBn : product.name}
          </h3>

          {/* Unit / Weight */}
          <p className="text-[11px] text-gray-500 mt-0.5">{product.unit}</p>

          {/* Expiry Date Display */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1.5">
            <Calendar className="w-3 h-3 text-emerald-600" />
            <span>
              {language === 'bn' ? 'মেয়াদ:' : 'Exp:'}{' '}
              {new Date(product.expiryDate).toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {daysLeft <= 30 && !isExpired && (
              <span className="text-amber-600 font-bold ml-1">
                ({daysLeft} {language === 'bn' ? 'দিন বাকি' : 'days left'})
              </span>
            )}
            {isExpired && (
              <span className="text-red-600 font-bold ml-1">
                ({language === 'bn' ? 'মেয়াদোত্তীর্ণ' : 'Expired'})
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-800 ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
            <span className="text-emerald-600 text-[10px] flex items-center gap-0.5 ml-auto">
              <CheckCircle className="w-3 h-3" />
              <span>{language === 'bn' ? 'খাঁটি' : 'Pure'}</span>
            </span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#007A3D]">
                {formatCurrency(priceInfo.effectivePrice, language)}
              </span>
              {priceInfo.isDiscountActive && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(priceInfo.regularPrice, language)}
                </span>
              )}
            </div>
            {priceInfo.savings > 0 && (
              <span className="text-[10px] text-emerald-600 font-bold">
                {language === 'bn'
                  ? `সাশ্রয় ${formatCurrency(priceInfo.savings, language)}`
                  : `Save ${formatCurrency(priceInfo.savings, language)}`}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0 || isExpired}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              product.stock <= 0 || isExpired
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#007A3D] hover:bg-[#006030] text-white hover:scale-102 active:scale-95'
            }`}
            title="কার্টে যুক্ত করুন"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'bn' ? 'কার্টে নিন' : 'Add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
