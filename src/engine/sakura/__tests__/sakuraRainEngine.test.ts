import { describe, it, expect, vi } from 'vitest';
import {
  SAKURA_PETAL_PALETTES,
  createRainPetals,
  calculateAdaptivePetalSize,
  getViewportScale,
  drawSakuraPetal,
} from '../sakuraRainEngine';

describe('sakuraRainEngine', () => {
  it('provides 5 botanical Japanese Sakura palettes with harmonic front/back gradients and inner cupping', () => {
    expect(SAKURA_PETAL_PALETTES).toHaveLength(5);
    const names = SAKURA_PETAL_PALETTES.map((p) => p.name);
    expect(names).toContain('Somei-Yoshino (Classic)');
    expect(names).toContain('Shiro-Sakura (Blanco Nieve)');
    expect(names).toContain('Beni-Sakura (Carmesí Vivo)');
    expect(names).toContain('Kanzan-Sakura (Rosa Magenta)');
    expect(names).toContain('Momo-Sakura (Melocotón Cálido)');

    for (const pal of SAKURA_PETAL_PALETTES) {
      expect(pal.frontGradient).toHaveLength(3);
      expect(pal.backGradient).toHaveLength(2);
      expect(pal.frontInner).toContain('rgba');
      expect(pal.backInner).toContain('rgba');
      expect(pal.veinFront).toContain('rgba');
      expect(pal.veinBack).toContain('rgba');
    }

    expect(getViewportScale(1920)).toBeGreaterThan(0);
    expect(calculateAdaptivePetalSize(1920, 1)).toBeGreaterThan(0);
  });

  it('generates rain petals distributed across canvas dimensions when no treeBounds are provided', () => {
    const petals = createRainPetals(32, 1000, 800);
    expect(petals).toHaveLength(32);

    for (const p of petals) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(1000);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(800);
      expect(p.baseSize).toBeGreaterThan(0);
      expect(p.phaseSpeed).toBeGreaterThan(0);
      expect(p.paletteIndex).toBeGreaterThanOrEqual(0);
      expect(p.paletteIndex).toBeLessThan(SAKURA_PETAL_PALETTES.length);
    }
  });

  it('spawns ambient petals across page and tree petals on blossom zones when treeBounds are provided', () => {
    const treeBounds = { x: 150, y: 80, width: 700, height: 450 };
    const petals = createRainPetals(20, 1200, 900, treeBounds);
    expect(petals).toHaveLength(20);

    // Initial ambient petals are distributed across canvas dimensions
    const ambientPetals = petals.slice(0, 10);
    for (const p of ambientPetals) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(1200);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(900);
    }

    // Tree blossom petals spawn directly on the blossom clusters
    const treePetals = petals.slice(10);
    for (const p of treePetals) {
      expect(p.x).toBeGreaterThanOrEqual(treeBounds.x - 20);
      expect(p.x).toBeLessThanOrEqual(treeBounds.x + treeBounds.width + 20);
      expect(p.y).toBeGreaterThanOrEqual(treeBounds.y - 20);
      expect(p.y).toBeLessThanOrEqual(treeBounds.y + treeBounds.height + 20);
    }
  });

  it('spawns 100% of petals on blossom clusters when blossomsOnly option is enabled', () => {
    const treeBounds = { x: 150, y: 80, width: 700, height: 450 };
    const petals = createRainPetals(16, 1200, 900, treeBounds, { blossomsOnly: true });
    expect(petals).toHaveLength(16);

    for (const p of petals) {
      expect(p.x).toBeGreaterThanOrEqual(treeBounds.x - 20);
      expect(p.x).toBeLessThanOrEqual(treeBounds.x + treeBounds.width + 20);
      expect(p.y).toBeGreaterThanOrEqual(treeBounds.y - 20);
      expect(p.y).toBeLessThanOrEqual(treeBounds.y + treeBounds.height + 20);
    }
  });

  it('adapts petal size and dynamics smoothly to the viewport width', () => {
    const mobileWidth = 375;
    const tabletWidth = 768;
    const desktopWidth = 1440;
    const ultraWidth = 2560;

    const mobileScale = getViewportScale(mobileWidth);
    const tabletScale = getViewportScale(tabletWidth);
    const desktopScale = getViewportScale(desktopWidth);
    const ultraScale = getViewportScale(ultraWidth);

    expect(mobileScale).toBeLessThan(tabletScale);
    expect(tabletScale).toBeLessThan(desktopScale);
    expect(desktopScale).toBeLessThan(ultraScale);

    const mobileSize = calculateAdaptivePetalSize(mobileWidth, 1);
    const tabletSize = calculateAdaptivePetalSize(tabletWidth, 1);
    const desktopSize = calculateAdaptivePetalSize(desktopWidth, 1);
    const ultraSize = calculateAdaptivePetalSize(ultraWidth, 1);

    expect(mobileSize).toBeGreaterThanOrEqual(7);
    expect(mobileSize).toBeLessThan(tabletSize);
    expect(tabletSize).toBeLessThan(desktopSize);
    expect(desktopSize).toBeLessThan(ultraSize);

    // Test that createRainPetals produces smaller petals on mobile than on desktop
    const mobilePetals = createRainPetals(10, mobileWidth, 667);
    const desktopPetals = createRainPetals(10, desktopWidth, 900);

    const avgMobileSize = mobilePetals.reduce((acc, p) => acc + p.baseSize, 0) / mobilePetals.length;
    const avgDesktopSize = desktopPetals.reduce((acc, p) => acc + p.baseSize, 0) / desktopPetals.length;

    expect(avgMobileSize).toBeLessThan(avgDesktopSize);
  });

  it('draws a sakura petal applying palette linear gradients, 3D arch and vein strokes', () => {
    const addColorStop = vi.fn();
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop })),
      fillStyle: '',
      fill: vi.fn(),
      strokeStyle: '',
      stroke: vi.fn(),
      quadraticCurveTo: vi.fn(),
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;

    const palette = SAKURA_PETAL_PALETTES[1]; // Shiro-Sakura
    drawSakuraPetal(ctx, 20, false, 0, 0.42, 0.48, 0.15, palette);

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, -20, 0, 20);
    expect(addColorStop).toHaveBeenCalledWith(0, palette.frontGradient[0]);
    expect(addColorStop).toHaveBeenCalledWith(0.55, palette.frontGradient[1]);
    expect(addColorStop).toHaveBeenCalledWith(1, palette.frontGradient[2]);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('draws underside face when isUnderside is true applying back gradient and inner tone', () => {
    const addColorStop = vi.fn();
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop })),
      fillStyle: '',
      fill: vi.fn(),
      strokeStyle: '',
      stroke: vi.fn(),
      quadraticCurveTo: vi.fn(),
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;

    const palette = SAKURA_PETAL_PALETTES[2]; // Beni-Sakura
    drawSakuraPetal(ctx, 22, true, 0, -0.42, 0.50, 0.10, palette);

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, -22, 0, 22);
    expect(addColorStop).toHaveBeenCalledWith(0, palette.backGradient[0]);
    expect(addColorStop).toHaveBeenCalledWith(1, palette.backGradient[1]);
    expect(ctx.fill).toHaveBeenCalled();
  });
});
