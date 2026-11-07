/**
 * Pricing, Discount, and Expiry Utilities for Haat Bazar
 */

export interface PriceCalculationResult {
  effectivePrice: number;
  regularPrice: number;
  discountPercentage: number;
  isDiscountActive: boolean;
  savings: number;
}

export function calculateEffectivePrice(
  regularPrice: number,
  discountPercentage: number = 0,
  discountStartDate?: string,
  discountEndDate?: string,
  now: Date = new Date()
): PriceCalculationResult {
  const safeRegular = Math.max(0, regularPrice);
  const safeDiscount = Math.max(0, Math.min(100, discountPercentage));

  let isDiscountActive = false;

  if (safeDiscount > 0) {
    if (!discountStartDate && !discountEndDate) {
      isDiscountActive = true;
    } else {
      const currentTime = now.getTime();
      const start = discountStartDate ? new Date(discountStartDate).getTime() : -Infinity;
      const end = discountEndDate ? new Date(discountEndDate).getTime() : Infinity;

      if (currentTime >= start && currentTime <= end) {
        isDiscountActive = true;
      }
    }
  }

  const effectivePrice = isDiscountActive
    ? Math.round(safeRegular * (1 - safeDiscount / 100))
    : safeRegular;
  const savings = safeRegular - effectivePrice;

  return {
    effectivePrice,
    regularPrice: safeRegular,
    discountPercentage: isDiscountActive ? safeDiscount : 0,
    isDiscountActive,
    savings,
  };
}

export interface CartCalculationResult {
  subtotal: number;
  deliveryCharge: number;
  total: number;
  qualifiesForFreeDelivery: boolean;
  freeDeliveryThreshold: number;
}

export interface DeliveryCalculationParams {
  courier: {
    insideDhakaRate: number;
    outsideDhakaRate: number;
    baseWeightKg?: number;
    additionalPerKg?: number;
    estimatedDaysInside?: string;
    estimatedDaysOutside?: string;
    restrictedDistricts?: string[];
    districtOverrides?: Record<string, number>;
    isActive: boolean;
  };
  district: string;
  weightKg?: number;
  subtotal?: number;
  freeDeliveryThreshold?: number;
}

export function calculateCourierDeliveryCharge({
  courier,
  district,
  weightKg = 1,
  subtotal = 0,
  freeDeliveryThreshold = 2000,
}: DeliveryCalculationParams): {
  charge: number;
  isAvailable: boolean;
  isFree: boolean;
  estimatedDays: string;
  baseCharge: number;
  extraWeightCharge: number;
} {
  const isDhaka = !district || district.trim().toLowerCase() === 'dhaka';

  // Check if courier is active and covers this district
  if (!courier.isActive) {
    return {
      charge: 0,
      isAvailable: false,
      isFree: false,
      estimatedDays: 'N/A',
      baseCharge: 0,
      extraWeightCharge: 0,
    };
  }

  if (courier.restrictedDistricts && courier.restrictedDistricts.includes(district)) {
    return {
      charge: 0,
      isAvailable: false,
      isFree: false,
      estimatedDays: 'সার্ভিস প্রযোজ্য নয় (Not Available)',
      baseCharge: 0,
      extraWeightCharge: 0,
    };
  }

  // Base rate (check district override first, then inside vs outside Dhaka)
  let baseCharge = isDhaka ? courier.insideDhakaRate : courier.outsideDhakaRate;
  if (courier.districtOverrides && courier.districtOverrides[district]) {
    baseCharge = courier.districtOverrides[district];
  }

  // Weight calculation
  const baseWeight = courier.baseWeightKg || 1;
  const additionalRate = courier.additionalPerKg || 0;
  const extraKg = Math.max(0, weightKg - baseWeight);
  const extraWeightCharge = Math.ceil(extraKg) * additionalRate;

  const totalCalculated = baseCharge + extraWeightCharge;
  const isFree = freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold;
  const finalCharge = isFree ? 0 : totalCalculated;

  const estimatedDays = isDhaka
    ? courier.estimatedDaysInside || '১২-২৪ ঘণ্টা'
    : courier.estimatedDaysOutside || '৪৮-৭২ ঘণ্টা';

  return {
    charge: finalCharge,
    isAvailable: true,
    isFree,
    estimatedDays,
    baseCharge,
    extraWeightCharge,
  };
}

export function calculateCartTotals(
  items: Array<{ price: number; quantity: number }>,
  deliveryZone: 'inside_dhaka' | 'outside_dhaka' = 'inside_dhaka',
  freeDeliveryThreshold: number = 1000
): CartCalculationResult {
  const subtotal = items.reduce((acc, item) => {
    return acc + Math.max(0, item.price) * Math.max(0, item.quantity);
  }, 0);

  const baseDelivery = deliveryZone === 'inside_dhaka' ? 60 : 120;
  const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold && subtotal > 0;
  const deliveryCharge = items.length === 0 ? 0 : qualifiesForFreeDelivery ? 0 : baseDelivery;
  const total = subtotal + deliveryCharge;

  return {
    subtotal,
    deliveryCharge,
    total,
    qualifiesForFreeDelivery,
    freeDeliveryThreshold,
  };
}

export function isProductExpired(expiryDateStr: string, now: Date = new Date()): boolean {
  if (!expiryDateStr) return false;
  const expiry = new Date(expiryDateStr).getTime();
  if (isNaN(expiry)) return false;
  return now.getTime() > expiry;
}

export function getDaysUntilExpiry(expiryDateStr: string, now: Date = new Date()): number {
  if (!expiryDateStr) return 999;
  const expiry = new Date(expiryDateStr).getTime();
  if (isNaN(expiry)) return 999;
  const diffMs = expiry - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number, locale: 'bn' | 'en' = 'bn'): string {
  if (locale === 'bn') {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const formatted = Math.round(amount).toString();
    const bnFormatted = formatted.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
    return `৳${bnFormatted}`;
  }
  return `৳${Math.round(amount).toLocaleString('en-US')}`;
}
