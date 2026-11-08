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
  Headphones,
  User,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CustomerServicePage: React.FC = () => {
  const { customer, tickets, createTicket, replyToTicket, navigateTo, language, showToast, officialContact } = useShop();

  const [topic, setTopic] = useState<'Order' | 'Payment' | 'Delivery' | 'Return' | 'General'>('Order');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(customer.phone || '+880 1712-345678');
  const [customerName, setCustomerName] = useState(customer.name || 'গ্রাহক');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  // Active customer tickets
  const myTickets = tickets.filter(
    (t) => t.customerPhone === phone || t.customerPhone === customer.phone || t.customerName === customer.name
  );

  const [activeTicketId, setActiveTicketId] = useState<string | null>(myTickets[0]?.id || null);
  const [followupMessage, setFollowupMessage] = useState('');

  const selectedTicket = tickets.find((t) => t.id === activeTicketId) || myTickets[0];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('অনুগ্রহ করে সমস্যার বিবরণ লিখুন');
      return;
    }

    const created = createTicket({
      customerName: customerName.trim() || customer.name || 'গ্রাহক',
      customerPhone: phone.trim() || customer.phone || '+880 1712-345678',
      customerEmail: customer.email || 'customer@haatbazar.com',
      category: topic,
      priority: 'High',
      status: 'Open',
      subject: subject.trim() || `${topic} সংক্রান্ত সমস্যা`,
      message: message.trim(),
    });

    setSubmittedTicketId(created.id);
    setActiveTicketId(created.id);
    setSubject('');
    setMessage('');
    showToast(`টিকেট সফলভাবে দাখিল হয়েছে! আইডি: ${created.id}`);
  };

  const handleSendFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !followupMessage.trim()) return;
    replyToTicket(selectedTicket.id, followupMessage.trim(), 'customer');
    setFollowupMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'কাস্টমার সার্ভিস ও অভিযোগ কেন্দ্র' : 'Customer Support & Helpdesk'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn'
                ? 'যেকোনো সমস্যার কথা জানান—অ্যাডমিন টিম দ্রুত সমাধান ও রিপ্লাই দেবে'
                : 'Share your problems—our team will review and respond promptly'}
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
            {officialContact.hotline}
          </h2>
          <p className="text-xs text-emerald-100">
            {officialContact.supportHours}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>সরাসরি কল করুন</span>
          </a>

          <a
            href={`https://wa.me/${officialContact.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>হোয়াটসঅ্যাপ</span>
          </a>
        </div>
      </div>

      {/* Support Categories Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setTopic('Order')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            topic === 'Order'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-emerald-100 text-[#007A3D] w-fit mb-2 text-base">
            📦
          </div>
          <h4 className="font-bold text-xs text-gray-900">অর্ডার সমস্যা</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">অর্ডার বদল বা বাতিল</p>
        </button>

        <button
          type="button"
          onClick={() => setTopic('Delivery')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            topic === 'Delivery'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 w-fit mb-2 text-base">
            🚚
          </div>
          <h4 className="font-bold text-xs text-gray-900">ডেলিভারি বিলম্ব</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">কুরিয়ার অবস্থান ও ট্র্যাকিং</p>
        </button>

        <button
          type="button"
          onClick={() => setTopic('Payment')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            topic === 'Payment'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600 w-fit mb-2 text-base">
            💳
          </div>
          <h4 className="font-bold text-xs text-gray-900">পেমেন্ট ও রিফান্ড</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">বিকাশ/নগদ ভেরিফিকেশন</p>
        </button>

        <button
          type="button"
          onClick={() => setTopic('Return')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            topic === 'Return'
              ? 'bg-emerald-50 border-[#007A3D] ring-2 ring-emerald-100'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600 w-fit mb-2 text-base">
            🔄
          </div>
          <h4 className="font-bold text-xs text-gray-900">পণ্য রিটার্ন</h4>
          <p className="text-[10px] text-gray-500 mt-0.5">ক্ষতিগ্রস্ত পণ্য বদল</p>
        </button>
      </div>

      {/* Ticket Submission Form */}
      <form
        onSubmit={handleSubmitTicket}
        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#006B35]" />
            <span>সমস্যার বিবরণ দিয়ে টিকিট দাখিল করুন (ক্যাটাগরি: {topic})</span>
          </h3>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
            অ্যাডমিন দ্রুত রিপ্লাই দেবেন
          </span>
        </div>

        {submittedTicketId && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>টিকেট সফলভাবে দাখিল হয়েছে!</strong>
              <p className="text-[11px] mt-0.5">
                টিকেট আইডি:{' '}
                <strong className="font-mono text-emerald-950 font-bold">{submittedTicketId}</strong>। অ্যাডমিন প্যানেল থেকে আপনার সমস্যার রিপ্লাই নিচে দেখা যাবে।
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-700">আপনার নাম</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="আপনার পুরো নাম..."
              className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50/50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">যোগাযোগের মোবাইল নম্বর</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 font-mono bg-gray-50/50"
              required
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-gray-700">সমস্যার মূল বিষয় (Subject)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="যেমন: অর্ডার ডেলিভারিতে বিলম্ব হচ্ছে অথবা পণ্যের কোয়ালিটি সংক্রান্ত..."
              className="w-full p-2.5 rounded-xl border border-gray-300"
              required
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-gray-700">বিস্তারিত বিবরণ (Problem Description)</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>সমস্যাটি পাঠিয়ে টিকিট জমা দিন (Submit Ticket)</span>
        </button>
      </form>

      {/* Customer Submitted Tickets & Admin Responses Thread */}
      {myTickets.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#007A3D]" />
                <span>আপনার দাখিলকৃত সমস্যা ও অ্যাডমিন রিপ্লাই (Ticket Conversation)</span>
              </h3>
              <p className="text-[11px] text-gray-500">
                অ্যাডমিন কর্তৃক প্রেরিত রিপ্লাই ও সমাধানসমূহ সরাসরি এখানে দৃশ্যমান
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              মোট {myTickets.length} টি টিকিট
            </span>
          </div>

          {/* Ticket Selector if multiple */}
          {myTickets.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 text-xs">
              {myTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all cursor-pointer ${
                    activeTicketId === t.id
                      ? 'bg-[#007A3D] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.id} ({t.status})
                </button>
              ))}
            </div>
          )}

          {/* Active Ticket Conversation View */}
          {selectedTicket && (
            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              {/* Ticket Top bar */}
              <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#007A3D]">{selectedTicket.id}</span>
                  <span className="text-gray-500 ml-2 font-bold">{selectedTicket.subject}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    selectedTicket.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedTicket.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  স্ট্যাটাস: {selectedTicket.status}
                </span>
              </div>

              {/* Chat thread */}
              <div className="p-4 space-y-3 bg-gray-50/40 max-h-72 overflow-y-auto">
                {/* Initial problem message */}
                <div className="bg-white p-3 rounded-2xl border border-gray-200 max-w-[85%]">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span className="font-bold text-gray-900">{selectedTicket.customerName} (আপনি)</span>
                    <span className="font-mono">{selectedTicket.createdAt}</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                {/* Replies Thread */}
                {selectedTicket.replies?.map((r) => {
                  const isAdmin = r.sender === 'admin';
                  return (
                    <div
                      key={r.id}
                      className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] ${
                          isAdmin
                            ? 'bg-[#007A3D] text-white shadow-xs rounded-tl-none'
                            : 'bg-white border border-gray-200 text-gray-900 rounded-tr-none'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-semibold mb-1 flex items-center justify-between gap-4 ${
                            isAdmin ? 'text-emerald-100' : 'text-gray-400'
                          }`}
                        >
                          <span className="font-bold">
                            {isAdmin ? 'হাট বাজার সাপোর্ট ডেস্ক (Official Admin)' : 'আপনি'}
                          </span>
                          <span className="font-mono text-[9px]">{r.timestamp}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{r.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Follow-up reply input */}
              <form onSubmit={handleSendFollowup} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  placeholder="অ্যাডমিনের রিপ্লাইয়ের উত্তরে কিছু লিখতে চাইলে লিখুন..."
                  value={followupMessage}
                  onChange={(e) => setFollowupMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-hidden focus:border-[#007A3D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>পাঠান</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
