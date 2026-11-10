import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupKatanaMotionListener } from '../useKatanaMotion';

describe('setupKatanaMotionListener', () => {
  let listeners: Record<string, EventListener> = {};
  let mockNow = 1000;
  let rafCallbacks: Array<FrameRequestCallback> = [];
  let nextRafId = 1;
  let classList: Set<string>;

  const flushRaf = () => {
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];
    callbacks.forEach((cb) => cb(mockNow));
  };

  beforeEach(() => {
    listeners = {};
    mockNow = 1000;
    rafCallbacks = [];
    nextRafId = 1;
    classList = new Set<string>();

    const mockDocument = {
      body: {
        classList: {
          add: vi.fn((cls: string) => classList.add(cls)),
          remove: vi.fn((cls: string) => classList.delete(cls)),
          contains: vi.fn((cls: string) => classList.has(cls)),
        },
      },
      getElementById: vi.fn((id: string) => {
        if (id === 'sakura-tree' || id === 'sakura-tree-img') {
          return {
            getBoundingClientRect: () => ({
              left: 0,
              top: 0,
              width: 1000,
              height: 1000,
              right: 1000,
              bottom: 1000,
              x: 0,
              y: 0,
            }),
          };
        }
        return null;
      }),
    };

    const mockWindow = {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn((type: string, listener: any) => {
        listeners[type] = listener;
      }),
      removeEventListener: vi.fn((type: string) => {
        delete listeners[type];
      }),
      requestAnimationFrame: vi.fn((cb: FrameRequestCallback) => {
        const id = nextRafId++;
        rafCallbacks.push(cb);
        return id;
      }),
      cancelAnimationFrame: vi.fn((_id: number) => {
        rafCallbacks = [];
      }),
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    };

    vi.stubGlobal('document', mockDocument);
    vi.stubGlobal('window', mockWindow);
    vi.stubGlobal('requestAnimationFrame', mockWindow.requestAnimationFrame);
    vi.stubGlobal('cancelAnimationFrame', mockWindow.cancelAnimationFrame);
    vi.stubGlobal('performance', {
      now: vi.fn(() => mockNow),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('adds cursor-none to document.body on mount and removes it on cleanup', () => {
    const onUpdate = vi.fn();
    const cleanup = setupKatanaMotionListener(onUpdate);

    expect(document.body.classList.add).toHaveBeenCalledWith('cursor-none');
    expect(document.body.classList.contains('cursor-none')).toBe(true);

    cleanup();

    expect(document.body.classList.remove).toHaveBeenCalledWith('cursor-none');
    expect(document.body.classList.contains('cursor-none')).toBe(false);
  });

  it('does not add cursor-none nor attach listeners on touch-only devices', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query.includes('hover: none') || query.includes('pointer: coarse'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const onUpdate = vi.fn();
    const cleanup = setupKatanaMotionListener(onUpdate);

    expect(document.body.classList.add).not.toHaveBeenCalled();
    expect(window.addEventListener).not.toHaveBeenCalled();

    cleanup();
  });

  it('attaches and removes event listeners for mousemove, mouseleave, and mouseenter', () => {
    const onUpdate = vi.fn();
    const cleanup = setupKatanaMotionListener(onUpdate);

    expect(window.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function));

    cleanup();

    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('mouseenter', expect.any(Function));
  });

  it('batches mousemove updates with requestAnimationFrame avoiding 1000Hz spam', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;
    expect(mouseMoveHandler).toBeDefined();

    // Fire 3 high-frequency mousemove events before rAF flushes
    mouseMoveHandler({ clientX: 10, clientY: 10 });
    mouseMoveHandler({ clientX: 20, clientY: 20 });
    mouseMoveHandler({ clientX: 100, clientY: 100 });

    // onUpdate should NOT be called 3 times synchronously
    expect(onUpdate).not.toHaveBeenCalled();

    // Trigger rAF
    flushRaf();

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        x: 100,
        y: 100,
        isVisible: true,
      })
    );
  });

  it('calculates position, angle and speed on mousemove with rAF', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;
    expect(mouseMoveHandler).toBeDefined();

    // First movement at t=1000
    mouseMoveHandler({ clientX: 100, clientY: 100 });
    flushRaf();

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        x: 100,
        y: 100,
        isVisible: true,
      })
    );

    // Second movement: moving right (+100px in X) at t=1100 (dt = 0.1s)
    mockNow = 1100;
    mouseMoveHandler({ clientX: 200, clientY: 100 });
    flushRaf();

    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.x).toBe(200);
    expect(lastCall.y).toBe(100);
    expect(lastCall.isVisible).toBe(true);
    expect(lastCall.angle).toBeCloseTo(0);
    expect(lastCall.speed).toBeGreaterThan(0);
  });

  it('cancels pending rAF on cleanup and mouseleave', () => {
    const onUpdate = vi.fn();
    const cleanup = setupKatanaMotionListener(onUpdate);

    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;
    mouseMoveHandler({ clientX: 50, clientY: 50 });

    cleanup();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    flushRaf();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('omits dynamic rotation when prefers-reduced-motion is active', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate, { prefersReducedMotion: true });

    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;

    // First move
    mouseMoveHandler({ clientX: 100, clientY: 100 });
    flushRaf();

    // Second move diagonal down-right
    mockNow = 1100;
    mouseMoveHandler({ clientX: 200, clientY: 200 });
    flushRaf();

    const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
    expect(lastCall.x).toBe(200);
    expect(lastCall.y).toBe(200);
    expect(lastCall.angle).toBe(0); // rotation is omitted
  });

  it('hides cursor on mouseleave and restores on mouseenter', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const mouseLeaveHandler = listeners['mouseleave'] as (e: any) => void;
    const mouseEnterHandler = listeners['mouseenter'] as (e: any) => void;

    mouseLeaveHandler({ clientX: 100, clientY: 100 });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isVisible: false,
        speed: 0,
      })
    );

    mouseEnterHandler({ clientX: 100, clientY: 100 });
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isVisible: true,
      })
    );
  });

  it('does NOT trigger slash or tree strike on minimal slow movement', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;

    // Small crawl: 5px movement over 200ms
    mouseMoveHandler({ clientX: 100, clientY: 100 });
    flushRaf();

    mockNow = 1200;
    mouseMoveHandler({ clientX: 105, clientY: 102 });
    flushRaf();

    // Neither katana-slash nor sakura-tree-strike should be dispatched
    const dispatchedEvents = dispatchSpy.mock.calls.map((c) => (c[0] as CustomEvent).type);
    expect(dispatchedEvents).not.toContain('katana-slash');
    expect(dispatchedEvents).not.toContain('sakura-tree-strike');
  });

  it('does NOT trigger slash on normal/moderate movement (< 50% of viewport)', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;

    // 400px move (~27.7% of 1442px viewport diagonal, under 50% threshold)
    mockNow = 1000;
    mouseMoveHandler({ clientX: 100, clientY: 100 });
    flushRaf();

    mockNow = 1150;
    mouseMoveHandler({ clientX: 500, clientY: 100 });
    flushRaf();

    const dispatchedEvents = dispatchSpy.mock.calls.map((c) => (c[0] as CustomEvent).type);
    expect(dispatchedEvents).not.toContain('katana-slash');
    expect(dispatchedEvents).not.toContain('sakura-tree-strike');
  });

  it('triggers slash when stroke distance exceeds the 50% viewport threshold (easter egg)', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;

    // Start of stroke at 1000ms
    mockNow = 1000;
    mouseMoveHandler({ clientX: 100, clientY: 100 });
    flushRaf();

    // Bold stroke: 760px movement over 200ms (~52.7% of 1442px viewport diagonal)
    mockNow = 1200;
    mouseMoveHandler({ clientX: 860, clientY: 100 });
    flushRaf();

    const dispatchedEvents = dispatchSpy.mock.calls.map((c) => (c[0] as CustomEvent).type);
    expect(dispatchedEvents).toContain('katana-slash');
  });

  it('triggers sakura-tree-strike when stroke crosses trunk with distance >= 50% viewport', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;

    // Start outside trunk at x: 100, y: 600
    mockNow = 1000;
    mouseMoveHandler({ clientX: 100, clientY: 600 });
    flushRaf();

    // Bold stroke crossing trunk to x: 860, y: 600 -> 760px in 200ms (~52.7% of viewport)
    mockNow = 1200;
    mouseMoveHandler({ clientX: 860, clientY: 600 });
    flushRaf();

    const dispatchedEvents = dispatchSpy.mock.calls.map((c) => (c[0] as CustomEvent).type);
    expect(dispatchedEvents).toContain('katana-slash');
    expect(dispatchedEvents).toContain('sakura-tree-strike');
  });

  it('triggers slash and tree strike exactly ONCE during a continuous stroke without multi-triggering', () => {
    const onUpdate = vi.fn();
    setupKatanaMotionListener(onUpdate);

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const mouseMoveHandler = listeners['mousemove'] as (e: any) => void;

    // Start of stroke
    mockNow = 1000;
    mouseMoveHandler({ clientX: 100, clientY: 600 });
    flushRaf();

    // Cross trunk with bold stroke >= 50% -> triggers slash #1
    mockNow = 1150;
    mouseMoveHandler({ clientX: 860, clientY: 600 });
    flushRaf();

    const slashEvents1 = dispatchSpy.mock.calls.filter((c) => (c[0] as CustomEvent).type === 'katana-slash');
    const treeEvents1 = dispatchSpy.mock.calls.filter((c) => (c[0] as CustomEvent).type === 'sakura-tree-strike');
    expect(slashEvents1.length).toBe(1);
    expect(treeEvents1.length).toBe(1);

    // Continue the same continuous stroke even further (another 760px in same gesture)
    mockNow = 1250;
    mouseMoveHandler({ clientX: 1620, clientY: 600 });
    flushRaf();

    // Must still be exactly 1 trigger, NOT 2 or 3
    const slashEvents2 = dispatchSpy.mock.calls.filter((c) => (c[0] as CustomEvent).type === 'katana-slash');
    const treeEvents2 = dispatchSpy.mock.calls.filter((c) => (c[0] as CustomEvent).type === 'sakura-tree-strike');
    expect(slashEvents2.length).toBe(1);
    expect(treeEvents2.length).toBe(1);
  });
});
