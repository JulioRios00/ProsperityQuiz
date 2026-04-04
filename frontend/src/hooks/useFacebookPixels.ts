import { useEffect } from 'react';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let scriptLoaded = false;

function loadFbScript() {
  if (scriptLoaded || document.querySelector('script[src*="fbevents.js"]')) {
    scriptLoaded = true;
    return;
  }
  scriptLoaded = true;

  // Standard Meta Pixel bootstrap (loads fbevents.js once)
  const f = window as Window & typeof globalThis;
  if (!f.fbq) {
    const n: (...args: unknown[]) => void = function (...args) {
      (n as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[][] }).callMethod
        ? (n as unknown as { callMethod: (...a: unknown[]) => void }).callMethod(...args)
        : (n as unknown as { queue: unknown[][] }).queue.push(args);
    };
    (n as unknown as { push: unknown; loaded: boolean; version: string; queue: unknown[] }).push = n;
    (n as unknown as { loaded: boolean }).loaded = true;
    (n as unknown as { version: string }).version = '2.0';
    (n as unknown as { queue: unknown[] }).queue = [];
    f.fbq = n;
    f._fbq = n;
  }

  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode?.insertBefore(t, s);
}

/**
 * Initializes one or more Meta Pixel IDs and fires a PageView.
 * Safe to call multiple times — fbevents.js is only loaded once.
 */
export function useFacebookPixels(pixelIds: string[]) {
  useEffect(() => {
    loadFbScript();

    // Wait a tick for the script tag to be inserted, then init
    const timer = setTimeout(() => {
      const fbq = window.fbq;
      if (!fbq) return;
      pixelIds.forEach((id) => fbq('init', id));
      fbq('track', 'PageView');
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
