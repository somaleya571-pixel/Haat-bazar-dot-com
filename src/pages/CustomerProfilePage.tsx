import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CloudinaryImageUploader } from '../components/CloudinaryImageUploader';
import { FormFooter } from '../components/FormFooter';

type ProfileMenuTab = 'overview' | 'settings' | 'contact' | 'services';

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
    officialContact,
  } = useShop();

  // Active Profile Menu Tab
  const [activeTab, setActiveTab] = useState<ProfileMenuTab>('overview');

  // Avatar Modal State for Cloudinary
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(customer.avatar || '');

  // Edit Profile States - Name, Phone, Gmail, and Delivery Address
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [email, setEmail] = useState(customer.email || '');
  const [district, setDistrict] = useState(customer.district || '');
  const [upazila, setUpazila] = useState(customer.upazila || '');
  const [thana, setThana] = useState(customer.thana || '');
  const [village, setVillage] = useState(customer.village || '');
  const [addressDetails, setAddressDetails] = useState(customer.addressDetails || '');

  // Synchronize when customer updates
  useEffect(() => {
    setName(customer.name || '');
    setPhone(customer.phone || '');
    setEmail(customer.email || '');
    setDistrict(customer.district || '');
    setUpazila(customer.upazila || '');
    setThana(customer.thana || '');
    setVillage(customer.village || '');
    setAddressDetails(customer.addressDetails || '');
  }, [customer]);

  // Password / PIN Change Form State
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Contact Official Message Form
  const [contactSubject, setContactSubject] = useState('সাধারণ অনুসন্ধান');
  const [contactMessage, setContactMessage] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Settings Notifications toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [whatsappPromos, setWhatsappPromos] = useState(false);

  // Direct profile save without blocking OTP hurdles
  const handleStartSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      district: district.trim(),
      upazila: upazila.trim(),
      thana: thana.trim(),
      village: village.trim(),
      addressDetails: addressDetails.trim(),
    });
    setIsEditing(false);
    showToast(
      language === 'bn'
        ? 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!'
        : 'Profile information saved successfully!'
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
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32 sm:pb-16 viewport-padding-safe">
      {/* 1. TOP PROFILE HERO CARD */}
      <div className="bg-white dark:bg-[#141f17] rounded-3xl p-5 sm:p-7 border border-gray-200/90 dark:border-gray-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with Cloudinary direct upload modal trigger */}
          <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 shadow-md">
              <img
                src={
                  customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt={customer.name || 'গ্রাহক'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAvatarModalOpen(true);
              }}
              className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-[#007A3D] text-white rounded-full shadow-md hover:bg-[#006030] transition-colors cursor-pointer"
              title="ছবি আপলোড করুন"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100">
                {customer.name || 'সম্মানিত গ্রাহক'}
              </h1>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                গ্রাহক প্রোফাইল
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
              {customer.phone || 'ফোন নম্বর যুক্ত নেই'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {customer.email || 'ইমেইল ঠিকানা যুক্ত নেই'}
            </p>
            {(customer.village || customer.thana || customer.district) && (
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {customer.village ? `${customer.village}, ` : ''}{customer.thana ? `${customer.thana}, ` : ''}{customer.district}
                </span>
              </p>
            )}
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 text-[#007A3D] dark:text-emerald-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>তথ্য পরিবর্তন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED PROFILE MENU NAVIGATION BAR */}
      <div className="bg-white dark:bg-[#141f17] rounded-2xl p-1.5 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#007A3D] text-white shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 hover:text-[#007A3D]'
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
          {/* Clean Profile Greeting & Quick Status Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-900/10 rounded-3xl p-5 border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#007A3D] text-white flex items-center justify-center shadow-xs shrink-0">
                <User className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900 dark:text-gray-100">
                  {customer.name ? `${customer.name}-এর প্রোফাইল` : 'সম্মানিত গ্রাহক প্রোফাইল'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  আপনার নাম, মোবাইল নম্বর, জিমেইল ও ডেলিভারি ঠিকানা যেকোনো সময় পরিবর্তন করতে পারেন। কোনো পণ্য অর্ডার করলে তথ্যগুলো অটোমেটিকলি এখানে আপডেট হয়ে যাবে।
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2.5 bg-[#007A3D] hover:bg-[#005a2d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              তথ্য পরিবর্তন ও সম্পাদন
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
          <div className="bg-white dark:bg-[#141f17] rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
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

            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {customer.addressDetails || 'বিস্তারিত ঠিকানা এখনও পূরণ করা হয়নি (অর্ডার করার সময় অথবা সেটিংসে গিয়ে ঠিকানা যোগ করুন)'}
              </p>
              {(customer.village || customer.thana || customer.upazila || customer.district) ? (
                <>
                  <p>গ্রাম/এলাকা: {customer.village || '-'}, থানা: {customer.thana || '-'}</p>
                  <p>উপজেলা: {customer.upazila || '-'}, জেলা: {customer.district || '-'}</p>
                </>
              ) : null}
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
                    <label className="font-bold text-gray-700 dark:text-gray-200">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-200">মোবাইল নম্বর</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] font-mono outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-200">জিমেইল / ইমেইল ঠিকানা</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ডেলিভারি ঠিকানা সেটিংস</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-600 dark:text-gray-300">জেলা (District)</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="যেমন: ঢাকা / চট্টগ্রাম"
                        className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-600 dark:text-gray-300">উপজেলা (Upazila)</label>
                      <input
                        type="text"
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        placeholder="যেমন: ধানমন্ডি / উত্তরা"
                        className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-600 dark:text-gray-300">থানা (Thana)</label>
                      <input
                        type="text"
                        value={thana}
                        onChange={(e) => setThana(e.target.value)}
                        placeholder="যেমন: ধানমন্ডি থানা"
                        className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-600 dark:text-gray-300">গ্রাম / এলাকা / রোড</label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="যেমন: রোড ৮/এ, সেক্টর ৩"
                        className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-gray-600 dark:text-gray-300">বাড়ি ও ফ্ল্যাট নম্বরসহ বিস্তারিত ঠিকানা</label>
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      placeholder="বাড়ি নং, ফ্ল্যাট নং, ল্যান্ডমার্ক ইত্যাদি"
                      className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#007A3D] outline-hidden"
                    />
                  </div>
                </div>

                {/* Dynamic Form Footer with distinct Save and Clear buttons */}
                <FormFooter
                  onClear={() => {
                    setName(customer.name || '');
                    setPhone(customer.phone || '');
                    setEmail(customer.email || '');
                    setDistrict(customer.district || '');
                    setUpazila(customer.upazila || '');
                    setThana(customer.thana || '');
                    setVillage(customer.village || '');
                    setAddressDetails(customer.addressDetails || '');
                    setIsEditing(false);
                  }}
                  isDirty={
                    name !== customer.name ||
                    phone !== customer.phone ||
                    email !== customer.email ||
                    district !== customer.district ||
                    upazila !== customer.upazila ||
                    thana !== customer.thana ||
                    village !== customer.village ||
                    addressDetails !== customer.addressDetails
                  }
                  saveText="তথ্য সংরক্ষণ করুন (Save Profile)"
                  clearText="বাতিল করুন (Cancel)"
                />
              </form>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">পূর্ণ নাম:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{customer.name || 'উল্লেখ নেই'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">মোবাইল নম্বর:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-100">{customer.phone || 'সংযুক্ত নেই'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-gray-400 block text-[11px]">জিমেইল / ইমেইল:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{customer.email || 'সংযুক্ত নেই'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs space-y-1">
                  <span className="text-gray-400 block text-[11px] font-bold">সংরক্ষিত ডেলিভারি ঠিকানা:</span>
                  <p className="font-bold text-gray-800 dark:text-gray-100">{customer.addressDetails || 'বিস্তারিত ঠিকানা পূরণ করা হয়নি'}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    গ্রাম/রোড: {customer.village || '-'}, থানা: {customer.thana || '-'}, উপজেলা: {customer.upazila || '-'}, জেলা: {customer.district || '-'}
                  </p>
                </div>
              </div>
            )}
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
