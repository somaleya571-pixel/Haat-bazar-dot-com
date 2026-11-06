import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  PhoneCall,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FAQ_ITEMS } from '../data/mockData';

export const HelpCenterPage: React.FC = () => {
  const { navigateTo, language } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {language === 'bn' ? 'হেল্প সেন্টার ও সাধারণ প্রশ্নোত্তর (Help Center)' : 'Help Center'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'অর্ডার প্রক্রিয়া, পেমেন্ট, ডেলিভারি ও পলিসি সংক্রান্ত সকল তথ্য' : 'Guides, FAQs, and support resources'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="আপনার জিজ্ঞাসা লিখুন (যেমন: ডেলিভারি চার্জ, বিকাশ পেমেন্ট, ফেরত নিয়ম...)"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 text-xs bg-white focus:border-[#007A3D] outline-hidden shadow-xs"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* 4 Quick Guide Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#007A3D] w-fit">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">কিভাবে অর্ডার করবেন</h4>
          <p className="text-[10px] text-gray-500">সহজ ৩ ধাপে পণ্য নির্বাচন ও অর্ডার</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 w-fit">
            <CreditCard className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">পেমেন্ট পদ্ধতি</h4>
          <p className="text-[10px] text-gray-500">ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 w-fit">
            <Truck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">ডেলিভারি চার্জ</h4>
          <p className="text-[10px] text-gray-500">ঢাকা ৬০৳, ঢাকার বাইরে ১২০৳</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 w-fit">
            <RotateCcw className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">৭ দিনের রিটার্ন</h4>
          <p className="text-[10px] text-gray-500">সহজ পরিবর্তন ও ১০০% রিফান্ড</p>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <FileQuestion className="w-5 h-5 text-[#007A3D]" />
          <h3 className="font-bold text-sm text-gray-900">
            প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (Frequently Asked Questions)
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-gray-800 hover:text-[#007A3D] transition-colors py-1"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2 ${
                      isOpen ? 'rotate-180 text-[#007A3D]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-2 text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Still need help banner */}
      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm text-gray-900">আপনার সমস্যার সমাধান পাননি?</h4>
          <p className="text-xs text-emerald-800">
            আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে সরাসরি কথা বলুন অথবা অভিযোগ দাখিল করুন।
          </p>
        </div>
        <button
          onClick={() => navigateTo('customer-service')}
          className="px-5 py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-2"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>কাস্টমার কেয়ারে যোগাযোগ</span>
        </button>
      </div>
    </div>
  );
};
