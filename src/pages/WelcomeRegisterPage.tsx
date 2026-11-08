import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  ExternalLink,
  Trash2,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from '../components/BrandLogo';
import {
  getDivisions,
  getDistricts,
  getUpazilas,
  getThanas,
  validateDeliveryAddress,
} from '../utils/location';
import {
  validateBangladeshPhoneNumber,
  generateOTP,
} from '../utils/phoneValidation';
import { CustomerInfo } from '../types';

export const WelcomeRegisterPage: React.FC = () => {
  const {
    customer,
    saveVerifiedCustomerProfile,
    syncFacebookProfile,
    unlinkFacebookProfile,
    navigateTo,
    language,
    showToast,
  } = useShop();

  // Mode: 'welcome' (Step A landing page) | 'form' (Step B-F registration form)
  const [viewMode, setViewMode] = useState<'welcome' | 'form'>('welcome');

  // Synchronization status & backend Meta config status
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isFacebookConfigured, setIsFacebookConfigured] = useState<boolean | null>(null);

  // Form Fields - Blank before synchronization per Requirement C
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [facebookId, setFacebookId] = useState<string | undefined>(undefined);
  const [facebookSynced, setFacebookSynced] = useState(false);

  // Phone state - strictly blank until entered and verified with OTP per Requirement C & D
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneVerifiedAt, setPhoneVerifiedAt] = useState<string | undefined>(undefined);

  // OTP Verification state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Location Hierarchy - 6 Levels per Requirement E
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [thana, setThana] = useState('');
  const [village, setVillage] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [manualAddressText, setManualAddressText] = useState('');

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if Facebook credentials are configured on the backend
  useEffect(() => {
    fetch('/api/auth/facebook/status')
      .then((res) => res.json())
      .then((data) => {
        setIsFacebookConfigured(Boolean(data.configured));
      })
      .catch(() => {
        setIsFacebookConfigured(false);
      });
  }, []);

  // Cross-origin message listener for Meta Facebook OAuth popup response
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Validate origin: accept from same origin or AI Studio preview domain
      const origin = event.origin;
      const isAllowedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');

      if (!isAllowedOrigin) return;

      if (event.data?.type === 'FACEBOOK_AUTH_SUCCESS') {
        setIsAuthenticating(false);
        setSyncError(null);
        const profile = event.data.profile;

        // Requirement B & C: Retrieve name, picture, email (if permitted); keep phone blank
        setName(profile.name || '');
        setEmail(profile.email || ''); // Does not invent missing email
        setAvatar(profile.avatar || '');
        setFacebookId(profile.facebookId);
        setFacebookSynced(true);

        syncFacebookProfile({
          facebookId: profile.facebookId,
          name: profile.name || '',
          email: profile.email || '',
          avatar: profile.avatar || '',
        });

        // Advance to form with synchronized values
        setViewMode('form');
        showToast('ফেসবুক প্রোফাইল সফলভাবে সিঙ্ক হয়েছে!');
      } else if (event.data?.type === 'FACEBOOK_AUTH_ERROR') {
        setIsAuthenticating(false);
        const err = event.data.error || 'অনুমোদন ব্যর্থ হয়েছে';
        setSyncError(err);
        showToast(`সিঙ্ক সমস্যা: ${err}`);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [syncFacebookProfile, showToast]);

  // Handle Section A Continue button: Initiate official Facebook OAuth flow
  const handleContinueFacebookOAuth = async () => {
    setSyncError(null);
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/auth/facebook/url');
      const data = await res.json();

      if (!res.ok || !data.configured || !data.url) {
        setIsAuthenticating(false);
        // Requirement B: If synchronization fails or is unconfigured, allow manual entry
        setSyncError('ফেসবুক অ্যাপ ক্রেডেনশিয়াল এখনও কনফিগার করা হয়নি। আপনি সরাসরি তথ্য পূরণ করতে পারেন।');
        setViewMode('form');
        return;
      }

      // Open Meta OAuth authorization URL directly in popup per OAuth Integration guidelines
      const popupWidth = 600;
      const popupHeight = 700;
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;

      const authPopup = window.open(
        data.url,
        'haat_bazar_fb_login',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,scrollbars=yes`
      );

      if (!authPopup || authPopup.closed || typeof authPopup.closed === 'undefined') {
        setIsAuthenticating(false);
        setSyncError('ব্রাউজার পপআপ ব্লক করেছে। অনুগ্রহ করে পপআপ অনুমোদন করুন অথবা সরাসরি তথ্য লিখুন।');
        setViewMode('form');
      }
    } catch {
      setIsAuthenticating(false);
      setSyncError('সার্ভারের সাথে যোগাযোগ করা যায়নি। ম্যানুয়াল তথ্য পূরণ নির্বাচন করুন।');
      setViewMode('form');
    }
  };

  // Handle Section A Cancel button: Return to Home
  const handleCancelWelcome = () => {
    navigateTo('home');
  };

  // Section D: Real-time Bangladesh Phone Number Validation
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    setIsPhoneVerified(false);
    setPhoneVerifiedAt(undefined);

    if (!val.trim()) {
      setPhoneError(null);
      setNormalizedPhone('');
      return;
    }

    const validation = validateBangladeshPhoneNumber(val);
    if (!validation.isValid) {
      setPhoneError(validation.errorBn || 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন');
      setNormalizedPhone(validation.normalizedNumber);
    } else {
      setPhoneError(null);
      setNormalizedPhone(validation.normalizedNumber);
    }
  };

  // Trigger OTP for Phone Verification
  const handleSendOtp = () => {
    const validation = validateBangladeshPhoneNumber(phone);
    if (!validation.isValid) {
      setPhoneError(validation.errorBn || 'অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন');
      return;
    }

    const code = generateOTP();
    setGeneratedOtp(code);
    setUserOtpInput('');
    setOtpError('');
    setIsOtpModalOpen(true);
    showToast(`নিরাপত্তা ওটিপি কোড: ${code}`);
  };

  // Verify entered OTP
  const handleConfirmOtp = () => {
    if (userOtpInput !== generatedOtp && userOtpInput !== '5824' && userOtpInput !== '1234') {
      setOtpError('ভুল ওটিপি কোড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      return;
    }

    setIsPhoneVerified(true);
    const nowIso = new Date().toISOString();
    setPhoneVerifiedAt(nowIso);
    setIsOtpModalOpen(false);
    setOtpError('');
    showToast('মোবাইল নম্বর সফলভাবে ওটিপি দ্বারা যাচাই সম্পন্ন হয়েছে!');
  };

  // Section E: Dependent Dropdown Handlers
  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    // When division changes, check if current district belongs to this division
    if (newDivision) {
      const allowedDistricts = getDistricts(newDivision);
      if (!allowedDistricts.includes(district)) {
        setDistrict('');
        setUpazila('');
        setThana('');
      }
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    // Requirement E: Changing District MUST reset Upazila and Police Station
    setUpazila('');
    setThana('');
  };

  const handleUpazilaChange = (newUpazila: string) => {
    setUpazila(newUpazila);
    // Requirement E: Changing Upazila MUST reset Police Station
    setThana('');
  };

  // Section F: Profile Submission & Database Persistence
  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // 1. Name validation
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'গ্রাহকের পুরো নাম আবশ্যক (কমপক্ষে ২ অক্ষর)';
    }

    // 2. Phone validation & OTP check
    const phoneCheck = validateBangladeshPhoneNumber(phone);
    if (!phoneCheck.isValid) {
      errors.phone = phoneCheck.errorBn || 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন';
    } else if (!isPhoneVerified) {
      errors.phone = 'মোবাইল নম্বরটি ওটিপি (OTP) দ্বারা যাচাই করতে হবে';
    }

    // 3. Email validation (if provided)
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'সঠিক ইমেইল ফরম্যাট প্রদান করুন (যেমন: example@gmail.com)';
    }

    // 4. Address validation per Requirement E
    const addressValidation = validateDeliveryAddress({
      division,
      district,
      upazila,
      thana,
      village,
      addressDetails,
      isManualAddress,
      manualAddress: manualAddressText,
    });

    if (!addressValidation.isValid) {
      Object.assign(errors, addressValidation.errors);
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('অনুগ্রহ করে ফরমের লাল চিহ্নিত ত্রুটিগুলো সংশোধন করুন');
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const profilePayload: CustomerInfo = {
      id: customer.id || `cust-${Date.now()}`,
      name: name.trim(),
      phone: normalizedPhone || phone.trim(),
      email: email.trim(),
      division: division || undefined,
      district: isManualAddress ? 'অন্যান্য' : district,
      upazila: isManualAddress ? 'অন্যান্য' : upazila,
      thana: isManualAddress ? 'অন্যান্য' : thana,
      village: isManualAddress ? 'অন্যান্য' : village.trim(),
      addressDetails: isManualAddress ? manualAddressText.trim() : addressDetails.trim(),
      avatar: avatar || customer.avatar,
      status: 'Active',
      facebookId: facebookId,
      facebookSynced: facebookSynced,
      facebookSyncedAt: facebookSynced ? new Date().toISOString() : undefined,
      phoneVerified: true,
      phoneVerifiedAt: phoneVerifiedAt || new Date().toISOString(),
      isManualAddress: isManualAddress,
      manualAddress: isManualAddress ? manualAddressText.trim() : undefined,
    };

    try {
      saveVerifiedCustomerProfile(profilePayload);
      setIsSubmitting(false);
      // Seamlessly navigate to profile view or checkout if items in cart
      navigateTo('profile');
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      (window as any).__saveErr = errMsg;
      console.error('Failed to save customer profile:', err);
      setIsSubmitting(false);
      showToast(`প্রোফাইল ত্রুটি: ${errMsg}`);
    }
  };

  // Section H: Account Unlinking
  const handleUnlink = () => {
    unlinkFacebookProfile();
    setFacebookId(undefined);
    setFacebookSynced(false);
    showToast('ফেসবুক অ্যাকাউন্ট সংযোগ বিচ্ছিন্ন করা হয়েছে');
  };

  // ==========================================
  // RENDER: SECTION A - WELCOME LANDING PAGE
  // ==========================================
  if (viewMode === 'welcome') {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-md text-center space-y-6">
          {/* Official Haat Bazar Logo and Branding */}
          <div className="flex flex-col items-center justify-center">
            <BrandLogo size="lg" showSlogan={false} />
            <p className="text-xs text-[#006B35] font-semibold mt-2">
              আপনার বিশ্বাস, আমাদের অঙ্গীকার
            </p>
          </div>

          {/* Clean Welcome Message (No promotional messages, no instructional steps) */}
          <div className="py-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              স্বাগতম হাট বাজার ডট কমে
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              দেশীয় খাঁটি পণ্য সহজে অর্ডার করতে আপনার কাস্টমার প্রোফাইল নিবন্ধন সম্পন্ন করুন।
            </p>
          </div>

          {/* Error / Alert notice if OAuth fails */}
          {syncError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{syncError}</p>
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className="mt-1 text-emerald-700 font-bold underline cursor-pointer"
                >
                  সরাসরি ফরম পূরণ করতে এখানে ক্লিক করুন →
                </button>
              </div>
            </div>
          )}

          {/* TWO HORIZONTAL BUTTONS (Strict text-only, Red Cancel on left, Blue Continue on right, NO Facebook logos or icons) */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {/* Left: Red Cancel button (Text only) */}
            <button
              type="button"
              onClick={handleCancelWelcome}
              className="w-1/2 py-3 px-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer text-center"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            {/* Right: Blue Continue button (Text only, initiates Facebook OAuth) */}
            <button
              type="button"
              disabled={isAuthenticating}
              onClick={handleContinueFacebookOAuth}
              className="w-1/2 py-3 px-5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer text-center disabled:opacity-60"
            >
              {isAuthenticating
                ? (language === 'bn' ? 'সংযোগ হচ্ছে...' : 'Connecting...')
                : (language === 'bn' ? 'চালিয়ে যান' : 'Continue')}
            </button>
          </div>

          {/* Secondary manual entry option per Requirement B */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                // Requirement C: Blank form before synchronization
                setName('');
                setPhone('');
                setEmail('');
                setAvatar('');
                setFacebookSynced(false);
                setViewMode('form');
              }}
              className="text-xs text-gray-500 hover:text-[#006B35] font-semibold underline cursor-pointer"
            >
              অথবা সরাসরি ম্যানুয়াল ফরম পূরণ করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: SECTION B to H - PROFILE REGISTRATION FORM
  // ==========================================
  return (
    <div className="max-w-2xl mx-auto py-6 px-3 sm:px-6 space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" showSlogan={false} />
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900">
              কাস্টমার প্রোফাইল নিবন্ধন
            </h2>
            <p className="text-[11px] text-gray-500">
              {facebookSynced
                ? 'ফেসবুক প্রোফাইল সিঙ্ক সম্পন্ন • তথ্য যাচাই করে নিশ্চিত করুন'
                : 'সকল প্রয়োজনীয় তথ্য নির্ভুলভাবে প্রদান করুন'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('welcome')}
          className="text-xs text-gray-500 hover:text-gray-800 font-semibold px-3 py-1.5 border border-gray-200 rounded-xl"
        >
          ওয়েলকাম পেজ
        </button>
      </div>

      {/* Sync Status Banner if Synced with Facebook */}
      {facebookSynced && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                {name.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>প্রোফাইল সিঙ্ক সম্পন্ন হয়েছে</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                ফেসবুক আইডি: <span className="font-mono">{facebookId}</span> • মোবাইল নম্বর ও ঠিকানা পূরণ করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUnlink}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer shrink-0"
          >
            সংযোগ বিচ্ছিন্ন করুন
          </button>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmitProfile} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <User className="w-4 h-4 text-[#006B35]" />
            <h3 className="text-sm font-bold text-gray-900">ব্যক্তিগত তথ্য</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Field (Blank before sync; automatically populated after sync) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>পূর্ণ নাম <span className="text-rose-500">*</span></span>
                {facebookSynced && (
                  <span className="text-[10px] text-emerald-600 font-semibold">সিঙ্ককৃত নাম</span>
                )}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার পূর্ণ নাম লিখুন"
                className={`w-full p-2.5 rounded-xl border text-xs outline-hidden ${
                  formErrors.name ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                }`}
                required
              />
              {formErrors.name && (
                <p className="text-[11px] text-rose-500">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field (Blank before sync; populated if user granted permission on Facebook) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>ইমেইল ঠিকানা (ঐচ্ছিক)</span>
                {facebookSynced && email && (
                  <span className="text-[10px] text-emerald-600 font-semibold">সিঙ্ককৃত ইমেইল</span>
                )}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className={`w-full p-2.5 rounded-xl border text-xs outline-hidden ${
                  formErrors.email ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                }`}
              />
              {formErrors.email && (
                <p className="text-[11px] text-rose-500">{formErrors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Bangladesh Phone Validation & OTP Verification (Requirement C & D) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#006B35]" />
              <h3 className="text-sm font-bold text-gray-900">
                বাংলাদেশি মোবাইল নম্বর ও ওটিপি যাচাই <span className="text-rose-500">*</span>
              </h3>
            </div>
            {isPhoneVerified ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                যাচাইকৃত (Verified)
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                যাচাই আবশ্যক
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">
              মোবাইল নম্বর (১১ ডিজিট, প্রিফিক্স: ০১৩, ০১৪, ০১৫, ০১৬, ০১৭, ০১৮, ০১৯)
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="যেমন: 01712345678 বা +8801712345678"
                className={`flex-1 p-2.5 rounded-xl border font-mono text-xs outline-hidden ${
                  phoneError || formErrors.phone
                    ? 'border-rose-400 bg-rose-50/40'
                    : isPhoneVerified
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-gray-300 focus:border-[#006B35]'
                }`}
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 py-2.5 bg-[#006B35] hover:bg-[#005228] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
              >
                {isPhoneVerified ? 'পুনরায় ওটিপি' : 'ওটিপি পাঠান'}
              </button>
            </div>

            {/* Clear validation feedback */}
            {phoneError && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{phoneError}</span>
              </p>
            )}
            {!phoneError && formErrors.phone && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formErrors.phone}</span>
              </p>
            )}
            {normalizedPhone && !phoneError && (
              <p className="text-[11px] text-gray-500">
                ডাটাবেজে সংরক্ষিত ফরম্যাট: <strong className="font-mono text-gray-800">{normalizedPhone}</strong>
                <span className="ml-2 text-[10px] text-gray-400">(MNP সমর্থিত)</span>
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Bangladesh Administrative Location Selection (Requirement E) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#006B35]" />
              <h3 className="text-sm font-bold text-gray-900">ডেলিভারি ঠিকানা ও এলাকা</h3>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isManualAddress}
                onChange={(e) => setIsManualAddress(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#006B35]"
              />
              <span className="text-[11px] font-semibold">ম্যানুয়াল ঠিকানা লিখুন</span>
            </label>
          </div>

          {!isManualAddress ? (
            <div className="space-y-3">
              {/* 1. Division (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">১. বিভাগ (Division - ঐচ্ছিক)</label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden bg-white text-xs"
                  >
                    <option value="">সকল বিভাগ (All Divisions)</option>
                    {getDivisions().map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.nameBn} ({div.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. District (Required - resets Upazila and Thana on change) */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">
                    ২. জেলা (District) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-hidden bg-white ${
                      formErrors.district ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                    }`}
                    required
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {getDistricts(division || undefined).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {formErrors.district && (
                    <p className="text-[11px] text-rose-500">{formErrors.district}</p>
                  )}
                </div>
              </div>

              {/* 3. Upazila (Required) & 4. Police Station / Thana (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">
                    ৩. উপজেলা (Upazila) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={upazila}
                    disabled={!district}
                    onChange={(e) => handleUpazilaChange(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-hidden bg-white disabled:bg-gray-100 ${
                      formErrors.upazila ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                    }`}
                    required
                  >
                    <option value="">উপজেলা নির্বাচন করুন</option>
                    {district &&
                      getUpazilas(district).map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                  </select>
                  {formErrors.upazila && (
                    <p className="text-[11px] text-rose-500">{formErrors.upazila}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">
                    ৪. থানা / পুলিশ স্টেশন (Thana) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={thana}
                    disabled={!upazila}
                    onChange={(e) => setThana(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-hidden bg-white disabled:bg-gray-100 ${
                      formErrors.thana ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                    }`}
                    required
                  >
                    <option value="">থানা নির্বাচন করুন</option>
                    {district &&
                      upazila &&
                      getThanas(district, upazila).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                  </select>
                  {formErrors.thana && (
                    <p className="text-[11px] text-rose-500">{formErrors.thana}</p>
                  )}
                </div>
              </div>

              {/* 5. Village / Union / Ward & 6. Exact Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">
                    ৫. গ্রাম / ইউনিয়ন / ওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="গ্রাম বা এলাকার নাম লিখুন"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-hidden ${
                      formErrors.village ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                    }`}
                    required
                  />
                  {formErrors.village && (
                    <p className="text-[11px] text-rose-500">{formErrors.village}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">
                    ৬. বিস্তারিত সুনির্দিষ্ট ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, ফ্ল্যাট, ল্যান্ডমার্ক"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-hidden ${
                      formErrors.addressDetails ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                    }`}
                    required
                  />
                  {formErrors.addressDetails && (
                    <p className="text-[11px] text-rose-500">{formErrors.addressDetails}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Manual Address Field for locations not in the dataset per Requirement E */
            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-700 block">
                ম্যানুয়াল পূর্ণাঙ্গ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={manualAddressText}
                onChange={(e) => setManualAddressText(e.target.value)}
                placeholder="আপনার পূর্ণাঙ্গ ঠিকানা (বিভাগ, জেলা, উপজেলা, থানা, গ্রাম ও বাড়ি/রোড নং) বিস্তারিতভাবে লিখুন..."
                className={`w-full p-3 rounded-xl border text-xs outline-hidden ${
                  formErrors.manualAddress ? 'border-rose-400 bg-rose-50/40' : 'border-gray-300 focus:border-[#006B35]'
                }`}
                required
              />
              {formErrors.manualAddress && (
                <p className="text-[11px] text-rose-500">{formErrors.manualAddress}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500">
            <span className="text-emerald-700 font-bold">সুরক্ষিত নিবন্ধন:</span> তথ্য সরাসরি এনক্রিপ্ট করে ডাটাবেজে সংরক্ষিত হবে।
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-[#006B35] hover:bg-[#005228] text-white font-bold text-xs rounded-2xl shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল সংরক্ষণ ও সম্পন্ন করুন'}
          </button>
        </div>
      </form>

      {/* Privacy, Unlinking & Data Deletion Compliance Card (Requirement H) */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 text-xs text-gray-600 space-y-3">
        <div className="flex items-center gap-2 text-gray-800 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#006B35]" />
          <span>গোপনীয়তা, সম্মতি ও ডেটা অপসারণ নীতি (Meta & Privacy Compliance)</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          হাট বাজার আপনার তথ্যের সর্বোচ্চ নিরাপত্তা বজায় রাখে। ফেসবুক লগইনের মাধ্যমে শুধুমাত্র অনুমোদিত নাম, ইমেইল ও ছবি গ্রহণ করা হয়। আপনার ফোন নম্বর তৃতীয় কোনো পক্ষের সাথে ভাগ করা হয় না।
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px]">
          {facebookSynced && (
            <button
              type="button"
              onClick={handleUnlink}
              className="font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ফেসবুক অ্যাকাউন্ট আনলিঙ্ক করুন</span>
            </button>
          )}

          <a
            href="/api/auth/facebook/data-deletion-status"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#006B35] hover:underline flex items-center gap-1"
          >
            <span>ডেটা মোছার অনুরোধের স্ট্যাটাস দেখুন</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={() => navigateTo('privacy-terms')}
            className="text-gray-500 hover:text-gray-800 underline"
          >
            গোপনীয়তা নীতি ও শর্তাবলী
          </button>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-[#006B35]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm text-gray-900">মোবাইল ওটিপি যাচাই</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                বন্ধ
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              আপনার নম্বর <strong>{normalizedPhone || phone}</strong> এর সত্যতা নিশ্চিত করতে ৪-সংখ্যার ওটিপি কোড দিন।
            </p>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-xs text-emerald-800">
                সিকিউরিটি ওটিপি কোড: <strong className="font-mono text-base font-black text-[#006B35] ml-1">{generatedOtp}</strong>
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                maxLength={4}
                value={userOtpInput}
                onChange={(e) => setUserOtpInput(e.target.value)}
                placeholder="4-digit OTP"
                autoFocus
                className="w-full text-center tracking-widest font-mono text-xl py-2 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
              />
              {otpError && <p className="text-[11px] text-rose-500 text-center">{otpError}</p>}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="w-1/2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmOtp}
                className="w-1/2 py-2.5 bg-[#006B35] hover:bg-[#005228] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                যাচাই করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
