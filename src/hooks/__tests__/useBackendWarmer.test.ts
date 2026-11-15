import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { triggerBackendWarmup, WARMUP_ENDPOINTS } from '../useBackendWarmer';

describe('triggerBackendWarmup', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve(new Response()));
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('triggers silent warmup fetch for both Render backends with mode no-cors', () => {
    triggerBackendWarmup();

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(globalThis.fetch).toHaveBeenCalledWith('https://serviceflow-api-y0df.onrender.com/api/v1/auth/csrf', {
      mode: 'no-cors',
    });
    expect(globalThis.fetch).toHaveBeenCalledWith('https://pricescope-api-i2dz.onrender.com/api/v1', {
      mode: 'no-cors',
    });
  });

  it('allows custom endpoint list to be warmed up', () => {
    const custom = ['https://example.com/api'];
    triggerBackendWarmup(custom);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith('https://example.com/api', {
      mode: 'no-cors',
    });
  });

  it('handles network errors gracefully without throwing', () => {
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Network error')));

    expect(() => {
      triggerBackendWarmup();
    }).not.toThrow();
  });

  it('exposes the configured endpoints', () => {
    expect(WARMUP_ENDPOINTS).toContain('https://serviceflow-api-y0df.onrender.com/api/v1/auth/csrf');
    expect(WARMUP_ENDPOINTS).toContain('https://pricescope-api-i2dz.onrender.com/api/v1');
  });
});
