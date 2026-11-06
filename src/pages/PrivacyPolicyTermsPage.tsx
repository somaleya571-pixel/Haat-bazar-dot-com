import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PrivacyPolicyTermsPage: React.FC = () => {
  const { navigateTo, language } = useShop();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'data'>('privacy');

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
              {language === 'bn' ? 'গোপনীয়তা নীতি ও শর্তাবলী (Page 18: Terms)' : 'Privacy & Terms'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'গ্রাহক তথ্য সুরক্ষা, প্ল্যাটফর্ম ব্যবহারের নীতি ও ভোক্তা অধিকার' : 'Consumer protection, customer data privacy, and platform rules'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'privacy'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          গোপনীয়তা নীতি (Privacy Policy)
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terms'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          ব্যবহারের শর্তাবলী (Terms & Conditions)
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'data'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          তথ্য সুরক্ষা (Data Protection)
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 text-xs text-gray-700 leading-relaxed">
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#007A3D] font-bold text-sm border-b border-gray-100 pb-2">
              <Shield className="w-5 h-5" />
              <span>হাট বাজার গোপনীয়তা নীতি (Customer Privacy Policy)</span>
            </div>
            <p>
              হাট বাজার (Haat Bazar) গ্রাহকদের ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার প্রদান করে। আমরা কোনো বাধ্যতামূলক অ্যাকাউন্ট বা পাসওয়ার্ড ছাড়াই সরাসরি অর্ডার গ্রহণের সুযোগ রেখেছি। আপনার নাম, মোবাইল নম্বর, জিমেইল এবং ভৌগোলিক ঠিকানা শুধুমাত্র অর্ডার ডেলিভারি ও কাস্টমার সার্ভিস নিশ্চিতকরণের উদ্দেশ্যে সংগ্রহ করা হয়।
            </p>
            <h4 className="font-bold text-gray-900 text-xs mt-3">তথ্য ব্যবহারের পরিধি:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>কুরিয়ার সার্ভিস বা রাইডারের মাধ্যমে পণ্য গ্রাহকের সঠিক ঠিকানায় পৌঁছে দেয়া।</li>
              <li>অর্ডার ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস এসএমএস/কলের মাধ্যমে অবহিত করা।</li>
              <li>পেমেন্ট ও রিফান্ড সংক্রান্ত কোনো অসঙ্গতি থাকলে ফোনে যাচাই করা।</li>
              <li>কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে কোনো বাণিজ্যিক উদ্দেশ্যে গ্রাহকের তথ্য বিক্রি বা হস্তান্তর করা হয় না।</li>
            </ul>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#007A3D] font-bold text-sm border-b border-gray-100 pb-2">
              <FileText className="w-5 h-5" />
              <span>ব্যবহারের সাধারণ শর্তাবলী (Terms of Service)</span>
            </div>
            <p>
              হাট বাজারে অর্ডার করার মাধ্যমে গ্রাহক প্ল্যাটফর্মের নিয়মাবলী ও ফেরত নীতিমালার সাথে একমত পোষণ করেন।
            </p>
            <h4 className="font-bold text-gray-900 text-xs mt-3">অর্ডার ও বাতিলকরণ:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>অর্ডার প্লেস করার পর যতক্ষণ পণ্য ‘Processing’ বা ‘Shipped’ পর্যায়ে পৌঁছায়নি, গ্রাহক বিনামূল্যে অর্ডার বাতিল বা সংশোধন করতে পারেন।</li>
              <li>ক্যাশ অন ডেলিভারি অর্ডারে রাইডারের সামনে পণ্য চেক করে মূল্য পরিশোধ করতে পারবেন।</li>
              <li>অনলাইন পেমেন্ট (বিকাশ/নগদ) এর ক্ষেত্রে ট্রানজেকশন আইডি সঠিক ও বৈধ প্রমাণিত হলেই কেবল অর্ডার চূড়ান্তভাবে শিপমেন্টে পাঠানো হবে।</li>
            </ul>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#007A3D] font-bold text-sm border-b border-gray-100 pb-2">
              <Lock className="w-5 h-5" />
              <span>গ্রাহক তথ্য সুরক্ষা (Customer Data Protection)</span>
            </div>
            <p>
              আমাদের ডাটাবেজে গ্রাহকের তথ্য সম্পূর্ণ এনক্রিপ্টেড এবং নিরাপদে সংরক্ষিত থাকে। সংবেদনশীল তথ্য (যেমন মোবাইল নম্বর বা ইমেইল ঠিকানা পরিবর্তন) এর ক্ষেত্রে ওয়ান-টাইম পাসওয়ার্ড (OTP) যাচাইকরণ বাধ্যতামূলক করা হয়েছে যাতে অননুমোদিত কেউ অন্য কারো তথ্য বিকৃত করতে না পারে।
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800">
                বাংলাদেশ ডিজিটাল নিরাপত্তা আইন ও ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরের নির্দেশিকা মেনে হাট বাজার পরিচালিত হয়।
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
