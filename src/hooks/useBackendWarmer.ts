import { useEffect } from 'react';

export const WARMUP_ENDPOINTS = [
  'https://serviceflow-api-y0df.onrender.com/api/v1/auth/csrf',
  'https://pricescope-api-i2dz.onrender.com/api/v1',
];

/**
 * Dispatches silent non-blocking fetch pings to the Render backends.
 */
export function triggerBackendWarmup(endpoints: readonly string[] = WARMUP_ENDPOINTS): void {
  endpoints.forEach((url) => {
    fetch(url, { mode: 'no-cors' }).catch(() => {
      // Silent warmup ping to prevent cold-starts on Render free tier
    });
  });
}

/**
 * Pre-warms the free-tier Render backends upon portfolio landing.
 * Defers execution to post-initial load (2s) to avoid competing with LCP/FCP on mobile devices.
 */
export function useBackendWarmer(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timerId = window.setTimeout(() => {
      triggerBackendWarmup();
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);
}
