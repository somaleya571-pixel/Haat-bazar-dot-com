import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

interface BrandLogoProps {
  variant?: 'header' | 'drawer' | 'footer' | 'admin' | 'banner' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  customSrc?: string;
  onClick?: () => void;
  showSlogan?: boolean;
}

/**
  * Replaceable Official Haat Bazar Brand Logo Component
  * Designed to allow seamless replacement by the Super Admin at any time
  * while preserving the authentic green-and-white visual identity and
  * proper responsive sizing across customer and admin pages.
  */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  size = 'md',
  className = '',
  customSrc,
  onClick,
  showSlogan = false,
}) => {
  const { websiteSettings } = useShop();
  const [imgError, setImgError] = useState(false);

  // Resolution cascade: customSrc -> websiteSettings.logoUrl -> official cropped logo -> full banner picture
  const primarySrc =
    customSrc ||
    (websiteSettings && websiteSettings.logoUrl ? websiteSettings.logoUrl : null) ||
    '/assets/haat_bazar_official_logo.png';

  const fallbackSrc = '/assets/aistudio/Bangladeshi_Marketplace_Grocery_Banner_af4d101b.png';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-7 sm:h-8 w-auto';
      case 'md':
        return 'h-9 sm:h-11 w-auto';
      case 'lg':
        return 'h-11 sm:h-14 w-auto';
      case 'xl':
        return 'h-14 sm:h-18 w-auto';
      case 'custom':
        return '';
      default:
        return 'h-9 sm:h-11 w-auto';
    }
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'admin':
        return 'bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-emerald-100 flex items-center';
      case 'drawer':
        return 'bg-white px-3 py-1.5 rounded-xl shadow-2xs flex items-center justify-center';
      case 'footer':
        return 'flex items-center';
      case 'banner':
        return 'rounded-2xl overflow-hidden shadow-sm';
      default:
        return 'flex items-center select-none';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 group transition-transform ${
        onClick ? 'cursor-pointer hover:opacity-95' : ''
      } ${getContainerStyle()} ${className}`}
      title="হাট বাজার ডট কম - Haat Bazar (.com)"
    >
      <div className="relative overflow-hidden flex items-center">
        <img
          src={imgError ? fallbackSrc : primarySrc}
          alt="হাট বাজার ডট কম - Haat Bazar.com"
          className={`${getSizeClasses()} object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
          onError={() => {
            if (!imgError) {
              setImgError(true);
            }
          }}
          loading="eager"
        />
      </div>

      {showSlogan && (
        <span className="hidden lg:inline text-[11px] font-semibold text-emerald-800 tracking-tight pl-1 border-l border-emerald-200">
          আপনার বিশ্বাস, আমাদের অঙ্গীকার
        </span>
      )}
    </div>
  );
};
