import { useEffect, type RefObject } from 'react';
import type { SakuraConfig, Petal, CanvasDimensions, SlashEventDetail } from '../../engine/types';
import {
  createPetal,
  applyWindSlash,
  updatePetal,
  drawPetal,
  SAKURA_PALETTE,
} from '../../engine/sakura/PetalSimulation';
import { spawnBranchFlowerPetals } from '../../engine/sakura/branchFlowerPetals';

export const DEFAULT_SAKURA_CONFIG: SakuraConfig = {
  petalCount: 75,
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

  const getDocHeight = (): number => {
    if (typeof document === 'undefined') return 2500;
    return Math.max(
      document.documentElement?.scrollHeight || 0,
      document.body?.scrollHeight || 0,
      (typeof window !== 'undefined' ? window.innerHeight : 0) || 800
    );
  };

  const pageDimensions: CanvasDimensions = {
    width: dimensions.width,
    height: getDocHeight(),
  };

  const updateEnvironment = () => {
    if (typeof document === 'undefined') return;
    pageDimensions.height = getDocHeight();
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const treeEl = document.getElementById('sakura-tree');
    if (treeEl) {
      const rect = treeEl.getBoundingClientRect();
      config.treeBounds = {
        x: rect.left,
        y: rect.top + scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    const groundEl = document.getElementById('ground') || document.querySelector('footer');
    if (groundEl) {
      const gRect = groundEl.getBoundingClientRect();
      config.groundY = gRect.top + scrollY + 30;
    } else {
      config.groundY = pageDimensions.height - 20;
    }
  };
  updateEnvironment();

  // Pre-populate petals throughout the full document height (not just viewport)
  const petals: Petal[] = Array.from({ length: config.petalCount }, (_, i) =>
    createPetal(pageDimensions, config, (i + Math.random()) / config.petalCount)
  );

  const motionQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  let isReducedMotion = config.prefersReducedMotion ?? (motionQuery ? motionQuery.matches : false);

  let animationFrameId: number;
  let lastTime = performance.now();

  const render = (currentTime: number) => {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
    lastTime = currentTime;

    const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    for (let i = petals.length - 1; i >= 0; i--) {
      updatePetal(petals[i], dt, pageDimensions, config);

      const screenY = petals[i].y - currentScrollY;
      if (screenY >= -petals[i].size * 2 && screenY <= dimensions.height + petals[i].size * 2) {
        drawPetal(ctx, petals[i], screenY);
      }

      if (petals[i].isBurst && screenY > dimensions.height + 40) {
        petals.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(render);
  };

  const renderStaticFrame = () => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    for (let i = 0; i < petals.length; i++) {
      const screenY = petals[i].y - scrollY;
      if (screenY >= -petals[i].size * 2 && screenY <= dimensions.height + petals[i].size * 2) {
        drawPetal(ctx, petals[i], screenY);
      }
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
    const customEvent = e as CustomEvent<{ count?: number }>;
    const treeEl = typeof document !== 'undefined' ? document.getElementById('sakura-tree') : null;
    const rect = treeEl?.getBoundingClientRect() ?? null;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const count = customEvent.detail?.count ?? 50;

    const flowerPetals = spawnBranchFlowerPetals(rect, scrollY, dimensions, count, config);
    petals.push(...flowerPetals);

    if (petals.length > config.petalCount + 120) {
      petals.splice(config.petalCount, petals.length - (config.petalCount + 120));
    }
  };

  const handleSlash = (e: Event) => {
    const customEvent = e as CustomEvent<SlashEventDetail>;
    if (customEvent.detail) {
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      applyWindSlash(petals, customEvent.detail, scrollY);
    }
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', updateEnvironment, { passive: true });
    window.addEventListener('sakura-tree-strike', handleTreeStrike);
    window.addEventListener('katana-slash', handleSlash);
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
      window.removeEventListener('scroll', updateEnvironment);
      window.removeEventListener('sakura-tree-strike', handleTreeStrike);
      window.removeEventListener('katana-slash', handleSlash);
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
