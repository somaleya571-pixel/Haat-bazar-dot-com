/**
 * Order Status and Tracking Utilities
 * 6-Stage Tracking: Order Placed → Order Confirmed → Processing → Shipped → Out for Delivery → Delivered
 */

export const ORDER_TRACKING_STAGES = [
  'Order Placed',
  'Order Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
] as const;

export type OrderTrackingStage = (typeof ORDER_TRACKING_STAGES)[number];

export const ORDER_TRACKING_STAGES_BN: Record<OrderTrackingStage, string> = {
  'Order Placed': 'অর্ডার গ্রহণ করা হয়েছে',
  'Order Confirmed': 'অর্ডার কনফার্মড',
  'Processing': 'পণ্য প্রস্তুত হচ্ছে',
  'Shipped': 'শিপমেন্ট সম্পন্ন',
  'Out for Delivery': 'ডেলিভারির জন্য পাঠানো হয়েছে',
  'Delivered': 'সফলভাবে ডেলিভার্ড',
};

export function getTrackingStageIndex(stage: string): number {
  return ORDER_TRACKING_STAGES.indexOf(stage as OrderTrackingStage);
}

export function isOrderDelivered(stage: string): boolean {
  return stage === 'Delivered';
}

export function isReturnEligible(
  deliveredDateStr?: string,
  windowDays: number = 7,
  now: Date = new Date()
): { eligible: boolean; daysRemaining: number } {
  if (!deliveredDateStr) return { eligible: false, daysRemaining: 0 };
  const delivered = new Date(deliveredDateStr).getTime();
  if (isNaN(delivered)) return { eligible: false, daysRemaining: 0 };

  const diffMs = now.getTime() - delivered;
  const daysPassed = diffMs / (1000 * 60 * 60 * 24);
  const daysRemaining = Math.max(0, Math.ceil(windowDays - daysPassed));

  return {
    eligible: daysPassed <= windowDays && daysPassed >= 0,
    daysRemaining,
  };
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `HB-${year}-${randomNum}`;
}
