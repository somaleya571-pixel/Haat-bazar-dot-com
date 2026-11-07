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
  Mail
} from 'lucide-react';

export const AdminSupportPage: React.FC = () => {
  const { tickets, updateTicketStatus, replyToTicket } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyMessage, setReplyMessage] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <Headphones className="w-6 h-6 text-[#006B35]" />
            Customer Support & Helpdesk
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Resolve buyer inquiries, delivery complaints, and refund assistance tickets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200">
            Open: {tickets.filter((t) => t.status === 'Open').length}
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
            In Progress: {tickets.filter((t) => t.status === 'In Progress').length}
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            Resolved: {tickets.filter((t) => t.status === 'Resolved').length}
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
                placeholder="Search ticket # or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006B35]"
              />
            </div>
            <div className="flex gap-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-600"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-600"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;
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
                      {ticket.priority} priority
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
                    <span className="text-slate-400">
                      {ticket.replies?.length || 0} replies
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Detail & Conversation Thread */}
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
                      Category: {selectedTicket.category}
                    </span>
                    {selectedTicket.orderId && (
                      <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                        Order #{selectedTicket.orderId}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-[#17231B] mt-0.5">
                    {selectedTicket.subject}
                  </h2>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 font-medium">Status:</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket.id, e.target.value as SupportTicket['status'])
                    }
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Customer Info Strip */}
              <div className="px-4 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-[#17231B]">
                  <User className="w-3.5 h-3.5 text-[#006B35]" /> {selectedTicket.customerName}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedTicket.customerPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedTicket.customerEmail}
                </span>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {/* Initial message */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs max-w-[85%]">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold text-[#17231B]">{selectedTicket.customerName}</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                {/* Replies */}
                {selectedTicket.replies?.map((r) => {
                  const isAdmin = r.sender === 'admin';
                  return (
                    <div
                      key={r.id}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-sm max-w-[85%] shadow-xs ${
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
                          <span>{isAdmin ? 'Haat Bazar Support' : selectedTicket.customerName}</span>
                          <span>{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{r.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type an official support response to the customer..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#006B35] hover:bg-[#005228] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a support ticket from the list to view conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
