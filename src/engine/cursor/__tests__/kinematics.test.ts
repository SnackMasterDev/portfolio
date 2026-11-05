import { describe, it, expect } from 'vitest';
import {
  calculateAngle,
  calculateAngleDegrees,
  calculateSpeed,
  calculateViewportSpeedFraction,
  lerp,
  lerpAngleDegrees,
} from '../kinematics';

describe('kinematics', () => {
  describe('calculateAngle and calculateAngleDegrees', () => {
    it('calculates direction angle in radians correctly using Math.atan2', () => {
      expect(calculateAngle(1, 0)).toBeCloseTo(0);
      expect(calculateAngle(0, 1)).toBeCloseTo(Math.PI / 2);
      expect(calculateAngle(-1, 0)).toBeCloseTo(Math.PI);
      expect(calculateAngle(0, -1)).toBeCloseTo(-Math.PI / 2);
      expect(calculateAngle(1, 1)).toBeCloseTo(Math.PI / 4);
    });

    it('converts angle to degrees properly', () => {
      expect(calculateAngleDegrees(1, 0)).toBeCloseTo(0);
      expect(calculateAngleDegrees(0, 1)).toBeCloseTo(90);
      expect(calculateAngleDegrees(-1, 0)).toBeCloseTo(180);
      expect(calculateAngleDegrees(0, -1)).toBeCloseTo(-90);
      expect(calculateAngleDegrees(1, 1)).toBeCloseTo(45);
    });
  });

  describe('calculateSpeed', () => {
    it('calculates scalar speed in px/s as Math.hypot(vx, vy)', () => {
      const dtSeconds = 0.5;
      const dx = 150;
      const dy = 200;
      // vx = 300, vy = 400 => hypot(300, 400) = 500
      const speed = calculateSpeed(dx, dy, dtSeconds);
      expect(speed).toBeCloseTo(500);
    });

    it('returns 0 when dt is 0 or negative to prevent division by zero', () => {
      expect(calculateSpeed(100, 100, 0)).toBe(0);
      expect(calculateSpeed(100, 100, -0.1)).toBe(0);
    });

    it('returns 0 when stationary (dx=0, dy=0)', () => {
      expect(calculateSpeed(0, 0, 0.016)).toBe(0);
    });
  });

  describe('calculateViewportSpeedFraction', () => {
    it('computes fraction of viewport diagonal traversed per second', () => {
      // 1000x1000 viewport => diagonal ~1414.21
      // Moving 282.84 px in 1s => ~0.20 (20% of viewport/s)
      const fraction = calculateViewportSpeedFraction(200, 200, 1.0, 1000, 1000);
      expect(fraction).toBeCloseTo(0.20, 2);
    });

    it('clamps micro dt to 16ms to avoid instantaneous division spikes', () => {
      // Micro move: 2px in 0.001s
      // Clamped to 0.016s => speed 125 px/s on 2000px viewport => ~0.06 (6%), well under 20%
      const fraction = calculateViewportSpeedFraction(2, 0, 0.001, 1600, 1200);
      expect(fraction).toBeLessThan(0.10);
    });
  });

  describe('lerp and lerpAngleDegrees', () => {
    it('performs linear interpolation', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(10, 20, 0.1)).toBeCloseTo(11);
    });

    it('interpolates angles in degrees shortest path across 0/360 wrap', () => {
      // From 350 to 10 deg: shortest path is +20 deg, halfway is 360 / 0 deg
      const interpolated = lerpAngleDegrees(350, 10, 0.5);
      expect((interpolated + 360) % 360).toBeCloseTo(0);
    });

    it('interpolates negative to positive degrees smoothly', () => {
      const interpolated = lerpAngleDegrees(-10, 10, 0.5);
      expect(interpolated).toBeCloseTo(0);
    });
  });
});
