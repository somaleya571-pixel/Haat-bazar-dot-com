import React, { useState } from 'react';
import {
  Package,
  Truck,
  RotateCcw,
  Star,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  XCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/pricing';
import { Order } from '../types';

export const MyOrdersPage: React.FC = () => {
  const { orders, navigateTo, language, cancelCustomerOrder } = useShop();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('ভুল পণ্য অর্ডার করেছিলাম');
  const [customReason, setCustomReason] = useState<string>('');

  const tabs = [
    { id: 'all', labelBn: 'সকল অর্ডার', labelEn: 'All Orders' },
    { id: 'Pending', labelBn: 'পেন্ডিং', labelEn: 'Pending' },
    { id: 'Processing', labelBn: 'প্রসেসিং', labelEn: 'Processing' },
    { id: 'Shipped', labelBn: 'শিপড', labelEn: 'Shipped' },
    { id: 'Delivered', labelBn: 'ডেলিভার্ড', labelEn: 'Delivered' },
    { id: 'Cancelled', labelBn: 'বাতিলকৃত', labelEn: 'Cancelled' },
  ];

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }
    if (searchId.trim()) {
      return (
        order.id.toLowerCase().includes(searchId.toLowerCase()) ||
        order.customer.phone.includes(searchId)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Processing':
      case 'Order Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
              {language === 'bn' ? 'আমার অর্ডার সমূহ (My Orders)' : 'My Orders'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'আপনার সকল অর্ডারের তালিকা ও অগ্রগতি ট্র্যাক করুন' : 'Track and review all previous purchases'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('order-tracking')}
          className="text-xs font-bold text-[#007A3D] bg-emerald-50 px-3 py-1.5 rounded-full border border-[#007A3D]/20 hover:bg-emerald-100 transition-colors flex items-center gap-1"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>লাইভ ট্র্যাকার (Page 11)</span>
        </button>
      </div>

      {/* Search by Order ID */}
      <div className="relative">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="অর্ডার আইডি (যেমন: HB-2026-...) অথবা ফোন নম্বর দিয়ে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:border-[#007A3D] outline-hidden"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const count =
            tab.id === 'all'
              ? orders.length
              : orders.filter((o) => o.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-[#007A3D] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 text-gray-400 mx-auto flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">কোনো অর্ডার পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            এই ফিল্টারে আপনার কোনো পূর্ববর্তী অর্ডার রেকর্ড নেই।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4 hover:border-[#007A3D]/40 transition-colors"
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#007A3D]">
                    {order.id}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{item.nameBn || item.name}</p>
                        <span className="text-[11px] text-gray-400">
                          {item.quantity} x {formatCurrency(item.price, language)}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">
                      {formatCurrency(item.price * item.quantity, language)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Card Footer & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="text-xs">
                  <span className="text-gray-500">মোট মূল্য: </span>
                  <strong className="text-sm font-black text-gray-900">
                    {formatCurrency(order.totalAmount, language)}
                  </strong>
                  <span className="text-[11px] text-gray-400 ml-2">
                    ({order.paymentMethod})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigateTo('order-tracking', { orderId: order.id })}
                    className="px-3 py-1.5 bg-[#007A3D] hover:bg-[#006030] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>ট্র্যাক করুন</span>
                  </button>

                  <button
                    onClick={() => navigateTo('order-confirmation', { orderId: order.id })}
                    className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>রসিদ</span>
                  </button>

                  {(order.status === 'Pending' || order.status === 'New Order') && (
                    <button
                      onClick={() => {
                        setCancellingOrder(order);
                        setCancelReason('ভুল পণ্য অর্ডার করেছিলাম');
                        setCustomReason('');
                      }}
                      className="px-3 py-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="পেন্ডিং অর্ডার বাতিল করুন"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>অর্ডার বাতিল</span>
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <>
                      <button
                        onClick={() => navigateTo('returns', { orderId: order.id })}
                        className="px-3 py-1.5 border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        title="রিটার্ন আবেদন"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>রিটার্ন</span>
                      </button>

                      <button
                        onClick={() =>
                          navigateTo('reviews', { productId: order.items[0]?.productId })
                        }
                        className="px-3 py-1.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        title="রিভিউ দিন"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>রিভিউ</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Order Cancellation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#141f17] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">অর্ডার বাতিল নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs space-y-1">
              <p className="flex justify-between">
                <span className="text-gray-500">অর্ডার আইডি:</span>
                <span className="font-mono font-bold text-[#007A3D]">{cancellingOrder.id}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">মোট মূল্য:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(cancellingOrder.totalAmount, language)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">পণ্য সংখ্যা:</span>
                <span className="text-gray-800 dark:text-gray-200">{cancellingOrder.items.length} টি আইটেম</span>
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-gray-700 dark:text-gray-300">অর্ডার বাতিলের কারণ নির্বাচন করুন:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden bg-white dark:bg-[#1a271e]"
              >
                <option value="ভুল পণ্য অর্ডার করেছিলাম">ভুল পণ্য অর্ডার করেছিলাম</option>
                <option value="ডেলিভারি ঠিকানা পরিবর্তন করতে হবে">ডেলিভারি ঠিকানা পরিবর্তন করতে হবে</option>
                <option value="পেমেন্ট পদ্ধতিতে পরিবর্তন চাই">পেমেন্ট পদ্ধতিতে পরিবর্তন চাই</option>
                <option value="দেরি হবে মনে হচ্ছে">দেরি হবে মনে হচ্ছে</option>
                <option value="অন্যান্য কারণ">অন্যান্য কারণ</option>
              </select>

              {cancelReason === 'অন্যান্য কারণ' && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="সংক্ষেপে কারণ লিখুন..."
                  className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden mt-1 text-xs"
                />
              )}
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              পেন্ডিং অর্ডার বাতিল করলে আপনার কোনো চার্জ কাটা হবে না। নিশ্চিত করতে নিচের বাটনে চাপ দিন।
            </p>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="w-1/2 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                অর্ডার রাখুন (Back)
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalReason = cancelReason === 'অন্যান্য কারণ' && customReason.trim() ? customReason.trim() : cancelReason;
                  cancelCustomerOrder(cancellingOrder.id, finalReason);
                  setCancellingOrder(null);
                }}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                বাতিল নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
