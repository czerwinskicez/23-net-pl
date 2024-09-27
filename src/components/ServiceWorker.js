import { useEffect } from 'react';

const ServiceWorker = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only run in the client
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      }
    }
  }, []);

  return null; // This component does not render anything
};

export default ServiceWorker;
