export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('Service Worker unregistered');
    } catch (error) {
      console.log('Service Worker unregistration failed:', error);
    }
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export const setupOnlineOfflineListeners = (onOnline: () => void, onOffline: () => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};
