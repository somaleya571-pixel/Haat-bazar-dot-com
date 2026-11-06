import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Package,
  CreditCard,
  Truck,
  Tag,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigateTo, language } =
    useShop();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'offer':
        return <Tag className="w-4 h-4 text-rose-600" />;
      case 'announcement':
        return <Radio className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
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
              {language === 'bn' ? 'বিজ্ঞপ্তি ও আপডেট (Notifications)' : 'Notifications'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? 'অর্ডার, ডেলিভারি স্ট্যাটাস ও বিশেষ মূল্যছাড়ের সর্বশেষ খবর'
                : 'Order alerts, payment confirmations, and special offers'}
            </p>
          </div>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-[#007A3D] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>সব পড়া চিহ্নিত করুন</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'সকল' },
          { id: 'order', label: 'অর্ডার' },
          { id: 'delivery', label: 'ডেলিভারি' },
          { id: 'offer', label: 'অফার ও ডিসকাউন্ট' },
          { id: 'announcement', label: 'ঘোষণা' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeFilter === tab.id
                ? 'bg-[#007A3D] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">কোনো নতুন বিজ্ঞপ্তি নেই</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            আপনার সকল আপডেট এখানে প্রদর্শিত হবে।
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkPage) navigateTo(n.linkPage);
              }}
              className={`p-4 flex gap-3.5 items-start cursor-pointer transition-colors ${
                n.isRead ? 'bg-white hover:bg-gray-50' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              <div className="p-2 rounded-xl bg-gray-100 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-gray-900 truncate">{n.title}</h4>
                  <span className="text-[11px] text-gray-400 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                {n.linkPage && (
                  <span className="text-[11px] text-[#007A3D] font-bold inline-flex items-center gap-1 mt-1.5 hover:underline">
                    <span>বিস্তারিত দেখুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#007A3D] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
