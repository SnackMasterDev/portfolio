import { describe, it, expect, vi } from 'vitest';
import {
  createPetal,
  createBurstPetal,
  applyWindSlash,
  deflectPetals,
  updatePetal,
  recyclePetal,
  drawPetal,
} from '../PetalSimulation';
import type { CanvasDimensions, SakuraConfig, Petal } from '../../types';

describe('PetalSimulation', () => {
  const dimensions: CanvasDimensions = { width: 1000, height: 800 };
  const config: SakuraConfig = {
    petalCount: 30,
    minSpeedY: 40,
    maxSpeedY: 100,
    minSize: 8,
    maxSize: 16,
    wind: { x: 15, y: 5 },
    colors: ['#ffb7c5', '#ffd1dc', '#ffe4e1'],
    maxDeltaTime: 0.05,
  };

  describe('createPetal', () => {
    it('creates a petal within config boundaries and assigns dual-sided backColor', () => {
      const petal = createPetal(dimensions, config);

      expect(petal.id).toBeDefined();
      expect(petal.size).toBeGreaterThanOrEqual(config.minSize);
      expect(petal.size).toBeLessThanOrEqual(config.maxSize);
      expect(petal.speedY).toBeGreaterThanOrEqual(config.minSpeedY);
      expect(petal.speedY).toBeLessThanOrEqual(config.maxSpeedY);
      expect(config.colors).toContain(petal.color);
      expect(petal.backColor).toBeDefined();
      expect(typeof petal.backColor).toBe('string');
      expect(petal.opacity).toBeGreaterThan(0);
      expect(petal.opacity).toBeLessThanOrEqual(1);
    });

    it('spawns petal within treeBounds when configured', () => {
      const treeConfig: SakuraConfig = {
        ...config,
        treeBounds: { x: 200, y: 150, width: 300, height: 250 },
      };
      const petal = createPetal(dimensions, treeConfig);
      expect(petal.x).toBeGreaterThanOrEqual(200);
      expect(petal.x).toBeLessThanOrEqual(500);
      expect(petal.y).toBeGreaterThanOrEqual(150);
      expect(petal.y).toBeLessThanOrEqual(150 + 250 * 0.5);
    });

    it('positions petal above screen when initialProgress is not provided and no treeBounds', () => {
      const petal = createPetal(dimensions, config);
      expect(petal.y).toBeLessThanOrEqual(0);
    });

    it('distributes petal vertically across screen when initialProgress is provided', () => {
      const petal = createPetal(dimensions, config, 0.5);
      expect(petal.y).toBeGreaterThanOrEqual(0);
      expect(petal.y).toBeLessThanOrEqual(dimensions.height);
    });
  });

  describe('createBurstPetal', () => {
    it('creates an energetic burst petal marked as isBurst', () => {
      const burst = createBurstPetal(400, 300, config);
      expect(burst.isBurst).toBe(true);
      expect(Math.abs(burst.x - 400)).toBeLessThanOrEqual(80);
      expect(burst.flipSpeed).toBeGreaterThan(3);
    });
  });

  describe('updatePetal', () => {
    it('updates position and clamps large delta time to maxDeltaTime', () => {
      const petal = createPetal(dimensions, config, 0.2);
      const initialY = petal.y;
      const initialPhase = petal.oscillationPhase;

      // Provide dt = 1.0s, which should be clamped to config.maxDeltaTime (0.05)
      updatePetal(petal, 1.0, dimensions, config);

      expect(petal.oscillationPhase).toBeCloseTo(
        initialPhase + petal.oscillationSpeed * 0.05,
        4
      );
      expect(petal.y).toBeGreaterThan(initialY);
      // y movement should not exceed (maxSpeedY + wind.y) * 0.05
      const dy = petal.y - initialY;
      expect(dy).toBeLessThanOrEqual((config.maxSpeedY + config.wind.y) * 0.05 + 1);
    });

    it('recycles petal when it falls beyond screen bounds', () => {
      const petal: Petal = {
        id: 1,
        x: 500,
        y: dimensions.height + 50,
        size: 10,
        speedY: 50,
        speedX: 0,
        rotation: 0,
        rotationSpeed: 0.5,
        flip: 0,
        flipSpeed: 1,
        oscillationPhase: 0,
        oscillationSpeed: 1,
        opacity: 0.8,
        color: '#ffb7c5',
      };

      updatePetal(petal, 0.016, dimensions, config);

      // Should have been recycled above the top
      expect(petal.y).toBeLessThanOrEqual(0);
    });

    it('settles petal on ground when config.groundY is reached', () => {
      const groundConfig: SakuraConfig = { ...config, groundY: 700 };
      const petal: Petal = {
        id: 2,
        x: 300,
        y: 700,
        size: 10,
        speedY: 50,
        speedX: 0,
        rotation: 0,
        rotationSpeed: 0.5,
        flip: 0,
        flipSpeed: 1,
        oscillationPhase: 0,
        oscillationSpeed: 1,
        opacity: 0.8,
        color: '#ffb7c5',
      };

      updatePetal(petal, 0.016, dimensions, groundConfig);

      expect(petal.isResting).toBe(true);
      expect(petal.speedX).toBe(0);
      expect(petal.speedY).toBe(0);
    });
  });

  describe('applyWindSlash', () => {
    it('applies directional velocity impulse to petals within blast radius', () => {
      const p1 = createPetal(dimensions, config);
      p1.x = 200;
      p1.y = 200;

      const p2 = createPetal(dimensions, config);
      p2.x = 900;
      p2.y = 900; // Outside radius

      applyWindSlash([p1, p2], { x: 210, y: 210, angle: 45, speed: 900 }, 0);

      expect(p1.slashImpulseX).toBeDefined();
      expect(p1.slashImpulseX).not.toBe(0);
      expect(p2.slashImpulseX).toBeUndefined();
    });

    it('deflects petals continuously when sword passes nearby', () => {
      const p = createPetal(dimensions, config);
      p.x = 200;
      p.y = 200;

      deflectPetals([p], 220, 210, 15, 10, 0, 95);

      expect(p.slashImpulseX).toBeDefined();
      expect(p.slashImpulseX).not.toBe(0);
      expect(p.slashImpulseY).toBeDefined();
      expect(p.slashImpulseY).not.toBe(0);
    });
  });

  describe('recyclePetal', () => {
    it('resets petal position above the top edge', () => {
      const petal = createPetal(dimensions, config, 0.8);
      recyclePetal(petal, dimensions, config);

      expect(petal.y).toBeLessThanOrEqual(0);
      expect(petal.x).toBeGreaterThanOrEqual(-50);
      expect(petal.x).toBeLessThanOrEqual(dimensions.width + 50);
    });
  });

  describe('drawPetal', () => {
    it('executes canvas transformations and bezier drawing commands', () => {
      const ctx = {
        save: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        scale: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        bezierCurveTo: vi.fn(),
        closePath: vi.fn(),
        fill: vi.fn(),
        restore: vi.fn(),
        fillStyle: '',
        globalAlpha: 1,
      } as unknown as CanvasRenderingContext2D;

      const petal = createPetal(dimensions, config, 0.5);
      drawPetal(ctx, petal);

      expect(ctx.save).toHaveBeenCalledOnce();
      expect(ctx.translate).toHaveBeenCalledWith(petal.x, petal.y);
      expect(ctx.rotate).toHaveBeenCalledWith(petal.rotation);
      expect(ctx.scale).toHaveBeenCalledOnce();
      expect(ctx.beginPath).toHaveBeenCalledOnce();
      expect(ctx.bezierCurveTo).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalledOnce();
      expect(ctx.restore).toHaveBeenCalledOnce();
    });
  });
});
