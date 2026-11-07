import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Scale,
  MapPin,
  HelpCircle,
  Calculator,
  ShieldCheck,
  X,
  Save,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CourierService } from '../../types';
import { getDistricts, isInsideDhaka } from '../../utils/location';
import { calculateCourierDeliveryCharge } from '../../utils/pricing';

export const AdminCouriersPage: React.FC = () => {
  const { couriers, updateCourier, addCourier, deleteCourier, toggleCourierStatus, showToast } =
    useShop();

  const [editingCourier, setEditingCourier] = useState<CourierService | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Live Rate Test Simulator state
  const [testDistrict, setTestDistrict] = useState('Dhaka');
  const [testWeight, setTestWeight] = useState(1);
  const [testCourierId, setTestCourierId] = useState(couriers[0]?.id || 'redx');

  // New Courier Form State
  const initialNewCourier: Omit<CourierService, 'id'> = {
    name: '',
    nameBn: '',
    code: '',
    insideDhakaRate: 60,
    outsideDhakaRate: 120,
    baseWeightKg: 1,
    additionalPerKg: 20,
    estimatedDaysInside: '১২-২৪ ঘণ্টা',
    estimatedDaysOutside: '৪৮-৭২ ঘণ্টা',
    isCodAvailable: true,
    isActive: true,
    restrictedDistricts: [],
    districtOverrides: {},
    notes: '',
  };

  const [newCourierForm, setNewCourierForm] = useState(initialNewCourier);

  const districtsList = getDistricts();

  const handleCreateCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourierForm.name.trim() || !newCourierForm.nameBn.trim()) {
      showToast('কুরিয়ার সার্ভিসের নাম প্রদান করুন');
      return;
    }

    const created: CourierService = {
      ...newCourierForm,
      id: newCourierForm.code.toLowerCase() || `cr-${Date.now()}`,
    };

    addCourier(created);
    setIsAddModalOpen(false);
    setNewCourierForm(initialNewCourier);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourier) return;
    updateCourier(editingCourier);
    setEditingCourier(null);
  };

  // Run live calculation for the simulator
  const activeTestCourier = couriers.find((c) => c.id === testCourierId) || couriers[0];
  const simResult = activeTestCourier
    ? calculateCourierDeliveryCharge({
        courier: activeTestCourier,
        district: testDistrict,
        weightKg: testWeight,
        subtotal: 500,
        freeDeliveryThreshold: 2000,
      })
    : null;

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17231B] flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#006B35]" />
            <span>কুরিয়ার ও ডেলিভারি ব্যবস্থাপনা (Courier & Delivery Management)</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            রেডএক্স, সুন্দরবন, পাঠাও, স্টেডফাস্ট সহ সকল কুরিয়ারের ঢাকা ও ঢাকার বাইরের স্বতন্ত্র রেট নিয়ন্ত্রণ
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#006B35] hover:bg-[#005229] text-white text-xs font-bold rounded-2xl shadow-xs transition-transform hover:scale-102 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুরিয়ার যোগ করুন (+ Add Courier)</span>
        </button>
      </div>

      {/* 2. LIVE RATE SIMULATOR (Demonstrating Section 8 Requirements) */}
      <div className="bg-gradient-to-br from-[#006B35] to-[#004723] text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-600/40 pb-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-300" />
            <h3 className="font-black text-sm">লাইভ কুরিয়ার চার্জ ক্যালকুলেটর (Live Rate Simulator)</h3>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-emerald-200">
            রিয়েল-টাইম হিসাব
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          {/* Select Courier */}
          <div>
            <label className="font-bold text-emerald-100 block mb-1">কুরিয়ার নির্বাচন:</label>
            <select
              value={testCourierId}
              onChange={(e) => setTestCourierId(e.target.value)}
              className="w-full p-2 rounded-xl bg-white text-gray-900 font-bold focus:outline-hidden"
            >
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameBn} {c.isActive ? '' : '(নিষ্ক্রিয়)'}
                </option>
              ))}
            </select>
          </div>

          {/* Select District (64 districts) */}
          <div>
            <label className="font-bold text-emerald-100 block mb-1">গন্তব্য জেলা (64 Districts):</label>
            <select
              value={testDistrict}
              onChange={(e) => setTestDistrict(e.target.value)}
              className="w-full p-2 rounded-xl bg-white text-gray-900 font-bold focus:outline-hidden"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>
                  {d} {isInsideDhaka(d) ? '(ঢাকার ভেতর)' : '(ঢাকার বাইরে)'}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="font-bold text-emerald-100 block mb-1">পার্সেলের ওজন (কেজি):</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={testWeight}
              onChange={(e) => setTestWeight(Number(e.target.value))}
              className="w-full p-2 rounded-xl bg-white text-gray-900 font-bold font-mono focus:outline-hidden"
            />
          </div>

          {/* Live Calculated Delivery Charge Display */}
          <div className="bg-white/15 p-2.5 rounded-2xl border border-white/20 flex flex-col justify-center">
            <span className="text-[10px] text-emerald-200 font-semibold">প্রযোজ্য ডেলিভারি ফি:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-yellow-300 font-mono">
                ৳{simResult?.charge ?? 0}
              </span>
              <span className="text-[10px] text-emerald-100">
                ({simResult?.estimatedDays || '১২-২৪ ঘণ্টা'})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COURIER SERVICES GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {couriers.map((courier) => (
          <div
            key={courier.id}
            className={`p-5 rounded-3xl border transition-all space-y-4 bg-white shadow-xs ${
              courier.isActive
                ? 'border-[#E2E8F0] hover:border-[#006B35]'
                : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#006B35]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">{courier.nameBn}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{courier.name}</p>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <button
                onClick={() => toggleCourierStatus(courier.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  courier.isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {courier.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
              </button>
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200/80">
                <span className="text-[10px] text-gray-500 block">ঢাকার ভেতর চার্জ:</span>
                <span className="text-base font-black text-[#006B35] font-mono">
                  ৳{courier.insideDhakaRate}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  সময়: {courier.estimatedDaysInside}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200/80">
                <span className="text-[10px] text-gray-500 block">ঢাকার বাইরে চার্জ:</span>
                <span className="text-base font-black text-blue-700 font-mono">
                  ৳{courier.outsideDhakaRate}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  সময়: {courier.estimatedDaysOutside}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200/80">
                <span className="text-[10px] text-gray-500 block">বেস ওজন সীমা:</span>
                <span className="text-xs font-bold text-gray-800 font-mono">
                  {courier.baseWeightKg} কেজি
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200/80">
                <span className="text-[10px] text-gray-500 block">অতিরিক্ত কেজি প্রতি:</span>
                <span className="text-xs font-bold text-gray-800 font-mono">
                  +৳{courier.additionalPerKg}/কেজি
                </span>
              </div>
            </div>

            {/* COD & Notes */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-500 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>ক্যাশ অন ডেলিভারি (COD) সমর্থিত</span>
              </span>

              <button
                onClick={() => setEditingCourier(courier)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] font-bold rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>রেট পরিবর্তন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. EDIT COURIER RATES MODAL */}
      {editingCourier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                কুরিয়ার রেট পরিবর্তন: {editingCourier.nameBn}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCourier(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঢাকার ভেতরে ডেলিভারি চার্জ (৳) *</label>
                <input
                  type="number"
                  min="0"
                  value={editingCourier.insideDhakaRate}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      insideDhakaRate: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঢাকার বাইরে ডেলিভারি চার্জ (৳) *</label>
                <input
                  type="number"
                  min="0"
                  value={editingCourier.outsideDhakaRate}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      outsideDhakaRate: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">বেস ওজন (কেজি)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={editingCourier.baseWeightKg}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      baseWeightKg: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">অতিরিক্ত প্রতি কেজি চার্জ (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={editingCourier.additionalPerKg}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      additionalPerKg: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঢাকার ভেতরের সময়সীমা</label>
                <input
                  type="text"
                  value={editingCourier.estimatedDaysInside}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      estimatedDaysInside: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঢাকার বাইরের সময়সীমা</label>
                <input
                  type="text"
                  value={editingCourier.estimatedDaysOutside}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      estimatedDaysOutside: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCourier(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#006B35] hover:bg-[#005229] text-white font-bold rounded-xl shadow-xs"
              >
                রেট পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. ADD COURIER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <form
            onSubmit={handleCreateCourier}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">নতুন কুরিয়ার সার্ভিস সংযোগ</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">কুরিয়ারের নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={newCourierForm.nameBn}
                  onChange={(e) => setNewCourierForm({ ...newCourierForm, nameBn: e.target.value })}
                  placeholder="যেমন: এস এ পরিবহন"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">কুরিয়ারের নাম (ইংরেজি) *</label>
                <input
                  type="text"
                  value={newCourierForm.name}
                  onChange={(e) => setNewCourierForm({ ...newCourierForm, name: e.target.value })}
                  placeholder="e.g. SA Paribahan"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">কুরিয়ার কোড (Code) *</label>
                <input
                  type="text"
                  value={newCourierForm.code}
                  onChange={(e) =>
                    setNewCourierForm({ ...newCourierForm, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. SAPR"
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঢাকার ভেতরে চার্জ (৳) *</label>
                <input
                  type="number"
                  min="0"
                  value={newCourierForm.insideDhakaRate}
                  onChange={(e) =>
                    setNewCourierForm({
                      ...newCourierForm,
                      insideDhakaRate: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঢাকার বাইরে চার্জ (৳) *</label>
                <input
                  type="number"
                  min="0"
                  value={newCourierForm.outsideDhakaRate}
                  onChange={(e) =>
                    setNewCourierForm({
                      ...newCourierForm,
                      outsideDhakaRate: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">অতিরিক্ত প্রতি কেজি চার্জ (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={newCourierForm.additionalPerKg}
                  onChange={(e) =>
                    setNewCourierForm({
                      ...newCourierForm,
                      additionalPerKg: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#006B35] text-white font-bold rounded-xl shadow-xs"
              >
                কুরিয়ার যুক্ত করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
