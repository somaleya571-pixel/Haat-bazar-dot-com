import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NavigationDrawer } from './components/NavigationDrawer';
import { BrandLogo } from './components/BrandLogo';
import { BrandingBanner } from './components/BrandingBanner';

// Customer Pages
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

// Admin Panel
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Footer component for Customer Storefront
import { Phone, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  const { navigateTo, officialContact } = useShop();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 mb-16 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand: Replaceable Logo Component */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="cursor-pointer" onClick={() => navigateTo('home')}>
            <BrandLogo size="md" showSlogan={false} />
          </div>
          <div className="text-[11px] text-gray-500">
            <p>দেশীয় পণ্য গ্রহণ করুন, নিজের স্বাস্থ্য ও পরিবারকে সুস্থ রাখুন।</p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#006B35] font-bold mt-0.5">
              <Phone className="w-3.5 h-3.5" />
              <a href={`tel:${officialContact.hotline.replace(/\s+/g, '')}`} className="hover:underline">
                হটলাইন: {officialContact.hotline}
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Policy links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-[11px]">
          <button onClick={() => navigateTo('privacy-terms')} className="hover:text-[#006B35]">
            গোপনীয়তা নীতি (Privacy Policy)
          </button>
          <span>•</span>
          <button onClick={() => navigateTo('privacy-terms')} className="hover:text-[#006B35]">
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
  const { currentPage, navigateTo, toastMessage } = useShop();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync /owner path with admin page
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const isOwnerPath = pathname === '/owner' || pathname.startsWith('/owner/') || hash === '#/owner';
      if (isOwnerPath && currentPage !== 'admin-dashboard') {
        navigateTo('admin-dashboard');
      } else if (!isOwnerPath && currentPage === 'admin-dashboard') {
        navigateTo('home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentPage, navigateTo]);

  // When viewing Admin / Owner Portal, render full screen Admin Panel
  if (currentPage === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 text-[#17231B]">
        <AdminDashboardPage />
        {/* Interactive Toast Notifications */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 bg-[#17231B] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Router for Storefront Pages
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
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-gray-900">
      {/* Header with Hotline, Logo, Search, Menu */}
      <Header onOpenDrawer={() => setIsDrawerOpen(true)} />

      {/* Main Page Content with Mobile Viewport Safety & Professional Branding Banner across all main pages */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-28 sm:pb-12 viewport-padding-safe">
        <BrandingBanner variant={currentPage === 'home' ? 'hero' : 'compact'} />
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
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#17231B] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-xs animate-in fade-in slide-in-from-top-2 duration-200">
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
