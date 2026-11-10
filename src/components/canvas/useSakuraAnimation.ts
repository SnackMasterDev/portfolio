import { useEffect, type RefObject } from 'react';
import type { SakuraConfig, CanvasDimensions, SlashEventDetail } from '../../engine/types';
import {
  createRainPetals,
  calculateAdaptivePetalSize,
  getViewportScale,
  type RainPetal,
} from '../../engine/sakura/sakuraRainEngine';
import { drawBladeSlashes, type ActiveBladeSlash } from './drawBladeSlash';
import {
  drawRainPetalItem,
  updateAndRenderPetal,
} from './petalLandingRenderer';

export const DEFAULT_SAKURA_CONFIG: SakuraConfig = {
  petalCount: 32,
  minSpeedY: 55,
  maxSpeedY: 90,
  minSize: 15,
  maxSize: 25,
  wind: { x: 18, y: 0 },
  colors: ['#fff0f5', '#ffb8c8', '#e47294', '#f87595', '#fca5a5'],
  maxDeltaTime: 0.05,
};

/**
 * Orquesta la lluvia continua de 32 pétalos aerodinámicos Richard Williams
 * con 5 variaciones cromáticas, desprendimiento en el árbol y acomodo fluido en el footer.
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

  const getScrollY = (): number => {
    if (typeof window === 'undefined') return 0;
    const docScroll = typeof document !== 'undefined' ? document.documentElement?.scrollTop : 0;
    return window.scrollY || window.pageYOffset || docScroll || 0;
  };

  const getGroundY = (): number => {
    const scrollY = getScrollY();
    if (typeof document === 'undefined') return dimensions.height + 60 + scrollY;
    const footerEl =
      (typeof document.getElementById === 'function' ? document.getElementById('ground') : null) ||
      (typeof document.querySelector === 'function' ? document.querySelector('footer') : null);
    if (!footerEl || typeof footerEl.getBoundingClientRect !== 'function') {
      const docHeight = document.documentElement?.scrollHeight || dimensions.height + 60;
      return docHeight;
    }
    const rect = footerEl.getBoundingClientRect();
    // Coordenada absoluta Y en el documento (independiente del scroll del viewport)
    return rect.top + scrollY + 28;
  };

  const getTreeBounds = (): { x: number; y: number; width: number; height: number } => {
    const scrollY = getScrollY();
    if (typeof document !== 'undefined') {
      const treeEl = document.getElementById('sakura-tree');
      if (treeEl && typeof treeEl.getBoundingClientRect === 'function') {
        const rect = treeEl.getBoundingClientRect();
        if (rect.width > 0) {
          const height = rect.height > 0 ? rect.height : rect.width * (752 / 1392);
          return { x: rect.left, y: rect.top + scrollY, width: rect.width, height };
        }
      }
    }
    const fallbackWidth = dimensions.width || 1200;
    return { x: 0, y: 0, width: fallbackWidth, height: fallbackWidth * (752 / 1392) };
  };

  const initialTreeBounds = getTreeBounds();
  const initialGroundY = getGroundY();

  // Distribuir pétalos a lo largo de toda la altura del documento (desde el árbol hasta el footer)
  const petals: RainPetal[] = createRainPetals(
    config.petalCount ?? 32,
    dimensions.width,
    initialGroundY,
    initialTreeBounds
  );

  const motionQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
  let isReducedMotion = config.prefersReducedMotion ?? (motionQuery ? motionQuery.matches : false);

  const activeSlashes: ActiveBladeSlash[] = [];
  let animationFrameId: number;
  let lastTime = performance.now();

  const render = (currentTime: number) => {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
    lastTime = currentTime;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    const scrollY = getScrollY();
    const groundY = getGroundY();
    const treeBounds = getTreeBounds();
    const groundContext = { groundY, scrollY, dimensions, treeBounds };

    for (const p of petals) {
      updateAndRenderPetal(ctx, p, dt, groundContext);
    }

    drawBladeSlashes(ctx, activeSlashes, dt);
    animationFrameId = requestAnimationFrame(render);
  };

  const renderStaticFrame = () => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    const scrollY = getScrollY();
    for (const p of petals) {
      const renderY = p.y - scrollY;
      if (renderY >= -60 && renderY <= dimensions.height + 60) {
        const swingVelocity = Math.cos(p.phase);
        const pitchScale = Math.sin(p.phase);
        const absPitch = Math.abs(pitchScale);
        drawRainPetalItem(ctx, p, swingVelocity, pitchScale, absPitch, 1, scrollY);
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

  const adaptPetalsToViewport = (viewportWidth: number) => {
    const scale = getViewportScale(viewportWidth);
    for (const p of petals) {
      p.baseSize = calculateAdaptivePetalSize(viewportWidth, p.z);
      p.swingAmplitude = (38 + Math.random() * 24) * p.z * scale;
      p.windDrift = (14 + Math.random() * 16) * p.z * scale;
      p.baseVy = (52 + Math.random() * 32) * p.z * Math.max(0.75, scale);
    }
  };

  const handleResize = () => {
    const { width, height } = getViewportDimensions();
    if (width > 0 && height > 0) {
      canvas.width = width;
      canvas.height = height;
      dimensions.width = width;
      dimensions.height = height;
      adaptPetalsToViewport(width);
    }
  };

  const handleTreeStrike = (e: Event) => {
    const customEvent = e as CustomEvent<{ count?: number }>;
    const count = customEvent.detail?.count ?? 16;
    const treeBounds = getTreeBounds();

    const burst = createRainPetals(count, dimensions.width, dimensions.height, treeBounds, { blossomsOnly: true });
    petals.push(...burst);

    const maxPetals = (config.petalCount ?? 32) + 48;
    if (petals.length > maxPetals) {
      petals.splice(config.petalCount ?? 32, petals.length - maxPetals);
    }
  };

  const handleSlash = (e: Event) => {
    const customEvent = e as CustomEvent<SlashEventDetail>;
    if (customEvent.detail) {
      const d = customEvent.detail;
      const startX = d.startX ?? d.x;
      const startY = d.startY ?? d.y;
      const endX = d.x;
      const endY = d.y;
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.hypot(dx, dy);

      if (length >= 10) {
        const angle =
          typeof d.angle === 'number' && !isNaN(d.angle)
            ? (d.angle * Math.PI) / 180
            : Math.atan2(dy, dx);

        activeSlashes.push({
          startX,
          startY,
          endX,
          endY,
          length,
          angle,
          life: 0.25,
          maxLife: 0.25,
        });

        if (activeSlashes.length > 4) {
          activeSlashes.shift();
        }
      }
    }
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', handleResize, { passive: true });
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
          adaptPetalsToViewport(width);
        }
      }
    });
    resizeObserver.observe(canvas);
  }

  return () => {
    cancelAnimationFrame(animationFrameId);
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('resize', handleResize);
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
