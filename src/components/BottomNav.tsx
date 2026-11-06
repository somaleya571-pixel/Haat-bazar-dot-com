import React from 'react';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PageId } from '../types';

export const BottomNav: React.FC = () => {
  const { currentPage, navigateTo, language, cart, wishlist } = useShop();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems: Array<{
    id: PageId;
    labelEn: string;
    labelBn: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'home',
      labelEn: 'Home',
      labelBn: 'হোম',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'categories',
      labelEn: 'Categories',
      labelBn: 'ক্যাটাগরি',
      icon: <Grid className="w-5 h-5" />,
    },
    {
      id: 'wishlist',
      labelEn: 'Wishlist',
      labelBn: 'উইশলিস্ট',
      icon: <Heart className="w-5 h-5" />,
      badge: wishlist.length > 0 ? wishlist.length : undefined,
    },
    {
      id: 'cart',
      labelEn: 'Shopping',
      labelBn: 'শপিং',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'profile',
      labelEn: 'Profile',
      labelBn: 'প্রোফাইল',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 shadow-lg px-2 py-1.5 transition-all select-none"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#007A3D] font-bold scale-105'
                  : 'text-gray-500 hover:text-[#007A3D] font-medium'
              }`}
              aria-label={item.labelEn}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#007A3D] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#007A3D] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
