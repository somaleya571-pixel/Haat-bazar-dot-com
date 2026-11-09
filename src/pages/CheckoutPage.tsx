import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Truck,
  Lock,
  MapPin,
  Ticket,
  CheckCircle2,
  X,
  Phone,
  User,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SearchableDropdown } from '../components/SearchableDropdown';
import {
  getDivisions,
  getDistricts,
  getUpazilas,
  getThanas,
  validateDeliveryAddress,
  isInsideDhaka,
} from '../utils/location';
import { validateBangladeshPhoneNumber } from '../utils/phoneValidation';
import { formatCurrency, calculateEffectivePrice, calculateCourierDeliveryCharge } from '../utils/pricing';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotals,
    customer,
    updateCustomerProfile,
    placeOrder,
    navigateTo,
    language,
    showToast,
    couriers,
    paymentSettings,
    officialContact,
    websiteSettings,
    activeCoupon,
    applyCoupon,
    removeCoupon,
  } = useShop();

  // Customer Contact Fields (Prefilled from customer profile per Requirement G)
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [email, setEmail] = useState(customer.email || '');

  // Address Fields (Prefilled & editable per customer profile)
  const [division, setDivision] = useState(customer.division || '');
  const [district, setDistrict] = useState(customer.district || '');
  const [upazila, setUpazila] = useState(customer.upazila || '');
  const [thana, setThana] = useState(customer.thana || '');
  const [village, setVillage] = useState(customer.village || '');
  const [addressDetails, setAddressDetails] = useState(customer.addressDetails || '');
  const [isManualAddress, setIsManualAddress] = useState(customer.isManualAddress || false);
  const [manualAddress, setManualAddress] = useState(customer.manualAddress || '');

  // Explicit Order Confirmation Modal state per Requirement G
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Automatically prefill previously saved customer information during checkout
  useEffect(() => {
    if (customer.name && !name) setName(customer.name);
    if (customer.phone && !phone) setPhone(customer.phone);
    if (customer.email && !email) setEmail(customer.email);
    if (customer.division && !division) setDivision(customer.division);
    if (customer.district && !district) setDistrict(customer.district);
    if (customer.upazila && !upazila) setUpazila(customer.upazila);
    if (customer.thana && !thana) setThana(customer.thana);
    if (customer.village && !village) setVillage(customer.village);
    if (customer.addressDetails && !addressDetails) setAddressDetails(customer.addressDetails);
    if (customer.isManualAddress !== undefined) setIsManualAddress(customer.isManualAddress);
    if (customer.manualAddress) setManualAddress(customer.manualAddress);
  }, [customer]);

  // Active Couriers
  const activeCouriers = couriers.filter((c) => c.isActive);
  const [selectedCourierId, setSelectedCourierId] = useState<string>(
    activeCouriers[0]?.id || 'cr-1'
  );
  const selectedCourier = couriers.find((c) => c.id === selectedCourierId) || couriers[0];

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad'>(
    paymentSettings.codEnabled ? 'Cash on Delivery' : 'bKash'
  );
  const [bKashNumber, setBKashNumber] = useState(customer.phone || '');
  const [trxId, setTrxId] = useState('');

  // Coupon Input
  const [couponInput, setCouponInput] = useState('');

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Options
  const districtList = getDistricts();
  const upazilaList = getUpazilas(district);
  const thanaList = getThanas(district, upazila);

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const newUpazilas = getUpazilas(d);
    const defaultUpazila = newUpazilas[0] || '';
    setUpazila(defaultUpazila);
    const newThanas = getThanas(d, defaultUpazila);
    setThana(newThanas[0] || '');
  };

  const handleUpazilaChange = (u: string) => {
    setUpazila(u);
    const newThanas = getThanas(district, u);
    setThana(newThanas[0] || '');
  };

  // Compute total weight
  const totalCartWeightKg = cart.reduce((sum, item) => sum + (item.quantity * 0.5), 0.5);

  // Dynamic courier delivery charge
  const courierCalculation = calculateCourierDeliveryCharge({
    courier: selectedCourier,
    district,
    weightKg: totalCartWeightKg,
    subtotal: cartTotals.subtotal,
    freeDeliveryThreshold: websiteSettings.freeDeliveryThreshold,
  });

  const calculatedFreight = courierCalculation.charge;
  const finalOrderTotal = Math.max(0, cartTotals.subtotal + calculatedFreight - (cartTotals.couponDiscount || 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast(language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty');
      navigateTo('cart');
      return;
    }

    const newErrors: Record<string, string> = {};

    // Validate Customer Info
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'গ্রাহকের পুরো নাম আবশ্যক (Full name min 3 chars)';
    }

    const phoneCheck = validateBangladeshPhoneNumber(phone);
    if (!phoneCheck.isValid) {
      newErrors.phone = phoneCheck.errorBn || 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'সঠিক জিমেইল বা ইমেইল ঠিকানা দিন (Valid Gmail required)';
    }

    // Validate Address via Location utility
    const addressValidation = validateDeliveryAddress({
      division,
      district,
      upazila,
      thana,
      village,
      addressDetails,
      isManualAddress,
      manualAddress,
    });

    if (!addressValidation.isValid) {
      Object.assign(newErrors, addressValidation.errors);
    }

    // Payment validation for bKash / Nagad
    if (paymentMethod === 'bKash' || paymentMethod === 'Nagad') {
      if (!bKashNumber.trim() || !/^01[3-9]\d{8}$/.test(bKashNumber.trim().replace(/\D/g, ''))) {
        newErrors.bKashNumber = `${paymentMethod} নম্বর প্রদান আবশ্যক (১১ সংখ্যা)`;
      }
      if (!trxId.trim() || trxId.trim().length < 6) {
        newErrors.trxId = 'সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(language === 'bn' ? 'সকল আবশ্যক তথ্য সঠিকভাবে পূরণ করুন' : 'Please fix form errors');
      return;
    }

    setErrors({});
    // Requirement G: Require explicit order confirmation before placing an order
    setShowConfirmModal(true);
  };

  const executePlaceOrder = () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    // Save customer info
    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      division,
      district: isManualAddress ? 'অন্যান্য' : district,
      upazila: isManualAddress ? 'অন্যান্য' : upazila,
      thana: isManualAddress ? 'অন্যান্য' : thana,
      village: isManualAddress ? 'অন্যান্য' : village.trim(),
      addressDetails: isManualAddress ? manualAddress.trim() : addressDetails.trim(),
      isManualAddress,
      manualAddress: isManualAddress ? manualAddress.trim() : undefined,
    });

    // Format Order Items
    const orderItems = cart.map((item) => {
      const priceCalc = calculateEffectivePrice(
        item.product.regularPrice,
        item.product.discountPercentage,
        item.product.discountStartDate,
        item.product.discountEndDate
      );
      return {
        productId: item.productId,
        name: item.product.name,
        nameBn: item.product.nameBn,
        image: item.product.image,
        price: priceCalc.effectivePrice,
        quantity: item.quantity,
      };
    });

    const paymentStatus =
      paymentMethod === 'Cash on Delivery'
        ? 'Cash on Delivery'
        : 'Pending Verification';

    const createdOrder = placeOrder({
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        division,
        district: isManualAddress ? 'অন্যান্য' : district,
        upazila: isManualAddress ? 'অন্যান্য' : upazila,
        thana: isManualAddress ? 'অন্যান্য' : thana,
        village: isManualAddress ? 'অন্যান্য' : village.trim(),
        addressDetails: isManualAddress ? manualAddress.trim() : addressDetails.trim(),
        isManualAddress,
        manualAddress: isManualAddress ? manualAddress.trim() : undefined,
      },
      items: orderItems,
      subtotal: cartTotals.subtotal,
      deliveryCharge: calculatedFreight,
      totalAmount: finalOrderTotal,
      paymentMethod,
      paymentStatus,
      bKashNumber: paymentMethod !== 'Cash on Delivery' ? bKashNumber : undefined,
      trxId: paymentMethod !== 'Cash on Delivery' ? trxId : undefined,
      assignedCourierId: selectedCourier.id,
      assignedCourierName: selectedCourier.name,
    });

    showToast(
      language === 'bn'
        ? 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে এবং প্রোফাইল তথ্য অটোমেটিকলি আপডেট হয়েছে!'
        : 'Order placed successfully and profile details updated automatically!'
    );

    setTimeout(() => {
      setIsSubmitting(false);
      navigateTo('order-confirmation', { orderId: createdOrder.id });
    }, 600);
  };

  return (
    <div className="space-y-6 pb-32 sm:pb-16 viewport-padding-safe">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('cart')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'চেকআউট ও অর্ডার সম্পন্নকরণ' : 'Checkout & Confirm Order'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? 'সরাসরি তথ্য পূরণ করুন - কোনো পূর্ব রেজিস্ট্রেশন আবশ্যক নয়'
                : 'Direct Guest Checkout - No mandatory prior account needed'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('delivery-address')}
          className="text-xs font-bold text-[#006B35] bg-emerald-50 px-3 py-1.5 rounded-full border border-[#006B35]/20 hover:bg-emerald-100 transition-colors flex items-center gap-1"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>ঠিকানা পেজ</span>
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Details & Cascading Address */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section 1: Customer Contact Info */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006B35] text-white text-xs flex items-center justify-center font-mono">
                1
              </span>
              <span>{language === 'bn' ? 'গ্রাহকের ব্যক্তিগত তথ্য (Customer Information)' : 'Customer Info'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-gray-700">
                  {language === 'bn' ? 'গ্রাহকের পূর্ণ নাম' : 'Full Name'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মোঃ সাহাবুল ইসলাম"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.name ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#006B35]'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">
                  {language === 'bn' ? 'সচল মোবাইল নম্বর' : 'Phone Number'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.phone ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#006B35]'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">
                  {language === 'bn' ? 'জিমেইল / ইমেইল ঠিকানা' : 'Gmail Address'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.email ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#006B35]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Exact Cascading Delivery Address */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#006B35] text-white text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা (বাংলাদেশ ৬৪ জেলা)' : 'Delivery Address'}</span>
              </h2>
              <span className="text-[11px] text-gray-400">প্রতিটি ফিল্ড বাধ্যতামূলক</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Searchable District */}
              <SearchableDropdown
                label={language === 'bn' ? 'জেলা (District)' : 'District'}
                placeholder="জেলা বাছাই করুন..."
                options={districtList}
                value={district}
                onChange={handleDistrictChange}
                required
                error={errors.district}
              />

              {/* Searchable Upazila (Cascading) */}
              <SearchableDropdown
                label={language === 'bn' ? 'উপজেলা (Upazila)' : 'Upazila'}
                placeholder="উপজেলা বাছাই করুন..."
                options={upazilaList}
                value={upazila}
                onChange={handleUpazilaChange}
                disabled={!district}
                required
                error={errors.upazila}
              />

              {/* Searchable Thana (Cascading) */}
              <SearchableDropdown
                label={language === 'bn' ? 'থানা (Thana)' : 'Thana'}
                placeholder="থানা বাছাই করুন..."
                options={thanaList}
                value={thana}
                onChange={setThana}
                disabled={!upazila}
                required
                error={errors.thana}
              />
            </div>

            {/* Village & Detailed Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-1">
                <label className="block font-bold text-gray-700">
                  {language === 'bn' ? 'গ্রাম / মহল্লা (Village)' : 'Village Name'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="গ্রাম বা এলাকার নাম..."
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.village ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#006B35]'
                  }`}
                />
                {errors.village && <p className="text-[11px] text-rose-500">{errors.village}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block font-bold text-gray-700">
                  {language === 'bn' ? 'পূর্ণাঙ্গ বিস্তারিত ঠিকানা' : 'Detailed Address'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="বাড়ি নং, ফ্ল্যাট নং, রোডের নাম বা ল্যান্ডমার্ক..."
                  className={`w-full px-3 py-2 rounded-xl border ${
                    errors.addressDetails ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#006B35]'
                  }`}
                />
                {errors.addressDetails && (
                  <p className="text-[11px] text-rose-500">{errors.addressDetails}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Courier Service Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#006B35] text-white text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <span>{language === 'bn' ? 'কুরিয়ার ডেলিভারি সার্ভিস নির্বাচন' : 'Select Courier Service'}</span>
              </h2>
              <span className="text-[11px] text-[#006B35] font-semibold">
                {isInsideDhaka(district) ? 'ঢাকার ভেতর' : 'ঢাকার বাইরে'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeCouriers.map((cr) => {
                const res = calculateCourierDeliveryCharge({
                  courier: cr,
                  district,
                  weightKg: totalCartWeightKg,
                  subtotal: cartTotals.subtotal,
                  freeDeliveryThreshold: websiteSettings.freeDeliveryThreshold,
                });
                const isSelected = cr.id === selectedCourierId;
                const estimatedDays = isInsideDhaka(district) ? cr.estimatedDaysInside : cr.estimatedDaysOutside;

                return (
                  <div
                    key={cr.id}
                    onClick={() => setSelectedCourierId(cr.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#006B35] bg-[#E8F7EC]/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#17231B]">{cr.name}</h4>
                      <Truck className={`w-4 h-4 ${isSelected ? 'text-[#006B35]' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{estimatedDays}</p>
                    <div className="mt-2 text-xs font-bold text-[#006B35]">
                      {res.isFree ? 'ফ্রি ডেলিভারি' : `৳${res.charge}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#006B35] text-white text-xs flex items-center justify-center font-mono">
                4
              </span>
              <span>{language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন (Payment Method)' : 'Select Payment Method'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash on Delivery */}
              {paymentSettings.codEnabled && (
                <label
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#006B35] bg-[#E8F7EC]/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="w-4 h-4 text-[#006B35] accent-[#006B35]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">ক্যাশ অন ডেলিভারি</h4>
                    <p className="text-[10px] text-gray-500">পণ্য হাতে পেয়ে টাকা দিন</p>
                  </div>
                </label>
              )}

              {/* bKash Payment */}
              {paymentSettings.bKashEnabled && (
                <label
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'bKash'
                      ? 'border-[#e2136e] bg-pink-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="w-4 h-4 text-[#e2136e] accent-[#e2136e]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#e2136e]">বিকাশ (bKash)</h4>
                    <p className="text-[10px] text-gray-500">{paymentSettings.bKashType}</p>
                  </div>
                </label>
              )}

              {/* Nagad Payment */}
              {paymentSettings.nagadEnabled && (
                <label
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'border-[#f7931e] bg-orange-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Nagad'}
                    onChange={() => setPaymentMethod('Nagad')}
                    className="w-4 h-4 text-[#f7931e] accent-[#f7931e]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#f7931e]">নগদ (Nagad)</h4>
                    <p className="text-[10px] text-gray-500">{paymentSettings.nagadType}</p>
                  </div>
                </label>
              )}
            </div>

            {/* bKash / Nagad Transaction ID Input Box */}
            {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-800">
                    {paymentMethod} একাউন্ট নম্বর:{' '}
                    <strong className="text-[#006B35] font-mono text-sm">
                      {paymentMethod === 'bKash' ? paymentSettings.bKashNumber : paymentSettings.nagadNumber}
                    </strong>
                  </span>
                  <p className="text-[11px] text-gray-500">
                    {paymentMethod === 'bKash' ? paymentSettings.bKashInstructions : paymentSettings.nagadInstructions}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700">
                      আপনার {paymentMethod} নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={bKashNumber}
                      onChange={(e) => setBKashNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className={`w-full px-3 py-2 rounded-xl border bg-white ${
                        errors.bKashNumber ? 'border-rose-400' : 'border-gray-300'
                      }`}
                    />
                    {errors.bKashNumber && (
                      <p className="text-[11px] text-rose-500">{errors.bKashNumber}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700">
                      ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="যেমন: BK9A82J103"
                      className={`w-full px-3 py-2 rounded-xl border bg-white font-mono uppercase ${
                        errors.trxId ? 'border-rose-400' : 'border-gray-300'
                      }`}
                    />
                    {errors.trxId && <p className="text-[11px] text-rose-500">{errors.trxId}</p>}
                  </div>
                </div>

                <p className="text-[10px] text-amber-700 italic">
                  * পেমেন্ট যাচাইয়ের পর অর্ডার স্ট্যাটাস কনফার্মড হবে। কোনো ভুয়া ট্রানজেকশন নিশ্চিত করা হয় না।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Place Order Button */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5">
              {language === 'bn' ? 'অর্ডার আইটেম সমূহ' : 'Order Items'} ({cart.length})
            </h3>

            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => {
                const priceCalc = calculateEffectivePrice(
                  item.product.regularPrice,
                  item.product.discountPercentage
                );
                return (
                  <div key={item.productId} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-gray-900 truncate">
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {item.quantity} x {formatCurrency(priceCalc.effectivePrice, language)}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      {formatCurrency(priceCalc.effectivePrice * item.quantity, language)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Application Box */}
            <div className="pt-2 border-t border-slate-100">
              {activeCoupon ? (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>কুপন কোড: {activeCoupon.code}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                  >
                    মুছে ফেলুন
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="কুপন কোড (যেমন: HAAT100)"
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-[#006B35] text-white rounded-lg text-xs font-bold"
                  >
                    প্রয়োগ
                  </button>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>উপমোট (Subtotal):</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(cartTotals.subtotal, language)}
                </span>
              </div>

              {cartTotals.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>কুপন ছাড় (Discount):</span>
                  <span>- {formatCurrency(cartTotals.couponDiscount, language)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>কুরিয়ার ডেলিভারি ({selectedCourier.name}):</span>
                <span
                  className={`font-bold ${
                    calculatedFreight === 0 ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {calculatedFreight === 0
                    ? 'ফ্রি (FREE)'
                    : formatCurrency(calculatedFreight, language)}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-black text-sm text-gray-900">সর্বমোট প্রদেয়:</span>
                <span className="text-xl font-black text-[#006B35]">
                  {formatCurrency(finalOrderTotal, language)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                isSubmitting || cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#006B35] hover:bg-[#005228] text-white hover:shadow-lg active:scale-98'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'অর্ডার প্রক্রিয়াধীন...'
                  : language === 'bn'
                  ? 'অর্ডার নিশ্চিত করুন (Confirm Order)'
                  : 'Place Order Now'}
              </span>
            </button>

            <div className="text-center text-[10px] text-gray-400 space-y-1 pt-1">
              <p>অর্ডার সাবমিট করার মাধ্যমে আপনি হাট বাজারের শর্তাবলীর সাথে সম্মত হচ্ছেন</p>
              <p className="text-[#006B35] font-medium">২৪/৭ হটলাইন সহায়তা: {officialContact.hotline}</p>
            </div>
          </div>
        </div>
      </form>

      {/* Explicit Order Confirmation Modal (Requirement G) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#006B35]">
                <CheckCircle2 className="w-5 h-5 text-[#006B35]" />
                <h3 className="font-bold text-base text-gray-900">
                  অর্ডার চূড়ান্ত নিশ্চিতকরণ (Order Confirmation)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা ও অর্ডারের বিবরণ পরীক্ষা করে নিশ্চিত করুন:
            </p>

            {/* Customer & Address Details */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <User className="w-3.5 h-3.5 text-[#006B35]" />
                <span>প্রাপকের নাম: {name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <Phone className="w-3.5 h-3.5 text-[#006B35]" />
                <span className="font-mono">মোবাইল: {phone}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-700 pt-1 border-t border-gray-200">
                <MapPin className="w-3.5 h-3.5 text-[#006B35] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-gray-900">ডেলিভারি ঠিকানা:</span>
                  {isManualAddress ? (
                    <p className="text-gray-800">{manualAddress}</p>
                  ) : (
                    <p className="text-gray-800">
                      {addressDetails}, {village}, {thana}, {upazila}, {district}
                      {division ? `, ${division} বিভাগ` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Courier & Payment */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">কুরিয়ার সার্ভিস</span>
                <span className="font-bold text-emerald-950">{selectedCourier.name}</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block text-[10px]">পেমেন্ট মাধ্যম</span>
                <span className="font-bold text-emerald-950">{paymentMethod}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-1 pt-1 text-xs">
              <span className="font-bold text-gray-800 block text-[11px]">আইটেম সারসংক্ষেপ ({cart.length} টি পণ্য):</span>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-1 border-b border-gray-100 text-gray-700">
                    <span className="truncate max-w-[200px]">{item.product.nameBn} × {item.quantity}</span>
                    <span className="font-bold">৳{item.product.regularPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-[#006B35]/10 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">সর্বমোট প্রদেয় মূল্য:</span>
              <span className="text-base font-black text-[#006B35]">
                {formatCurrency(finalOrderTotal, language)}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                তথ্য পরিবর্তন (Edit)
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={executePlaceOrder}
                className="w-1/2 py-2.5 bg-[#006B35] hover:bg-[#005228] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'প্রসেসিং...' : 'হ্যাঁ, কনফার্ম করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
