import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductReviewsPage: React.FC = () => {
  const { reviews, submitReview, products, orders, customer, pageParams, navigateTo, language, showToast } =
    useShop();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    pageParams.productId || products[0]?.id || ''
  );
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(customer.name || '');
  const [filterRating, setFilterRating] = useState<number>(0);

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Check if customer has a delivered order containing this product (Verified Purchase Check)
  const isVerifiedPurchaser = orders.some((order) =>
    order.status === 'Delivered' && order.items.some((i) => i.productId === currentProduct?.id)
  );

  const productReviews = reviews.filter((r) => {
    if (r.productId !== currentProduct?.id) return false;
    if (filterRating > 0 && r.rating !== filterRating) return false;
    return true;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('অনুগ্রহ করে আপনার মূল্যবান মতামত লিখুন');
      return;
    }

    submitReview(currentProduct.id, rating, comment, reviewerName || 'গ্রাহক');
    setComment('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              currentProduct
                ? navigateTo('product-details', { productId: currentProduct.id })
                : navigateTo('home')
            }
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {language === 'bn' ? 'কাস্টমার রিভিউ ও রেটিং (Page 14: Reviews)' : 'Product Reviews'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'যাচাইকৃত ক্রেতাদের বাস্তব প্রতিক্রিয়া ও রেটিং' : 'Real verified customer reviews and feedback'}
            </p>
          </div>
        </div>
      </div>

      {/* Product Selector Dropdown */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-gray-700 shrink-0">পণ্য নির্বাচন:</span>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full text-xs font-bold text-[#007A3D] bg-emerald-50/50 border border-emerald-200 rounded-xl p-2 outline-hidden"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nameBn} ({p.name})
            </option>
          ))}
        </select>
      </div>

      {/* Review Submission Box */}
      <form
        onSubmit={handleReviewSubmit}
        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#007A3D]" />
            <span>আপনার রিভিউ প্রদান করুন</span>
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            {isVerifiedPurchaser ? (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>যাচাইকৃত ক্রেতা (Verified Buyer)</span>
              </span>
            ) : (
              <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                সাধারণ রিভিউ
              </span>
            )}
          </div>
        </div>

        {/* 5-Star Interactive Rating */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700">স্টার রেটিং দিন:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
                title={`${star} Stars`}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-600">({rating} / 5)</span>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700">আপনার নাম:</label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700">
            পণ্যের গুণগত মান ও অভিজ্ঞতা সম্পর্কে বিস্তারিত লিখুন:
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="যেমন: পণ্যটির খাঁটি সুবাস ও প্যাকেজিং দারুণ ছিল..."
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          রিভিউ সাবমিট করুন (Submit Review)
        </button>
      </form>

      {/* Reviews List & Filter */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <h3 className="font-bold text-sm text-gray-900">
            {currentProduct?.nameBn} এর রিভিউ ({productReviews.length})
          </h3>

          {/* Rating Star Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400">ফিল্টার:</span>
            {[0, 5, 4, 3].map((s) => (
              <button
                key={s}
                onClick={() => setFilterRating(s)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  filterRating === s
                    ? 'bg-[#007A3D] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 0 ? 'সকল' : `${s}★`}
              </button>
            ))}
          </div>
        </div>

        {productReviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            এই পণ্যের জন্য এখনও কোনো রিভিউ যোগ করা হয়নি। আপনিই প্রথম রিভিউ প্রদান করুন!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {productReviews.map((rev) => (
              <div key={rev.id} className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{rev.customerName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#007A3D]" />
                        <span>যাচাইকৃত ক্রেতা</span>
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-[11px]">{rev.date}</span>
                </div>

                <div className="flex items-center text-amber-400 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
