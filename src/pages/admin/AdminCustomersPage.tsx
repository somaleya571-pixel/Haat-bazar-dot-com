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
  Trash2,
  UserX,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CustomerInfo } from '../../types';

export const AdminCustomersPage: React.FC = () => {
  const {
    customersList,
    updateCustomerAccount,
    suspendCustomer,
    activateCustomer,
    deleteCustomer,
    orders,
    tickets,
    showToast,
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');
  const [viewingCustomer, setViewingCustomer] = useState<CustomerInfo | null>(null);

  // Delete customer confirmation state
  const [customerToDelete, setCustomerToDelete] = useState<CustomerInfo | null>(null);

  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (c.status || 'Active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleActivate = (c: CustomerInfo) => {
    activateCustomer(c.id || 'CUST-001');
    if (viewingCustomer && viewingCustomer.id === c.id) {
      setViewingCustomer({ ...viewingCustomer, status: 'Active' });
    }
  };

  const handleSuspend = (c: CustomerInfo) => {
    suspendCustomer(c.id || 'CUST-001');
    if (viewingCustomer && viewingCustomer.id === c.id) {
      setViewingCustomer({ ...viewingCustomer, status: 'Suspended' });
    }
  };

  const confirmDeleteAction = () => {
    if (!customerToDelete) return;
    deleteCustomer(customerToDelete.id || 'CUST-001');
    if (viewingCustomer?.id === customerToDelete.id) {
      setViewingCustomer(null);
    }
    setCustomerToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17231B] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#006B35]" />
            <span>গ্রাহক ডাটাবেস ও প্রোফাইল নিয়ন্ত্রণ (Customer Management)</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            গ্রাহক প্রোফাইল সক্রিয়করণ (Active), সাময়িক ডিঅ্যাক্টিভেশন (Suspend) ও স্থায়ী অবলুপ্তি (Delete)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7EC] text-[#006B35] px-3 py-1.5 rounded-full border border-emerald-200">
            মোট সক্রিয়: {customersList.filter((c) => c.status !== 'Suspended').length} জন
          </span>
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200">
            স্থগিত/ডিঅ্যাক্টিভ: {customersList.filter((c) => c.status === 'Suspended').length} জন
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
          <span className="text-gray-500 font-bold">ফিল্টার:</span>
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
                <th className="py-3">মোট খরচ</th>
                <th className="py-3">বর্তমান স্ট্যাটাস</th>
                <th className="py-3 text-right">প্রোফাইল কন্ট্রোল (Active/Suspend/Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((c) => {
                const isSuspended = c.status === 'Suspended';
                return (
                  <tr key={c.id || c.phone} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#006B35]">{c.id || 'CUST-001'}</td>
                    <td className="py-3.5 font-bold text-gray-900">{c.name}</td>
                    <td className="py-3.5 font-mono text-gray-600">{c.phone}</td>
                    <td className="py-3.5 text-gray-600">
                      {c.district}, {c.upazila}
                    </td>
                    <td className="py-3.5 font-bold font-mono text-gray-900">
                      ৳{(c.totalSpent || 2400).toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          isSuspended
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <UserX className="w-3 h-3 text-rose-600" />
                            <span>স্থগিত (Suspended)</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            <span>সক্রিয় (Active)</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* View Profile */}
                        <button
                          onClick={() => setViewingCustomer(c)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          title="প্রোফাইল দেখুন"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>প্রোফাইল</span>
                        </button>

                        {/* Suspend or Active Toggle Control */}
                        {isSuspended ? (
                          <button
                            onClick={() => handleActivate(c)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title="অ্যাকাউন্ট সক্রিয় করুন"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>সক্রিয় করুন</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(c)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title="অ্যাকাউন্ট সাময়িকভাবে ডিঅ্যাক্টিভ করুন"
                          >
                            <Ban className="w-3.5 h-3.5 text-amber-600" />
                            <span>ডিঅ্যাক্টিভ</span>
                          </button>
                        )}

                        {/* Permanent Delete Control */}
                        <button
                          onClick={() => setCustomerToDelete(c)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl cursor-pointer transition-colors"
                          title="গ্রাহক অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CUSTOMER PROFILE MODAL WITH SUSPEND / ACTIVE / DELETE CONTROLS */}
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
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingCustomer.status === 'Suspended'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {viewingCustomer.status === 'Suspended' ? 'স্থগিত (Suspended)' : 'সক্রিয় (Active)'}
                </span>
              </div>
              <button
                onClick={() => setViewingCustomer(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Controls Warning if Suspended */}
            {viewingCustomer.status === 'Suspended' && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-[11px]">
                <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  এই অ্যাকাউন্টটি বর্তমানে সাময়িকভাবে ডিঅ্যাক্টিভ করা রয়েছে। সক্রিয় করতে নিচের বোতামে চাপুন।
                </span>
              </div>
            )}

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
                <p className="text-gray-400 italic">কোনো অভিযোগ রেকর্ড নেই</p>
              )}
            </div>

            {/* Comprehensive Profile Action Controls */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* Suspend or Active */}
                {viewingCustomer.status === 'Suspended' ? (
                  <button
                    type="button"
                    onClick={() => handleActivate(viewingCustomer)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>অ্যাকাউন্ট সক্রিয় করুন (Active)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSuspend(viewingCustomer)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>অ্যাকাউন্ট স্থগিত করুন (Suspend)</span>
                  </button>
                )}

                {/* Permanent Delete */}
                <button
                  type="button"
                  onClick={() => setCustomerToDelete(viewingCustomer)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>স্থায়ীভাবে মুছুন (Delete)</span>
                </button>
              </div>

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

      {/* 5. PERMANENT CUSTOMER DELETION CONFIRMATION MODAL */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900">গ্রাহক অ্যাকাউন্ট চিরতরে মুছে ফেলবেন?</h3>
                <p className="text-gray-500 text-[11px] font-mono">{customerToDelete.name} ({customerToDelete.phone})</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              আপনি কি নিশ্চিত যে গ্রাহক <strong>{customerToDelete.name}</strong>-এর প্রোফাইল ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে চান? গ্রাহককে স্বয়ংক্রিয় নোটিফিকেশন পাঠানো হবে:{' '}
              <span className="block mt-1 font-semibold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 text-[11px]">
                &ldquo;প্রিয় গ্রাহক, আপনার অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলা হয়েছে।&rdquo;
              </span>
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>হ্যাঁ, স্থায়ীভাবে মুছুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
