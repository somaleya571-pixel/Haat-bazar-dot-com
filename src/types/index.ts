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
  unit: string;
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
  name: string;
  phone: string;
  email: string;
  district: string;
  upazila: string;
  thana: string;
  village: string;
  addressDetails: string;
  avatar?: string;
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

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  paymentStatus: 'Pending Verification' | 'Paid (Verified)' | 'Cash on Delivery';
  status: 'Pending' | 'Order Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingHistory: TrackingStep[];
  bKashNumber?: string;
  trxId?: string;
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
