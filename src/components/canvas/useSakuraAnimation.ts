import { useEffect, type RefObject } from 'react';
import type { SakuraConfig, Petal, CanvasDimensions } from '../../engine/types';
import { createPetal, updatePetal, drawPetal } from '../../engine/sakura/PetalSimulation';

export const DEFAULT_SAKURA_CONFIG: SakuraConfig = {
  petalCount: 35,
  minSpeedY: 30,
  maxSpeedY: 70,
  minSize: 8,
  maxSize: 18,
  wind: { x: 15, y: 0 },
  colors: ['#ffd1dc', '#ffb7c5', '#ffc0cb', '#f8b9d4', '#fff0f5'],
  maxDeltaTime: 0.05,
};

/**
 * Initializes and orchestrates the canvas animation loop outside React's lifecycle.
 * Manages ResizeObserver, prefers-reduced-motion, and cleanup.
 */
export function setupSakuraCanvas(
  canvas: HTMLCanvasElement,
  customConfig?: Partial<SakuraConfig>
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const config: SakuraConfig = { ...DEFAULT_SAKURA_CONFIG, ...customConfig };

  const dimensions: CanvasDimensions = {
    width: (canvas.width = canvas.clientWidth || 800),
    height: (canvas.height = canvas.clientHeight || 600),
  };

  const petals: Petal[] = Array.from({ length: config.petalCount }, () =>
    createPetal(dimensions, config, Math.random())
  );

  const motionQuery =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  let isReducedMotion = motionQuery ? motionQuery.matches : false;

  let animationFrameId: number;
  let lastTime = performance.now();

  const render = (currentTime: number) => {
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    for (let i = 0; i < petals.length; i++) {
      updatePetal(petals[i], dt, dimensions, config);
      drawPetal(ctx, petals[i]);
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

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        dimensions.width = width;
        dimensions.height = height;
      }
    }
  });

  resizeObserver.observe(canvas);

  return () => {
    cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
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
