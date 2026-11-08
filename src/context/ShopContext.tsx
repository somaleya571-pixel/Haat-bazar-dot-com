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
import {
  OwnerActiveSession,
  OWNER_SESSION_STORAGE_KEY,
  OWNER_SESSION_CHANNEL,
  verifyAdminCredentials,
  createOwnerSession,
  checkSessionConflict,
  isSessionActiveAndValid,
  MASTER_ADMIN_PASSWORD,
} from '../utils/session';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError, sanitizeForFirestore } from '../lib/firebase';
import { safeStorage } from '../utils/safeStorage';


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
  deleteCancelledOrders: () => number;
  getOrderById: (orderId: string) => Order | undefined;

  // Customers
  customer: CustomerInfo;
  updateCustomerProfile: (updated: Partial<CustomerInfo>) => void;
  syncFacebookProfile: (profile: { facebookId: string; name: string; email?: string; avatar?: string }) => void;
  unlinkFacebookProfile: () => void;
  saveVerifiedCustomerProfile: (profileData: CustomerInfo) => { success: boolean; customer: CustomerInfo; message: string };
  customersList: CustomerInfo[];
  updateCustomerAccount: (customerId: string, updated: Partial<CustomerInfo>) => void;
  suspendCustomer: (customerId: string) => void;
  activateCustomer: (customerId: string) => void;
  deleteCustomer: (customerId: string) => void;
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
  deleteTicketReply: (ticketId: string, replyId: string) => void;
  deleteTicket: (ticketId: string) => void;
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
  ownerSession: OwnerActiveSession | null;
  sessionConflictReason: string | null;
  clearSessionConflict: () => void;
  loginAdmin: (email?: string, password?: string, role?: AdminRole) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  validateOwnerSession: () => boolean;
  triggerSimulatedConcurrentSession: () => void;

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

  // Theme: Bright, Radiant Light Mode by Default
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeStorage.getItem('hb_theme');
    // If previously saved as dark, reset to light mode as requested by user
    if (saved === 'dark') {
      safeStorage.setItem('hb_theme', 'light');
      return 'light';
    }
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    safeStorage.setItem('hb_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Clean up any stale dark classes on initial render
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

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
    const saved = safeStorage.getItem('hb_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const login = (phoneOrEmail?: string) => {
    setIsLoggedIn(true);
    safeStorage.setItem('hb_logged_in', 'true');
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
    safeStorage.setItem('hb_logged_in', 'false');
    showToast(language === 'bn' ? 'আপনি সফলভাবে লগআউট করেছেন।' : 'You have logged out.');
  };

  // Admin Single-Session Authentication & Enforcement
  const [ownerSession, setOwnerSession] = useState<OwnerActiveSession | null>(() => {
    const saved = safeStorage.getItem(OWNER_SESSION_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [sessionConflictReason, setSessionConflictReason] = useState<string | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = safeStorage.getItem(OWNER_SESSION_STORAGE_KEY);
    return Boolean(saved);
  });

  // Cross-Tab & Multi-Device Single Session Enforcement via BroadcastChannel & Storage Event
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(OWNER_SESSION_CHANNEL);
        channel.onmessage = (event) => {
          const data = event.data;
          if (data && data.type === 'NEW_OWNER_SESSION') {
            // A new session has been initiated! If our local session doesn't match, invalidate immediately.
            setOwnerSession((currentLocalSession) => {
              if (currentLocalSession && currentLocalSession.sessionId !== data.sessionId) {
                setIsAdminLoggedIn(false);
                setSessionConflictReason(
                  'আপনার অ্যাকাউন্টে নতুন একটি ডিভাইস বা ব্রাউজার সেশন থেকে লগইন করা হয়েছে। একক-সেশন (Single Session) সুরক্ষা নীতির কারণে এই পূর্ববর্তী সেশনটি স্বয়ংক্রিয়ভাবে বাতিল করা হয়েছে।'
                );
                showToast('⚠️ অন্য উইন্ডো/ডিভাইসে নতুন সেশন শুরু হওয়ায় বর্তমান সেশনটি বাতিল করা হয়েছে!');
                return null;
              }
              return currentLocalSession;
            });
          }
        };
      }
    } catch {
      // BroadcastChannel fallback
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OWNER_SESSION_STORAGE_KEY) {
        if (!e.newValue) {
          setIsAdminLoggedIn(false);
          setOwnerSession(null);
        } else {
          try {
            const newStoredSession: OwnerActiveSession = JSON.parse(e.newValue);
            setOwnerSession((currentLocalSession) => {
              if (currentLocalSession && currentLocalSession.sessionId !== newStoredSession.sessionId) {
                setIsAdminLoggedIn(false);
                setSessionConflictReason(
                  'অন্য ব্রাউজার উইন্ডো বা ডিভাইস থেকে নতুন সেশন শুরু হয়েছে। একক-সেশন নীতি অনুসারে এই সেশনটি বাতিল করা হলো।'
                );
                showToast('⚠️ সেশন কনফ্লিক্ট: পূর্ববর্তী সেশন বাতিল করা হয়েছে।');
                return null;
              }
              return currentLocalSession;
            });
          } catch {
            // ignore JSON parse error
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Heartbeat check every 2 seconds to ensure strict single-session validity
    const heartbeatInterval = setInterval(() => {
      setOwnerSession((currentLocalSession) => {
        if (!currentLocalSession) return null;
        const currentRaw = safeStorage.getItem(OWNER_SESSION_STORAGE_KEY);
        const currentStored: OwnerActiveSession | null = currentRaw ? JSON.parse(currentRaw) : null;
        const check = checkSessionConflict(currentLocalSession.sessionId, currentStored);
        if (check.isConflict) {
          setIsAdminLoggedIn(false);
          setSessionConflictReason(check.reason || 'সেশন টার্মিনেট হয়েছে।');
          return null;
        }
        return currentLocalSession;
      });
    }, 2000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(heartbeatInterval);
    };
  }, []);

  const loginAdmin = (
    email: string = 'tanzilahammed130@gmail.com',
    password: string = MASTER_ADMIN_PASSWORD,
    role: AdminRole = 'Super Admin'
  ): { success: boolean; error?: string } => {
    const verified = verifyAdminCredentials(email, password);
    if (!verified.success) {
      return { success: false, error: verified.error };
    }

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Desktop Admin Terminal';
    const newSession = createOwnerSession(email, role, verified.name, userAgent);

    // Overwrite storage key with the sole active session
    safeStorage.setItem(OWNER_SESSION_STORAGE_KEY, JSON.stringify(newSession));
    safeStorage.setItem('hb_admin_logged_in', 'true');

    setOwnerSession(newSession);
    setIsAdminLoggedIn(true);
    setSessionConflictReason(null);

    setAdminProfile((prev) => ({
      ...prev,
      name: verified.name || prev.name,
      email: email,
      role: role,
      status: 'Online',
      lastLogin: new Date().toISOString(),
    }));

    // Broadcast invalidation signal to all other tabs/windows
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(OWNER_SESSION_CHANNEL);
        channel.postMessage({
          type: 'NEW_OWNER_SESSION',
          sessionId: newSession.sessionId,
          timestamp: newSession.loginTimestamp,
        });
        channel.close();
      }
    } catch {
      // fallback
    }

    logActivity(
      'Super Admin Login',
      'Security',
      `সুপার অ্যাডমিন একক-সেশন শুরু হয়েছে: ${newSession.sessionId} (${email})`
    );
    showToast(`স্বাগতম! আপনি সুপার অ্যাডমিন হিসেবে প্রবেশ করেছেন।`);

    // Keep URL in sync with /owner
    if (typeof window !== 'undefined' && window.location.pathname !== '/owner') {
      window.history.pushState(null, '', '/owner');
    }

    return { success: true };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setOwnerSession(null);
    safeStorage.removeItem(OWNER_SESSION_STORAGE_KEY);
    safeStorage.setItem('hb_admin_logged_in', 'false');
    logActivity('Admin Logout', 'Security', 'সুপার অ্যাডমিন সেশন সমাপ্ত হয়েছে');
    showToast('অ্যাডমিন সেশন সমাপ্ত হয়েছে।');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    navigateTo('home');
  };

  const clearSessionConflict = () => {
    setSessionConflictReason(null);
  };

  const validateOwnerSession = (): boolean => {
    const raw = safeStorage.getItem(OWNER_SESSION_STORAGE_KEY);
    if (!raw || !ownerSession) return false;
    try {
      const stored: OwnerActiveSession = JSON.parse(raw);
      return isSessionActiveAndValid(ownerSession.sessionId, stored);
    } catch {
      return false;
    }
  };

  const triggerSimulatedConcurrentSession = () => {
    // Simulates an administrative login initiated from another browser or device
    const foreignSession = createOwnerSession(
      'owner@haatbazar.com',
      'Super Admin',
      'Secondary Login (Device B)',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile'
    );
    safeStorage.setItem(OWNER_SESSION_STORAGE_KEY, JSON.stringify(foreignSession));

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(OWNER_SESSION_CHANNEL);
        channel.postMessage({
          type: 'NEW_OWNER_SESSION',
          sessionId: foreignSession.sessionId,
          timestamp: foreignSession.loginTimestamp,
        });
        channel.close();
      }
    } catch {}

    setIsAdminLoggedIn(false);
    setOwnerSession(null);
    setSessionConflictReason(
      'আপনার অ্যাকাউন্টে নতুন একটি ডিভাইস বা ব্রাউজার সেশন থেকে লগইন করা হয়েছে। একক-সেশন (Single Session) সুরক্ষা নীতির কারণে এই পূর্ববর্তী সেশনটি স্বয়ংক্রিয়ভাবে বাতিল করা হয়েছে।'
    );
    showToast('⚠️ নতুন সেশন শুরু হওয়ায় পূর্বের সেশন সাথে সাথে বাতিল করা হয়েছে!');
  };

  // Admin Profile
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    return safeStorage.getJSON('hb_admin_profile', INITIAL_ADMIN_PROFILE);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_admin_profile', adminProfile);
  }, [adminProfile]);

  const updateAdminProfile = (updated: Partial<AdminProfile>) => {
    setAdminProfile((prev) => ({ ...prev, ...updated }));
    logActivity('Profile Updated', 'Profile', 'Admin profile information was modified');
    showToast('অ্যাডমিন প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে');
  };

  // Persistent Tombstones for Deleted Products
  // Tracks deleted product IDs in safeStorage AND in Firestore (settings/deleted_products)
  // so deleted items NEVER resurrect across refreshes, re-seeds, or device sync.
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => {
    return safeStorage.getJSON<string[]>('hb_deleted_product_ids', []);
  });

  // Real-time synchronization of deleted product tombstones from Firestore
  useEffect(() => {
    const deletedDocRef = doc(db, 'settings', 'deleted_products');
    const unsubscribe = onSnapshot(
      deletedDocRef,
      (snap) => {
        if (snap.exists()) {
          const remoteIds: string[] = snap.data()?.ids || [];
          if (Array.isArray(remoteIds) && remoteIds.length > 0) {
            setDeletedProductIds((prev) => {
              const merged = Array.from(new Set([...prev, ...remoteIds]));
              safeStorage.setJSON('hb_deleted_product_ids', merged);
              return merged;
            });
            // Purge deleted IDs from current products state
            setProducts((prev) => {
              const filtered = prev.filter((p) => !remoteIds.includes(p.id));
              safeStorage.setJSON('hb_products', filtered);
              return filtered;
            });
          }
        }
      },
      () => {
        // Silently catch network/permission warnings
      }
    );
    return () => unsubscribe();
  }, []);

  // Products: Centralized Firestore Database Synchronization with Tombstone Filtering
  const [products, setProducts] = useState<Product[]>(() => {
    const deleted = safeStorage.getJSON<string[]>('hb_deleted_product_ids', []);
    const stored = safeStorage.getJSON<Product[]>('hb_products', INITIAL_PRODUCTS);
    return stored.filter((p) => !deleted.includes(p.id));
  });

  // Listen to Firestore products collection in real time
  useEffect(() => {
    const productsColRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsColRef,
      (snapshot) => {
        const deleted = safeStorage.getJSON<string[]>('hb_deleted_product_ids', deletedProductIds);
        if (snapshot.empty) {
          // Initial seeding: NEVER seed any product that was previously deleted
          const seedable = INITIAL_PRODUCTS.filter((p) => !deleted.includes(p.id));
          seedable.forEach((p) => {
            setDoc(doc(db, 'products', p.id), p).catch(() => {});
          });
          setProducts(seedable);
          safeStorage.setJSON('hb_products', seedable);
        } else {
          const loaded: Product[] = [];
          snapshot.forEach((snapDoc) => {
            const p = snapDoc.data() as Product;
            if (!deleted.includes(p.id)) {
              loaded.push(p);
            }
          });
          setProducts(loaded);
          safeStorage.setJSON('hb_products', loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    return () => unsubscribe();
  }, [deletedProductIds]);

  useEffect(() => {
    safeStorage.setJSON('hb_products', products);
  }, [products]);

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    safeStorage.setJSON('hb_products', products.map((p) => (p.id === updated.id ? updated : p)));

    // Synchronize to Firestore
    setDoc(doc(db, 'products', updated.id), {
      ...updated,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `products/${updated.id}`);
    });

    logActivity('Product Updated', 'Products', `Updated product: ${updated.nameBn} (৳${updated.regularPrice})`, updated.id);
    showToast(language === 'bn' ? 'পণ্য সফলভাবে আপডেট ও ডাটাবেজে সিঙ্ক হয়েছে' : 'Product updated and synced');
  };

  const addProduct = (product: Product) => {
    // If this product ID was previously in deleted list, remove it from tombstones
    if (deletedProductIds.includes(product.id)) {
      const nextDeleted = deletedProductIds.filter((id) => id !== product.id);
      setDeletedProductIds(nextDeleted);
      safeStorage.setJSON('hb_deleted_product_ids', nextDeleted);
      setDoc(doc(db, 'settings', 'deleted_products'), { ids: nextDeleted }, { merge: true }).catch(() => {});
    }

    setProducts((prev) => [product, ...prev]);
    safeStorage.setJSON('hb_products', [product, ...products]);

    // Synchronize to Firestore
    setDoc(doc(db, 'products', product.id), {
      ...product,
      updatedAt: new Date().toISOString(),
    }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
    });

    logActivity('Product Added', 'Products', `Created new product: ${product.nameBn}`, product.id);
    showToast(language === 'bn' ? 'নতুন পণ্য তালিকাভুক্ত ও ডাটাবেজে সিঙ্ক হয়েছে' : 'New product listed and synced');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updatedDeleted = Array.from(new Set([...deletedProductIds, productId]));

    // 1. Immediately store in persistent tombstone state & localStorage
    setDeletedProductIds(updatedDeleted);
    safeStorage.setJSON('hb_deleted_product_ids', updatedDeleted);

    // 2. Filter products state & local storage
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    safeStorage.setJSON('hb_products', updatedProducts);

    // 3. Purge from cart and wishlist immediately
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));

    // 4. Delete document from Firestore
    deleteDoc(doc(db, 'products', productId)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    });

    // 5. Persist tombstone to Firestore so no reload, restart or other device restores it
    setDoc(
      doc(db, 'settings', 'deleted_products'),
      {
        ids: updatedDeleted,
        lastDeletedId: productId,
        lastDeletedName: prod?.nameBn || productId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {});

    logActivity('Product Deleted', 'Products', `স্থায়ীভাবে পণ্য ডিলিট করা হয়েছে: ${prod?.nameBn || productId}`, productId);
    showToast(language === 'bn' ? 'পণ্যটি স্থায়ীভাবে ডিলিট করা হয়েছে এবং এটি আর কখনো ফিরে আসবে না' : 'Product permanently deleted');
  };

  // Couriers
  const [couriers, setCouriers] = useState<CourierService[]>(() => {
    return safeStorage.getJSON('hb_couriers', INITIAL_COURIERS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_couriers', couriers);
  }, [couriers]);

  const [selectedCourierId, setSelectedCourierId] = useState<string>(() => {
    const saved = safeStorage.getItem('hb_selected_courier');
    return saved || 'redx';
  });

  useEffect(() => {
    safeStorage.setItem('hb_selected_courier', selectedCourierId);
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
    return safeStorage.getJSON('hb_sellers', INITIAL_SELLERS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_sellers', sellers);
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
    return safeStorage.getJSON('hb_coupons', INITIAL_COUPONS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_coupons', coupons);
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
    return safeStorage.getJSON('hb_tickets', INITIAL_SUPPORT_TICKETS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_tickets', tickets);
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

  const deleteTicketReply = (ticketId: string, replyId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          replies: t.replies.filter((r) => r.id !== replyId),
        };
      })
    );
    logActivity('Ticket Reply Deleted', 'Support', `Deleted reply ${replyId} from ticket ${ticketId}`, ticketId);
    showToast('রিপ্লাই সফলভাবে মুছে ফেলা হয়েছে');
  };

  const deleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    logActivity('Ticket Deleted', 'Support', `Deleted ticket ${ticketId}`, ticketId);
    showToast('সাপোর্ট টিকেট সফলভাবে মোছা হয়েছে');
  };


  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    return safeStorage.getJSON('hb_activity_logs', INITIAL_ACTIVITY_LOGS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_activity_logs', activityLogs);
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
    return safeStorage.getJSON('hb_payment_settings', INITIAL_PAYMENT_SETTINGS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_payment_settings', paymentSettings);
  }, [paymentSettings]);

  const updatePaymentSettings = (updated: Partial<PaymentSettings>) => {
    const merged = { ...paymentSettings, ...updated };
    setPaymentSettings(merged);
    safeStorage.setJSON('hb_payment_settings', merged);

    setDoc(doc(db, 'settings', 'general'), {
      paymentSettings: merged,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    });

    logActivity('Payment Settings Updated', 'Settings', 'Modified bKash, Nagad or COD parameters');
    showToast('পেমেন্ট ও সিওডি সেটিংস সফলভাবে সংরক্ষিত ও সিঙ্ক হয়েছে');
  };

  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    return safeStorage.getJSON('hb_website_settings', INITIAL_WEBSITE_SETTINGS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_website_settings', websiteSettings);
  }, [websiteSettings]);

  const updateWebsiteSettings = (updated: Partial<WebsiteSettings>) => {
    const merged = { ...websiteSettings, ...updated };
    setWebsiteSettings(merged);
    safeStorage.setJSON('hb_website_settings', merged);

    // Sync to centralized Firestore settings document
    setDoc(doc(db, 'settings', 'general'), {
      websiteSettings: merged,
      logoUrl: merged.logoUrl,
      heroBannerUrl: merged.heroBannerUrl,
      announcementText: merged.announcementText,
      announcementActive: merged.announcementActive,
      freeDeliveryThreshold: merged.freeDeliveryThreshold,
      footerNotice: merged.footerNotice,
      termsContent: merged.termsContent,
      privacyContent: merged.privacyContent,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    });

    logActivity('Website Settings Updated', 'Website', 'Updated banner, announcement or policy settings');
    showToast('ওয়েবসাইট সেটিংস সফলভাবে হালনাগাদ ও সিঙ্ক হয়েছে');
  };

  // Official Contact Info
  const [officialContact, setOfficialContact] = useState<OfficialContactInfo>(() => {
    return safeStorage.getJSON('hb_official_contact', DEFAULT_OFFICIAL_CONTACT);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_official_contact', officialContact);
  }, [officialContact]);

  const updateOfficialContact = (updated: Partial<OfficialContactInfo>) => {
    const merged = { ...officialContact, ...updated };
    setOfficialContact(merged);
    safeStorage.setJSON('hb_official_contact', merged);

    // Sync to centralized Firestore settings document
    setDoc(doc(db, 'settings', 'general'), {
      officialContact: merged,
      hotline: merged.hotline,
      phone: merged.phone,
      email: merged.email,
      gmail: merged.gmail,
      whatsapp: merged.whatsapp,
      supportHours: merged.supportHours,
      officeAddress: merged.officeAddress,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    });

    logActivity('Contact Information Updated', 'Settings', `Updated hotline to ${updated.hotline || officialContact.hotline}`);
    showToast(language === 'bn' ? 'অফিশিয়াল যোগাযোগ তথ্য সফলভাবে হালনাগাদ ও ডাটাবেজে সিঙ্ক হয়েছে' : 'Official contact info synced');
  };

  // Real-Time Centralized Settings Synchronization across ALL browsers
  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'general');
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data) {
            // Synchronize Contact info
            if (data.officialContact || data.hotline) {
              const incomingContact: Partial<OfficialContactInfo> = {
                ...(data.officialContact || {}),
                ...(data.hotline ? { hotline: data.hotline } : {}),
                ...(data.phone ? { phone: data.phone } : {}),
                ...(data.email ? { email: data.email } : {}),
                ...(data.gmail ? { gmail: data.gmail } : {}),
                ...(data.whatsapp ? { whatsapp: data.whatsapp } : {}),
                ...(data.supportHours ? { supportHours: data.supportHours } : {}),
                ...(data.officeAddress ? { officeAddress: data.officeAddress } : {}),
              };
              setOfficialContact((prev) => {
                const updated = { ...prev, ...incomingContact };
                safeStorage.setJSON('hb_official_contact', updated);
                return updated;
              });
            }

            // Synchronize Website settings
            if (data.websiteSettings || data.logoUrl || data.heroBannerUrl) {
              const incomingSettings: Partial<WebsiteSettings> = {
                ...(data.websiteSettings || {}),
                ...(data.logoUrl ? { logoUrl: data.logoUrl } : {}),
                ...(data.heroBannerUrl ? { heroBannerUrl: data.heroBannerUrl } : {}),
                ...(data.announcementText ? { announcementText: data.announcementText } : {}),
                ...(data.announcementActive !== undefined ? { announcementActive: data.announcementActive } : {}),
                ...(data.freeDeliveryThreshold !== undefined ? { freeDeliveryThreshold: data.freeDeliveryThreshold } : {}),
                ...(data.footerNotice ? { footerNotice: data.footerNotice } : {}),
              };
              setWebsiteSettings((prev) => {
                const updated = { ...prev, ...incomingSettings };
                safeStorage.setJSON('hb_website_settings', updated);
                return updated;
              });
            }

            // Synchronize Payment settings
            if (data.paymentSettings) {
              setPaymentSettings((prev) => {
                const updated = { ...prev, ...data.paymentSettings };
                safeStorage.setJSON('hb_payment_settings', updated);
                return updated;
              });
            }
          }
        } else {
          // Initialize centralized settings in Firestore on first load
          setDoc(settingsDocRef, {
            id: 'general',
            officialContact: DEFAULT_OFFICIAL_CONTACT,
            websiteSettings: INITIAL_WEBSITE_SETTINGS,
            paymentSettings: INITIAL_PAYMENT_SETTINGS,
            hotline: DEFAULT_OFFICIAL_CONTACT.hotline,
            phone: DEFAULT_OFFICIAL_CONTACT.phone,
            email: DEFAULT_OFFICIAL_CONTACT.email,
            gmail: DEFAULT_OFFICIAL_CONTACT.gmail,
            whatsapp: DEFAULT_OFFICIAL_CONTACT.whatsapp,
            supportHours: DEFAULT_OFFICIAL_CONTACT.supportHours,
            officeAddress: DEFAULT_OFFICIAL_CONTACT.officeAddress,
            logoUrl: INITIAL_WEBSITE_SETTINGS.logoUrl,
            heroBannerUrl: INITIAL_WEBSITE_SETTINGS.heroBannerUrl,
            announcementText: INITIAL_WEBSITE_SETTINGS.announcementText,
            announcementActive: INITIAL_WEBSITE_SETTINGS.announcementActive,
            freeDeliveryThreshold: INITIAL_WEBSITE_SETTINGS.freeDeliveryThreshold,
            footerNotice: INITIAL_WEBSITE_SETTINGS.footerNotice,
            termsContent: INITIAL_WEBSITE_SETTINGS.termsContent,
            privacyContent: INITIAL_WEBSITE_SETTINGS.privacyContent,
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );

    return () => unsubscribe();
  }, []);

  // Customer List
  const [customersList, setCustomersList] = useState<CustomerInfo[]>(() => {
    return safeStorage.getJSON('hb_customers_list', INITIAL_CUSTOMERS_LIST);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_customers_list', customersList);
  }, [customersList]);

  const updateCustomerAccount = (customerId: string, updated: Partial<CustomerInfo>) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updated } : c))
    );
    logActivity('Customer Account Modified', 'Customers', `Updated customer ${customerId} (Status: ${updated.status || 'Active'})`, customerId);
    showToast('গ্রাহক অ্যাকাউন্ট সফলভাবে আপডেট হয়েছে');
  };

  const suspendCustomer = (customerId: string) => {
    const target = customersList.find((c) => c.id === customerId);
    setCustomersList((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'Suspended' } : c))
    );
    if (customer.id === customerId || customer.phone === target?.phone) {
      setCustomer((prev) => ({ ...prev, status: 'Suspended' }));
    }

    // Automated notification for account deactivation
    const deactNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'account',
      title: 'অ্যাকাউন্ট ডিঅ্যাক্টিভেশন নোটিফিকেশন',
      message: 'প্রিয় গ্রাহক, আপনার অ্যাকাউন্টটি সাময়িকভাবে ডিঅ্যাক্টিভ করা হয়েছে।',
      timestamp: 'এইমাত্র',
      isRead: false,
      linkPage: 'profile',
    };
    setNotifications((prev) => [deactNotif, ...prev]);

    logActivity('Customer Suspended', 'Customers', `Suspended customer account ${customerId} (${target?.name || ''})`, customerId);
    showToast('গ্রাহক অ্যাকাউন্ট সাময়িকভাবে ডিঅ্যাক্টিভ করা হয়েছে');
  };

  const activateCustomer = (customerId: string) => {
    const target = customersList.find((c) => c.id === customerId);
    setCustomersList((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'Active' } : c))
    );
    if (customer.id === customerId || customer.phone === target?.phone) {
      setCustomer((prev) => ({ ...prev, status: 'Active' }));
    }

    const actNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'account',
      title: 'অ্যাকাউন্ট সক্রিয়করণ নোটিফিকেশন',
      message: 'প্রিয় গ্রাহক, আপনার অ্যাকাউন্টটি পুনরায় সক্রিয় করা হয়েছে।',
      timestamp: 'এইমাত্র',
      isRead: false,
      linkPage: 'profile',
    };
    setNotifications((prev) => [actNotif, ...prev]);

    logActivity('Customer Activated', 'Customers', `Activated customer account ${customerId} (${target?.name || ''})`, customerId);
    showToast('গ্রাহক অ্যাকাউন্ট সক্রিয় করা হয়েছে');
  };

  const deleteCustomer = (customerId: string) => {
    const target = customersList.find((c) => c.id === customerId);
    setCustomersList((prev) => prev.filter((c) => c.id !== customerId));

    // Automated notification for permanent deletion
    const delNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'account',
      title: 'অ্যাকাউন্ট অবলুপ্তি নোটিফিকেশন',
      message: 'প্রিয় গ্রাহক, আপনার অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলা হয়েছে।',
      timestamp: 'এইমাত্র',
      isRead: false,
      linkPage: 'home',
    };
    setNotifications((prev) => [delNotif, ...prev]);

    if (customer.id === customerId || customer.phone === target?.phone) {
      setIsLoggedIn(false);
      safeStorage.setItem('hb_logged_in', 'false');
    }

    logActivity('Customer Deleted', 'Customers', `Permanently deleted customer account ${customerId} (${target?.name || ''})`, customerId);
    showToast('গ্রাহক অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলা হয়েছে');
  };


  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    return safeStorage.getJSON('hb_cart', []);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_cart', cart);
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    return safeStorage.getJSON('hb_wishlist', ['hb-prod-1', 'hb-prod-5']);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_wishlist', wishlist);
  }, [wishlist]);

  // Orders: Centralized Firestore Database Synchronization
  const [orders, setOrders] = useState<Order[]>(() => {
    return safeStorage.getJSON('hb_orders', INITIAL_ORDERS);
  });

  // Listen to Firestore orders collection in real time
  useEffect(() => {
    const ordersColRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Order[] = [];
          snapshot.forEach((snapDoc) => {
            loaded.push(snapDoc.data() as Order);
          });
          setOrders(loaded);
          safeStorage.setJSON('hb_orders', loaded);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    safeStorage.setJSON('hb_orders', orders);
  }, [orders]);

  // Customer Profile
  const [customer, setCustomer] = useState<CustomerInfo>(() => {
    return safeStorage.getJSON('hb_customer', INITIAL_CUSTOMER);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_customer', customer);
  }, [customer]);

  // Returns
  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    return safeStorage.getJSON('hb_returns', INITIAL_RETURNS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_returns', returns);
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
    return safeStorage.getJSON('hb_reviews', INITIAL_REVIEWS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_reviews', reviews);
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
    return safeStorage.getJSON('hb_notifications', INITIAL_NOTIFICATIONS);
  });

  useEffect(() => {
    safeStorage.setJSON('hb_notifications', notifications);
  }, [notifications]);

  // Navigation
  const navigateTo = (page: PageId, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window !== 'undefined') {
      if (page === 'admin-dashboard') {
        if (window.location.pathname !== '/owner') {
          window.history.pushState(null, '', '/owner');
        }
      } else {
        if (window.location.pathname === '/owner') {
          window.history.pushState(null, '', '/');
        }
      }
    }
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
    safeStorage.setJSON('hb_orders', [newOrder, ...orders]);

    // Synchronize to Firestore
    try {
      const cleanOrder = sanitizeForFirestore(newOrder);
      setDoc(doc(db, 'orders', newOrder.id), cleanOrder).catch((err) => {
        console.warn('Firestore order sync offline:', err);
      });
    } catch (err) {
      console.warn('Firestore sync skipped for order:', err);
    }

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
    const targetOrder = orders.find((o) => o.id === orderId);

    // Automated cancellation notifications with specific Bengali templates
    if (status === 'Cancelled' && targetOrder) {
      const isCod = targetOrder.paymentMethod === 'Cash on Delivery';
      const cancelMessage = isCod
        ? 'প্রিয় গ্রাহক, অনিবার্য কারণে আপনার অর্ডারটি বাতিল করা হয়েছে। অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।'
        : 'প্রিয় গ্রাহক, অনিবার্য কারণে আপনার অর্ডারটি বাতিল করা হয়েছে। আপনার রিফান্ড প্রসেস করা হয়েছে এবং নির্দিষ্ট সময়ের মধ্যে অ্যাকাউন্টে পৌঁছে যাবে।';

      const cancelNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'order',
        title: `অর্ডার বাতিল সংক্রান্ত বিজ্ঞপ্তি (${orderId})`,
        message: cancelMessage,
        timestamp: 'এইমাত্র',
        isRead: false,
        linkPage: 'order-tracking',
      };
      setNotifications((prev) => [cancelNotif, ...prev]);
    }

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

        const targetUpdated = {
          ...order,
          status,
          trackingHistory: updatedHistory,
        };

        // Synchronize updated order to Firestore
        setDoc(doc(db, 'orders', orderId), targetUpdated, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
        });

        return targetUpdated;
      })
    );
    logActivity('Order Status Changed', 'Orders', `Order ${orderId} changed to ${status}${note ? ` (${note})` : ''}`, orderId);
    showToast(`অর্ডার স্ট্যাটাস হালনাগাদ: ${status}`);
  };

  const assignOrderCourier = (orderId: string, courierId: string, courierName: string, trackingCode?: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedCourierId: courierId,
              assignedCourierName: courierName,
              courierTrackingCode: trackingCode || o.courierTrackingCode || `HB-${Math.floor(100000 + Math.random() * 900000)}`,
            }
          : o
      );
      safeStorage.setJSON('hb_orders', updated);
      const target = updated.find((o) => o.id === orderId);
      if (target) {
        setDoc(doc(db, 'orders', orderId), target, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
        });
      }
      return updated;
    });
    logActivity('Courier Assigned', 'Orders', `Order ${orderId} assigned to ${courierName}`, orderId);
    showToast(`অর্ডারে ${courierName} এসাইন করা হয়েছে`);
  };

  const updateOrderPaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
      safeStorage.setJSON('hb_orders', updated);
      const target = updated.find((o) => o.id === orderId);
      if (target) {
        setDoc(doc(db, 'orders', orderId), target, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
        });
      }
      return updated;
    });
    logActivity('Payment Status Verified', 'Orders', `Order ${orderId} payment status set to ${status}`, orderId);
    showToast(`পেমেন্ট স্ট্যাটাস আপডেট: ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      safeStorage.setJSON('hb_orders', updated);
      return updated;
    });
    deleteDoc(doc(db, 'orders', orderId)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    });
    logActivity('Order Deleted', 'Orders', `Permanently deleted order ID ${orderId}`, orderId);
    showToast('অর্ডার স্থায়ীভাবে মোছা হয়েছে');
  };

  const deleteCancelledOrders = (): number => {
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');
    const count = cancelledOrders.length;
    if (count === 0) {
      showToast('কোনো বাতিল অর্ডার নেই');
      return 0;
    }
    setOrders((prev) => {
      const remaining = prev.filter((o) => o.status !== 'Cancelled');
      safeStorage.setJSON('hb_orders', remaining);
      return remaining;
    });
    cancelledOrders.forEach((o) => {
      deleteDoc(doc(db, 'orders', o.id)).catch(() => {});
    });
    logActivity('Cancelled Orders Purged', 'Orders', `Permanently deleted ${count} cancelled orders`);
    showToast(`${count}টি বাতিল অর্ডার স্থায়ীভাবে মুছে ফেলা হয়েছে`);
    return count;
  };


  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Customer Profile
  const updateCustomerProfile = (updated: Partial<CustomerInfo>) => {
    setCustomer((prev) => {
      const merged = { ...prev, ...updated };
      safeStorage.setJSON('hb_customer', merged);
      if (merged.id) {
        try {
          const cleanCust = sanitizeForFirestore({
            ...merged,
            updatedAt: new Date().toISOString(),
          });
          setDoc(doc(db, 'customers', merged.id), cleanCust, { merge: true }).catch(() => {});
        } catch (err) {
          console.warn('Customer firestore update skipped:', err);
        }
      }
      return merged;
    });
    showToast(language === 'bn' ? 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে' : 'Profile information updated');
  };

  const syncFacebookProfile = (profile: {
    facebookId: string;
    name: string;
    email?: string;
    avatar?: string;
  }) => {
    setCustomer((prev) => {
      const updated: CustomerInfo = {
        ...prev,
        // Populate available Facebook profile name
        name: profile.name || prev.name,
        // Populate email if provided by Facebook and permitted, do not invent missing information
        email: profile.email ? profile.email : prev.email,
        // Populate profile picture
        avatar: profile.avatar || prev.avatar,
        // Keep phone number blank or as-is until manually entered and verified
        facebookId: profile.facebookId,
        facebookSynced: true,
        facebookSyncedAt: new Date().toISOString(),
      };
      safeStorage.setJSON('hb_customer', updated);
      return updated;
    });

    logActivity('Facebook Profile Synced', 'Customers', `Facebook account synced: ${profile.name} (${profile.facebookId})`);
    showToast(language === 'bn' ? 'ফেসবুক প্রোফাইল সফলভাবে সিঙ্ক হয়েছে!' : 'Facebook profile synced successfully!');
  };

  const unlinkFacebookProfile = () => {
    setCustomer((prev) => {
      const updated: CustomerInfo = {
        ...prev,
        facebookId: undefined,
        facebookSynced: false,
        facebookSyncedAt: undefined,
      };
      safeStorage.setJSON('hb_customer', updated);
      if (updated.id) {
        setDoc(doc(db, 'customers', updated.id), {
          facebookId: null,
          facebookSynced: false,
          updatedAt: new Date().toISOString(),
        }, { merge: true }).catch(() => {});
      }
      return updated;
    });

    logActivity('Facebook Account Unlinked', 'Customers', 'Customer unlinked Facebook account');
    showToast(language === 'bn' ? 'ফেসবুক অ্যাকাউন্ট সংযোগ বিচ্ছিন্ন করা হয়েছে।' : 'Facebook account unlinked.');
  };

  const saveVerifiedCustomerProfile = (profileData: CustomerInfo): { success: boolean; customer: CustomerInfo; message: string } => {
    // 1. Prevent duplicate accounts: check by verified phone or facebookId
    // CRITICAL: Never merge accounts solely because their email addresses match
    const existingIndex = customersList.findIndex(
      (c) => (profileData.phone && c.phone === profileData.phone) || (profileData.facebookId && c.facebookId === profileData.facebookId)
    );

    let customerId = profileData.id;
    let updatedList: CustomerInfo[];

    if (existingIndex >= 0) {
      // Secure linking to existing account, keeping historical orders
      customerId = customersList[existingIndex].id || `cust-${Date.now()}`;
      const mergedCustomer: CustomerInfo = {
        ...customersList[existingIndex],
        ...profileData,
        id: customerId,
        status: customersList[existingIndex].status || 'Active',
      };
      updatedList = customersList.map((c, idx) => (idx === existingIndex ? mergedCustomer : c));
      profileData = mergedCustomer;
    } else {
      // New unique customer record
      if (!customerId) {
        customerId = `cust-${Date.now()}`;
      }
      const newCustomer: CustomerInfo = {
        ...profileData,
        id: customerId,
        joinedDate: profileData.joinedDate || new Date().toISOString().split('T')[0],
        status: 'Active',
      };
      updatedList = [newCustomer, ...customersList];
      profileData = newCustomer;
    }

    setCustomersList(updatedList);
    safeStorage.setJSON('hb_customers_list', updatedList);

    setCustomer(profileData);
    safeStorage.setJSON('hb_customer', profileData);
    setIsLoggedIn(true);
    safeStorage.setItem('hb_logged_in', 'true');

    // Save to Firestore customers/{customerId}
    if (customerId) {
      try {
        const cleanCustomerData = sanitizeForFirestore({
          ...profileData,
          updatedAt: new Date().toISOString(),
        });

        setDoc(doc(db, 'customers', customerId), cleanCustomerData, { merge: true }).catch((err) => {
          console.warn('Firestore customer sync offline/pending:', err);
        });
      } catch (err) {
        console.warn('Customer Firestore sync skipped:', err);
      }
    }

    logActivity('Customer Profile Saved', 'Customers', `Verified profile saved: ${profileData.name} (${profileData.phone})`, customerId);
    showToast(language === 'bn' ? 'গ্রাহক তথ্য সফলভাবে সংরক্ষিত ও ডাটাবেজে যুক্ত হয়েছে!' : 'Customer profile saved and verified!');

    return {
      success: true,
      customer: profileData,
      message: 'Profile verified and saved successfully',
    };
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
        deleteCancelledOrders,
        getOrderById,
        customer,
        updateCustomerProfile,
        syncFacebookProfile,
        unlinkFacebookProfile,
        saveVerifiedCustomerProfile,
        customersList,
        updateCustomerAccount,
        suspendCustomer,
        activateCustomer,
        deleteCustomer,
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
        deleteTicketReply,
        deleteTicket,
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
        ownerSession,
        sessionConflictReason,
        clearSessionConflict,
        loginAdmin,
        logoutAdmin,
        validateOwnerSession,
        triggerSimulatedConcurrentSession,
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
