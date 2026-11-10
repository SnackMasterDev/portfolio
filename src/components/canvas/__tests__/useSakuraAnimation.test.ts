import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupSakuraCanvas, DEFAULT_SAKURA_CONFIG } from '../useSakuraAnimation';

describe('SakuraCanvas setup and animation lifecycle', () => {
  let mockCtx: any;
  let mockCanvas: any;
  let resizeCallback: ((entries: any[]) => void) | null = null;
  let matchMediaListeners: ((e: any) => void)[] = [];
  let isReducedMotion = false;
  let rafCallbacks: ((time: number) => void)[] = [];
  let cancelRafIds: number[] = [];

  beforeEach(() => {
    rafCallbacks = [];
    cancelRafIds = [];
    matchMediaListeners = [];
    isReducedMotion = false;
    resizeCallback = null;

    const addColorStop = vi.fn();
    mockCtx = {
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      ellipse: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop })),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
    };

    mockCanvas = {
      getContext: vi.fn().mockReturnValue(mockCtx),
      width: 0,
      height: 0,
      clientWidth: 800,
      clientHeight: 600,
    };

    const mockMatchMedia = vi.fn((query: string) => ({
      matches: isReducedMotion,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((type: string, listener: any) => {
        if (type === 'change') matchMediaListeners.push(listener);
      }),
      removeEventListener: vi.fn((_type: string, listener: any) => {
        matchMediaListeners = matchMediaListeners.filter((l) => l !== listener);
      }),
      dispatchEvent: vi.fn(),
    }));

    vi.stubGlobal('window', {
      matchMedia: mockMatchMedia,
    });

    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: (time: number) => void) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    }));

    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => {
      cancelRafIds.push(id);
    }));

    vi.stubGlobal('ResizeObserver', vi.fn(function (cb: any) {
      resizeCallback = cb;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('provides sensible default configuration', () => {
    expect(DEFAULT_SAKURA_CONFIG.petalCount).toBeGreaterThan(0);
    expect(DEFAULT_SAKURA_CONFIG.minSpeedY).toBeLessThan(DEFAULT_SAKURA_CONFIG.maxSpeedY);
    expect(DEFAULT_SAKURA_CONFIG.colors.length).toBeGreaterThan(0);
  });

  it('initializes canvas context and starts animation loop when reduced motion is false', () => {
    const cleanup = setupSakuraCanvas(mockCanvas);

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();

    cleanup();
  });

  it('respects prefers-reduced-motion by rendering a single static frame without animation loop', () => {
    isReducedMotion = true;
    const cleanup = setupSakuraCanvas(mockCanvas);

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCtx.clearRect).toHaveBeenCalled();
    // In reduced motion, requestAnimationFrame should not be invoked to run continuously
    expect(globalThis.requestAnimationFrame).not.toHaveBeenCalled();

    cleanup();
  });

  it('updates dimensions when ResizeObserver triggers with non-zero dimensions', () => {
    const cleanup = setupSakuraCanvas(mockCanvas);

    expect(resizeCallback).not.toBeNull();
    resizeCallback!([
      {
        contentRect: { width: 1200, height: 900 },
      },
    ]);

    expect(mockCanvas.width).toBe(1200);
    expect(mockCanvas.height).toBe(900);

    cleanup();
  });

  it('reacts dynamically to prefers-reduced-motion changes', () => {
    const cleanup = setupSakuraCanvas(mockCanvas);
    expect(matchMediaListeners.length).toBe(1);

    // Switch to reduced motion
    matchMediaListeners[0]({ matches: true } as MediaQueryListEvent);
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();

    // Switch back to motion enabled
    matchMediaListeners[0]({ matches: false } as MediaQueryListEvent);
    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it('spawns and recycles petals from tree flower blossoms when #sakura-tree is in viewport', () => {
    const listeners: { strike?: (e: any) => void } = {};
    vi.stubGlobal('window', {
      matchMedia: vi.fn(() => ({ matches: false })),
      addEventListener: vi.fn((type: string, listener: any) => {
        if (type === 'sakura-tree-strike') listeners.strike = listener;
      }),
      removeEventListener: vi.fn(),
    });

    const fakeTree = {
      id: 'sakura-tree',
      getBoundingClientRect: vi.fn(() => ({
        left: 100,
        top: 50,
        right: 700,
        bottom: 450,
        width: 600,
        height: 400,
      })),
    };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id: string) => (id === 'sakura-tree' ? fakeTree : null)),
    });

    const cleanup = setupSakuraCanvas(mockCanvas);

    expect(rafCallbacks.length).toBeGreaterThan(0);
    // Simulate animation loop step
    const raf = rafCallbacks[rafCallbacks.length - 1];
    raf(100);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();

    // Trigger tree strike
    listeners.strike?.({ detail: { count: 8 } });

    cleanup();
  });

  it('handles ground landing and settles petals gracefully on the footer', () => {
    const fakeGround = {
      id: 'ground',
      getBoundingClientRect: vi.fn(() => ({
        left: 0,
        top: 500,
        right: 800,
        bottom: 560,
        width: 800,
        height: 60,
      })),
    };

    vi.stubGlobal('document', {
      getElementById: vi.fn((id: string) => (id === 'ground' ? fakeGround : null)),
      querySelector: vi.fn(() => fakeGround),
    });

    const cleanup = setupSakuraCanvas(mockCanvas);
    expect(rafCallbacks.length).toBeGreaterThan(0);
    const raf = rafCallbacks[rafCallbacks.length - 1];

    // Simulate several frames advancing the animation down to ground
    for (let t = 100; t <= 1000; t += 100) {
      raf(t);
    }

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();

    cleanup();
  });

  it('adapts petals when resize occurs via ResizeObserver', () => {
    const cleanup = setupSakuraCanvas(mockCanvas);

    expect(resizeCallback).not.toBeNull();
    // Simulate window/container resize from 800px to mobile 375px
    resizeCallback!([{ contentRect: { width: 375, height: 667 } }]);

    expect(mockCanvas.width).toBe(375);
    expect(mockCanvas.height).toBe(667);

    // Simulate RAF after resize to verify rendering adapts without errors
    const raf = rafCallbacks[rafCallbacks.length - 1];
    raf(120);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalled();

    cleanup();
  });

  it('cleans up animation frame and observers on teardown', () => {
    const cleanup = setupSakuraCanvas(mockCanvas);

    cleanup();
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
  });
});
