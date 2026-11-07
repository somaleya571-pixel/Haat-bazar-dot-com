import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertTriangle
} from 'lucide-react';
import { FormFooter } from '../../components/FormFooter';

export const AdminSettingsPage: React.FC = () => {
  const { 
    paymentSettings, 
    updatePaymentSettings, 
    officialContact, 
    updateOfficialContact, 
    orders, 
    updateOrderPaymentStatus, 
    showToast 
  } = useShop();

  // Local state for payment settings
  const [bKashEnabled, setBKashEnabled] = useState(paymentSettings.bKashEnabled);
  const [bKashNumber, setBKashNumber] = useState(paymentSettings.bKashNumber);
  const [bKashType, setBKashType] = useState(paymentSettings.bKashType);
  const [bKashInstructions, setBKashInstructions] = useState(paymentSettings.bKashInstructions);

  const [nagadEnabled, setNagadEnabled] = useState(paymentSettings.nagadEnabled);
  const [nagadNumber, setNagadNumber] = useState(paymentSettings.nagadNumber);
  const [nagadType, setNagadType] = useState(paymentSettings.nagadType);
  const [nagadInstructions, setNagadInstructions] = useState(paymentSettings.nagadInstructions);

  const [codEnabled, setCodEnabled] = useState(paymentSettings.codEnabled);

  // Dynamic dirty state and reset for payments
  const isPaymentDirty =
    bKashEnabled !== paymentSettings.bKashEnabled ||
    bKashNumber !== paymentSettings.bKashNumber ||
    bKashType !== paymentSettings.bKashType ||
    bKashInstructions !== paymentSettings.bKashInstructions ||
    nagadEnabled !== paymentSettings.nagadEnabled ||
    nagadNumber !== paymentSettings.nagadNumber ||
    nagadType !== paymentSettings.nagadType ||
    nagadInstructions !== paymentSettings.nagadInstructions ||
    codEnabled !== paymentSettings.codEnabled;

  const handleClearPaymentSettings = () => {
    setBKashEnabled(paymentSettings.bKashEnabled);
    setBKashNumber(paymentSettings.bKashNumber);
    setBKashType(paymentSettings.bKashType);
    setBKashInstructions(paymentSettings.bKashInstructions);
    setNagadEnabled(paymentSettings.nagadEnabled);
    setNagadNumber(paymentSettings.nagadNumber);
    setNagadType(paymentSettings.nagadType);
    setNagadInstructions(paymentSettings.nagadInstructions);
    setCodEnabled(paymentSettings.codEnabled);
    showToast('পেমেন্ট সেটিংস পূর্বাবস্থায় রিসেট করা হয়েছে');
  };

  // Local state for contact settings
  const [hotline, setHotline] = useState(officialContact.hotline);
  const [phone, setPhone] = useState(officialContact.phone);
  const [gmail, setGmail] = useState(officialContact.gmail);
  const [email, setEmail] = useState(officialContact.email);
  const [whatsapp, setWhatsapp] = useState(officialContact.whatsapp);
  const [supportHours, setSupportHours] = useState(officialContact.supportHours);
  const [officeAddress, setOfficeAddress] = useState(officialContact.officeAddress);

  // Dynamic dirty state and reset for contact info
  const isContactDirty =
    hotline !== officialContact.hotline ||
    phone !== officialContact.phone ||
    gmail !== officialContact.gmail ||
    email !== officialContact.email ||
    whatsapp !== officialContact.whatsapp ||
    supportHours !== officialContact.supportHours ||
    officeAddress !== officialContact.officeAddress;

  const handleClearContactSettings = () => {
    setHotline(officialContact.hotline);
    setPhone(officialContact.phone);
    setGmail(officialContact.gmail);
    setEmail(officialContact.email);
    setWhatsapp(officialContact.whatsapp);
    setSupportHours(officialContact.supportHours);
    setOfficeAddress(officialContact.officeAddress);
    showToast('যোগাযোগ সেটিংস পূর্বাবস্থায় রিসেট করা হয়েছে');
  };

  // Tab
  const [activeTab, setActiveTab] = useState<'payments' | 'verification' | 'contact'>('payments');

  // Pending payments list
  const pendingPayments = orders.filter(
    (o) => (o.paymentMethod === 'bKash' || o.paymentMethod === 'Nagad') && o.paymentStatus === 'Pending Verification'
  );

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings({
      bKashEnabled,
      bKashNumber,
      bKashType,
      bKashInstructions,
      nagadEnabled,
      nagadNumber,
      nagadType,
      nagadInstructions,
      codEnabled,
    });
    showToast('Payment gateway configurations saved successfully!');
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateOfficialContact({
      hotline,
      phone,
      gmail,
      email,
      whatsapp,
      supportHours,
      officeAddress,
    });
    showToast('Official store contact details updated!');
  };

  return (
    <div className="space-y-6 viewport-padding-safe pb-28 sm:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#006B35]" />
            System & Payment Settings
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Configure bKash / Nagad mobile financial accounts, COD policies, and merchant contact info.
          </p>
        </div>
        {pendingPayments.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {pendingPayments.length} Pending Prepayment Verifications
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          bKash / Nagad / COD Settings
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Payment Verification Queue ({pendingPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-[#006B35] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          Official Contact Information
        </button>
      </div>

      {/* Tab 1: Payment Method Configurations */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSavePaymentSettings} className="space-y-6">
          {/* bKash Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center font-bold text-pink-700 text-sm">
                  bKash
                </div>
                <div>
                  <h3 className="font-bold text-[#17231B] text-base">bKash Mobile Banking</h3>
                  <p className="text-xs text-slate-500">Configure bKash Merchant or Personal send money numbers</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-slate-600">
                  {bKashEnabled ? 'Active' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={bKashEnabled}
                  onChange={(e) => setBKashEnabled(e.target.checked)}
                  className="w-5 h-5 accent-[#006B35] rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">bKash Account Number</label>
                <input
                  type="text"
                  value={bKashNumber}
                  onChange={(e) => setBKashNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Category</label>
                <select
                  value={bKashType}
                  onChange={(e) => setBKashType(e.target.value as 'Merchant' | 'Personal')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="Merchant">Merchant (Payment Option)</option>
                  <option value="Personal">Personal (Send Money Option)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Instructions to Buyer</label>
              <textarea
                rows={2}
                value={bKashInstructions}
                onChange={(e) => setBKashInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
          </div>

          {/* Nagad Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-700 text-sm">
                  Nagad
                </div>
                <div>
                  <h3 className="font-bold text-[#17231B] text-base">Nagad Payment Gateway</h3>
                  <p className="text-xs text-slate-500">Configure Nagad Merchant or Personal send money numbers</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-slate-600">
                  {nagadEnabled ? 'Active' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={nagadEnabled}
                  onChange={(e) => setNagadEnabled(e.target.checked)}
                  className="w-5 h-5 accent-[#006B35] rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nagad Account Number</label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Category</label>
                <select
                  value={nagadType}
                  onChange={(e) => setNagadType(e.target.value as 'Merchant' | 'Personal')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="Merchant">Merchant (Payment Option)</option>
                  <option value="Personal">Personal (Send Money Option)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Instructions to Buyer</label>
              <textarea
                rows={2}
                value={nagadInstructions}
                onChange={(e) => setNagadInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
          </div>

          {/* Cash On Delivery Policy */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-[#006B35] text-sm">
                  COD
                </div>
                <div>
                  <h3 className="font-bold text-[#17231B] text-base">Cash On Delivery (ক্যাশ অন ডেলিভারি)</h3>
                  <p className="text-xs text-slate-500">Allow customers across all 64 districts to pay courier on doorstep</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-slate-600">
                  {codEnabled ? 'Active' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="w-5 h-5 accent-[#006B35] rounded"
                />
              </label>
            </div>
          </div>

          {/* Dynamic Form Footer with distinct Save and Clear buttons */}
          <FormFooter
            onClear={handleClearPaymentSettings}
            isDirty={isPaymentDirty}
            saveText="পেমেন্ট সেটিংস সংরক্ষণ করুন (Save)"
            clearText="রিসেট করুন (Clear)"
          />
        </form>
      )}

      {/* Tab 2: Verification Queue */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-[#17231B] text-base">
              Customer Digital Payment Submissions ({pendingPayments.length})
            </h2>
            <p className="text-xs text-slate-500">
              Verify Transaction IDs (TrxID) submitted during bKash or Nagad checkout before approving orders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-[#64748B] uppercase">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Sender Mobile</th>
                  <th className="py-3 px-4 font-semibold">Transaction ID (TrxID)</th>
                  <th className="py-3 px-4 font-semibold text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No pending digital payments to verify right now.
                    </td>
                  </tr>
                ) : (
                  pendingPayments.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#006B35] text-xs">
                        {order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#17231B] block">{order.customer.name}</span>
                        <span className="text-xs text-slate-500">{order.customer.phone}</span>
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${order.paymentMethod === 'bKash' ? 'bg-pink-100 text-pink-800' : 'bg-orange-100 text-orange-800'}`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        ৳{order.totalAmount}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                        {order.bKashNumber || order.customer.phone}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-purple-700 bg-purple-50/50">
                        {order.trxId || 'None'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateOrderPaymentStatus(order.id, 'Paid (Verified)')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve Payment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Official Store Contact */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContactSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-[#17231B] text-base border-b border-slate-100 pb-3">
            Haat Bazar Official Contact & Address Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Hotline</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Gmail</label>
              <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Working / Hotline Hours</label>
              <input
                type="text"
                value={supportHours}
                onChange={(e) => setSupportHours(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Office / Corporate Headquarters Address</label>
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
            />
          </div>

          {/* Dynamic Form Footer with distinct Save and Clear buttons */}
          <FormFooter
            onClear={handleClearContactSettings}
            isDirty={isContactDirty}
            saveText="যোগাযোগ তথ্য সংরক্ষণ করুন (Save)"
            clearText="রিসেট করুন (Clear)"
          />
        </form>
      )}
    </div>
  );
};
