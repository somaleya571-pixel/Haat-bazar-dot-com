import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEffectivePrice,
  calculateCartTotals,
  isProductExpired,
  getDaysUntilExpiry,
  formatCurrency,
} from './pricing.js';
import {
  getDistricts,
  getUpazilas,
  getThanas,
  validateDeliveryAddress,
} from './location.js';
import {
  ORDER_TRACKING_STAGES,
  getTrackingStageIndex,
  isReturnEligible,
  generateOrderId,
} from './order.js';

test('calculateEffectivePrice applies discount when within active dates', () => {
  const now = new Date('2026-11-06T12:00:00Z');
  const result = calculateEffectivePrice(
    1000,
    20,
    '2026-11-01T00:00:00Z',
    '2026-11-10T00:00:00Z',
    now
  );
  assert.equal(result.isDiscountActive, true);
  assert.equal(result.effectivePrice, 800);
  assert.equal(result.savings, 200);
});

test('calculateEffectivePrice falls back to regular price when discount expired', () => {
  const now = new Date('2026-11-15T12:00:00Z');
  const result = calculateEffectivePrice(
    1000,
    20,
    '2026-11-01T00:00:00Z',
    '2026-11-10T00:00:00Z',
    now
  );
  assert.equal(result.isDiscountActive, false);
  assert.equal(result.effectivePrice, 1000);
  assert.equal(result.savings, 0);
});

test('calculateCartTotals calculates subtotal, free delivery threshold, and total', () => {
  const items = [
    { price: 400, quantity: 2 }, // 800
    { price: 100, quantity: 1 }, // 100
  ];
  // Subtotal = 900 (less than 1000 threshold)
  const cartBelow = calculateCartTotals(items, 'inside_dhaka', 1000);
  assert.equal(cartBelow.subtotal, 900);
  assert.equal(cartBelow.deliveryCharge, 60);
  assert.equal(cartBelow.total, 960);
  assert.equal(cartBelow.qualifiesForFreeDelivery, false);

  // Add 1 more item -> 1100 -> Free delivery
  const cartAbove = calculateCartTotals([...items, { price: 200, quantity: 1 }], 'inside_dhaka', 1000);
  assert.equal(cartAbove.subtotal, 1100);
  assert.equal(cartAbove.deliveryCharge, 0);
  assert.equal(cartAbove.total, 1100);
  assert.equal(cartAbove.qualifiesForFreeDelivery, true);
});

test('isProductExpired detects past dates accurately', () => {
  const now = new Date('2026-11-06T12:00:00Z');
  assert.equal(isProductExpired('2026-11-01T00:00:00Z', now), true);
  assert.equal(isProductExpired('2026-12-01T00:00:00Z', now), false);
  assert.ok(getDaysUntilExpiry('2026-11-16T12:00:00Z', now) > 0);
});

test('formatCurrency formats Bengali digits correctly', () => {
  const formatted = formatCurrency(500, 'bn');
  assert.equal(formatted, '৳৫০০');
});

test('Bangladesh location cascading and validation works', () => {
  const districts = getDistricts();
  assert.ok(districts.includes('Dhaka'));
  assert.ok(districts.includes('Chittagong'));

  const upazilas = getUpazilas('Dhaka');
  assert.ok(upazilas.includes('Dhanmondi'));

  const thanas = getThanas('Dhaka', 'Dhanmondi');
  assert.ok(thanas.includes('Dhanmondi Thana'));

  // Invalid address validation test
  const invalidResult = validateDeliveryAddress({
    district: '',
    upazila: '',
    thana: '',
    village: '',
    addressDetails: '',
  });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.district);
  assert.ok(invalidResult.errors.village);

  // Valid address test
  const validResult = validateDeliveryAddress({
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    thana: 'Dhanmondi Thana',
    village: 'Road 4/A',
    addressDetails: 'House 25, Flat 4B',
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('Order tracking stages and return eligibility', () => {
  assert.equal(ORDER_TRACKING_STAGES.length, 6);
  assert.equal(getTrackingStageIndex('Processing'), 2);
  assert.equal(getTrackingStageIndex('Delivered'), 5);

  const now = new Date('2026-11-06T12:00:00Z');
  // Delivered 3 days ago -> eligible
  const recentDelivery = isReturnEligible('2026-11-03T12:00:00Z', 7, now);
  assert.equal(recentDelivery.eligible, true);
  assert.ok(recentDelivery.daysRemaining > 0);

  // Delivered 15 days ago -> ineligible
  const oldDelivery = isReturnEligible('2026-10-20T12:00:00Z', 7, now);
  assert.equal(oldDelivery.eligible, false);

  const orderId = generateOrderId();
  assert.match(orderId, /^HB-2026-\d{5}$/);
});
