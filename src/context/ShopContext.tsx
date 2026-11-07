import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  AdminMenuTab,
  AdminRole,
  Product,
  CartItem,
  Order,
  OrderStatus,
  ReturnRequest,
  ProductReview,
  AppNotification,
  CustomerInfo,
  OfficialContactInfo,
  CourierService,
  Seller,
  Coupon,
  SupportTicket,
  ActivityLog,
  PaymentSettings,
  WebsiteSettings,
  AdminProfile,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMER,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RETURNS,
  INITIAL_COURIERS,
  INITIAL_SELLERS,
  INITIAL_COUPONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_ADMIN_PROFILE,
  INITIAL_CUSTOMERS_LIST,
} from '../data/mockData';
import {
  calculateEffectivePrice,
  calculateCourierDeliveryCharge,
} from '../utils/pricing';
import { generateOrderId } from '../utils/order';

export const DEFAULT_OFFICIAL_CONTACT: OfficialContactInfo = {
  hotline: '+880 1700-123456',
  phone: '+880 1700-123456',
  email: 'official@haatbazar.com',
  gmail: 'haatbazar.official@gmail.com',
  whatsapp: '+880 1700-123456',
  supportHours: 'সকাল ৮:০০টা - রাত ১১:০০টা (প্রতিদিন)',
  officeAddress: 'বাড়ি #৪২, রোড #০৭, সেক্টর #৩, উত্তরা মডেল টাউন, ঢাকা-১২৩০, বাংলাদেশ।',
  tradeLicense: 'TRAD/DNCC/029182/2024',
  ecabNo: 'e-CAB/M-4921',
};

interface CartTotalsType {
  subtotal: number;
  deliveryCharge: number;
  couponDiscount: number;
  total: number;
  qualifiesForFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  selectedCourierName: string;
}

interface ShopContextType {
  currentPage: PageId;
  pageParams: Record<string, any>;
  navigateTo: (page: PageId, params?: Record<string, any>) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  toggleLanguage: () => void;

  // Theme: Bright Mode / Dark Mode
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Products
  products: Product[];
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotals: CartTotalsType;

  // Couriers & Delivery Selection
  couriers: CourierService[];
  selectedCourierId: string;
  setSelectedCourierId: (id: string) => void;
  updateCourier: (updated: CourierService) => void;
  addCourier: (courier: CourierService) => void;
  deleteCourier: (id: string) => void;
  toggleCourierStatus: (id: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingHistory'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignOrderCourier: (orderId: string, courierId: string, courierName: string, trackingCode?: string) => void;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Customers
  customer: CustomerInfo;
  updateCustomerProfile: (updated: Partial<CustomerInfo>) => void;
  customersList: CustomerInfo[];
  updateCustomerAccount: (customerId: string, updated: Partial<CustomerInfo>) => void;
  isLoggedIn: boolean;
  login: (phoneOrEmail?: string) => void;
  logout: () => void;

  // Sellers
  sellers: Seller[];
  addSeller: (seller: Seller) => void;
  updateSeller: (updated: Seller) => void;
  deleteSeller: (id: string) => void;

  // Coupons & Offers
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (updated: Coupon) => void;
  deleteCoupon: (id: string) => void;

  // Support & Helpdesk Tickets
  tickets: SupportTicket[];
  createTicket: (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'replies'>) => SupportTicket;
  replyToTicket: (ticketId: string, message: string, sender: 'customer' | 'admin') => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  logActivity: (action: string, module: string, details: string, recordId?: string) => void;

  // Settings & Syncing
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (updated: Partial<PaymentSettings>) => void;
  websiteSettings: WebsiteSettings;
  updateWebsiteSettings: (updated: Partial<WebsiteSettings>) => void;

  // Official Contact Info
  officialContact: OfficialContactInfo;
  updateOfficialContact: (updated: Partial<OfficialContactInfo>) => void;

  // Admin Hub & Profile
  adminTab: AdminMenuTab;
  setAdminTab: (tab: AdminMenuTab) => void;
  adminProfile: AdminProfile;
  updateAdminProfile: (updated: Partial<AdminProfile>) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (password?: string, role?: AdminRole) => boolean;
  logoutAdmin: () => void;

  // Returns & Reviews
  returns: ReturnRequest[];
  submitReturnRequest: (data: Omit<ReturnRequest, 'id' | 'requestDate' | 'status'>) => void;
  updateReturnStatus: (returnId: string, status: ReturnRequest['status'], comments?: string) => void;
  reviews: ProductReview[];
  submitReview: (productId: string, rating: number, comment: string, reviewerName: string) => void;
  updateReviewStatus: (reviewId: string, status: 'Approved' | 'Pending' | 'Hidden', reply?: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Search & Global Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;

  // Quick Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [adminTab, setAdminTab] = useState<AdminMenuTab>('dashboard');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hb_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('hb_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Customer Auth
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('hb_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const login = (phoneOrEmail?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('hb_logged_in', 'true');
    if (phoneOrEmail) {
      setCustomer((prev) => ({
        ...prev,
        phone: phoneOrEmail.includes('@') ? prev.phone : phoneOrEmail,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : prev.email,
      }));
    }
    showToast(language === 'bn' ? 'সফলভাবে লগইন সম্পন্ন হয়েছে!' : 'Successfully logged in!');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('hb_logged_in', 'false');
    showToast(language === 'bn' ? 'আপনি সফলভাবে লগআউট করেছেন।' : 'You have logged out.');
  };

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('hb_admin_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const loginAdmin = (_password?: string, role: AdminRole = 'Super Admin') => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('hb_admin_logged_in', 'true');
    setAdminProfile((prev) => ({ ...prev, role, status: 'Online' }));
    logActivity('Admin Login', 'Authentication', `Admin logged in with ${role} privileges`);
    showToast(`স্বাগতম! আপনি ${role} হিসেবে প্রবেশ করেছেন।`);
    return true;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem('hb_admin_logged_in', 'false');
    logActivity('Admin Logout', 'Authentication', 'Session ended safely');
    showToast('অ্যাডমিন সেশন সমাপ্ত হয়েছে।');
    navigateTo('home');
  };

  // Admin Profile
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem('hb_admin_profile');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('hb_admin_profile', JSON.stringify(adminProfile));
  }, [adminProfile]);

  const updateAdminProfile = (updated: Partial<AdminProfile>) => {
    setAdminProfile((prev) => ({ ...prev, ...updated }));
    logActivity('Profile Updated', 'Profile', 'Admin profile information was modified');
    showToast('অ্যাডমিন প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে');
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hb_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('hb_products', JSON.stringify(products));
  }, [products]);

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    logActivity('Product Updated', 'Products', `Updated product: ${updated.nameBn} (৳${updated.regularPrice})`, updated.id);
    showToast(language === 'bn' ? 'পণ্য সফলভাবে আপডেট করা হয়েছে' : 'Product updated successfully');
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    logActivity('Product Added', 'Products', `Created new product: ${product.nameBn}`, product.id);
    showToast(language === 'bn' ? 'নতুন পণ্য তালিকাভুক্ত হয়েছে' : 'New product listed');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    logActivity('Product Deleted', 'Products', `Deleted product: ${prod?.nameBn || productId}`, productId);
    showToast('পণ্য তালিকা থেকে অপসারণ করা হয়েছে');
  };

  // Couriers
  const [couriers, setCouriers] = useState<CourierService[]>(() => {
    const saved = localStorage.getItem('hb_couriers');
    return saved ? JSON.parse(saved) : INITIAL_COURIERS;
  });

  useEffect(() => {
    localStorage.setItem('hb_couriers', JSON.stringify(couriers));
  }, [couriers]);

  const [selectedCourierId, setSelectedCourierId] = useState<string>(() => {
    const saved = localStorage.getItem('hb_selected_courier');
    return saved || 'redx';
  });

  useEffect(() => {
    localStorage.setItem('hb_selected_courier', selectedCourierId);
  }, [selectedCourierId]);

  const updateCourier = (updated: CourierService) => {
    setCouriers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    logActivity('Courier Rate Changed', 'Couriers', `Updated ${updated.name}: Inside ৳${updated.insideDhakaRate}, Outside ৳${updated.outsideDhakaRate}`, updated.id);
    showToast(`${updated.nameBn} কনফিগারেশন আপডেট হয়েছে`);
  };

  const addCourier = (courier: CourierService) => {
    setCouriers((prev) => [...prev, courier]);
    logActivity('Courier Added', 'Couriers', `Added new courier service: ${courier.name}`, courier.id);
    showToast('নতুন কুরিয়ার সার্ভিস যুক্ত করা হয়েছে');
  };

  const deleteCourier = (id: string) => {
    setCouriers((prev) => prev.filter((c) => c.id !== id));
    logActivity('Courier Deleted', 'Couriers', `Removed courier service ID ${id}`, id);
    showToast('কুরিয়ার সার্ভিস অপসারিত হয়েছে');
  };

  const toggleCourierStatus = (id: string) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    const cr = couriers.find((c) => c.id === id);
    logActivity('Courier Status Toggled', 'Couriers', `Toggled ${cr?.name} active status to ${!cr?.isActive}`, id);
    showToast(`${cr?.nameBn} স্ট্যাটাস পরিবর্তন হয়েছে`);
  };

  // Sellers
  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('hb_sellers');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });

  useEffect(() => {
    localStorage.setItem('hb_sellers', JSON.stringify(sellers));
  }, [sellers]);

  const addSeller = (seller: Seller) => {
    setSellers((prev) => [seller, ...prev]);
    logActivity('Seller Created', 'Sellers', `Created seller account for ${seller.name} (${seller.companyName})`, seller.id);
    showToast('সেলার একাউন্ট সফলভাবে তৈরি হয়েছে');
  };

  const updateSeller = (updated: Seller) => {
    setSellers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    logActivity('Seller Updated', 'Sellers', `Updated seller ${updated.name}`, updated.id);
    showToast('সেলার তথ্য হালনাগাদ হয়েছে');
  };

  const deleteSeller = (id: string) => {
    setSellers((prev) => prev.filter((s) => s.id !== id));
    logActivity('Seller Removed', 'Sellers', `Deleted seller account ID ${id}`, id);
    showToast('সেলার একাউন্ট সরানো হয়েছে');
  };

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('hb_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  useEffect(() => {
    localStorage.setItem('hb_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      showToast('অকার্যকর কুপন কোড (Invalid coupon)');
      return false;
    }
    const now = new Date();
    if (found.expiryDate && new Date(found.expiryDate) < now) {
      showToast('কুপনের মেয়াদ শেষ হয়ে গেছে (Coupon expired)');
      return false;
    }
    setActiveCoupon(found);
    showToast(`কুপন কোড ${found.code} সফলভাবে প্রয়োগ করা হয়েছে!`);
    return true;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('কুপন বাতিল করা হয়েছে');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    logActivity('Coupon Created', 'Coupons', `Created coupon ${coupon.code} (${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '৳'})`, coupon.id);
    showToast('নতুন কুপন সফলভাবে যোগ হয়েছে');
  };

  const updateCoupon = (updated: Coupon) => {
    setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    logActivity('Coupon Updated', 'Coupons', `Updated coupon ${updated.code}`, updated.id);
    showToast('কুপন হালনাগাদ হয়েছে');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    logActivity('Coupon Deleted', 'Coupons', `Deleted coupon ID ${id}`, id);
    showToast('কুপন অপসারিত হয়েছে');
  };

  // Support Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('hb_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem('hb_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const createTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'replies'>) => {
    const newId = `TCK-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newTicket: SupportTicket = {
      ...ticketData,
      id: newId,
      createdAt: nowStr,
      updatedAt: nowStr,
      replies: [
        {
          id: `rep-${Date.now()}`,
          sender: 'customer',
          senderName: ticketData.customerName,
          message: ticketData.message,
          timestamp: nowStr,
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    logActivity('Support Ticket Created', 'Support', `New ticket from ${ticketData.customerName}: ${ticketData.subject}`, newId);
    showToast('আপনার সাপোর্ট আবেদন গৃহীত হয়েছে');
    return newTicket;
  };

  const replyToTicket = (ticketId: string, message: string, sender: 'customer' | 'admin') => {
    const nowStr = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newReply = {
          id: `rep-${Date.now()}`,
          sender,
          senderName: sender === 'admin' ? 'Haat Bazar Support Desk' : t.customerName,
          message,
          timestamp: nowStr,
        };
        return {
          ...t,
          updatedAt: nowStr,
          status: sender === 'admin' ? 'In Progress' : t.status,
          replies: [...t.replies, newReply],
        };
      })
    );
    logActivity('Ticket Reply Sent', 'Support', `Reply sent for ticket ${ticketId}`, ticketId);
    showToast('বার্তা সফলভাবে পাঠানো হয়েছে');
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: 'Just now' } : t))
    );
    logActivity('Ticket Status Updated', 'Support', `Ticket ${ticketId} status set to ${status}`, ticketId);
    showToast(`টিকিট স্ট্যাটাস হালনাগাদ: ${status}`);
  };

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('hb_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('hb_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = (action: string, module: string, details: string, recordId?: string) => {
    const nowStr = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newLog: ActivityLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      adminName: adminProfile?.name || 'Tanzil Ahammed',
      adminRole: adminProfile?.role || 'Super Admin',
      action,
      module,
      recordId,
      details,
      timestamp: nowStr,
      ipAddress: '103.114.98.24',
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('hb_payment_settings');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('hb_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  const updatePaymentSettings = (updated: Partial<PaymentSettings>) => {
    setPaymentSettings((prev) => ({ ...prev, ...updated }));
    logActivity('Payment Settings Updated', 'Settings', 'Modified bKash, Nagad or COD parameters');
    showToast('পেমেন্ট ও সিওডি সেটিংস সফলভাবে সংরক্ষিত হয়েছে');
  };

  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('hb_website_settings');
    return saved ? JSON.parse(saved) : INITIAL_WEBSITE_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('hb_website_settings', JSON.stringify(websiteSettings));
  }, [websiteSettings]);

  const updateWebsiteSettings = (updated: Partial<WebsiteSettings>) => {
    setWebsiteSettings((prev) => ({ ...prev, ...updated }));
    logActivity('Website Settings Updated', 'Website', 'Updated banner, announcement or policy settings');
    showToast('ওয়েবসাইট সেটিংস সফলভাবে হালনাগাদ ও সিঙ্ক হয়েছে');
  };

  // Customer List
  const [customersList, setCustomersList] = useState<CustomerInfo[]>(() => {
    const saved = localStorage.getItem('hb_customers_list');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS_LIST;
  });

  useEffect(() => {
    localStorage.setItem('hb_customers_list', JSON.stringify(customersList));
  }, [customersList]);

  const updateCustomerAccount = (customerId: string, updated: Partial<CustomerInfo>) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updated } : c))
    );
    logActivity('Customer Account Modified', 'Customers', `Updated customer ${customerId} (Status: ${updated.status || 'Active'})`, customerId);
    showToast('গ্রাহক অ্যাকাউন্ট সফলভাবে আপডেট হয়েছে');
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hb_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hb_wishlist');
    return saved ? JSON.parse(saved) : ['hb-prod-1', 'hb-prod-5'];
  });

  useEffect(() => {
    localStorage.setItem('hb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hb_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('hb_orders', JSON.stringify(orders));
  }, [orders]);

  // Customer Profile
  const [customer, setCustomer] = useState<CustomerInfo>(() => {
    const saved = localStorage.getItem('hb_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  useEffect(() => {
    localStorage.setItem('hb_customer', JSON.stringify(customer));
  }, [customer]);

  // Official Contact Info
  const [officialContact, setOfficialContact] = useState<OfficialContactInfo>(() => {
    const saved = localStorage.getItem('hb_official_contact');
    return saved ? JSON.parse(saved) : DEFAULT_OFFICIAL_CONTACT;
  });

  useEffect(() => {
    localStorage.setItem('hb_official_contact', JSON.stringify(officialContact));
  }, [officialContact]);

  const updateOfficialContact = (updated: Partial<OfficialContactInfo>) => {
    setOfficialContact((prev) => ({ ...prev, ...updated }));
    logActivity('Contact Information Updated', 'Settings', `Updated hotline to ${updated.hotline || officialContact.hotline}`);
    showToast(language === 'bn' ? 'অফিশিয়াল যোগাযোগ তথ্য সফলভাবে হালনাগাদ হয়েছে' : 'Official contact information updated');
  };

  // Returns
  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem('hb_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURNS;
  });

  useEffect(() => {
    localStorage.setItem('hb_returns', JSON.stringify(returns));
  }, [returns]);

  const updateReturnStatus = (returnId: string, status: ReturnRequest['status'], comments?: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, status, comments: comments || r.comments } : r))
    );
    logActivity('Return Request Updated', 'Orders', `Return request ${returnId} marked as ${status}`, returnId);
    showToast(`রিটার্ন আবেদন স্ট্যাটাস: ${status}`);
  };

  // Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('hb_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('hb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const updateReviewStatus = (reviewId: string, status: 'Approved' | 'Pending' | 'Hidden', reply?: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status, adminReply: reply || r.adminReply } : r))
    );
    logActivity('Review Moderated', 'Reviews', `Review ${reviewId} set to ${status}`, reviewId);
    showToast('রিভিউ স্ট্যাটাস হালনাগাদ হয়েছে');
  };

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('hb_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('hb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Navigation
  const navigateTo = (page: PageId, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
    showToast(language === 'bn' ? `${product.nameBn} কার্টে যোগ করা হয়েছে` : `${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast(language === 'bn' ? 'পণ্য কার্ট থেকে অপসারিত হয়েছে' : 'Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals dynamically with selected courier and coupons
  const calculateTotals = (): CartTotalsType => {
    const subtotal = cart.reduce((acc, item) => {
      const priceCalc = calculateEffectivePrice(
        item.product.regularPrice,
        item.product.discountPercentage,
        item.product.discountStartDate,
        item.product.discountEndDate
      );
      return acc + priceCalc.effectivePrice * item.quantity;
    }, 0);

    const activeCourier =
      couriers.find((c) => c.id === selectedCourierId && c.isActive) ||
      couriers.find((c) => c.isActive) ||
      couriers[0];

    const freeThreshold = websiteSettings.freeDeliveryThreshold || 1000;

    let deliveryCharge = 0;
    if (cart.length > 0 && activeCourier) {
      const deliveryRes = calculateCourierDeliveryCharge({
        courier: activeCourier,
        district: customer.district || 'Dhaka',
        weightKg: Math.max(1, cart.length * 0.8),
        subtotal,
        freeDeliveryThreshold: freeThreshold,
      });
      deliveryCharge = deliveryRes.charge;
    }

    // Coupon discount calculation
    let couponDiscount = 0;
    if (activeCoupon && subtotal >= activeCoupon.minOrderValue) {
      if (activeCoupon.discountType === 'percentage') {
        const calculated = Math.round((subtotal * activeCoupon.discountValue) / 100);
        couponDiscount = activeCoupon.maxDiscount
          ? Math.min(activeCoupon.maxDiscount, calculated)
          : calculated;
      } else {
        couponDiscount = Math.min(subtotal, activeCoupon.discountValue);
      }
    }

    const total = Math.max(0, subtotal - couponDiscount + deliveryCharge);

    return {
      subtotal,
      deliveryCharge,
      couponDiscount,
      total,
      qualifiesForFreeDelivery: subtotal >= freeThreshold && subtotal > 0,
      freeDeliveryThreshold: freeThreshold,
      selectedCourierName: activeCourier?.nameBn || activeCourier?.name || 'স্ট্যান্ডার্ড কুরিয়ার',
    };
  };

  const cartTotals = calculateTotals();

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'bn' ? 'উইশলিস্টে যুক্ত করা হয়েছে' : 'Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toggleWishlist(productId);
    }
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingHistory'>): Order => {
    const newOrderId = generateOrderId();
    const nowStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const activeCourier = couriers.find((c) => c.id === selectedCourierId);

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      date: nowStr,
      status: 'Pending',
      assignedCourierId: activeCourier?.id || 'redx',
      assignedCourierName: activeCourier?.nameBn || 'রেডএক্স ডেলিভারি',
      courierTrackingCode: `HB-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingHistory: [
        {
          stage: 'Order Placed',
          stageBn: 'অর্ডার গ্রহণ করা হয়েছে',
          timestamp: nowStr,
          note: `অর্ডার নিশ্চিত হয়েছে (${orderData.paymentMethod})`,
          completed: true,
        },
        {
          stage: 'Order Confirmed',
          stageBn: 'অর্ডার কনফার্মড',
          timestamp: 'অপেক্ষমাণ',
          note: 'হাট বাজার অ্যাডমিন টিম তথ্য ও পেমেন্ট যাচাই করবে',
          completed: false,
        },
        {
          stage: 'Processing',
          stageBn: 'পণ্য প্রস্তুত হচ্ছে',
          timestamp: 'অপেক্ষমাণ',
          note: 'পণ্য বাছাই ও ওয়্যারহাউসে নিরাপদ প্যাকিং',
          completed: false,
        },
        {
          stage: 'Ready for Shipment',
          stageBn: 'শিপমেন্টের জন্য প্রস্তুত',
          timestamp: 'অপেক্ষমাণ',
          note: 'পার্সেল রেডি এবং কুরিয়ারে হস্তান্তরের অপেক্ষায়',
          completed: false,
        },
        {
          stage: 'Shipped',
          stageBn: 'শিপমেন্ট সম্পন্ন',
          timestamp: 'অপেক্ষমাণ',
          note: `${activeCourier?.nameBn || 'কুরিয়ারে'} হস্তান্তর করা হয়েছে`,
          completed: false,
        },
        {
          stage: 'Out for Delivery',
          stageBn: 'ডেলিভারির জন্য পাঠানো হয়েছে',
          timestamp: 'অপেক্ষমাণ',
          note: 'রাইডার আপনার ঠিকানায় ডেলিভারি দিতে বের হয়েছে',
          completed: false,
        },
        {
          stage: 'Delivered',
          stageBn: 'সফলভাবে ডেলিভার্ড',
          timestamp: 'অপেক্ষমাণ',
          note: 'পণ্য সফলভাবে গ্রাহকের হাতে পৌঁছে দেওয়া হয়েছে',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Log admin activity
    logActivity('New Customer Order', 'Orders', `New order ${newOrderId} placed by ${orderData.customer.name} (৳${newOrder.totalAmount})`, newOrderId);

    // Add notification
    const orderNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'order',
      title: `অর্ডার নিশ্চিতকরণ (${newOrderId})`,
      message: `আপনার ৳${newOrder.totalAmount} টাকার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।`,
      timestamp: 'এইমাত্র',
      isRead: false,
      linkPage: 'order-tracking',
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const stages: OrderStatus[] = [
          'New Order',
          'Pending',
          'Confirmed',
          'Processing',
          'Ready for Shipment',
          'Shipped',
          'Delivered',
        ];
        const currentIdx = stages.indexOf(status);

        const updatedHistory = order.trackingHistory.map((step, idx) => {
          if (idx <= currentIdx) {
            return {
              ...step,
              completed: true,
              timestamp: step.completed ? step.timestamp : 'Just now',
              note: idx === currentIdx && note ? note : step.note,
            };
          }
          return { ...step, completed: false };
        });

        return {
          ...order,
          status,
          trackingHistory: updatedHistory,
        };
      })
    );
    logActivity('Order Status Changed', 'Orders', `Order ${orderId} changed to ${status}${note ? ` (${note})` : ''}`, orderId);
    showToast(`অর্ডার স্ট্যাটাস হালনাগাদ: ${status}`);
  };

  const assignOrderCourier = (orderId: string, courierId: string, courierName: string, trackingCode?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedCourierId: courierId,
              assignedCourierName: courierName,
              courierTrackingCode: trackingCode || o.courierTrackingCode || `HB-${Math.floor(100000 + Math.random() * 900000)}`,
            }
          : o
      )
    );
    logActivity('Courier Assigned', 'Orders', `Order ${orderId} assigned to ${courierName}`, orderId);
    showToast(`অর্ডারে ${courierName} এসাইন করা হয়েছে`);
  };

  const updateOrderPaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    logActivity('Payment Status Verified', 'Orders', `Order ${orderId} payment status set to ${status}`, orderId);
    showToast(`পেমেন্ট স্ট্যাটাস আপডেট: ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    logActivity('Order Deleted', 'Orders', `Deleted order ID ${orderId}`, orderId);
    showToast('অর্ডার সফলভাবে মোছা হয়েছে');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Customer Profile
  const updateCustomerProfile = (updated: Partial<CustomerInfo>) => {
    setCustomer((prev) => ({ ...prev, ...updated }));
    showToast(language === 'bn' ? 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে' : 'Profile information updated');
  };

  // Returns
  const submitReturnRequest = (data: Omit<ReturnRequest, 'id' | 'requestDate' | 'status'>) => {
    const returnId = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newReq: ReturnRequest = {
      ...data,
      id: returnId,
      requestDate: nowStr,
      status: 'Pending Review',
    };
    setReturns((prev) => [newReq, ...prev]);
    logActivity('Return Requested', 'Returns', `Return requested for order ${data.orderId} (৳${data.amount})`, returnId);
    showToast(language === 'bn' ? 'রিটার্ন আবেদন সফলভাবে দাখিল হয়েছে' : 'Return request submitted');
  };

  // Reviews
  const submitReview = (productId: string, rating: number, comment: string, reviewerName: string) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: reviewerName,
      rating,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      comment,
      isVerifiedPurchase: true,
      status: 'Approved',
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast(language === 'bn' ? 'রিভিউ প্রদানের জন্য ধন্যবাদ!' : 'Thank you for your verified review!');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(language === 'bn' ? 'সকল নোটিফিকেশন পড়া হিসেবে চিহ্নিত' : 'All notifications marked as read');
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        pageParams,
        navigateTo,
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        products,
        updateProduct,
        addProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotals,
        couriers,
        selectedCourierId,
        setSelectedCourierId,
        updateCourier,
        addCourier,
        deleteCourier,
        toggleCourierStatus,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        assignOrderCourier,
        updateOrderPaymentStatus,
        deleteOrder,
        getOrderById,
        customer,
        updateCustomerProfile,
        customersList,
        updateCustomerAccount,
        isLoggedIn,
        login,
        logout,
        sellers,
        addSeller,
        updateSeller,
        deleteSeller,
        coupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        tickets,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        activityLogs,
        logActivity,
        paymentSettings,
        updatePaymentSettings,
        websiteSettings,
        updateWebsiteSettings,
        officialContact,
        updateOfficialContact,
        adminTab,
        setAdminTab,
        adminProfile,
        updateAdminProfile,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        returns,
        submitReturnRequest,
        updateReturnStatus,
        reviews,
        submitReview,
        updateReviewStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
