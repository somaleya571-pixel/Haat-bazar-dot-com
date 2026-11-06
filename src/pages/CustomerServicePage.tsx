import React, { useState } from 'react';
import {
  ArrowLeft,
  PhoneCall,
  Mail,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CustomerServicePage: React.FC = () => {
  const { customer, navigateTo, language, showToast } = useShop();

  const [topic, setTopic] = useState('Order Problems');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('অনুগ্রহ করে সমস্যার বিবরণ লিখুন');
      return;
    }

    const ticketId = `HB-TICKET-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(ticketId);
    setSubject('');
    setMessage('');
    showToast(`টিকেট দাখিল সম্পন্ন! টিকেট আইডি: ${ticketId}`);
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
              {language === 'bn' ? 'কাস্টমার সার্ভিস (Customer Service)' : 'Customer Support'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'অর্ডার, ডেলিভারি, পেমেন্ট বা রিফান্ড সংক্রান্ত যেকোনো সমস্যায় আমরা আপনার পাশে' : '24/7 dedicated customer care & complaint resolution'}
            </p>
          </div>
        </div>
      </div>

      {/* Hotline Banner */}
      <div className="bg-gradient-to-r from-[#007A3D] to-[#014e27] text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
            সরাসরি হটলাইন সাপোর্ট
          </span>
          <h2 className="text-2xl font-black text-yellow-300 font-mono tracking-wide">
            +880 1700-123456
          </h2>
          <p className="text-xs text-emerald-100">
            প্রতিদিন সকাল ৮:০০ টা থেকে রাত ১১:০০ টা পর্যন্ত খোলা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:+8801700123456"
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>সরাসরি কল করুন</span>
          </a>

          <a
            href="https://wa.me/8801700123456"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>হোয়াটসঅ্যাপ</span>
          </a>
        </div>
      </div>

      {/* Support Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setTopic('Order Problems')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            topic === 'Order Problems'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-emerald-100 text-[#007A3D] w-fit mb-2">
            📦
          </div>
          <h4 className="font-bold text-xs text-gray-900">অর্ডার সংক্রান্ত</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">অর্ডার পরিবর্তন বা বাতিল</p>
        </button>

        <button
          onClick={() => setTopic('Delivery Problems')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            topic === 'Delivery Problems'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 w-fit mb-2">
            🚚
          </div>
          <h4 className="font-bold text-xs text-gray-900">ডেলিভারি বিলম্ব</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">রাইডার অবস্থান বা সময়</p>
        </button>

        <button
          onClick={() => setTopic('Payment Problems')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            topic === 'Payment Problems'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600 w-fit mb-2">
            💳
          </div>
          <h4 className="font-bold text-xs text-gray-900">পেমেন্ট সমস্যা</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">বিকাশ/নগদ ভেরিফিকেশন</p>
        </button>

        <button
          onClick={() => setTopic('Return and Refund Support')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            topic === 'Return and Refund Support'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600 w-fit mb-2">
            🔄
          </div>
          <h4 className="font-bold text-xs text-gray-900">রিটার্ন ও রিফান্ড</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">টাকা ফেরত বা পণ্য বদল</p>
        </button>
      </div>

      {/* Ticket Submission Form */}
      <form
        onSubmit={handleSubmitTicket}
        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h3 className="font-bold text-sm text-gray-900">
            সাপোর্ট টিকেট দাখিল করুন (বিষয়: {topic})
          </h3>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
            ২৪ ঘণ্টার ভেতর সমাধান
          </span>
        </div>

        {submittedTicket && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>টিকেট সফলভাবে গৃহীত হয়েছে!</strong>
              <p className="text-[11px] mt-0.5">
                আপনার টিকেট রেফারেন্স নম্বর:{' '}
                <strong className="font-mono text-emerald-900">{submittedTicket}</strong>। আমাদের কাস্টমার রিলেশন অফিসার শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করবেন।
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-700">বিষয় (Subject)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="সংক্ষেপে সমস্যার মূল কারণ লিখুন..."
              className="w-full p-2.5 rounded-xl border border-gray-300"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">যোগাযোগের মোবাইল নম্বর</label>
            <input
              type="tel"
              defaultValue={customer.phone}
              className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
              required
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-gray-700">বিস্তারিত বিবরণ (Description)</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আপনার অভিযোগ, প্রশ্ন বা সহযোগিতার প্রয়োজন বিস্তারিত লিখুন..."
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>টিকেট দাখিল করুন (Submit Ticket)</span>
        </button>
      </form>
    </div>
  );
};
