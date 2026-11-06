import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Lock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SearchableDropdown } from '../components/SearchableDropdown';
import {
  getDistricts,
  getUpazilas,
  getThanas,
  validateDeliveryAddress,
} from '../utils/location';
import { formatCurrency, calculateEffectivePrice } from '../utils/pricing';

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
  } = useShop();

  // Customer Contact Fields
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [email, setEmail] = useState(customer.email || '');

  // Address Fields
  const [district, setDistrict] = useState(customer.district || 'Dhaka');
  const [upazila, setUpazila] = useState(customer.upazila || 'Dhanmondi');
  const [thana, setThana] = useState(customer.thana || 'Dhanmondi Thana');
  const [village, setVillage] = useState(customer.village || 'Road 8/A');
  const [addressDetails, setAddressDetails] = useState(customer.addressDetails || 'House 34, Flat 5A');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad'>('Cash on Delivery');
  const [bKashNumber, setBKashNumber] = useState(customer.phone || '');
  const [trxId, setTrxId] = useState('');

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

    if (!phone.trim() || !/^01[3-9]\d{8}$/.test(phone.trim().replace(/\D/g, ''))) {
      newErrors.phone = 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'সঠিক জিমেইল বা ইমেইল ঠিকানা দিন (Valid Gmail required)';
    }

    // Validate Address via Location utility
    const addressValidation = validateDeliveryAddress({
      district,
      upazila,
      thana,
      village,
      addressDetails,
    });

    if (!addressValidation.isValid) {
      Object.assign(newErrors, addressValidation.errors);
    }

    // Payment validation for bKash / Nagad
    if (paymentMethod === 'bKash' || paymentMethod === 'Nagad') {
      if (!bKashNumber.trim() || !/^01[3-9]\d{8}$/.test(bKashNumber.trim().replace(/\D/g, ''))) {
        newErrors.bKashNumber = `${paymentMethod} নম্বর প্রদান আবশ্যক (১১ সংখ্যা)`;
      }
      if (!trxId.trim() || trxId.trim().length < 8) {
        newErrors.trxId = 'সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন (কমপক্ষে ৮ অক্ষর)';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(language === 'bn' ? 'সকল আবশ্যক তথ্য সঠিকভাবে পূরণ করুন' : 'Please fix form errors');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Save customer info
    updateCustomerProfile({
      name,
      phone,
      email,
      district,
      upazila,
      thana,
      village,
      addressDetails,
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
        : 'Pending Verification'; // Strictly follow requirement: Do not claim payment is successful until verified!

    const createdOrder = placeOrder({
      customer: {
        name,
        phone,
        email,
        district,
        upazila,
        thana,
        village,
        addressDetails,
      },
      items: orderItems,
      subtotal: cartTotals.subtotal,
      deliveryCharge: cartTotals.deliveryCharge,
      totalAmount: cartTotals.total,
      paymentMethod,
      paymentStatus,
      bKashNumber: paymentMethod !== 'Cash on Delivery' ? bKashNumber : undefined,
      trxId: paymentMethod !== 'Cash on Delivery' ? trxId : undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigateTo('order-confirmation', { orderId: createdOrder.id });
    }, 600);
  };

  return (
    <div className="space-y-6 pb-20">
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
          className="text-xs font-bold text-[#007A3D] bg-emerald-50 px-3 py-1.5 rounded-full border border-[#007A3D]/20 hover:bg-emerald-100 transition-colors flex items-center gap-1"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>ঠিকানা পেজ (Page 08)</span>
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Details & Cascading Address */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section 1: Customer Contact Info */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#007A3D] text-white text-xs flex items-center justify-center font-mono">
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
                    errors.name ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
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
                    errors.phone ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
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
                    errors.email ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Exact Cascading Delivery Address (PAGE 08 Requirements Integrated) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#007A3D] text-white text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা (Cascading Searchable Address)' : 'Delivery Address'}</span>
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
                    errors.village ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
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
                    errors.addressDetails ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
                  }`}
                />
                {errors.addressDetails && (
                  <p className="text-[11px] text-rose-500">{errors.addressDetails}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#007A3D] text-white text-xs flex items-center justify-center font-mono">
                3
              </span>
              <span>{language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন (Payment Method)' : 'Select Payment Method'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#007A3D] bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="w-4 h-4 text-[#007A3D] accent-[#007A3D]"
                />
                <div>
                  <h4 className="font-bold text-xs text-gray-900">ক্যাশ অন ডেলিভারি</h4>
                  <p className="text-[10px] text-gray-500">পণ্য হাতে পেয়ে টাকা দিন</p>
                </div>
              </label>

              {/* bKash Payment */}
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
                  <p className="text-[10px] text-gray-500">মার্চেন্ট পেমেন্ট / সেন্ড মানি</p>
                </div>
              </label>

              {/* Nagad Payment */}
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
                  <p className="text-[10px] text-gray-500">মার্চেন্ট পেমেন্ট</p>
                </div>
              </label>
            </div>

            {/* bKash / Nagad Transaction ID Input Box */}
            {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 text-xs animate-in fade-in duration-200">
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-gray-800">
                    {paymentMethod} মার্চেন্ট নম্বর: <strong className="text-[#007A3D] font-mono">01700-123456</strong>
                  </span>
                  <p className="text-[11px] text-gray-500">
                    উপরে উল্লেখিত নম্বরে ৳{cartTotals.total} টাকা পেমেন্ট সম্পন্ন করে নিচের বক্সে আপনার ব্যবহৃত নম্বর এবং ট্রানজেকশন আইডি (TrxID) লিখুন।
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

            {/* Calculations */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>উপমোট (Subtotal):</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(cartTotals.subtotal, language)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span
                  className={`font-bold ${
                    cartTotals.deliveryCharge === 0 ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {cartTotals.deliveryCharge === 0
                    ? 'ফ্রি (FREE)'
                    : formatCurrency(cartTotals.deliveryCharge, language)}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-black text-sm text-gray-900">সর্বমোট প্রদেয়:</span>
                <span className="text-xl font-black text-[#007A3D]">
                  {formatCurrency(cartTotals.total, language)}
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
                  : 'bg-[#007A3D] hover:bg-[#006030] text-white hover:shadow-lg active:scale-98'
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
              <p className="text-emerald-700 font-medium">২৪/৭ হটলাইন সহায়তা: +880 1700-123456</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
