import { useEffect } from 'react';

export const WARMUP_ENDPOINTS = [
  'https://serviceflow-api-y0df.onrender.com/',
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
 * Fires once when the visitor enters the portfolio.
 */
export function useBackendWarmer(): void {
  useEffect(() => {
    triggerBackendWarmup();
  }, []);
}
