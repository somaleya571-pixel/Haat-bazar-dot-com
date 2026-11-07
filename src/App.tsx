import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NavigationDrawer } from './components/NavigationDrawer';

// 18 Separate Pages
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DeliveryAddressPage } from './pages/DeliveryAddressPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { ReturnsRefundsPage } from './pages/ReturnsRefundsPage';
import { ProductReviewsPage } from './pages/ProductReviewsPage';
import { CustomerServicePage } from './pages/CustomerServicePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { PrivacyPolicyTermsPage } from './pages/PrivacyPolicyTermsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Footer component
import { Phone, Mail, ShieldCheck, Heart, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { navigateTo, language, officialContact } = useShop();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 mb-16 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand: Logo only (removed duplicate text beside logo) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="cursor-pointer" onClick={() => navigateTo('home')}>
            <img
              src="/assets/haat_bazar_official_logo.png"
              alt="Haat Bazar"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/haat_bazar_logo.png';
              }}
            />
          </div>
          <div className="text-[11px] text-gray-500">
            <p>দেশীয় পণ্য গ্রহণ করুন, নিজের স্বাস্থ্য ও পরিবারকে সুস্থ রাখুন।</p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#007A3D] font-bold mt-0.5">
              <Phone className="w-3.5 h-3.5" />
              <a href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`} className="hover:underline">
                হটলাইন: {officialContact.hotline}
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Policy links only */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-[11px]">
          <button onClick={() => navigateTo('privacy-terms')} className="hover:text-[#007A3D]">
            গোপনীয়তা নীতি (Privacy Policy)
          </button>
          <span>•</span>
          <button onClick={() => navigateTo('privacy-terms')} className="hover:text-[#007A3D]">
            শর্তাবলী (Terms & Conditions)
          </button>
          <span>•</span>
          <span className="text-gray-400">© 2026 Haat Bazar. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

const MainContent: React.FC = () => {
  const { currentPage, toastMessage } = useShop();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Router for 18 Separate Pages
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'categories':
        return <CategoriesPage />;
      case 'search':
        return <SearchResultsPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'delivery-address':
        return <DeliveryAddressPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'my-orders':
        return <MyOrdersPage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'profile':
        return <CustomerProfilePage />;
      case 'returns':
        return <ReturnsRefundsPage />;
      case 'reviews':
        return <ProductReviewsPage />;
      case 'customer-service':
        return <CustomerServicePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'help-center':
        return <HelpCenterPage />;
      case 'privacy-terms':
        return <PrivacyPolicyTermsPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-gray-900">
      {/* Header with Hotline, Logo, Search, Menu */}
      <Header onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed 5-Item Bottom Navigation */}
      <BottomNav />

      {/* 18-Page Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
