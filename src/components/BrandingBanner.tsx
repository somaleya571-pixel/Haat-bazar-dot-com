import React from 'react';
import {
  ShieldCheck,
  Truck,
  Phone,
  ArrowRight,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface BrandingBannerProps {
  variant?: 'full' | 'compact' | 'hero';
  showActions?: boolean;
}

export const BrandingBanner: React.FC<BrandingBannerProps> = ({
  showActions = true,
}) => {
  const { navigateTo, officialContact, websiteSettings } = useShop();

  const bannerImgSrc = websiteSettings?.heroBannerUrl || '/assets/haat_bazar_banner.png';
  const fallbackImgSrc = '/assets/aistudio/Bangladeshi_Marketplace_Grocery_Banner_af4d101b.png';

  return (
    <section className="w-full bg-white rounded-2xl sm:rounded-3xl border border-emerald-500/25 shadow-xs overflow-hidden mb-6 transition-all">
      {/* 100% Full Uncropped Banner Image - Exactly as designed by user */}
      <div
        className="w-full cursor-pointer overflow-hidden block bg-[#FEFDF7] group"
        onClick={() => navigateTo('categories')}
        title="হাট বাজার ডট কম - বিভিন্ন পণ্যের বিশ্বস্ত ঠিকানা (পণ্য দেখতে ক্লিক করুন)"
      >
        <img
          src={bannerImgSrc}
          alt="হাট বাজার ডট কম - Haat Bazar.com - বিভিন্ন পণ্যের বিশ্বস্ত ঠিকানা - আপনার বিশ্বাস, আমাদের অঙ্গীকার"
          className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.005]"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImgSrc;
          }}
        />
      </div>

      {/* Trust Badges & Quick Action Ribbon */}
      {showActions && (
        <div className="bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/80 px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Trust credentials matching the banner's promise */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold text-gray-700">
            <span className="inline-flex items-center gap-1.5 text-[#006B35]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>১০০% খাঁটি ও বিশ্বস্ত পণ্য</span>
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-gray-700">
              <Truck className="w-4 h-4 text-[#006B35]" />
              <span>দ্রুত ডেলিভারি</span>
            </span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-gray-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>সাশ্রয়ী দাম</span>
            </span>
          </div>

          {/* Interactive Fast Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('categories')}
              className="px-3.5 py-1.5 bg-[#006B35] hover:bg-[#005228] text-white rounded-xl font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>পণ্য কেনা</span>
              <ArrowRight className="w-3 h-3 hidden sm:inline" />
            </button>

            <button
              onClick={() => navigateTo('order-tracking')}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold text-xs border border-gray-200 shadow-2xs transition-transform active:scale-95 cursor-pointer hidden sm:flex items-center gap-1"
            >
              <Clock className="w-3 h-3 text-[#006B35]" />
              <span>ট্র্যাকিং</span>
            </button>

            <a
              href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
              className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              title="হটলাইনে সরাসরি যোগাযোগ"
            >
              <Phone className="w-3.5 h-3.5 text-gray-900" />
              <span className="hidden sm:inline">হটলাইন:</span>
              <span className="font-mono">{officialContact.hotline}</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
