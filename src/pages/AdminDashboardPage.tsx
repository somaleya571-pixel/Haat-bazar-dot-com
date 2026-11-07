import React from 'react';
import { useShop } from '../context/ShopContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboardHome } from './admin/AdminDashboardHome';
import { AdminProductsPage } from './admin/AdminProductsPage';
import { AdminOrdersPage } from './admin/AdminOrdersPage';
import { AdminCustomersPage } from './admin/AdminCustomersPage';
import { AdminSellersPage } from './admin/AdminSellersPage';
import { AdminCouriersPage } from './admin/AdminCouriersPage';
import { AdminCouponsPage } from './admin/AdminCouponsPage';
import { AdminReportsPage } from './admin/AdminReportsPage';
import { AdminReviewsPage } from './admin/AdminReviewsPage';
import { AdminSupportPage } from './admin/AdminSupportPage';
import { AdminActivityLogsPage } from './admin/AdminActivityLogsPage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';
import { AdminWebsitePage } from './admin/AdminWebsitePage';
import { AdminProfilePage } from './admin/AdminProfilePage';
import { AdminLoginPage } from './admin/AdminLoginPage';

export const AdminDashboardPage: React.FC = () => {
  const {
    adminTab,
    isAdminLoggedIn,
    ownerSession,
    sessionConflictReason,
    clearSessionConflict,
  } = useShop();

  // Strict Single-Session Security Gate: Block all unauthorized access completely
  if (!isAdminLoggedIn || !ownerSession) {
    return (
      <AdminLoginPage
        conflictReason={sessionConflictReason}
        onClearConflict={clearSessionConflict}
      />
    );
  }

  const renderContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'products':
        return <AdminProductsPage />;
      case 'orders':
        return <AdminOrdersPage />;
      case 'customers':
        return <AdminCustomersPage />;
      case 'sellers':
        return <AdminSellersPage />;
      case 'couriers':
        return <AdminCouriersPage />;
      case 'coupons':
        return <AdminCouponsPage />;
      case 'reports':
        return <AdminReportsPage />;
      case 'reviews':
        return <AdminReviewsPage />;
      case 'support':
        return <AdminSupportPage />;
      case 'activity-logs':
        return <AdminActivityLogsPage />;
      case 'settings':
        return <AdminSettingsPage />;
      case 'website':
        return <AdminWebsitePage />;
      case 'profile':
        return <AdminProfilePage />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return <AdminLayout>{renderContent()}</AdminLayout>;
};
