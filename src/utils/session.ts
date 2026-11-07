import { AdminRole } from '../types/index.js';

export interface OwnerActiveSession {
  sessionId: string;
  adminEmail: string;
  adminName: string;
  role: AdminRole;
  loginTimestamp: number;
  lastActiveTimestamp: number;
  userAgent?: string;
  deviceLabel?: string;
}

export const OWNER_SESSION_STORAGE_KEY = 'hb_owner_active_session';
export const OWNER_SESSION_CHANNEL = 'hb_owner_session_broadcast';

// Authorized Super Admin / Owner accounts
export const AUTHORIZED_SUPER_ADMIN_EMAILS = [
  'tanzilahammed130@gmail.com',
  'owner@haatbazar.com',
  'admin@haatbazar.com',
];

export const MASTER_ADMIN_PASSWORD = 'haatbazar@admin2026';

/**
 * Generate a unique, unguessable cryptographic session identifier
 */
export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `hb_sess_${crypto.randomUUID()}`;
  }
  const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `hb_sess_${Date.now()}_${randomPart}`;
}

/**
 * Authenticates admin credentials
 */
export function verifyAdminCredentials(
  email: string,
  password: string
): { success: boolean; error?: string; role?: AdminRole; name?: string } {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail) {
    return { success: false, error: 'ইমেইল ঠিকানা বা ইউজার আইডি প্রবেশ করান' };
  }

  if (!trimmedPassword) {
    return { success: false, error: 'অ্যাডমিন সিকিউরিটি পাসওয়ার্ড প্রবেশ করান' };
  }

  const isEmailAuthorized = AUTHORIZED_SUPER_ADMIN_EMAILS.some(
    (e) => e.toLowerCase() === trimmedEmail
  );

  if (!isEmailAuthorized) {
    return {
      success: false,
      error: 'অননুমোদিত প্রবেশ! এই ইমেইল অ্যাকাউন্টের সুপার অ্যাডমিন প্রিভিলেজ নেই।',
    };
  }

  if (trimmedPassword !== MASTER_ADMIN_PASSWORD) {
    return {
      success: false,
      error: 'ভুল সিকিউরিটি পাসওয়ার্ড! অনুগ্রহ করে সঠিক ক্রেডেনশিয়াল ব্যবহার করুন।',
    };
  }

  const name =
    trimmedEmail === 'tanzilahammed130@gmail.com'
      ? 'তানজিল আহাম্মেদ (Super Admin)'
      : 'সুপার অ্যাডমিন (Haat Bazar)';

  return {
    success: true,
    role: 'Super Admin',
    name,
  };
}

/**
 * Create a new single-session object.
 * When this session starts, any previous session is invalidated.
 */
export function createOwnerSession(
  email: string,
  role: AdminRole = 'Super Admin',
  name: string = 'Super Admin',
  userAgent: string = 'Chrome / Desktop'
): OwnerActiveSession {
  const now = Date.now();
  return {
    sessionId: generateSessionId(),
    adminEmail: email.trim().toLowerCase(),
    adminName: name,
    role,
    loginTimestamp: now,
    lastActiveTimestamp: now,
    userAgent,
    deviceLabel: userAgent.includes('Mobile') ? 'স্মার্টফোন (Mobile)' : 'ডেস্কটপ / ল্যাপটপ (Workstation)',
  };
}

/**
 * Validates whether the active session in local store matches current session ID.
 * If another tab or device logged in, storedSessionId will be different.
 */
export function isSessionActiveAndValid(
  currentSessionId: string | null | undefined,
  storedSession: OwnerActiveSession | null
): boolean {
  if (!currentSessionId || !storedSession) {
    return false;
  }
  return currentSessionId === storedSession.sessionId;
}

/**
 * Evaluates session state and determines if it was invalidated by a concurrent session.
 */
export function checkSessionConflict(
  localSessionId: string | null | undefined,
  storedSession: OwnerActiveSession | null
): { isConflict: boolean; reason?: string } {
  if (!localSessionId) {
    return { isConflict: false };
  }

  if (!storedSession) {
    return {
      isConflict: true,
      reason: 'অ্যাডমিন সেশন সমাপ্ত করা হয়েছে অথবা ক্যাশ ক্লিয়ার করা হয়েছে।',
    };
  }

  if (localSessionId !== storedSession.sessionId) {
    const timeStr = new Date(storedSession.loginTimestamp).toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      isConflict: true,
      reason: `আপনার অ্যাডমিন অ্যাকাউন্টে নতুন একটি ডিভাইস বা ব্রাউজার সেশন থেকে (${storedSession.deviceLabel || 'অন্য উইন্ডো'}, সময় ${timeStr}) লগইন করা হয়েছে। একক-সেশন (Single Session) কঠোর সুরক্ষা নীতির কারণে এই পূর্ববর্তী সেশনটি স্বয়ংক্রিয়ভাবে বাতিল করা হয়েছে।`,
    };
  }

  return { isConflict: false };
}
