import { describe, it, expect } from 'vitest';
import {
  calculateAngle,
  calculateAngleDegrees,
  calculateSpeed,
  calculateViewportSpeedFraction,
  calculateWindowDistance,
  calculateWindowSpeed,
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

  describe('calculateWindowSpeed', () => {
    it('computes velocity fraction over a calibrated 250ms window', () => {
      const samples = [
        { x: 100, y: 100, time: 1000 },
        { x: 200, y: 100, time: 1100 },
        { x: 350, y: 100, time: 1200 }, // Moved 250px in 200ms
      ];

      // Viewport 1000x1000 => diagonal ~1414.21
      // 250px / 0.2s = 1250 px/s => 1250 / 1414.21 = ~0.88 fraction
      const result = calculateWindowSpeed(samples, 1200, 250, 1000, 1000);
      expect(result.distance).toBe(250);
      expect(result.speedFraction).toBeCloseTo(0.88, 1);
    });

    it('prunes samples older than window duration (e.g. 250ms)', () => {
      const samples = [
        { x: 0, y: 0, time: 500 }, // Expired
        { x: 100, y: 100, time: 900 },
        { x: 150, y: 150, time: 1000 },
      ];

      calculateWindowSpeed(samples, 1000, 250, 1000, 1000);
      // Samples older than 1000 - 250 = 750ms must be shifted out
      expect(samples.some((s) => s.time === 500)).toBe(false);
    });

    it('returns zero speed fraction when samples length < 2', () => {
      const result = calculateWindowSpeed([{ x: 10, y: 10, time: 100 }], 100);
      expect(result.speedFraction).toBe(0);
      expect(result.distance).toBe(0);
    });
  });

  describe('calculateWindowDistance', () => {
    it('calculates exact cumulative distance traveled in a calibrated window without px/s division', () => {
      const samples = [
        { x: 100, y: 100, time: 1000 },
        { x: 150, y: 100, time: 1100 }, // +50px
        { x: 220, y: 100, time: 1200 }, // +70px -> total 120px
      ];

      const result = calculateWindowDistance(samples, 1200, 350);
      expect(result.distance).toBe(120);
      expect(result.pathDistance).toBe(120);
      expect(result.netDisplacement).toBe(120);
      expect(result.dx).toBe(120);
    });

    it('prunes samples older than windowMs (e.g. 350ms or 500ms)', () => {
      const samples = [
        { x: 0, y: 0, time: 500 }, // expired (> 350ms before 1000)
        { x: 100, y: 100, time: 700 },
        { x: 180, y: 100, time: 1000 },
      ];

      const result = calculateWindowDistance(samples, 1000, 350);
      expect(samples.some((s) => s.time === 500)).toBe(false);
      expect(result.distance).toBe(80);
    });

    it('computes viewportDistanceFraction proportionally to viewport diagonal without dividing by dt', () => {
      // 1200x800 viewport => diagonal ~1442.22
      // Stroke travels 144.22px => exactly 0.10 (10% of viewport diagonal)
      const samples = [
        { x: 100, y: 100, time: 1000 },
        { x: 244.22, y: 100, time: 1200 },
      ];

      const result = calculateWindowDistance(samples, 1200, 350, 1200, 800);
      expect(result.distance).toBeCloseTo(144.22, 1);
      expect(result.viewportDistanceFraction).toBeCloseTo(0.10, 2);
    });
  });
});
