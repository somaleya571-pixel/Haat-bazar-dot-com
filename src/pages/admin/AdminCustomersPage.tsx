import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  CreditCard,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CustomerInfo } from '../../types';

export const AdminCustomersPage: React.FC = () => {
  const { customersList, updateCustomerAccount, orders, tickets, showToast } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');
  const [viewingCustomer, setViewingCustomer] = useState<CustomerInfo | null>(null);
  const [confirmSuspendId, setConfirmSuspendId] = useState<string | null>(null);

  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleSuspend = (c: CustomerInfo) => {
    const nextStatus = c.status === 'Suspended' ? 'Active' : 'Suspended';
    updateCustomerAccount(c.id || 'CUST-001', { status: nextStatus });
    if (viewingCustomer && viewingCustomer.id === c.id) {
      setViewingCustomer({ ...viewingCustomer, status: nextStatus });
    }
    showToast(`গ্রাহক অ্যাকাউন্ট স্ট্যাটাস: ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17231B] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#006B35]" />
            <span>গ্রাহক ডাটাবেস ও প্রোফাইল ব্যবস্থাপনা (Customer Management)</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            নিবন্ধিত ও অতিথি গ্রাহকদের অর্ডার ইতিহাস, পেমেন্ট রেকর্ড ও অ্যাকাউন্ট সিকিউরিটি
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7EC] text-[#006B35] px-3 py-1.5 rounded-full border border-emerald-200">
            মোট সক্রিয় গ্রাহক: {customersList.filter((c) => c.status !== 'Suspended').length} জন
          </span>
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="গ্রাহকের নাম, মোবাইল, জেলা বা ইমেইল..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold">স্ট্যাটাস:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 rounded-xl border border-gray-300 bg-white font-bold text-gray-700"
          >
            <option value="all">সকল গ্রাহক ({customersList.length})</option>
            <option value="Active">সক্রিয় গ্রাহক (Active)</option>
            <option value="Suspended">স্থগিত একাউন্ট (Suspended)</option>
          </select>
        </div>
      </div>

      {/* 3. CUSTOMERS TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="divide-y divide-gray-100 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-bold uppercase">
                <th className="py-3">গ্রাহক আইডি</th>
                <th className="py-3">গ্রাহকের নাম</th>
                <th className="py-3">ফোন নম্বর</th>
                <th className="py-3">জেলা ও ঠিকানা</th>
                <th className="py-3">যোগদানের তারিখ</th>
                <th className="py-3">মোট খরচ</th>
                <th className="py-3">স্ট্যাটাস</th>
                <th className="py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((c) => (
                <tr key={c.id || c.phone} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#006B35]">{c.id || 'CUST-001'}</td>
                  <td className="py-3.5 font-bold text-gray-900">{c.name}</td>
                  <td className="py-3.5 font-mono text-gray-600">{c.phone}</td>
                  <td className="py-3.5 text-gray-600">
                    {c.district}, {c.upazila}
                  </td>
                  <td className="py-3.5 font-mono text-gray-400">{c.joinedDate || '2026-01-15'}</td>
                  <td className="py-3.5 font-bold font-mono text-gray-900">
                    ৳{(c.totalSpent || 2400).toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Suspended'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingCustomer(c)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="প্রোফাইল দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>প্রোফাইল</span>
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(c)}
                        className={`p-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                          c.status === 'Suspended'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                        title={c.status === 'Suspended' ? 'সক্রিয় করুন' : 'স্থগিত করুন'}
                      >
                        {c.status === 'Suspended' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Ban className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CUSTOMER PROFILE MODAL */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-[#006B35]">
                  {viewingCustomer.id || 'CUST-001'}
                </span>
                <span className="font-bold text-gray-900 text-sm">{viewingCustomer.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingCustomer.status === 'Suspended'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {viewingCustomer.status || 'Active'}
                </span>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact & Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800">যোগাযোগ তথ্য:</h4>
                <p>ফোন: <strong className="font-mono text-gray-900">{viewingCustomer.phone}</strong></p>
                <p>ইমেইল: <strong className="text-gray-900">{viewingCustomer.email}</strong></p>
                <p className="text-gray-500 font-mono text-[10px]">
                  যোগদান: {viewingCustomer.joinedDate || '12 Jan 2026'}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800">সংরক্ষিত ডেলিভারি ঠিকানা:</h4>
                <p className="font-medium text-gray-900">{viewingCustomer.addressDetails}</p>
                <p>গ্রাম: {viewingCustomer.village}, থানা: {viewingCustomer.thana}</p>
                <p>উপজেলা: {viewingCustomer.upazila}, জেলা: {viewingCustomer.district}</p>
              </div>
            </div>

            {/* Orders Placed by this customer */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800">অর্ডার ইতিহাস (Order History):</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#006B35]">{ord.id}</span>
                      <span className="text-gray-400 ml-2 font-mono text-[10px]">{ord.date}</span>
                      <p className="text-gray-500 text-[10px] mt-0.5">
                        আইটেম: {ord.items.length} টি ({ord.paymentMethod})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-gray-900">৳{ord.totalAmount}</p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complaints / Tickets by customer */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="font-bold text-gray-800">গ্রাহকের অভিযোগ ও টিকিট (Complaints):</h4>
              {tickets.filter((t) => t.customerPhone === viewingCustomer.phone).length > 0 ? (
                <div className="space-y-1.5">
                  {tickets
                    .filter((t) => t.customerPhone === viewingCustomer.phone)
                    .map((t) => (
                      <div key={t.id} className="p-2 rounded-xl bg-amber-50/70 border border-amber-200">
                        <div className="flex justify-between font-bold">
                          <span>{t.subject}</span>
                          <span className="text-amber-800 text-[10px]">{t.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">{t.message}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">কোনো অভিযোগ রেকর্ড নেই (No complaints lodged)</p>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleSuspend(viewingCustomer)}
                className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                  viewingCustomer.status === 'Suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {viewingCustomer.status === 'Suspended'
                  ? 'অ্যাকাউন্ট পুনরায় সক্রিয় করুন'
                  : 'অ্যাকাউন্ট স্থগিত করুন (Suspend)'}
              </button>

              <button
                type="button"
                onClick={() => setViewingCustomer(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-800 cursor-pointer"
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
