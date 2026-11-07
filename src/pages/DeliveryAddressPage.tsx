import React, { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle, Save, Plus, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { FormFooter } from '../components/FormFooter';
import {
  getDistricts,
  getUpazilas,
  getThanas,
  validateDeliveryAddress,
} from '../utils/location';

export const DeliveryAddressPage: React.FC = () => {
  const { customer, updateCustomerProfile, navigateTo, language, showToast } = useShop();

  const [district, setDistrict] = useState(customer.district || 'Dhaka');
  const [upazila, setUpazila] = useState(customer.upazila || 'Dhanmondi');
  const [thana, setThana] = useState(customer.thana || 'Dhanmondi Thana');
  const [village, setVillage] = useState(customer.village || 'Road 8/A');
  const [addressDetails, setAddressDetails] = useState(customer.addressDetails || 'House 34, Flat 5A');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty =
    district !== (customer.district || 'Dhaka') ||
    upazila !== (customer.upazila || 'Dhanmondi') ||
    thana !== (customer.thana || 'Dhanmondi Thana') ||
    village !== (customer.village || 'Road 8/A') ||
    addressDetails !== (customer.addressDetails || 'House 34, Flat 5A');

  const handleClearAddress = () => {
    setDistrict(customer.district || 'Dhaka');
    setUpazila(customer.upazila || 'Dhanmondi');
    setThana(customer.thana || 'Dhanmondi Thana');
    setVillage(customer.village || 'Road 8/A');
    setAddressDetails(customer.addressDetails || 'House 34, Flat 5A');
    setErrors({});
  };

  // District options
  const districtList = getDistricts();

  // Cascading Upazila options based on selected District
  const upazilaList = getUpazilas(district);

  // Cascading Thana options based on selected District & Upazila
  const thanaList = getThanas(district, upazila);

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    // Reset dependent upazila and thana
    const newUpazilas = getUpazilas(selectedDistrict);
    const defaultUpazila = newUpazilas[0] || '';
    setUpazila(defaultUpazila);

    const newThanas = getThanas(selectedDistrict, defaultUpazila);
    setThana(newThanas[0] || '');
  };

  const handleUpazilaChange = (selectedUpazila: string) => {
    setUpazila(selectedUpazila);
    const newThanas = getThanas(district, selectedUpazila);
    setThana(newThanas[0] || '');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateDeliveryAddress({
      district,
      upazila,
      thana,
      village,
      addressDetails,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast(language === 'bn' ? 'সকল আবশ্যক ঠিকানা তথ্য পূরণ করুন' : 'Please fill all mandatory address fields');
      return;
    }

    setErrors({});
    updateCustomerProfile({
      district,
      upazila,
      thana,
      village,
      addressDetails,
    });

    showToast(language === 'bn' ? 'ডেলিভারি ঠিকানা সফলভাবে সংরক্ষিত হয়েছে' : 'Delivery address saved');
    navigateTo('checkout');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-32 sm:pb-16 viewport-padding-safe">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('checkout')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'ডেলিভারি ঠিকানা (Page 08: Delivery Address)' : 'Delivery Address'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? 'জেলা, উপজেলা ও থানা স্বতন্ত্র সার্চের মাধ্যমে নির্বাচন করুন'
                : 'Select District, Upazila & Thana with independent search'}
            </p>
          </div>
        </div>
      </div>

      {/* Address Form Card */}
      <form onSubmit={handleSaveAddress} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-[#007A3D]">
          <MapPin className="w-5 h-5" />
          <h2 className="font-bold text-sm text-gray-900">
            {language === 'bn' ? 'বাধ্যতামূলক ঠিকানা ফরম (সকল ফিল্ড পূরণ করুন)' : 'Mandatory Address Fields'}
          </h2>
        </div>

        {/* 1. Searchable District Dropdown */}
        <SearchableDropdown
          label={language === 'bn' ? 'জেলা (District)' : 'District'}
          placeholder="জেলা সার্চ করুন ও বাছাই করুন..."
          options={districtList}
          value={district}
          onChange={handleDistrictChange}
          required
          error={errors.district}
        />

        {/* 2. Searchable Upazila Dropdown (Cascades from District) */}
        <SearchableDropdown
          label={language === 'bn' ? 'উপজেলা (Upazila - জেলার উপর নির্ভরশীল)' : 'Upazila (Depends on District)'}
          placeholder="উপজেলা সার্চ করুন..."
          options={upazilaList}
          value={upazila}
          onChange={handleUpazilaChange}
          disabled={!district}
          required
          error={errors.upazila}
        />

        {/* 3. Searchable Thana Dropdown (Cascades from District & Upazila) */}
        <SearchableDropdown
          label={language === 'bn' ? 'থানা (Thana - জেলা ও উপজেলার উপর নির্ভরশীল)' : 'Thana (Depends on District & Upazila)'}
          placeholder="থানা সার্চ করুন..."
          options={thanaList}
          value={thana}
          onChange={setThana}
          disabled={!upazila}
          required
          error={errors.thana}
        />

        {/* 4. Mandatory Village Name */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700">
            {language === 'bn' ? 'গ্রাম / মহল্লার নাম (Village Name)' : 'Village / Area Name'}{' '}
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="আপনার গ্রাম, রোড বা ব্লকের নাম লিখুন..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white ${
              errors.village ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
            }`}
          />
          {errors.village && <p className="text-[11px] text-rose-500 font-medium">{errors.village}</p>}
        </div>

        {/* 5. Mandatory Exact Detailed Delivery Address */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700">
            {language === 'bn' ? 'বিস্তারিত পূর্ণাঙ্গ ঠিকানা (Exact Detailed Address)' : 'Exact Detailed Address'}{' '}
            <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={addressDetails}
            onChange={(e) => setAddressDetails(e.target.value)}
            placeholder="বাড়ি নং, ফ্ল্যাট/তলা নং, রোডের নাম, ল্যান্ডমার্ক বা পরিচিত স্থান..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white ${
              errors.addressDetails ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-300 focus:border-[#007A3D]'
            }`}
          />
          {errors.addressDetails && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.addressDetails}</p>
          )}
        </div>

        {/* Dynamic Form Footer with distinct Save and Clear buttons */}
        <FormFooter
          onClear={handleClearAddress}
          isDirty={isDirty}
          saveText={language === 'bn' ? 'ঠিকানা সংরক্ষণ ও চেকআউটে ফিরুন' : 'Save Address & Return'}
          clearText="রিসেট করুন (Clear)"
        />
      </form>

      {/* Address Rules Notice */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>ঠিকানা নিয়মাবলী (Address Compliance):</strong>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            সঠিক ও দ্রুত ডেলিভারির স্বার্থে প্রতিটি ঠিকানা ফিল্ড পূরণ করা বাধ্যতামূলক। কুরিয়ার রাইডার আপনার উল্লেখিত থানা ও গ্রামে পৌঁছে সরাসরি ফোনে যোগাযোগ করবে।
          </p>
        </div>
      </div>
    </div>
  );
};
