export type PageId =
  | 'home'
  | 'categories'
  | 'search'
  | 'product-details'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'delivery-address'
  | 'order-confirmation'
  | 'my-orders'
  | 'order-tracking'
  | 'profile'
  | 'returns'
  | 'reviews'
  | 'customer-service'
  | 'notifications'
  | 'help-center'
  | 'privacy-terms'
  | 'admin-dashboard';

export type AdminMenuTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'sellers'
  | 'couriers'
  | 'coupons'
  | 'reports'
  | 'reviews'
  | 'support'
  | 'activity-logs'
  | 'settings'
  | 'website'
  | 'profile';

export type AdminRole = 'Super Admin' | 'Admin' | 'Sub-Admin' | 'Authorized Staff';

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  regularPrice: number;
  discountPercentage: number;
  discountStartDate?: string;
  discountEndDate?: string;
  expiryDate: string;
  description: string;
  descriptionBn: string;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  unit: string;
  supplierName?: string;
  isAvailable?: boolean;
  isFlashSale?: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  isRecommended?: boolean;
  specifications: Record<string, string>;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface CustomerAddress {
  id: string;
  label: string;
  district: string;
  upazila: string;
  thana: string;
  village: string;
  addressDetails: string;
  isDefault: boolean;
}

export interface OfficialContactInfo {
  hotline: string;
  phone: string;
  email: string;
  gmail: string;
  whatsapp: string;
  supportHours: string;
  officeAddress: string;
  tradeLicense: string;
  ecabNo: string;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  upazila: string;
  thana: string;
  village: string;
  addressDetails: string;
  avatar?: string;
  status?: 'Active' | 'Suspended';
  joinedDate?: string;
  totalSpent?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  nameBn: string;
  image: string;
  price: number;
  quantity: number;
}

export interface TrackingStep {
  stage: string;
  stageBn: string;
  timestamp: string;
  note: string;
  completed: boolean;
}

export type OrderStatus =
  | 'New Order'
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready for Shipment'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Refunded';

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Rocket';
  paymentStatus: 'Pending Verification' | 'Paid (Verified)' | 'Cash on Delivery' | 'Refunded';
  status: OrderStatus;
  trackingHistory: TrackingStep[];
  assignedCourierId?: string;
  assignedCourierName?: string;
  courierTrackingCode?: string;
  bKashNumber?: string;
  trxId?: string;
  notes?: string;
}

export interface CourierService {
  id: string;
  name: string;
  nameBn: string;
  code: string;
  insideDhakaRate: number;
  outsideDhakaRate: number;
  baseWeightKg: number;
  additionalPerKg: number;
  estimatedDaysInside: string;
  estimatedDaysOutside: string;
  isCodAvailable: boolean;
  isActive: boolean;
  restrictedDistricts?: string[];
  districtOverrides?: Record<string, number>;
  notes?: string;
}

export interface Seller {
  id: string;
  name: string;
  nameBn: string;
  companyName: string;
  phone: string;
  email: string;
  district: string;
  rating: number;
  totalSales: number;
  totalOrders: number;
  commissionRate: number; // percentage
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  productsCount: number;
  bankOrBkashAccount?: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface SupportTicketReply {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  category: 'Order' | 'Payment' | 'Delivery' | 'Return' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  subject: string;
  message: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  replies: SupportTicketReply[];
}

export interface ActivityLog {
  id: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  module: string;
  recordId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface PaymentSettings {
  bKashNumber: string;
  bKashType: 'Merchant' | 'Personal';
  bKashEnabled: boolean;
  bKashInstructions: string;
  nagadNumber: string;
  nagadType: 'Merchant' | 'Personal';
  nagadEnabled: boolean;
  nagadInstructions: string;
  rocketNumber: string;
  rocketEnabled: boolean;
  codEnabled: boolean;
  codRestrictedDistricts: string[];
}

export interface WebsiteSettings {
  logoUrl: string;
  heroBannerUrl: string;
  announcementText: string;
  announcementActive: boolean;
  freeDeliveryThreshold: number;
  allowPublicSellerRegistration: boolean;
  footerNotice: string;
  termsContent: string;
  privacyContent: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  avatar: string;
  bio: string;
  status: 'Online' | 'Offline' | 'Away';
  lastLogin: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  reason: string;
  refundMethod: 'bKash' | 'Nagad' | 'Bank Transfer';
  accountNumber: string;
  status: 'Pending Review' | 'Approved' | 'Picked Up' | 'Refund Completed' | 'Rejected';
  requestDate: string;
  amount: number;
  comments?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status?: 'Approved' | 'Pending' | 'Hidden';
  adminReply?: string;
}

export interface AppNotification {
  id: string;
  type: 'order' | 'payment' | 'delivery' | 'offer' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkPage?: PageId;
}
