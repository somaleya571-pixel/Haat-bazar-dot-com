/**
 * Service Worker Registration and Automatic Cache Invalidation
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Prevent registration in local dev if not desired, or register to manage cache
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates periodically
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000); // 1 hour

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available; prompt or activate
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            }
          });
        });
      })
      .catch((error) => {
        console.warn('[SW] Registration failed:', error);
      });

    // When the controller changes (new SW activated), refresh to get newest assets
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}
