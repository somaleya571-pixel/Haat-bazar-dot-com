/**
 * In-App Browser & Cross-Browser Compatibility Utility
 * Optimizes runtime behavior for:
 * - Facebook In-App Browser (FBAN, FBAV)
 * - Messenger In-App Browser (FB_IAB)
 * - WhatsApp In-App Browser
 * - Instagram In-App Browser
 * - Samsung Internet, iOS Safari, Chrome, Firefox, Edge, Opera
 */

export interface BrowserEnvironment {
  isFacebook: boolean;
  isMessenger: boolean;
  isWhatsApp: boolean;
  isInstagram: boolean;
  isInAppBrowser: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  browserName: string;
}

export function detectBrowserEnvironment(): BrowserEnvironment {
  if (typeof window === 'undefined' || !navigator.userAgent) {
    return {
      isFacebook: false,
      isMessenger: false,
      isWhatsApp: false,
      isInstagram: false,
      isInAppBrowser: false,
      isIOS: false,
      isAndroid: false,
      browserName: 'Unknown',
    };
  }

  const ua = navigator.userAgent;
  const isFacebook = /FBAN|FBAV/i.test(ua);
  const isMessenger = /FB_IAB|Messenger/i.test(ua);
  const isWhatsApp = /WhatsApp/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isInAppBrowser = isFacebook || isMessenger || isWhatsApp || isInstagram || /wv|FB_IAB/i.test(ua);

  let browserName = 'Browser';
  if (isFacebook) browserName = 'Facebook In-App Browser';
  else if (isMessenger) browserName = 'Messenger In-App Browser';
  else if (isWhatsApp) browserName = 'WhatsApp In-App Browser';
  else if (isInstagram) browserName = 'Instagram In-App Browser';
  else if (/SamsungBrowser/i.test(ua)) browserName = 'Samsung Internet';
  else if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) browserName = 'Google Chrome';
  else if (/Firefox/i.test(ua)) browserName = 'Mozilla Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browserName = 'Apple Safari';
  else if (/Edg/i.test(ua)) browserName = 'Microsoft Edge';
  else if (/OPR|Opera/i.test(ua)) browserName = 'Opera';

  return {
    isFacebook,
    isMessenger,
    isWhatsApp,
    isInstagram,
    isInAppBrowser,
    isIOS,
    isAndroid,
    browserName,
  };
}

/**
 * Handles safe external link navigation in webviews
 */
export function openExternalUrlSafely(url: string, target: string = '_blank') {
  if (typeof window === 'undefined') return;

  // Tel, mailto, whatsapp links should open naturally without blank target in webviews
  if (url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('https://wa.me/')) {
    window.location.href = url;
    return;
  }

  const env = detectBrowserEnvironment();
  if (env.isInAppBrowser) {
    // In in-app browsers, target="_blank" may be blocked or spawn broken sub-webviews
    window.location.href = url;
  } else {
    window.open(url, target, 'noopener,noreferrer');
  }
}

/**
 * Initialize viewport adjustments for mobile in-app browser header/footer dynamic toolbars
 */
export function initBrowserFixes() {
  if (typeof window === 'undefined') return;

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh();
  window.addEventListener('resize', setVh, { passive: true });
  window.addEventListener('orientationchange', setVh, { passive: true });
}
