import React from 'react';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from './BrandLogo';

interface BrandingBannerProps {
  variant?: 'full' | 'compact' | 'hero';
  showActions?: boolean;
}

export const BrandingBanner: React.FC<BrandingBannerProps> = ({
  variant = 'compact',
  showActions = true,
}) => {
  const { navigateTo, officialContact, websiteSettings } = useShop();

  if (variant === 'hero') {
    return (
      <section className="max-w-4xl mx-auto w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/25 shadow-sm bg-white mb-6">
        {/* Banner Graphic: Covers edge to edge */}
        <div
          className="relative w-full cursor-pointer overflow-hidden block"
          onClick={() => navigateTo('categories')}
          title="হাট বাজার - পণ্য দেখুন"
        >
          <img
            src={websiteSettings?.heroBannerUrl || '/assets/haat_bazar_banner.png'}
            alt="হাট বাজার ডট কম - Haat Bazar.com"
            className="w-full h-auto object-cover block transition-transform duration-300 hover:scale-[1.01]"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                '/assets/aistudio/Bangladeshi_Marketplace_Grocery_Banner_af4d101b.png';
            }}
          />
        </div>

        {/* Text Area: Multicolor Slogan + Action Buttons */}
        <div className="bg-gradient-to-b from-white to-emerald-50/50 border-t border-emerald-100/80 px-4 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center gap-2.5">
          <h2 className="font-black text-xs sm:text-sm md:text-base tracking-tight leading-snug">
            <span className="bg-gradient-to-r from-[#007A3D] via-teal-600 to-amber-600 bg-clip-text text-transparent">
              &ldquo;দেশীয় পণ্য গ্রহণ করুন,
            </span>{' '}
            <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-[#007A3D] bg-clip-text text-transparent">
              নিজের স্বাস্থ্য ও পরিবারকে সুস্থ রাখুন।&rdquo;
            </span>
          </h2>

          {showActions && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => navigateTo('categories')}
                className="px-4 py-1.5 bg-[#007A3D] hover:bg-[#006030] text-white font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>পণ্য কেনা</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => navigateTo('order-tracking')}
                className="px-4 py-1.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl text-xs border border-gray-200 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <span>ট্র্যাকিং</span>
              </button>
              <a
                href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A3D] font-bold rounded-xl text-xs border border-emerald-200 flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-[#007A3D]" />
                <span>{officialContact.hotline}</span>
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Compact Professional Banner across all main storefront pages
  return (
    <div className="w-full bg-gradient-to-r from-[#006B35] via-[#007A3D] to-[#005228] text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm border border-emerald-600/40 mb-5 relative overflow-hidden">
      {/* Decorative background glow accents */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/4 -top-8 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3.5">
        {/* Left: Brand Logo & Title with Verified Seal */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95 bg-white/95 p-1.5 rounded-2xl shadow-xs"
            title="হাট বাজার হোমপেজে যান"
          >
            <BrandLogo size="md" showSlogan={false} />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                Haat Bazar - হাট বাজার
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400 text-gray-900 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                <span>ভেরিফাইড</span>
              </span>
            </div>

            {/* Slogan */}
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5 leading-snug">
              &ldquo;দেশীয় পণ্য গ্রহণ করুন, নিজের স্বাস্থ্য ও পরিবারকে সুস্থ রাখুন।&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Trust Badges & Direct Hotline CTA */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs">
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-emerald-100 bg-black/15 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
              <span>১০০% খাঁটি পণ্য</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-300" />
              <span>দ্রুত ডেলিভারি</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('categories')}
              className="px-3.5 py-1.5 bg-white text-[#006B35] hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>পণ্য তালিকা</span>
            </button>

            <a
              href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`}
              className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              title="হটলাইনে কল করুন"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">হটলাইন:</span>
              <span className="font-mono">{officialContact.hotline}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
