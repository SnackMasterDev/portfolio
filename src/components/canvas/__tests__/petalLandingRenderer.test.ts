import { describe, it, expect, vi } from 'vitest';
import {
  drawRainPetalItem,
  respawnPetal,
  updateAndRenderPetal,
  type GroundLandingContext,
} from '../petalLandingRenderer';
import type { RainPetal } from '../../../engine/sakura/sakuraRainEngine';

describe('petalLandingRenderer', () => {
  it('draws a rain petal item with translation and scale', () => {
    const addColorStop = vi.fn();
    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop })),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const petal: RainPetal = {
      x: 100,
      y: 200,
      z: 1,
      baseSize: 20,
      phase: 0.5,
      phaseSpeed: 1.5,
      yawAngle: 0.2,
      yawSpeed: 0.5,
      swingAmplitude: 30,
      baseVy: 70,
      windDrift: 20,
      paletteIndex: 0,
    };

    drawRainPetalItem(ctx, petal, 0.8, 0.4, 0.4, 0.9);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.translate).toHaveBeenCalledWith(100, 200);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('respawns a petal at tree blossoms when tree bounds are available', () => {
    const petal: RainPetal = {
      x: 50,
      y: 900,
      z: 1,
      baseSize: 20,
      phase: 0,
      phaseSpeed: 1.5,
      yawAngle: 0,
      yawSpeed: 0.5,
      swingAmplitude: 30,
      baseVy: 70,
      windDrift: 20,
      isResting: true,
      landingProgress: 1,
    };

    const treeBounds = { x: 100, y: 50, width: 600, height: 400 };
    respawnPetal(petal, treeBounds, { width: 1000, height: 800 });

    expect(petal.isResting).toBe(false);
    expect(petal.landingProgress).toBe(0);
    expect(petal.x).toBeGreaterThanOrEqual(treeBounds.x - 20);
    expect(petal.x).toBeLessThanOrEqual(treeBounds.x + treeBounds.width + 20);
    expect(petal.baseSize).toBeGreaterThan(0);
  });

  it('respawns petals at tree blossoms and adapts baseSize even when treeBounds are omitted', () => {
    const mobilePetal: RainPetal = {
      x: 0,
      y: 0,
      z: 1,
      baseSize: 20,
      phase: 0,
      phaseSpeed: 1.5,
      yawAngle: 0,
      yawSpeed: 0.5,
      swingAmplitude: 30,
      baseVy: 70,
      windDrift: 20,
    };
    const desktopPetal: RainPetal = { ...mobilePetal };

    respawnPetal(mobilePetal, undefined, { width: 375, height: 667 });
    respawnPetal(desktopPetal, undefined, { width: 1440, height: 900 });

    // On mobile without treeBounds, blossom coordinates must still be constrained to tree aspect ratio (width * 752 / 1392)
    const mobileTreeHeight = 375 * (752 / 1392);
    expect(mobilePetal.x).toBeGreaterThanOrEqual(-20);
    expect(mobilePetal.x).toBeLessThanOrEqual(375 + 20);
    expect(mobilePetal.y).toBeGreaterThanOrEqual(-20);
    expect(mobilePetal.y).toBeLessThanOrEqual(mobileTreeHeight + 20);

    // Mobile size must adapt to be smaller than desktop size
    expect(mobilePetal.baseSize).toBeLessThan(desktopPetal.baseSize);
  });

  it('smoothly cushions and settles a petal onto the ground footer', () => {
    const addColorStop = vi.fn();
    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      ellipse: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop })),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const petal: RainPetal = {
      x: 300,
      y: 680,
      z: 1,
      baseSize: 18,
      phase: 0.5,
      phaseSpeed: 1.5,
      yawAngle: 0.2,
      yawSpeed: 0.5,
      swingAmplitude: 30,
      baseVy: 70,
      windDrift: 20,
      paletteIndex: 0,
      landingProgress: 0,
      isResting: false,
    };

    const groundContext: GroundLandingContext = {
      groundY: 700,
      scrollY: 0,
      dimensions: { width: 800, height: 800 },
    };

    // Petal within 45px of ground should begin landing progress
    updateAndRenderPetal(ctx, petal, 0.05, groundContext);
    expect(petal.landingProgress).toBeGreaterThan(0);
    expect(ctx.ellipse).toHaveBeenCalled(); // Sombra de contacto

    // After enough delta time, petal lands and rests
    for (let i = 0; i < 20; i++) {
      updateAndRenderPetal(ctx, petal, 0.1, groundContext);
    }
    expect(petal.isResting).toBe(true);
    expect(petal.y).toBe(700);
    expect(petal.restingRoll).toBeDefined();
    expect(petal.restingScaleX).toBeDefined();
    expect(petal.restingScaleY).toBeDefined();
  });
});
