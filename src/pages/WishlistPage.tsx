import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateEffectivePrice, formatCurrency } from '../utils/pricing';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    moveToCartFromWishlist,
    navigateTo,
    language,
  } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'আমার পছন্দের তালিকা (Wishlist)' : 'My Wishlist'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? `সংরক্ষিত প্রিয় পণ্য (${wishlistProducts.length} টি)`
                : `Saved favorite items (${wishlistProducts.length} items)`}
            </p>
          </div>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            onClick={() => {
              wishlistProducts.forEach((p) => moveToCartFromWishlist(p.id));
            }}
            className="text-xs font-bold text-white bg-[#007A3D] px-3.5 py-2 rounded-xl hover:bg-[#006030] shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সব কার্টে নিন' : 'Move All to Cart'}</span>
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-base">আপনার পছন্দের তালিকা বর্তমানে খালি</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              পণ্য ব্রাউজ করার সময় পছন্দের পণ্যের হার্ট আইকনে ক্লিক করে তালিকায় সংরক্ষণ করতে পারেন।
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="px-5 py-2.5 bg-[#007A3D] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#006030] transition-colors inline-flex items-center gap-2"
          >
            <span>পণ্য ব্রাউজ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((product) => {
            const priceCalc = calculateEffectivePrice(
              product.regularPrice,
              product.discountPercentage
            );
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 items-center justify-between shadow-xs hover:border-[#007A3D] transition-colors"
              >
                <div
                  onClick={() => navigateTo('product-details', { productId: product.id })}
                  className="w-20 h-20 rounded-xl bg-gray-50 p-2 border border-gray-100 shrink-0 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {language === 'bn' ? product.categoryBn : product.category}
                  </span>
                  <h3
                    onClick={() => navigateTo('product-details', { productId: product.id })}
                    className="font-bold text-sm text-gray-900 truncate hover:text-[#007A3D] cursor-pointer mt-1"
                  >
                    {language === 'bn' ? product.nameBn : product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-black text-sm text-[#007A3D]">
                      {formatCurrency(priceCalc.effectivePrice, language)}
                    </span>
                    {priceCalc.isDiscountActive && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatCurrency(priceCalc.regularPrice, language)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">{product.unit}</p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => moveToCartFromWishlist(product.id)}
                    className="p-2 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl shadow-xs transition-colors"
                    title="কার্টে যোগ করুন"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-xl transition-colors"
                    title="তালিকা থেকে মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
