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
  Headphones,
  PhoneCall,
  Sparkles,
  LogOut,
  LogIn,
  MessageSquare,
  Clock,
  Building,
  Truck,
  RotateCcw,
  Sun,
  Moon,
  KeyRound,
  BellRing,
  Send,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CloudinaryImageUploader } from '../components/CloudinaryImageUploader';
import { FormFooter } from '../components/FormFooter';

type ProfileMenuTab = 'overview' | 'settings' | 'contact' | 'services' | 'auth';

export const CustomerProfilePage: React.FC = () => {
  const {
    customer,
    updateCustomerProfile,
    orders,
    wishlist,
    navigateTo,
    language,
    showToast,
    theme,
    toggleTheme,
    isLoggedIn,
    login,
    logout,
    officialContact,
  } = useShop();

  // Active Profile Menu Tab
  const [activeTab, setActiveTab] = useState<ProfileMenuTab>('overview');

  // Avatar Modal State for Cloudinary
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(customer.avatar || '');

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);

  // OTP Verification Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('5824');
  const [otpError, setOtpError] = useState('');

  // Password / PIN Change Form State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Contact Official Message Form
  const [contactSubject, setContactSubject] = useState('সাধারণ অনুসন্ধান');
  const [contactMessage, setContactMessage] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Login Form States (when logged out)
  const [loginPhone, setLoginPhone] = useState('01712-345678');
  const [loginPass, setLoginPass] = useState('••••••••');

  // Logout Confirmation Modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Settings Notifications toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [whatsappPromos, setWhatsappPromos] = useState(false);

  const handleStartSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sensitiveChanged = phone !== customer.phone || email !== customer.email;

    if (sensitiveChanged) {
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

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin !== confirmPin) {
      showToast(language === 'bn' ? 'নতুন পাসওয়ার্ড বা পিন মিলছে না' : 'PINs do not match');
      return;
    }
    setPinSuccess(true);
    showToast(language === 'bn' ? 'নিরাপত্তা পিন সফলভাবে আপডেট হয়েছে' : 'Security PIN updated successfully');
    setTimeout(() => {
      setPinSuccess(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }, 2500);
  };

  const handleSendOfficialMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setIsMessageSent(true);
    showToast(
      language === 'bn'
        ? 'আপনার বার্তা হাটবাজার অফিশিয়াল টিমের কাছে পাঠানো হয়েছে।'
        : 'Message sent to Haatbazar Official support team.'
    );
    setTimeout(() => {
      setIsMessageSent(false);
      setContactMessage('');
    }, 3000);
  };

  const handlePerformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginPhone);
    setActiveTab('overview');
  };

  const handlePerformLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setActiveTab('auth');
  };

  const menuItems: Array<{
    id: ProfileMenuTab;
    labelBn: string;
    labelEn: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'overview',
      labelBn: 'প্রোফাইল সারসংক্ষেপ',
      labelEn: 'Overview',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'settings',
      labelBn: 'প্রোফাইল সেটিংস',
      labelEn: 'Profile Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'contact',
      labelBn: 'অফিশিয়াল যোগাযোগ',
      labelEn: 'Contact Official',
      icon: <PhoneCall className="w-4 h-4" />,
      badge: '২৪/৭',
    },
    {
      id: 'services',
      labelBn: 'সেবা সমূহ',
      labelEn: 'Services',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'auth',
      labelBn: isLoggedIn ? 'লগআউট মেনু' : 'লগইন মেনু',
      labelEn: isLoggedIn ? 'Log Out' : 'Log In',
      icon: isLoggedIn ? <LogOut className="w-4 h-4 text-rose-500" /> : <LogIn className="w-4 h-4 text-emerald-600" />,
      badge: isLoggedIn ? 'Active' : 'Guest',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32 sm:pb-16 viewport-padding-safe">
      {/* 1. TOP PROFILE HERO CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with Cloudinary direct upload modal trigger */}
          <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 shadow-md">
              <img
                src={
                  isLoggedIn
                    ? customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={customer.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            {isLoggedIn && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAvatarModalOpen(true);
                }}
                className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-[#007A3D] text-white rounded-full shadow-md hover:bg-[#006030] transition-colors cursor-pointer"
                title="Cloudinary ছবি আপলোড করুন"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                {isLoggedIn ? customer.name : 'অতিথি গ্রাহক (Guest User)'}
              </h1>
              {isLoggedIn ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-700" />
                  যাচাইকৃত গ্রাহক
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                  লগইন প্রয়োজন
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {isLoggedIn ? customer.phone : 'ফোন নম্বর সংযুক্ত নেই'}
            </p>
            <p className="text-xs text-gray-500">
              {isLoggedIn ? customer.email : 'লগইন করে সম্পূর্ণ প্রোফাইল এক্সেস করুন'}
            </p>
            {isLoggedIn && (
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {customer.village}, {customer.thana}, {customer.district}
                </span>
              </p>
            )}
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-3.5 py-2 border border-gray-200 hover:border-[#007A3D] text-xs font-bold text-gray-700 hover:text-[#007A3D] rounded-xl transition-colors flex items-center gap-1.5 bg-gray-50/70"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>সেটিংস মেনু</span>
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-5 py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. DEDICATED PROFILE MENU NAVIGATION BAR (Requested: Profile settings, contact Haatbazar official, services, and login or logout) */}
      <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#007A3D] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-emerald-50/80 hover:text-[#007A3D]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500'}>{item.icon}</span>
                <span className="truncate">{language === 'bn' ? item.labelBn : item.labelEn}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MENU CONTENT: 1) OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Facebook Sync & Registration Status Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#007A3D] text-white flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-gray-900">
                    {customer.facebookSynced
                      ? 'ফেসবুক প্রোফাইল সিঙ্ক সক্রিয়'
                      : 'ফেসবুক প্রোফাইল সিঙ্ক ও রেজিস্ট্রেশন'}
                  </h4>
                  {customer.facebookSynced && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      সংযুক্ত
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  {customer.facebookSynced
                    ? `আইডি: ${customer.facebookId || 'Connected'} • নাম ও ছবি স্বয়ংক্রিয়ভাবে হালনাগাদ`
                    : 'ওয়েলকাম ল্যান্ডিং পেজ থেকে অফিসিয়াল ফেসবুক সিঙ্কের মাধ্যমে দ্রুত নিবন্ধন করুন'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('welcome-register')}
              className="px-4 py-2.5 bg-[#007A3D] hover:bg-[#005a2d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              {customer.facebookSynced ? 'তথ্য সংশোধন বা রি-সিঙ্ক' : 'ওয়েলকাম পেজে যান'}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigateTo('my-orders')}
              className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-2">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">আমার অর্ডার</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{orders.length} টি অর্ডার রেকর্ড</p>
            </button>

            <button
              onClick={() => navigateTo('wishlist')}
              className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 w-fit mb-2">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">উইশলিস্ট</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{wishlist.length} টি সংরক্ষিত পণ্য</p>
            </button>

            <button
              onClick={() => navigateTo('delivery-address')}
              className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-emerald-50 text-[#007A3D] w-fit mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">সংরক্ষিত ঠিকানা</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">ডিফল্ট ঠিকানা দেখুন</p>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#007A3D] transition-all text-left group shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 w-fit mb-2">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#007A3D]">অফিশিয়াল সাপোর্ট</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">সকাল ৮টা - রাত ১১টা</p>
            </button>
          </div>

          {/* Primary Address Preview */}
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
                সম্পাদনা করুন →
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
              <p className="font-bold text-gray-900">{customer.addressDetails}</p>
              <p>গ্রাম: {customer.village}, থানা: {customer.thana}</p>
              <p>উপজেলা: {customer.upazila}, জেলা: {customer.district}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MENU CONTENT: 2) PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Personal Info Edit Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-[#007A3D]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">ব্যক্তিগত তথ্য সেটিংস</h3>
                  <p className="text-[11px] text-gray-500">নাম, মোবাইল নম্বর ও যোগাযোগ ইমেইল পরিবর্তন</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 border border-gray-300 hover:border-[#007A3D] text-xs font-bold text-gray-700 hover:text-[#007A3D] rounded-xl transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'বাতিল' : 'তথ্য পরিবর্তন'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleStartSave} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">মোবাইল নম্বর (ওটিপি যাচাই)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">জিমেইল ঠিকানা</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* Dynamic Form Footer with distinct Save and Clear buttons */}
                <FormFooter
                  onClear={() => {
                    setName(customer.name);
                    setPhone(customer.phone);
                    setEmail(customer.email);
                    setIsEditing(false);
                  }}
                  isDirty={name !== customer.name || phone !== customer.phone || email !== customer.email}
                  saveText="তথ্য সংরক্ষণ করুন (Save)"
                  clearText="রিসেট করুন (Clear)"
                />
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">পূর্ণ নাম:</span>
                  <span className="font-bold text-gray-800">{customer.name}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-gray-800">{customer.phone}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">ইমেইল:</span>
                  <span className="font-bold text-gray-800">{customer.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Theme & Display Settings */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-[#007A3D]">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">ডিসপ্লে ও থিম সেটিংস</h3>
                  <p className="text-[11px] text-gray-500">ডার্ক মোড (Dark Mode) ও ব্রাইট মোড (Bright Mode) পরিবর্তন</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-gray-900">
                  {theme === 'dark' ? 'ডার্ক মোড সক্রিয়' : 'ব্রাইট মোড সক্রিয় (সাধারণ)'}
                </p>
                <p className="text-[11px] text-gray-500">চোখের আরামের জন্য ডিসপ্লে কালার পরিবর্তন করুন</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer bg-white text-gray-800 border-gray-300 hover:border-[#007A3D]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>ব্রাইট মোড করুন</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>ডার্ক মোড করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Password / PIN Security */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-[#007A3D]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">পাসওয়ার্ড ও নিরাপত্তা পিন</h3>
                  <p className="text-[11px] text-gray-500">আপনার একাউন্টের ৪ বা ৬ ডিজিটের নিরাপত্তা পিন পরিবর্তন</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePinUpdate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">বর্তমান পাসওয়ার্ড / পিন</label>
                  <input
                    type="password"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="বর্তমান পিন লিখুন"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">নতুন পাসওয়ার্ড / পিন</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="নতুন পিন দিন"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">নতুন পিন নিশ্চিত করুন</label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="পুনরায় লিখুন"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                    required
                  />
                </div>
              </div>

              {pinSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পাসওয়ার্ড / পিন সফলভাবে পরিবর্তন হয়েছে!</span>
                </div>
              )}

              {/* Dynamic Form Footer with distinct Save and Clear buttons */}
              <FormFooter
                onClear={() => {
                  setCurrentPin('');
                  setNewPin('');
                  setConfirmPin('');
                }}
                isDirty={Boolean(currentPin || newPin || confirmPin)}
                saveText="পিন আপডেট করুন (Save PIN)"
                clearText="মুছে ফেলুন (Clear)"
              />
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-[#007A3D]">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">বিজ্ঞপ্তি ও এলার্ট সেটিংস</h3>
                <p className="text-[11px] text-gray-500">অর্ডার ট্র্যাকিং ও ডিসকাউন্ট অফারের নোটিফিকেশন নিয়ন্ত্রণ</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/70 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 block">মোবাইল এসএমএস এলার্ট</span>
                  <span className="text-[11px] text-gray-500">অর্ডার কনফার্মেশন ও ডেলিভারি রাইডারের এসএমএস</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#007A3D]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/70 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 block">ইমেইল ইনভয়েস ও মেমো</span>
                  <span className="text-[11px] text-gray-500">প্রতিটি অর্ডারের ডিজিটাল ক্যাশমেমো ইমেইলে প্রেরণ</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailInvoices}
                  onChange={(e) => setEmailInvoices(e.target.checked)}
                  className="w-4 h-4 accent-[#007A3D]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/70 cursor-pointer">
                <div>
                  <span className="font-bold text-gray-800 block">হোয়াটসঅ্যাপ স্পেশাল ডিল ও কুপন</span>
                  <span className="text-[11px] text-gray-500">সাপ্তাহিক বাজার ছাড় ও বিশেষ উৎসবের নোটিফিকেশন</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappPromos}
                  onChange={(e) => setWhatsappPromos(e.target.checked)}
                  className="w-4 h-4 accent-[#007A3D]"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. MENU CONTENT: 3) CONTACT HAATBAZAR OFFICIAL */}
      {activeTab === 'contact' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Official Hotline & Channels */}
          <div className="bg-gradient-to-br from-[#007A3D] to-[#004e27] text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
                  হাটবাজার ডট কম অফিশিয়াল কাস্টমার সাপোর্ট
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1">যোগাযোগ করুন সরাসরি আমাদের সাথে</h2>
                <p className="text-xs text-emerald-100 mt-1 max-w-md">
                  যে কোনো প্রশ্ন, অভিযোগ, পাইকারি ক্রয় বা ডেলিভারি সহায়তায় আমাদের হটলাইন ও অফিশিয়াল জিমেইল সার্বক্ষণিক উন্মুক্ত।
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <a
                  href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
                  className="px-4 py-2.5 bg-white text-[#007A3D] hover:bg-emerald-50 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-102"
                >
                  <Phone className="w-4 h-4 text-emerald-700 animate-pulse" />
                  <span>{officialContact.hotline}</span>
                </a>
                <a
                  href={`mailto:${officialContact.gmail}`}
                  className="px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-102 border border-emerald-400/40"
                >
                  <Mail className="w-4 h-4 text-yellow-300" />
                  <span className="font-mono text-[11px] sm:text-xs">{officialContact.gmail}</span>
                </a>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-600/50 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-300" />
                <span>{officialContact.supportHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>দ্রুত সমাধান গ্যারান্টি</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-300" />
                <span>লাইভ ডেলিভারি হেল্প</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-300" />
                <span>সহজ রিটার্ন সাপোর্ট</span>
              </div>
            </div>
          </div>

          {/* Contact Methods Grid (4 Authentic Official Channels including Gmail Address) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Phone Hotline Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#007A3D] flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900">অফিশিয়াল ফোন হটলাইন</h4>
              <p className="text-xs font-mono font-bold text-[#007A3D]">{officialContact.hotline}</p>
              <p className="text-[11px] text-gray-500">টোল-ফ্রি ও সরাসরি কল সার্ভিস ({officialContact.supportHours})</p>
              <a
                href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#007A3D] hover:underline"
              >
                সরাসরি কল দিন →
              </a>
            </div>

            {/* Official Gmail Address Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900">হাটবাজার জিমেইল অ্যাড্রেস</h4>
              <p className="text-[11px] font-mono font-bold text-rose-600 break-all">{officialContact.gmail}</p>
              <p className="text-[11px] text-gray-500">জরুরি যোগাযোগ ও যে কোনো প্রশ্ন সরাসরি জিমেইলে পাঠান</p>
              <a
                href={`mailto:${officialContact.gmail}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
              >
                জিমেইলে লিখুন →
              </a>
            </div>

            {/* WhatsApp Official Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900">হোয়াটসঅ্যাপ সাপোর্ট</h4>
              <p className="text-xs font-mono font-bold text-green-700">{officialContact.whatsapp}</p>
              <p className="text-[11px] text-gray-500">ছবি ও ভিডিও পাঠিয়ে দ্রুত সমস্যা জানান</p>
              <a
                href={`https://wa.me/${officialContact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:underline"
              >
                মেসেজ পাঠান <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Corporate Email Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-900">কর্পোরেট ইমেইল</h4>
              <p className="text-xs font-mono font-bold text-blue-700">{officialContact.email}</p>
              <p className="text-[11px] text-gray-500">বড় প্রাতিষ্ঠানিক ও বাল্ক অর্ডারের অফিশিয়াল চিঠি</p>
              <a
                href={`mailto:${officialContact.email}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
              >
                ইমেইল লিখুন →
              </a>
            </div>
          </div>

          {/* Corporate Office Address & Instant Message Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Corporate Office */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">প্রধান করপোরেট হেডকোয়ার্টার</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>হাটবাজার ডট কম লিমিটেড (Haatbazar.com)</strong><br />
                {officialContact.officeAddress}
              </p>
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
                <p><strong>ট্রেড লাইসেন্স নং:</strong> {officialContact.tradeLicense}</p>
                <p><strong>ই-কমার্স এসোসিয়েশন সদস্য নং:</strong> {officialContact.ecabNo}</p>
              </div>
            </div>

            {/* Direct Official Query Form */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#007A3D]" />
                <h3 className="text-sm font-bold text-gray-900">অফিশিয়াল মতামত / মেসেজ বক্স</h3>
              </div>

              {isMessageSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-medium space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>মেসেজ সফলভাবে পৌঁছেছে!</span>
                  </div>
                  <p>আমাদের সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে।</p>
                </div>
              ) : (
                <form onSubmit={handleSendOfficialMessage} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">বিষয় নির্বাচন করুন</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden bg-white"
                    >
                      <option value="সাধারণ অনুসন্ধান">সাধারণ অনুসন্ধান (General Inquiry)</option>
                      <option value="অর্ডার ও ডেলিভারি সংক্রান্ত">অর্ডার ও ডেলিভারি সংক্রান্ত (Order Delivery)</option>
                      <option value="পণ্য ফেরতের আবেদন">পণ্য ফেরতের আবেদন (Return / Refund)</option>
                      <option value="পাইকারি বাজার ও কর্পোরেট">পাইকারি বাজার ও কর্পোরেট সাপ্লাই (Bulk Supply)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">আপনার বক্তব্য লিখুন</label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="এখানে আপনার মেসেজ বা প্রশ্ন বিস্তারিত লিখুন..."
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                      required
                    />
                  </div>

                  {/* Dynamic Form Footer */}
                  <FormFooter
                    onClear={() => {
                      setContactMessage('');
                      setContactSubject('সাধারণ অনুসন্ধান');
                    }}
                    isDirty={Boolean(contactMessage.trim())}
                    saveText="মেসেজ পাঠান (Send Message)"
                    clearText="মুছে ফেলুন (Clear)"
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. MENU CONTENT: 4) SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-[#007A3D]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">হাটবাজার ডট কম-এর বিশেষ সেবাসমূহ</h2>
                <p className="text-xs text-gray-500">বিশ্বস্ত দেশীয় পণ্যের নিরাপদ ডেলিভারি ও প্রিমিয়াম গ্রাহক সেবা</p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service 1 */}
              <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#007A3D] text-white flex items-center justify-center font-bold text-xs">
                  ১
                </div>
                <h3 className="font-bold text-xs text-gray-900">শতভাগ খাঁটি ও খামারজাত গ্রোসারি</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  দেশের সেরা খামার ও বিশ্বস্ত কৃষকদের থেকে সরাসরি সংগৃহীত রাসায়নিকমুক্ত চাল, ডাল, সরিষার তেল, সুন্দরবনের মধু এবং ঘানিভাঙা খাঁটি মসলা।
                </p>
              </div>

              {/* Service 2 */}
              <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ২
                </div>
                <h3 className="font-bold text-xs text-gray-900">এক্সপ্রেস হোম ডেলিভারি</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  ঢাকা সিটিতে ৩ থেকে ৪ ঘণ্টার মধ্যে নিজস্ব রাইডারের মাধ্যমে দ্রুত ডেলিভারি এবং দেশের প্রতিটি জেলা ও উপজেলায় ৪৮ ঘণ্টার সুপারফাস্ট কুরিয়ার সেবা।
                </p>
              </div>

              {/* Service 3 */}
              <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  ৩
                </div>
                <h3 className="font-bold text-xs text-gray-900">ক্যাশ অন ডেলিভারি ও নিরাপদ পেমেন্ট</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করার সুবিধা (ক্যাশ অন ডেলিভারি)। এছাড়া বিকাশ, নগদ, রকেট ও ভিসা/মাস্টারকার্ডের নিরাপদ গেটওয়ে।
                </p>
              </div>

              {/* Service 4 */}
              <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  ৪
                </div>
                <h3 className="font-bold text-xs text-gray-900">৭ দিনের সহজ রিটার্ন পলিসি</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  পণ্য কোনো কারণে অপছন্দ হলে বা মানে অসন্তোষ থাকলে ৭ দিনের মধ্যে কোনো ঝামেলা ছাড়াই রিটার্ন এবং শতভাগ রিফান্ডের পূর্ণ নিশ্চয়তা।
                </p>
              </div>

              {/* Service 5 */}
              <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  ৫
                </div>
                <h3 className="font-bold text-xs text-gray-900">হোলসেল ও কর্পোরেট বাল্ক সাপ্লাই</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  হোটেল, রেস্তোরাঁ, ক্যাটারিং ও অফিসের মাসিক বাজারের জন্য পাইকারি দামে বিশেষ ভ্যাট চালানসহ সরাসরি গোডাউন থেকে দ্রুত সাপ্লাই ব্যবস্থা।
                </p>
              </div>

              {/* Service 6 */}
              <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  ৬
                </div>
                <h3 className="font-bold text-xs text-gray-900">২৪/৭ ডেডিকেটেড গ্রাহক সহায়তা</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  অর্ডার সংক্রান্ত যে কোনো তথ্যের জন্য হটলাইন, হোয়াটসঅ্যাপ এবং লাইভ চ্যাটে আমাদের প্রতিনিধিবৃন্দ সার্বক্ষণিক সেবা দিতে প্রস্তুত।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MENU CONTENT: 5) LOGIN OR LOGOUT */}
      {activeTab === 'auth' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {isLoggedIn ? (
            /* Logged In View: Active Session & Logout Controls */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#007A3D] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  অ্যাক্টিভ সেশন (Active Session)
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-2">
                  আপনি বর্তমানে <strong>{customer.name}</strong> হিসেবে লগইন আছেন
                </h3>
                <p className="text-xs text-gray-500 font-mono">মোবাইল: {customer.phone} | {customer.email}</p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1.5 text-left">
                <p className="flex justify-between">
                  <span>ডিভাইস স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-700">সুরক্ষিত সংযোগ</span>
                </p>
                <p className="flex justify-between">
                  <span>শেষ লগইন সময়:</span>
                  <span className="font-bold text-gray-800">আজ, ১০:১৫ AM</span>
                </p>
                <p className="flex justify-between">
                  <span>গ্রাহক রেটিং:</span>
                  <span className="font-bold text-amber-600">★★★★★ (গোল্ড মেম্বার)</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>একাউন্ট থেকে লগআউট করুন</span>
                </button>

                <button
                  onClick={() => setActiveTab('overview')}
                  className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  প্রোফাইল হোমপেজে ফিরে যান
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out View: Sign In Form */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-md mx-auto">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#007A3D] flex items-center justify-center mx-auto mb-2">
                  <LogIn className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-gray-900">হাটবাজার একাউন্টে লগইন করুন</h3>
                <p className="text-xs text-gray-500">আপনার মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে সহজে প্রবেশ করুন</p>
              </div>

              <form onSubmit={handlePerformLogin} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">মোবাইল নম্বর অথবা ইমেইল</label>
                  <input
                    type="text"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="017XX-XXXXXX"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-gray-700">পাসওয়ার্ড / নিরাপত্তা পিন</label>
                    <button
                      type="button"
                      onClick={() => showToast('আপনার ফোনে নতুন পিন পাঠানো হয়েছে')}
                      className="text-[11px] text-[#007A3D] hover:underline"
                    >
                      পিন ভুলে গেছেন?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="আপনার পিন লিখুন"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন (Log In)</span>
                </button>
              </form>

              <div className="pt-2 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    login('01712-345678');
                    setActiveTab('overview');
                  }}
                  className="text-xs font-semibold text-[#007A3D] hover:underline"
                >
                  কুইক ডেমো লগইন ব্যবহার করুন (Quick One-Click Login)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-base text-gray-900">লগআউট নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনার হাটবাজার একাউন্ট থেকে লগআউট করতে চান? পরবর্তী অর্ডারের জন্য পুনরায় লগইন করতে হবে।
            </p>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-1/2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handlePerformLogout}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                হ্যাঁ, লগআউট
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Cloudinary Direct Avatar Upload Modal for Customer */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#007A3D]" />
                <span>গ্রাহক প্রোফাইল ছবি আপলোড (Cloudinary)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CloudinaryImageUploader
              label="সরাসরি Cloudinary অ্যাকাউন্টে আপলোড"
              currentImageUrl={customer.avatar}
              onImageUploaded={(url) => {
                setAvatarPreview(url);
                updateCustomerProfile({ avatar: url });
                showToast('ক্লাউডিনারি প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!');
                setIsAvatarModalOpen(false);
              }}
              aspectRatio="square"
              helperText="ক্যামেরা থেকে সরাসরি ছবি তুলুন অথবা গ্যালারি থেকে আপলোড করুন।"
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs font-bold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
