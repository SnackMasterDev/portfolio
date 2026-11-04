import { useEffect, type RefObject } from 'react';
import type { SakuraConfig, Petal, CanvasDimensions } from '../../engine/types';
import {
  createPetal,
  createBurstPetal,
  updatePetal,
  drawPetal,
  SAKURA_PALETTE,
} from '../../engine/sakura/PetalSimulation';

export const DEFAULT_SAKURA_CONFIG: SakuraConfig = {
  petalCount: 55,
  minSpeedY: 60,
  maxSpeedY: 110,
  minSize: 10,
  maxSize: 20,
  wind: { x: 16, y: 0 },
  colors: SAKURA_PALETTE,
  maxDeltaTime: 0.05,
};

/**
 * Initializes and orchestrates the canvas animation loop outside React's lifecycle.
 */
export function setupSakuraCanvas(
  canvas: HTMLCanvasElement,
  customConfig?: Partial<SakuraConfig>
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const config: SakuraConfig = { ...DEFAULT_SAKURA_CONFIG, ...customConfig };

  const getViewportDimensions = (): CanvasDimensions => {
    const hasWindow = typeof window !== 'undefined';
    const hasDoc = typeof document !== 'undefined';
    const width =
      (hasWindow ? window.innerWidth : 0) ||
      (hasDoc ? document.documentElement?.clientWidth : 0) ||
      canvas.clientWidth ||
      800;
    const height =
      (hasWindow ? window.innerHeight : 0) ||
      (hasDoc ? document.documentElement?.clientHeight : 0) ||
      canvas.clientHeight ||
      600;
    return { width, height };
  };

  const initialDims = getViewportDimensions();
  canvas.width = initialDims.width;
  canvas.height = initialDims.height;

  const dimensions: CanvasDimensions = { ...initialDims };

  const updateTreeBounds = () => {
    if (typeof document === 'undefined') return;
    const treeEl = document.getElementById('sakura-tree');
    if (treeEl) {
      const rect = treeEl.getBoundingClientRect();
      config.treeBounds = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  };
  updateTreeBounds();

  // Pre-populate petals throughout vertical height
  const petals: Petal[] = Array.from({ length: config.petalCount }, (_, i) =>
    createPetal(dimensions, config, (i + Math.random()) / config.petalCount)
  );

  const motionQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  let isReducedMotion = config.prefersReducedMotion ?? (motionQuery ? motionQuery.matches : false);

  let animationFrameId: number;
  let lastTime = performance.now();
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  const render = (currentTime: number) => {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
    lastTime = currentTime;

    // Full page depth scroll tracking
    const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const deltaScrollY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (deltaScrollY !== 0) {
      for (let i = 0; i < petals.length; i++) {
        petals[i].y -= deltaScrollY * 0.85;
      }
    }

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    for (let i = petals.length - 1; i >= 0; i--) {
      updatePetal(petals[i], dt, dimensions, config);
      drawPetal(ctx, petals[i]);

      // Gently clean up burst flurry petals after they leave screen
      if (petals[i].isBurst && petals[i].y > dimensions.height + 40) {
        petals.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(render);
  };

  const renderStaticFrame = () => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    for (let i = 0; i < petals.length; i++) {
      drawPetal(ctx, petals[i]);
    }
  };

  if (isReducedMotion) {
    renderStaticFrame();
  } else {
    animationFrameId = requestAnimationFrame(render);
  }

  const handleMotionChange = (e: MediaQueryListEvent) => {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      cancelAnimationFrame(animationFrameId);
      renderStaticFrame();
    } else {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(render);
    }
  };

  motionQuery?.addEventListener?.('change', handleMotionChange);

  const handleResize = () => {
    const { width, height } = getViewportDimensions();
    if (width > 0 && height > 0) {
      canvas.width = width;
      canvas.height = height;
      dimensions.width = width;
      dimensions.height = height;
    }
  };

  const handleTreeStrike = (e: Event) => {
    const customEvent = e as CustomEvent<{ x?: number; y?: number; count?: number }>;
    const treeEl = typeof document !== 'undefined' ? document.getElementById('sakura-tree') : null;
    const rect = treeEl?.getBoundingClientRect();
    const originX = customEvent.detail?.x ?? (rect ? rect.left + rect.width * 0.5 : dimensions.width * 0.5);
    const originY = customEvent.detail?.y ?? (rect ? rect.top + rect.height * 0.35 : dimensions.height * 0.25);
    const count = customEvent.detail?.count ?? 45;

    for (let i = 0; i < count; i++) {
      petals.push(createBurstPetal(originX, originY, config));
    }

    if (petals.length > config.petalCount + 100) {
      petals.splice(config.petalCount, petals.length - (config.petalCount + 100));
    }
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', updateTreeBounds, { passive: true });
    window.addEventListener('sakura-tree-strike', handleTreeStrike);
  }

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && (canvas.width !== width || canvas.height !== height)) {
          canvas.width = width;
          canvas.height = height;
          dimensions.width = width;
          dimensions.height = height;
        }
      }
    });
    resizeObserver.observe(canvas);
  }

  return () => {
    cancelAnimationFrame(animationFrameId);
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateTreeBounds);
      window.removeEventListener('sakura-tree-strike', handleTreeStrike);
    }
    resizeObserver?.disconnect();
    motionQuery?.removeEventListener?.('change', handleMotionChange);
  };
}

/**
 * Custom hook connecting the Sakura simulation lifecycle to a canvas ref.
 */
export function useSakuraAnimation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  customConfig?: Partial<SakuraConfig>
): void {
  useEffect(() => {
    if (!canvasRef.current) return;
    return setupSakuraCanvas(canvasRef.current, customConfig);
  }, [canvasRef, customConfig]);
}
