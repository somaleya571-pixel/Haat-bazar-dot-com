import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { SupportTicket } from '../../types';
import { 
  Headphones, 
  Search, 
  MessageSquare, 
  Send, 
  User, 
  Phone, 
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AdminSupportPage: React.FC = () => {
  const { tickets, updateTicketStatus, replyToTicket, deleteTicketReply, deleteTicket } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyMessage, setReplyMessage] = useState('');

  // Selected Ticket
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerPhone.includes(searchTerm) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;
    replyToTicket(selectedTicket.id, replyMessage.trim(), 'admin');
    setReplyMessage('');
  };

  const handlePresetReply = (text: string) => {
    setReplyMessage(text);
  };

  const handleDeleteReply = (replyId: string) => {
    if (!selectedTicket) return;
    if (window.confirm('আপনি কি নিশ্চিত যে এই রিপ্লাইটি মুছে ফেলতে চান?')) {
      deleteTicketReply(selectedTicket.id, replyId);
    }
  };

  const handleDeleteEntireTicket = (ticketId: string) => {
    if (window.confirm('আপনি কি সম্পূর্ণ টিকিটটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
      deleteTicket(ticketId);
      if (selectedTicketId === ticketId) {
        setSelectedTicketId(tickets.find((t) => t.id !== ticketId)?.id || null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <Headphones className="w-6 h-6 text-[#006B35]" />
            <span>কাস্টমার সাপোর্ট ও হেল্পডেস্ক (Customer Support & Helpdesk)</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            গ্রাহকদের সমস্যার সমাধান দিন, উত্তর (রিপ্লাই) প্রদান করুন এবং প্রয়োজনে রিপ্লাই ডিলিট করার পূর্ণ নিয়ন্ত্রণ
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200">
            নতুন/ওপেন: {tickets.filter((t) => t.status === 'Open').length}
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">
            চলমান: {tickets.filter((t) => t.status === 'In Progress').length}
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
            সমাধানকৃত: {tickets.filter((t) => t.status === 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Main Container: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="টিকেট আইডি, নাম বা ফোন নম্বর খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div className="flex gap-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-600 font-medium"
              >
                <option value="all">সকল অবস্থা (All)</option>
                <option value="Open">ওপেন (Open)</option>
                <option value="In Progress">চলমান (In Progress)</option>
                <option value="Resolved">সমাধানকৃত (Resolved)</option>
                <option value="Closed">বন্ধ (Closed)</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-600 font-medium"
              >
                <option value="all">সকল গুরুত্ব (All)</option>
                <option value="High">উচ্চ (High)</option>
                <option value="Urgent">জরুরি (Urgent)</option>
                <option value="Medium">মাঝারি (Medium)</option>
                <option value="Low">সাধারণ (Low)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicket?.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#E8F7EC] border-[#006B35] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#006B35]">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ticket.priority === 'High' || ticket.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : ticket.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#17231B] line-clamp-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ticket.customerName} • {ticket.customerPhone}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span
                      className={`font-semibold capitalize ${
                        ticket.status === 'Open'
                          ? 'text-rose-600'
                          : ticket.status === 'In Progress'
                          ? 'text-blue-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      ● {ticket.status}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {ticket.replies?.length || 0} টি মেসেজ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Detail, Conversation Thread & Admin Reply Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {selectedTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#006B35]">
                      {selectedTicket.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      ক্যাটাগরি: {selectedTicket.category}
                    </span>
                    {selectedTicket.orderId && (
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                        অর্ডার #{selectedTicket.orderId}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-[#17231B] mt-0.5">
                    {selectedTicket.subject}
                  </h2>
                </div>

                {/* Status Switcher & Delete Ticket Button */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket.id, e.target.value as SupportTicket['status'])
                    }
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                  >
                    <option value="Open">Open (নতুন)</option>
                    <option value="In Progress">In Progress (চলমান)</option>
                    <option value="Resolved">Resolved (সমাধানকৃত)</option>
                    <option value="Closed">Closed (বন্ধ)</option>
                  </select>

                  <button
                    onClick={() => handleDeleteEntireTicket(selectedTicket.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                    title="সম্পূর্ণ টিকিটটি ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Info Strip */}
              <div className="px-4 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-[#17231B]">
                  <User className="w-3.5 h-3.5 text-[#006B35]" /> {selectedTicket.customerName}
                </span>
                <a
                  href={`tel:${selectedTicket.customerPhone}`}
                  className="flex items-center gap-1 hover:text-[#006B35] font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedTicket.customerPhone}
                </a>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedTicket.customerEmail}
                </span>
              </div>

              {/* Messages Flow with Admin Reply Deletion Option */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {/* Initial message from Customer */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs max-w-[85%]">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold text-[#17231B]">{selectedTicket.customerName} (গ্রাহক)</span>
                    <span className="text-[10px] font-mono">{selectedTicket.createdAt}</span>
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{selectedTicket.message}</p>
                </div>

                {/* Replies Thread */}
                {selectedTicket.replies?.map((r) => {
                  const isAdmin = r.sender === 'admin';
                  return (
                    <div
                      key={r.id}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-sm max-w-[85%] shadow-xs relative ${
                          isAdmin
                            ? 'bg-[#006B35] text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        <div
                          className={`text-[11px] mb-1 font-semibold flex items-center justify-between gap-4 ${
                            isAdmin ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">
                              {isAdmin ? 'হাট বাজার সাপোর্ট ডেস্ক (Admin)' : selectedTicket.customerName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono opacity-80">{r.timestamp}</span>

                            {/* Option to Delete Reply (Specifically for Admin Replies as requested) */}
                            <button
                              onClick={() => handleDeleteReply(r.id)}
                              className={`p-1 rounded-md transition-all cursor-pointer opacity-70 hover:opacity-100 ${
                                isAdmin
                                  ? 'hover:bg-rose-500/30 text-rose-200 hover:text-white'
                                  : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                              }`}
                              title={isAdmin ? 'অ্যাডমিন রিপ্লাইটি মুছে ফেলুন (Delete Reply)' : 'রিপ্লাইটি মুছে ফেলুন'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="whitespace-pre-wrap leading-relaxed">{r.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fast Bengali Quick Response Chips */}
              <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-bold shrink-0">দ্রুত রিপ্লাই:</span>
                <button
                  type="button"
                  onClick={() => handlePresetReply('প্রিয় গ্রাহক, আপনার সমস্যার জন্য আমরা আন্তরিকভাবে দুঃখিত। বিষয়টি সমাধানে আমরা কাজ করছি।')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#006B35] rounded-full border border-slate-300 shrink-0 transition-colors"
                >
                  দুঃখ প্রকাশ ও সমাধান
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetReply('প্রিয় গ্রাহক, আপনার রিফান্ডটি প্রসেস করা হয়েছে এবং নির্দিষ্ট সময়ের মধ্যে আপনার অ্যাকাউন্টে পৌঁছে যাবে।')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#006B35] rounded-full border border-slate-300 shrink-0 transition-colors"
                >
                  রিফান্ড কনফার্মেশন
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetReply('প্রিয় গ্রাহক, কুরিয়ার টিমকে তাগিদ দেওয়া হয়েছে। আজকেই ডেলিভারি সম্পন্ন হবে।')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#006B35] rounded-full border border-slate-300 shrink-0 transition-colors"
                >
                  ডেলিভারি আপডেট
                </button>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="গ্রাহকের সমস্যার সমাধান জানিয়ে অফিসিয়াল রিপ্লাই লিখুন..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#006B35] hover:bg-[#005228] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>রিপ্লাই পাঠান</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Headphones className="w-10 h-10 opacity-40 text-[#006B35]" />
              <p>তালিকা থেকে একটি সাপোর্ট টিকেট নির্বাচন করুন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
