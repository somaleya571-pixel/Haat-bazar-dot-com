/**
 * Bangladesh Mobile Number Validation & Normalization
 * Supports prefixes: 013, 014, 015, 016, 017, 018, 019
 * Local standard: 11 digits (e.g., 01712345678)
 * Optionally accepts international format +880 / 880 and normalizes to standard 01XXXXXXXXX.
 *
 * MNP Note: Due to Mobile Number Portability in Bangladesh, operator is NOT locked
 * or inferred exclusively from prefix.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalizedNumber: string;
  error?: string;
  errorBn?: string;
  prefix?: string;
}

export const VALID_BD_PREFIXES = ['013', '014', '015', '016', '017', '018', '019'];

export function validateBangladeshPhoneNumber(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || !rawPhone.trim()) {
    return {
      isValid: false,
      normalizedNumber: '',
      error: 'Mobile number is required.',
      errorBn: 'মোবাইল নম্বর প্রদান আবশ্যক।',
    };
  }

  // Remove spaces, dashes, parentheses, dots
  let cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Handle +880 or 880 international format
  if (cleaned.startsWith('+880')) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.startsWith('880')) {
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('+88')) {
    cleaned = cleaned.substring(3);
  }

  // Ensure digits only
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      normalizedNumber: cleaned,
      error: 'Mobile number must only contain digits.',
      errorBn: 'মোবাইল নম্বরে শুধুমাত্র সংখ্যা ব্যবহার করুন (যেমন: 01712345678)।',
    };
  }

  // Check length: exactly 11 digits
  if (cleaned.length !== 11) {
    return {
      isValid: false,
      normalizedNumber: cleaned,
      error: `Invalid length (${cleaned.length} digits). Bangladesh mobile number must be exactly 11 digits.`,
      errorBn: `নম্বরের দৈর্ঘ্য সঠিক নয় (${cleaned.length} ডিজিট)। অবশ্যই ১১ ডিজিট হতে হবে।`,
    };
  }

  // Check prefix: 013, 014, 015, 016, 017, 018, 019
  const prefix = cleaned.substring(0, 3);
  if (!VALID_BD_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      normalizedNumber: cleaned,
      error: `Invalid prefix "${prefix}". Allowed Bangladesh mobile prefixes: 013, 014, 015, 016, 017, 018, 019.`,
      errorBn: `অকার্যকর প্রিফিক্স "${prefix}"। অনুমোদিত প্রিফিক্স: ০১৩, ০১৪, ০১৫, ০১৬, ০১৭, ০১৮ ও ০১৯।`,
    };
  }

  return {
    isValid: true,
    normalizedNumber: cleaned,
    prefix,
  };
}

export function generateOTP(): string {
  // Generates 4-digit numeric OTP for verification
  return Math.floor(1000 + Math.random() * 9000).toString();
}
