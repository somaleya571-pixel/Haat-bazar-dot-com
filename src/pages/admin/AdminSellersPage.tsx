import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Ban,
  Star,
  DollarSign,
  Package,
  ShoppingCart,
  Percent,
  Mail,
  Phone,
  Building,
  Shield,
  Eye,
  X,
  UserPlus,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Seller } from '../../types';

export const AdminSellersPage: React.FC = () => {
  const {
    sellers,
    addSeller,
    updateSeller,
    deleteSeller,
    websiteSettings,
    updateWebsiteSettings,
    showToast,
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Seller Form
  const [newSellerForm, setNewSellerForm] = useState<Omit<Seller, 'id' | 'rating' | 'totalSales' | 'totalOrders'>>({
    name: '',
    nameBn: '',
    companyName: '',
    phone: '',
    email: '',
    district: 'Dhaka',
    commissionRate: 8,
    status: 'Active',
    joinedDate: '2026-11-07',
    productsCount: 1,
    bankOrBkashAccount: '',
  });

  const filteredSellers = sellers.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerForm.name.trim() || !newSellerForm.companyName.trim()) {
      showToast('সেলার ও কোম্পানির নাম আবশ্যক');
      return;
    }

    const created: Seller = {
      ...newSellerForm,
      id: `seller-${Date.now()}`,
      rating: 5.0,
      totalSales: 0,
      totalOrders: 0,
    };

    addSeller(created);
    setIsCreateModalOpen(false);
  };

  const togglePublicRegistration = () => {
    const nextVal = !websiteSettings.allowPublicSellerRegistration;
    updateWebsiteSettings({ allowPublicSellerRegistration: nextVal });
    showToast(
      nextVal
        ? 'সেলার পাবলিক রেজিস্ট্রেশন সক্রিয় করা হয়েছে'
        : 'সেলার পাবলিক রেজিস্ট্রেশন বন্ধ (শুধুমাত্র অ্যাডমিন ইনভাইট)'
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17231B] flex items-center gap-2">
            <Store className="w-6 h-6 text-[#006B35]" />
            <span>সেলার ও ভেন্ডর ব্যবস্থাপনা (Seller Management)</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            অনুমোদিত সরবরাহকারী, পারফরম্যান্স মেট্রিক্স, সেলার কমিশন ও আমন্ত্রণ নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-[#006B35] hover:bg-[#005229] text-white text-xs font-bold rounded-2xl shadow-xs transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>সেলার যোগ করুন (+ Invite Seller)</span>
          </button>
        </div>
      </div>

      {/* 2. PUBLIC SELLER REGISTRATION TOGGLE BAR (Section 7 Requirement) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              পাবলিক সেলার রেজিস্ট্রেশন নিয়ন্ত্রণ (Public Seller Registration)
            </h4>
            <p className="text-gray-500 text-[11px]">
              {websiteSettings.allowPublicSellerRegistration
                ? 'উন্মুক্ত: যে কেউ অনলাইনে আবেদন করতে পারে'
                : 'সুরক্ষিত ও নিয়ন্ত্রিত: জনসাধারণের জন্য নিবন্ধন বন্ধ। শুধুমাত্র সুপার অ্যাডমিন আমন্ত্রণ জানাতে পারবেন।'}
            </p>
          </div>
        </div>

        <button
          onClick={togglePublicRegistration}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            websiteSettings.allowPublicSellerRegistration
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-emerald-50 text-[#006B35] border border-emerald-300'
          }`}
        >
          {websiteSettings.allowPublicSellerRegistration ? 'নিবন্ধন বন্ধ করুন' : 'নিবন্ধন উন্মুক্ত করুন'}
        </button>
      </div>

      {/* 3. SELLERS TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs">
          <div className="relative w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="সেলার নাম, কোম্পানি বা জেলা..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <span className="text-gray-500 font-bold">মোট সেলার: {sellers.length} জন</span>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-bold uppercase">
                <th className="py-3">সেলার ও প্রতিষ্ঠান</th>
                <th className="py-3">জেলা</th>
                <th className="py-3">রেটিং</th>
                <th className="py-3">পণ্য সংখ্যা</th>
                <th className="py-3">সর্বমোট বিক্রয়</th>
                <th className="py-3">কমিশন (%)</th>
                <th className="py-3">স্ট্যাটাস</th>
                <th className="py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5">
                    <p className="font-bold text-gray-900">{seller.nameBn || seller.name}</p>
                    <p className="text-[10px] text-gray-500">{seller.companyName}</p>
                    <p className="text-[10px] font-mono text-gray-400">{seller.phone}</p>
                  </td>
                  <td className="py-3.5 text-gray-700 font-medium">{seller.district}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{seller.rating}</span>
                    </span>
                  </td>
                  <td className="py-3.5 font-bold font-mono text-gray-800">
                    {seller.productsCount} টি
                  </td>
                  <td className="py-3.5 font-bold text-[#006B35] font-mono text-sm">
                    ৳{seller.totalSales.toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={seller.commissionRate}
                      onChange={(e) =>
                        updateSeller({ ...seller, commissionRate: Number(e.target.value) })
                      }
                      className="w-14 p-1 rounded-lg border border-gray-300 font-mono font-bold text-center bg-gray-50"
                    />
                    <span className="ml-1 text-gray-400">%</span>
                  </td>
                  <td className="py-3.5">
                    <select
                      value={seller.status}
                      onChange={(e) =>
                        updateSeller({ ...seller, status: e.target.value as Seller['status'] })
                      }
                      className={`p-1 rounded-lg border font-bold text-[11px] ${
                        seller.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : seller.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setSelectedSeller(seller)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>রিপোর্ট</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CREATE SELLER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <form
            onSubmit={handleCreateSeller}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">নতুন সেলার অ্যাকাউন্ট নিবন্ধন</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">ব্যক্তির নাম *</label>
                <input
                  type="text"
                  value={newSellerForm.name}
                  onChange={(e) => setNewSellerForm({ ...newSellerForm, name: e.target.value })}
                  placeholder="যেমন: হাজী মকবুল হোসেন"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">প্রতিষ্ঠানের নাম *</label>
                <input
                  type="text"
                  value={newSellerForm.companyName}
                  onChange={(e) =>
                    setNewSellerForm({ ...newSellerForm, companyName: e.target.value })
                  }
                  placeholder="যেমন: দিনাজপুর এগ্রো মিলস"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  value={newSellerForm.phone}
                  onChange={(e) => setNewSellerForm({ ...newSellerForm, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={newSellerForm.email}
                  onChange={(e) => setNewSellerForm({ ...newSellerForm, email: e.target.value })}
                  placeholder="seller@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">জেলা</label>
                <input
                  type="text"
                  value={newSellerForm.district}
                  onChange={(e) => setNewSellerForm({ ...newSellerForm, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">প্ল্যাটফর্ম কমিশন (%)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newSellerForm.commissionRate}
                  onChange={(e) =>
                    setNewSellerForm({ ...newSellerForm, commissionRate: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="font-bold text-gray-700">ব্যাংক বা বিকাশ অ্যাকাউন্ট নম্বর</label>
                <input
                  type="text"
                  value={newSellerForm.bankOrBkashAccount || ''}
                  onChange={(e) =>
                    setNewSellerForm({ ...newSellerForm, bankOrBkashAccount: e.target.value })
                  }
                  placeholder="বিকাশ / ব্যাংক একাউন্ট বিবরণ..."
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#006B35] text-white font-bold rounded-xl shadow-xs"
              >
                সেলার অ্যাকাউন্ট সক্রিয় করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. SELLER SALES REPORT MODAL */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                সেলার সেলস রিপোর্ট: {selectedSeller.companyName}
              </h3>
              <button
                onClick={() => setSelectedSeller(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">মোট বিক্রয়:</span>
                <span className="font-mono font-bold text-gray-900">৳{selectedSeller.totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">মোট সম্পন্ন অর্ডার:</span>
                <span className="font-mono font-bold text-gray-900">{selectedSeller.totalOrders} টি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">কমিশন হার:</span>
                <span className="font-mono font-bold text-emerald-800">{selectedSeller.commissionRate}%</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <span className="text-gray-700 font-bold">প্ল্যাটফর্মের অর্জিত কমিশন:</span>
                <span className="font-mono font-bold text-[#006B35]">
                  ৳{Math.round((selectedSeller.totalSales * selectedSeller.commissionRate) / 100).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSeller(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl cursor-pointer"
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
