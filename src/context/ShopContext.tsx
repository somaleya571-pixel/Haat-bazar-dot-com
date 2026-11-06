import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  Product,
  CartItem,
  Order,
  ReturnRequest,
  ProductReview,
  AppNotification,
  CustomerInfo,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMER,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RETURNS,
} from '../data/mockData';
import { calculateEffectivePrice, calculateCartTotals } from '../utils/pricing';
import { generateOrderId } from '../utils/order';

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

  // Products & Admin
  products: Product[];
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotals: ReturnType<typeof calculateCartTotals>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingHistory'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Customer Profile & Address
  customer: CustomerInfo;
  updateCustomerProfile: (updated: Partial<CustomerInfo>) => void;

  // Returns
  returns: ReturnRequest[];
  submitReturnRequest: (data: Omit<ReturnRequest, 'id' | 'requestDate' | 'status'>) => void;

  // Reviews
  reviews: ProductReview[];
  submitReview: (productId: string, rating: number, comment: string, reviewerName: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Search & Filter Global State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;

  // Quick Toast / Alert Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Theme: Bright Mode / Dark Mode
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

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hb_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('hb_products', JSON.stringify(products));
  }, [products]);

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

  // Returns
  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem('hb_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURNS;
  });

  useEffect(() => {
    localStorage.setItem('hb_returns', JSON.stringify(returns));
  }, [returns]);

  // Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('hb_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('hb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('hb_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('hb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Navigation helper
  const navigateTo = (page: PageId, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Product Management (Admin)
  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(language === 'bn' ? 'পণ্য সফলভাবে আপডেট করা হয়েছে' : 'Product updated successfully');
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    showToast(language === 'bn' ? 'নতুন পণ্য তালিকাভুক্ত হয়েছে' : 'New product listed');
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
    showToast(language === 'bn' ? 'শপিং কার্ট খালি করা হয়েছে' : 'Cart cleared');
  };

  // Calculate cart totals
  const cartTotals = calculateCartTotals(
    cart.map((item) => {
      const priceCalc = calculateEffectivePrice(
        item.product.regularPrice,
        item.product.discountPercentage,
        item.product.discountStartDate,
        item.product.discountEndDate
      );
      return { price: priceCalc.effectivePrice, quantity: item.quantity };
    }),
    customer.district.toLowerCase() === 'dhaka' ? 'inside_dhaka' : 'outside_dhaka'
  );

  // Wishlist operations
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

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      date: nowStr,
      status: 'Pending',
      trackingHistory: [
        {
          stage: 'Order Placed',
          stageBn: 'অর্ডার গ্রহণ করা হয়েছে',
          timestamp: nowStr,
          note: `Order placed via ${orderData.paymentMethod}`,
          completed: true,
        },
        {
          stage: 'Order Confirmed',
          stageBn: 'অর্ডার কনফার্মড',
          timestamp: 'Pending verification',
          note: 'Haat Bazar support will verify order',
          completed: false,
        },
        {
          stage: 'Processing',
          stageBn: 'পণ্য প্রস্তুত হচ্ছে',
          timestamp: 'Pending',
          note: 'Packing items at warehouse',
          completed: false,
        },
        {
          stage: 'Shipped',
          stageBn: 'শিপমেন্ট সম্পন্ন',
          timestamp: 'Pending',
          note: 'Dispatching to delivery courier',
          completed: false,
        },
        {
          stage: 'Out for Delivery',
          stageBn: 'ডেলিভারির জন্য পাঠানো হয়েছে',
          timestamp: 'Pending',
          note: 'Rider assigned',
          completed: false,
        },
        {
          stage: 'Delivered',
          stageBn: 'সফলভাবে ডেলিভার্ড',
          timestamp: 'Pending',
          note: 'Handed over to recipient',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

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

  const updateOrderStatus = (orderId: string, status: Order['status'], note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const stages = [
          'Order Placed',
          'Order Confirmed',
          'Processing',
          'Shipped',
          'Out for Delivery',
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
    showToast(language === 'bn' ? `অর্ডার স্ট্যাটাস হালনাগাদ: ${status}` : `Order status updated: ${status}`);
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
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotals,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        customer,
        updateCustomerProfile,
        returns,
        submitReturnRequest,
        reviews,
        submitReview,
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
