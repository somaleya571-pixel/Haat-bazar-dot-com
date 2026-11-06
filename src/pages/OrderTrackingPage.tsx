import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MapPin,
  Package,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ORDER_TRACKING_STAGES, ORDER_TRACKING_STAGES_BN } from '../utils/order';
import { formatCurrency } from '../utils/pricing';

export const OrderTrackingPage: React.FC = () => {
  const { orders, pageParams, navigateTo, language } = useShop();

  const [searchId, setSearchId] = useState<string>(pageParams.orderId || orders[0]?.id || '');
  const activeOrder = orders.find((o) => o.id === searchId) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getStageIndex = (stage: string) => {
    return ORDER_TRACKING_STAGES.indexOf(stage as any);
  };

  const currentStageIdx = activeOrder
    ? getStageIndex(activeOrder.status)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('my-orders')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'অর্ডার ট্র্যাকিং (Page 11: Order Tracking)' : 'Order Tracking'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? '৬-ধাপে লাইভ ডেলিভারি অগ্রগতি পর্যবেক্ষণ করুন'
                : 'Live 6-stage order fulfillment & courier tracking'}
            </p>
          </div>
        </div>

        <a
          href="tel:+8801700123456"
          className="text-xs font-bold text-white bg-[#007A3D] px-3.5 py-2 rounded-xl hover:bg-[#006030] shadow-xs transition-colors flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">রাইডার সহায়তা</span>
        </a>
      </div>

      {/* Search Order Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="অর্ডার ট্র্যাকিং আইডি লিখুন (যেমন: HB-2026-92841)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:border-[#007A3D] outline-hidden font-mono"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-xs font-bold transition-colors"
        >
          ট্র্যাক
        </button>
      </form>

      {!activeOrder ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <p className="text-sm text-gray-500">উক্ত আইডি দিয়ে কোনো অর্ডার খুঁজে পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Snapshot Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                  লাইভ স্ট্যাটাস
                </span>
                <h2 className="text-lg font-black text-gray-900 mt-1">
                  {(ORDER_TRACKING_STAGES_BN as Record<string, string>)[activeOrder.status] || activeOrder.status}
                </h2>
                <p className="text-xs text-gray-500">
                  অর্ডার আইডি: <strong className="font-mono text-[#007A3D]">{activeOrder.id}</strong> •{' '}
                  তারিখ: {activeOrder.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400">সর্বমোট প্রদেয়</span>
                <p className="text-base font-black text-gray-900">
                  {formatCurrency(activeOrder.totalAmount, language)}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
                </span>
              </div>
            </div>

            {/* 6-Stage Visual Timeline (Exactly matches requested sequence) */}
            <div className="pt-2">
              <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-6">
                ডেলিভারি পর্যায়ক্রম (৬ ধাপ)
              </h3>

              <div className="relative pl-6 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {ORDER_TRACKING_STAGES.map((stage, idx) => {
                  const stageStep = activeOrder.trackingHistory.find((s) => s.stage === stage);
                  const isDone = stageStep ? stageStep.completed : idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stage} className="relative flex items-start gap-4 group">
                      {/* Timeline Dot / Check Icon */}
                      <div
                        className={`absolute -left-[23px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#007A3D] text-white ring-4 ring-emerald-50 shadow-xs'
                            : isCurrent
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              isDone || isCurrent ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {ORDER_TRACKING_STAGES_BN[stage]} ({stage})
                          </h4>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {stageStep?.timestamp || (isDone ? 'সম্পন্ন' : 'অপেক্ষমান')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {stageStep?.note || (isDone ? 'ধাপটি সফলভাবে সম্পন্ন হয়েছে' : 'পরবর্তী ধাপের জন্য প্রক্রিয়াধীন')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Address & Customer Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
              <span className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>ডেলিভারি গন্তব্য</span>
              </span>
              <p className="font-bold text-gray-900">{activeOrder.customer.addressDetails}</p>
              <p className="text-gray-600">
                গ্রাম: {activeOrder.customer.village}, থানা: {activeOrder.customer.thana}
              </p>
              <p className="text-gray-600">
                উপজেলা: {activeOrder.customer.upazila}, জেলা: {activeOrder.customer.district}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
              <span className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>অর্ডারকৃত পণ্যসমূহ</span>
              </span>
              <div className="space-y-1">
                {activeOrder.items.map((i) => (
                  <div key={i.productId} className="flex justify-between text-gray-700">
                    <span className="truncate pr-2">{i.nameBn || i.name}</span>
                    <span className="font-bold shrink-0">{i.quantity} টি</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
