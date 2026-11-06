import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  ShoppingBag,
  Clock,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/pricing';

export const OrderConfirmationPage: React.FC = () => {
  const { orders, pageParams, navigateTo, language } = useShop();

  const orderId = pageParams.orderId || orders[0]?.id;
  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-gray-500">কোনো অর্ডার পাওয়া যায়নি।</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-[#007A3D] text-white rounded-xl text-xs font-bold"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#007A3D] mx-auto flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {order.paymentStatus === 'Cash on Delivery'
              ? 'ক্যাশ অন ডেলিভারি অর্ডার গৃহীত হয়েছে'
              : 'অর্ডার গৃহীত হয়েছে (পেমেন্ট ভেরিফিকেশন সাপেক্ষ)'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            ধন্যবাদ! আপনার অর্ডার সফলভাবে নিশ্চিত হয়েছে
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            আপনার অর্ডার ট্র্যাকিং আইডি:{' '}
            <strong className="text-[#007A3D] font-mono text-sm">{order.id}</strong>
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('order-tracking', { orderId: order.id })}
            className="px-5 py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>অর্ডার ট্র্যাক করুন (Track Order)</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>আরও কেনাকাটা করুন</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            title="ইনভয়েস প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / রসিদ</span>
          </button>
        </div>
      </div>

      {/* Structured Details Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Information */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs space-y-3">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>গ্রাহকের তথ্য (Customer Details)</span>
          </h3>

          <div className="space-y-1.5 text-xs text-gray-700">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">নাম:</span>
              <span className="font-bold text-gray-900">{order.customer.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">মোবাইল:</span>
              <span className="font-bold text-gray-900 font-mono">{order.customer.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">জিমেইল:</span>
              <span className="font-semibold text-gray-900">{order.customer.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">অর্ডারের তারিখ:</span>
              <span className="font-medium text-gray-800">{order.date}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs space-y-3">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>ডেলিভারি ঠিকানা (Shipping Address)</span>
          </h3>

          <div className="space-y-1 text-xs text-gray-700">
            <p className="font-bold text-gray-900">{order.customer.addressDetails}</p>
            <p>
              গ্রাম/মহল্লা: <strong className="text-gray-800">{order.customer.village}</strong>
            </p>
            <p>
              থানা: <strong className="text-gray-800">{order.customer.thana}</strong>,{' '}
              উপজেলা: <strong className="text-gray-800">{order.customer.upazila}</strong>
            </p>
            <p>
              জেলা: <strong className="text-gray-800">{order.customer.district}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Table & Payment Details */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5">
          অর্ডারকৃত পণ্যের তালিকা ({order.items.length} টি)
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{item.nameBn || item.name}</h4>
                  <p className="text-gray-400 text-[11px]">
                    {item.quantity} x {formatCurrency(item.price, language)}
                  </p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm">
                {formatCurrency(item.price * item.quantity, language)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>উপমোট:</span>
            <span className="font-bold text-gray-900">{formatCurrency(order.subtotal, language)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>ডেলিভারি চার্জ:</span>
            <span className="font-bold text-emerald-600">
              {order.deliveryCharge === 0 ? 'ফ্রি (FREE)' : formatCurrency(order.deliveryCharge, language)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>পেমেন্ট মেথড:</span>
            <span className="font-bold text-gray-800">
              {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>
          {order.trxId && (
            <div className="flex justify-between text-gray-600">
              <span>ট্রানজেকশন আইডি:</span>
              <span className="font-mono font-bold text-[#007A3D]">{order.trxId}</span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
            <span className="font-black text-sm text-gray-900">মোট পরিশোধিত / প্রদেয়:</span>
            <span className="text-xl font-black text-[#007A3D]">
              {formatCurrency(order.totalAmount, language)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
