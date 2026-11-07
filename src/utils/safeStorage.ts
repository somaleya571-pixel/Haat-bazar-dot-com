/**
 * Safe Storage Layer for Universal Browser & In-App Browser Compatibility
 * (Facebook In-App Browser, Messenger, WhatsApp, Instagram, Samsung Internet, iOS Safari Private Browsing)
 * 
 * Prevents DOMException: SecurityError, QuotaExceededError, or localStorage access restrictions
 * in sandboxed mobile webviews by falling back to a thread-safe in-memory store.
 */

class SafeStorage {
  private memoryStore: Map<string, string> = new Map();
  private isStorageAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  private checkAvailability(): boolean {
    if (typeof window === 'undefined') {
      this.isStorageAvailable = false;
      return false;
    }

    try {
      const testKey = '__hb_test_storage__';
      window.localStorage.setItem(testKey, testKey);
      const retrieved = window.localStorage.getItem(testKey);
      window.localStorage.removeItem(testKey);
      this.isStorageAvailable = retrieved === testKey;
      return this.isStorageAvailable;
    } catch {
      // In-App browser private mode or disabled storage
      this.isStorageAvailable = false;
      return false;
    }
  }

  public getItem(key: string): string | null {
    if (this.isStorageAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fallback to memory
        return this.memoryStore.get(key) ?? null;
      }
    }
    return this.memoryStore.get(key) ?? null;
  }

  public getJSON<T>(key: string, defaultValue: T): T {
    try {
      const item = this.getItem(key);
      if (item === null || item === undefined || item === '') {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  public setItem(key: string, value: string): void {
    // Always keep memory store updated for instant fallback
    this.memoryStore.set(key, value);

    if (this.isStorageAvailable) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Quota exceeded or restricted sandbox
        this.isStorageAvailable = false;
      }
    }
  }

  public setJSON<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.setItem(key, serialized);
    } catch (err) {
      console.warn(`[SafeStorage] Failed to serialize key "${key}":`, err);
    }
  }

  public removeItem(key: string): void {
    this.memoryStore.delete(key);
    if (this.isStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignored
      }
    }
  }

  public clear(): void {
    this.memoryStore.clear();
    if (this.isStorageAvailable) {
      try {
        window.localStorage.clear();
      } catch {
        // Ignored
      }
    }
  }
}

export const safeStorage = new SafeStorage();
