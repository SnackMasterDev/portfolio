import { describe, it, expect } from 'vitest';
import {
  isPointInPolygon,
  closestPointOnSegment,
  getClosestBoundaryPoint,
  denormalizePolygon,
  resolveTrunkCollision,
  DEFAULT_TRUNK_POLYGON,
} from '../trunkHitbox';

describe('trunkHitbox', () => {
  const squarePoly = [
    { x: 10, y: 10 },
    { x: 50, y: 10 },
    { x: 50, y: 50 },
    { x: 10, y: 50 },
  ];

  describe('isPointInPolygon', () => {
    it('returns true for points inside the polygon', () => {
      expect(isPointInPolygon({ x: 30, y: 30 }, squarePoly)).toBe(true);
    });

    it('returns false for points outside the polygon', () => {
      expect(isPointInPolygon({ x: 5, y: 30 }, squarePoly)).toBe(false);
      expect(isPointInPolygon({ x: 60, y: 30 }, squarePoly)).toBe(false);
      expect(isPointInPolygon({ x: 30, y: 5 }, squarePoly)).toBe(false);
      expect(isPointInPolygon({ x: 30, y: 60 }, squarePoly)).toBe(false);
    });

    it('returns false for polygons with fewer than 3 vertices', () => {
      expect(isPointInPolygon({ x: 0, y: 0 }, [{ x: 0, y: 0 }, { x: 1, y: 1 }])).toBe(false);
    });
  });

  describe('closestPointOnSegment', () => {
    it('clamps to segment start and end', () => {
      const a = { x: 0, y: 0 };
      const b = { x: 10, y: 0 };

      // Point before A
      expect(closestPointOnSegment({ x: -5, y: 0 }, a, b)).toEqual({ x: 0, y: 0 });
      // Point after B
      expect(closestPointOnSegment({ x: 15, y: 0 }, a, b)).toEqual({ x: 10, y: 0 });
      // Point projected onto segment
      expect(closestPointOnSegment({ x: 4, y: 10 }, a, b)).toEqual({ x: 4, y: 0 });
    });
  });

  describe('getClosestBoundaryPoint', () => {
    it('finds closest boundary point and outward normal on a square', () => {
      const res = getClosestBoundaryPoint({ x: 48, y: 30 }, squarePoly);
      expect(res.point.x).toBeCloseTo(50, 1);
      expect(res.point.y).toBeCloseTo(30, 1);
      // Right edge normal points in positive x direction
      expect(res.normal.x).toBeGreaterThan(0);
    });
  });

  describe('denormalizePolygon', () => {
    it('scales normalized polygon coordinates to screen rect', () => {
      const normPoly = [{ x: 0.5, y: 0.5 }];
      const rect = { left: 100, top: 200, width: 400, height: 600 };
      const res = denormalizePolygon(normPoly, rect);

      expect(res[0]).toEqual({
        x: 300, // 100 + 0.5 * 400
        y: 500, // 200 + 0.5 * 600
      });
    });
  });

  describe('resolveTrunkCollision', () => {
    const screenRect = { left: 0, top: 0, width: 1000, height: 1000 };
    const screenTrunk = denormalizePolygon(DEFAULT_TRUNK_POLYGON, screenRect);

    it('allows free movement outside trunk', () => {
      const outsideX = 100;
      const outsideY = 100;
      const res = resolveTrunkCollision(outsideX, outsideY, screenTrunk);

      expect(res.isColliding).toBe(false);
      expect(res.clampedX).toBe(outsideX);
      expect(res.clampedY).toBe(outsideY);
    });

    it('clamps coordinates when point enters the trunk interior', () => {
      // Point inside the trunk: center around x=670, y=600
      const insideX = 670;
      const insideY = 600;
      const res = resolveTrunkCollision(insideX, insideY, screenTrunk, 5);

      expect(res.isColliding).toBe(true);
      // The clamped point must be pushed outside the trunk
      expect(isPointInPolygon({ x: res.clampedX, y: res.clampedY }, screenTrunk)).toBe(false);
    });
  });
});
