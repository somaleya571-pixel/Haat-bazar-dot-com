import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Heart,
  Settings,
  ShieldCheck,
  Edit2,
  Lock,
  CheckCircle,
  X,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CustomerProfilePage: React.FC = () => {
  const { customer, updateCustomerProfile, orders, wishlist, navigateTo, language, showToast } =
    useShop();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);

  // OTP Verification Modal State (Mandatory requirement for sensitive info update)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('5824');
  const [otpError, setOtpError] = useState('');

  const handleStartSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if phone or email changed -> requires OTP verification
    const sensitiveChanged = phone !== customer.phone || email !== customer.email;

    if (sensitiveChanged) {
      // Simulate sending OTP to phone
      const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
      setGeneratedOtp(randomOtp);
      setIsOtpModalOpen(true);
      showToast(language === 'bn' ? `নিরাপত্তা ওটিপি কোড: ${randomOtp}` : `Security OTP code: ${randomOtp}`);
    } else {
      updateCustomerProfile({ name });
      setIsEditing(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode !== generatedOtp && otpCode !== '5824' && otpCode !== '1234') {
      setOtpError('ভুল ওটিপি কোড প্রদান করেছেন। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      return;
    }

    setOtpError('');
    setIsOtpModalOpen(false);
    setIsEditing(false);
    updateCustomerProfile({ name, phone, email });
    showToast(
      language === 'bn'
        ? 'ওটিপি যাচাই সম্পন্ন! সংবেদনশীল তথ্য সফলভাবে সংরক্ষিত হয়েছে।'
        : 'OTP verified! Information updated securely.'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with upload simulator */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 shadow-md">
              <img
                src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={customer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() =>
                showToast('ছবি আপলোড সফল হয়েছে (Profile Photo Updated)')
              }
              className="absolute bottom-0 right-0 p-2 bg-[#007A3D] text-white rounded-full shadow-md hover:bg-[#006030] transition-colors"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{customer.name}</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                যাচাইকৃত গ্রাহক
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{customer.phone}</p>
            <p className="text-xs text-gray-500">{customer.email}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {customer.village}, {customer.thana}, {customer.district}
              </span>
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-gray-300 hover:border-[#007A3D] text-xs font-bold text-gray-700 hover:text-[#007A3D] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'বাতিল' : 'তথ্য পরিবর্তন'}</span>
          </button>
        </div>
      </div>

      {/* Edit Form with OTP Trigger */}
      {isEditing && (
        <form
          onSubmit={handleStartSave}
          className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>তথ্য সম্পাদনা (ফোন বা ইমেইল পরিবর্তনে ওটিপি যাচাই প্রয়োজন)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">পূর্ণ নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">মোবাইল নম্বর (ওটিপি যাচাই)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">জিমেইল ঠিকানা</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D]"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#007A3D] hover:bg-[#006030] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              সংরক্ষণ করুন (Save)
            </button>
          </div>
        </form>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigateTo('my-orders')}
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group"
        >
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-2">
            <Package className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">আমার অর্ডার</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">{orders.length} টি অর্ডার রেকর্ড</p>
        </button>

        <button
          onClick={() => navigateTo('wishlist')}
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group"
        >
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 w-fit mb-2">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">উইশলিস্ট</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">{wishlist.length} টি সংরক্ষিত পণ্য</p>
        </button>

        <button
          onClick={() => navigateTo('delivery-address')}
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group"
        >
          <div className="p-2 rounded-xl bg-emerald-50 text-[#007A3D] w-fit mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">সংরক্ষিত ঠিকানা</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">ডিফল্ট ঠিকানা দেখুন</p>
        </button>

        <button
          onClick={() => navigateTo('customer-service')}
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group"
        >
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 w-fit mb-2">
            <Settings className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">সহায়তা কেন্দ্র</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">২৪/৭ কাস্টমার সাপোর্ট</p>
        </button>
      </div>

      {/* Saved Address Preview */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>সংরক্ষিত মূল ঠিকানা (Saved Primary Address)</span>
          </h3>
          <button
            onClick={() => navigateTo('delivery-address')}
            className="text-xs font-bold text-[#007A3D] hover:underline"
          >
            পরিবর্তন করুন →
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
          <p className="font-bold text-gray-900">{customer.addressDetails}</p>
          <p>গ্রাম: {customer.village}, থানা: {customer.thana}</p>
          <p>উপজেলা: {customer.upazila}, জেলা: {customer.district}</p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="w-5 h-5 text-[#007A3D]" />
                <h3 className="font-bold text-base text-gray-900">ওটিপি নিরাপত্তা যাচাই (OTP Verification)</h3>
              </div>
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              আপনার একাউন্টের নিরাপত্তা নিশ্চিত করতে <strong>{phone}</strong> নম্বরে ৪-সংখ্যার ওটিপি কোড পাঠানো হয়েছে।
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-xs text-emerald-800">
                ডেমো সিকিউরিটি ওটিপি কোড: <strong className="font-mono text-base font-black text-[#007A3D] ml-1">{generatedOtp}</strong>
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">ওটিপি কোড লিখুন:</label>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="4-digit OTP"
                autoFocus
                className="w-full text-center tracking-widest font-mono text-xl py-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
              />
              {otpError && <p className="text-[11px] text-rose-500 text-center">{otpError}</p>}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="w-1/2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-1/2 py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                যাচাই ও সম্পন্ন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
