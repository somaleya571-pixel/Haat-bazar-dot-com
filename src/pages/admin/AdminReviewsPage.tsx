import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Star, 
  Search, 
  CheckCircle, 
  EyeOff, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus, products } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Approved' | 'Pending' | 'Hidden'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const getProductName = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    return p ? p.nameBn : 'Haat Bazar Product';
  };

  const filteredReviews = reviews.filter((r) => {
    const prodName = getProductName(r.productId);
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    updateReviewStatus(reviewId, 'Approved', replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Reviews & Ratings Moderation
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Monitor customer feedback, verify purchases, and publish official merchant replies.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 text-[#006B35] px-4 py-2 rounded-xl border border-emerald-200 text-sm font-semibold">
          <span>Total Reviews: {reviews.length}</span>
          <span>•</span>
          <span>
            Avg:{' '}
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : 0}{' '}
            ★
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, customer, or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006B35]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Review</option>
            <option value="Hidden">Hidden</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700"
          >
            <option value="all">All Stars (1-5)</option>
            <option value={5}>5 Stars ★★★★★</option>
            <option value={4}>4 Stars ★★★★☆</option>
            <option value={3}>3 Stars ★★★☆☆</option>
            <option value={2}>2 Stars ★★☆☆☆</option>
            <option value={1}>1 Star ★☆☆☆☆</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            No reviews matching your filter criteria.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const productName = getProductName(r.productId);
            return (
              <div
                key={r.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#17231B] text-base">{r.customerName}</span>
                      {r.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Buyer
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          r.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status || 'Approved'}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Product:{' '}
                      <span className="font-semibold text-slate-700">{productName}</span> •{' '}
                      {r.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">{r.rating}.0</span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{r.comment}"
                </p>

                {/* Official Merchant Reply if present */}
                {r.adminReply && (
                  <div className="mt-3 ml-4 pl-3 border-l-2 border-[#006B35] bg-[#E8F7EC]/50 p-3 rounded-r-xl text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#006B35] mb-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Haat Bazar Official Response:
                    </div>
                    <p className="text-[#17231B]">{r.adminReply}</p>
                  </div>
                )}

                {/* Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateReviewStatus(r.id, 'Approved')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        r.status === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => updateReviewStatus(r.id, 'Hidden')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        r.status === 'Hidden'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Hide Review
                    </button>
                    <button
                      onClick={() => {
                        setActiveReplyId(activeReplyId === r.id ? null : r.id);
                        setReplyText(r.adminReply || '');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />{' '}
                      {r.adminReply ? 'Edit Merchant Reply' : 'Add Merchant Reply'}
                    </button>
                  </div>
                </div>

                {/* Inline Reply Form */}
                {activeReplyId === r.id && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-100">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Merchant Reply (Displayed publicly below customer review):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Thank you for your support! We are glad you enjoyed the fresh Sundarban Honey."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#006B35] bg-white"
                      />
                      <button
                        onClick={() => handleSendReply(r.id)}
                        className="px-4 py-2 bg-[#006B35] hover:bg-[#005228] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" /> Post Reply
                      </button>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
