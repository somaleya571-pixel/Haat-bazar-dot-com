import React, { useState } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/pricing';

export const ReturnsRefundsPage: React.FC = () => {
  const { returns, submitReturnRequest, orders, pageParams, navigateTo, language, showToast } =
    useShop();

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    pageParams.orderId || deliveredOrders[0]?.id || ''
  );
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [reason, setReason] = useState<string>('Damaged item received');
  const [refundMethod, setRefundMethod] = useState<'bKash' | 'Nagad' | 'Bank Transfer'>('bKash');
  const [accountNumber, setAccountNumber] = useState<string>('01712345678');
  const [comments, setComments] = useState<string>('');

  const currentOrder = orders.find((o) => o.id === selectedOrderId);

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrderId) {
      showToast('অনুগ্রহ করে ডেলিভার্ড অর্ডার নির্বাচন করুন');
      return;
    }

    const item = currentOrder?.items.find((i) => i.productId === selectedProductId) || currentOrder?.items[0];
    if (!item) {
      showToast('পণ্য নির্বাচন আবশ্যক');
      return;
    }

    if (!accountNumber.trim()) {
      showToast('রিফান্ড প্রাপ্তির একাউন্ট নম্বর দিন');
      return;
    }

    submitReturnRequest({
      orderId: selectedOrderId,
      productId: item.productId,
      productName: item.nameBn || item.name,
      reason,
      refundMethod,
      accountNumber,
      amount: item.price * item.quantity,
      comments,
    });

    setComments('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Refund Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Approved':
      case 'Picked Up':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'রিটার্ন ও রিফান্ড (Page 13: Returns & Refunds)' : 'Returns & Refunds'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? '৭ দিনের মধ্যে সহজ রিটার্ন ও দ্রুত রিফান্ড আবেদন'
                : 'Hassle-free 7-day product return and refund requests'}
            </p>
          </div>
        </div>
      </div>

      {/* Return Policy Notice */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-800">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>হাট বাজার ৭ দিনের রিটার্ন পলিসি:</strong>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            পণ্য ডেলিভারি পাওয়ার ৭ দিনের ভেতর ক্ষতিগ্রস্ত, মেয়াদোত্তীর্ণ বা অস্বস্তিকর পণ্যের ক্ষেত্রে ১০০% ক্যাশব্যাক অথবা রিফান্ড নিশ্চিত করা হয়।
          </p>
        </div>
      </div>

      {/* Return Request Form */}
      <form
        onSubmit={handleSubmitReturn}
        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
      >
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#007A3D]" />
          <span>নতুন রিটার্ন ও রিফান্ড আবেদন দাখিল করুন</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Select Order */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700">অর্ডার নির্বাচন করুন</label>
            <select
              value={selectedOrderId}
              onChange={(e) => {
                setSelectedOrderId(e.target.value);
                setSelectedProductId('');
              }}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
              required
            >
              <option value="">অর্ডার নির্বাচন করুন...</option>
              {deliveredOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} - ৳{o.totalAmount} ({o.date})
                </option>
              ))}
            </select>
          </div>

          {/* Select Product from Order */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700">ফেরতযোগ্য পণ্য বাছাই</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
              disabled={!currentOrder}
              required
            >
              <option value="">পণ্য নির্বাচন করুন...</option>
              {currentOrder?.items.map((item) => (
                <option key={item.productId} value={item.productId}>
                  {item.nameBn || item.name} ({item.quantity} টি - ৳{item.price * item.quantity})
                </option>
              ))}
            </select>
          </div>

          {/* Return Reason */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700">রিটার্নের সুনির্দিষ্ট কারণ</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
            >
              <option value="Damaged item received">কুরিয়ার পরিবহনে পণ্য ক্ষতিগ্রস্ত হয়েছে</option>
              <option value="Quality issue / Defective">পণ্য খাঁটি বা সন্তোষজনক নয়</option>
              <option value="Expired item">মেয়াদ উত্তীর্ণ পণ্য পাওয়া গেছে</option>
              <option value="Wrong item delivered">ভুল পণ্য ডেলিভারি করা হয়েছে</option>
              <option value="Missing packaging">সিল বা প্যাকেজিং ছেঁড়া ছিল</option>
            </select>
          </div>

          {/* Refund Method */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700">রিফান্ড গ্রহণের মাধ্যম</label>
            <select
              value={refundMethod}
              onChange={(e) => setRefundMethod(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
            >
              <option value="bKash">বিকাশ (bKash)</option>
              <option value="Nagad">নগদ (Nagad)</option>
              <option value="Bank Transfer">ব্যাংক ট্রান্সফার</option>
            </select>
          </div>

          {/* Refund Account Number */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-gray-700">
              রিফান্ড পাঠানোর {refundMethod} নম্বর / ব্যাংক একাউন্ট বিবরণ
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
              required
            />
          </div>

          {/* Optional Details */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-gray-700">অতিরিক্ত মন্তব্য / সমস্যা (ঐচ্ছিক)</label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="পণ্যটির অবস্থা সম্পর্কে বিস্তারিত লিখুন..."
              className="w-full p-2.5 rounded-xl border border-gray-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!currentOrder}
          className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors ${
            currentOrder
              ? 'bg-[#007A3D] hover:bg-[#006030] shadow-xs'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          রিটার্ন আবেদন সাবমিট করুন (Submit Return Request)
        </button>
      </form>

      {/* Return Requests History */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2.5">
          আপনার পূর্ববর্তী রিটার্ন ও রিফান্ড ইতিহাস ({returns.length})
        </h3>

        <div className="space-y-3">
          {returns.map((ret) => (
            <div
              key={ret.id}
              className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#007A3D]">{ret.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                    ret.status
                  )}`}
                >
                  {ret.status}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-bold text-gray-900">{ret.productName}</h4>
                  <p className="text-gray-500 text-[11px]">
                    অর্ডার: {ret.orderId} • কারণ: {ret.reason}
                  </p>
                </div>
                <span className="font-black text-gray-900 text-sm">
                  {formatCurrency(ret.amount, language)}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-gray-100">
                <span>রিফান্ড মেথড: {ret.refundMethod} ({ret.accountNumber})</span>
                <span>তারিখ: {ret.requestDate}</span>
              </div>

              {ret.comments && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                  নোট: {ret.comments}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
