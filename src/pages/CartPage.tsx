import React from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { calculateEffectivePrice, formatCurrency } from '../utils/pricing';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotals,
    navigateTo,
    language,
    customer,
  } = useShop();

  const isFreeDelivery = cartTotals.qualifiesForFreeDelivery;
  const remainingForFree = Math.max(0, cartTotals.freeDeliveryThreshold - cartTotals.subtotal);

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
              {language === 'bn' ? 'শপিং কার্ট (Shopping Cart)' : 'Shopping Cart'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? `কার্টে মোট ${cart.length} টি অনন্য পণ্য রয়েছে`
                : `Total ${cart.length} unique items in cart`}
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সম্পূর্ণ কার্ট খালি করুন' : 'Clear Entire Cart'}</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#007A3D] mx-auto flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-base">আপনার শপিং কার্ট খালি</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              খাঁটি ও প্রাকৃতিক দেশীয় পণ্য দেখতে এখনই আমাদের শপ ভিজিট করুন।
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="px-6 py-2.5 bg-[#007A3D] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#006030] transition-colors inline-flex items-center gap-2"
          >
            <span>পণ্য ব্রাউজ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {/* Free Delivery Bar */}
            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isFreeDelivery
                      ? 'অভিনন্দন! আপনি পাচ্ছেন ফ্রি হোম ডেলিভারি!'
                      : `আর মাত্র ৳${remainingForFree} টাকার পণ্য যোগ করলেই ফ্রি ডেলিভারি!`}
                  </span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">
                  {Math.min(100, Math.round((cartTotals.subtotal / cartTotals.freeDeliveryThreshold) * 100))}%
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#007A3D] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (cartTotals.subtotal / cartTotals.freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              {cart.map((item) => {
                const priceCalc = calculateEffectivePrice(
                  item.product.regularPrice,
                  item.product.discountPercentage,
                  item.product.discountStartDate,
                  item.product.discountEndDate
                );
                const itemTotal = priceCalc.effectivePrice * item.quantity;

                return (
                  <div key={item.productId} className="p-4 flex gap-3 sm:gap-4 items-center">
                    {/* Item Image */}
                    <div
                      onClick={() =>
                        navigateTo('product-details', { productId: item.productId })
                      }
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 p-2 shrink-0 cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() =>
                          navigateTo('product-details', { productId: item.productId })
                        }
                        className="font-bold text-sm text-gray-900 truncate hover:text-[#007A3D] cursor-pointer"
                      >
                        {language === 'bn' ? item.product.nameBn : item.product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{item.product.unit}</p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs text-gray-500">একক মূল্য:</span>
                        <span className="font-bold text-xs text-[#007A3D]">
                          {formatCurrency(priceCalc.effectivePrice, language)}
                        </span>
                        {priceCalc.isDiscountActive && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {formatCurrency(priceCalc.regularPrice, language)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 sm:p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-lg transition-colors"
                          title="কমান"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 sm:w-8 text-center font-bold text-xs font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="p-1 sm:p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-lg transition-colors"
                          title="বাড়ান"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-gray-900">
                          {formatCurrency(itemTotal, language)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                          title="পণ্যটি অপসারণ করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary & Checkout */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
              <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
                {language === 'bn' ? 'অর্ডার সারাংশ (Order Summary)' : 'Order Summary'}
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(cartTotals.subtotal, language)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="text-[10px] text-gray-400">
                      ({customer.district || 'ঢাকা'})
                    </span>
                  </div>
                  <span
                    className={`font-bold ${
                      cartTotals.deliveryCharge === 0 ? 'text-emerald-600' : 'text-gray-900'
                    }`}
                  >
                    {cartTotals.deliveryCharge === 0
                      ? language === 'bn'
                        ? 'ফ্রি (FREE)'
                        : 'FREE'
                      : formatCurrency(cartTotals.deliveryCharge, language)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-gray-900">সর্বমোট (Total):</span>
                  <span className="text-xl font-black text-[#007A3D]">
                    {formatCurrency(cartTotals.total, language)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-3.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'bn' ? 'চেকআউটে এগিয়ে যান' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[11px] text-gray-500 space-y-1">
                <p>✓ কোনো বাধ্যতামূলক অ্যাকাউন্ট তৈরি ছাড়াই সরাসরি অর্ডার করুন</p>
                <p>✓ ক্যাশ অন ডেলিভারি ও বিকাশ পেমেন্ট সুবিধা</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>হাট বাজার গ্যারান্টি:</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  পণ্য গ্রহণ করার পর কোনো সমস্যা পেলে ৭ দিনের ভেতর সম্পূর্ণ রিফান্ড ও রিটার্ন পলিসি প্রযোজ্য।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
