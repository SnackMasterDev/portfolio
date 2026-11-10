import { describe, it, expect, vi } from 'vitest';
import { drawBladeSlashes, type ActiveBladeSlash } from '../drawBladeSlash';

describe('drawBladeSlash', () => {
  it('updates life and renders slash path with glow and stroke', () => {
    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      globalAlpha: 1,
      shadowColor: '',
      shadowBlur: 0,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;

    const slashes: ActiveBladeSlash[] = [
      {
        startX: 100,
        startY: 100,
        endX: 200,
        endY: 150,
        length: 120,
        angle: 0.5,
        life: 0.25,
        maxLife: 0.25,
      },
    ];

    drawBladeSlashes(ctx, slashes, 0.05);

    expect(slashes).toHaveLength(1);
    expect(slashes[0].life).toBeCloseTo(0.20, 2);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.translate).toHaveBeenCalledWith(100, 100);
    expect(ctx.rotate).toHaveBeenCalledWith(0.5);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });

  it('removes slashes when their life reaches zero', () => {
    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      globalAlpha: 1,
      shadowColor: '',
      shadowBlur: 0,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;

    const slashes: ActiveBladeSlash[] = [
      {
        startX: 100,
        startY: 100,
        endX: 200,
        endY: 150,
        length: 120,
        angle: 0.5,
        life: 0.02,
        maxLife: 0.25,
      },
    ];

    drawBladeSlashes(ctx, slashes, 0.05);
    expect(slashes).toHaveLength(0);
  });
});
