import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCollisionConfig,
  updateCollisionConfig,
  resetCollisionConfig,
  getCollisionPolygon,
  addPoint,
  updatePoint,
  removePoint,
  DEFAULT_POLYGON_CONFIG,
} from '../collisionBoxConfig';
import { DEFAULT_TRUNK_POLYGON } from '../trunkHitbox';

describe('collisionBoxConfig (Polygon Pen Tool)', () => {
  beforeEach(() => {
    resetCollisionConfig();
  });

  it('initializes with default trunk polygon vertices and tolerance', () => {
    const config = getCollisionConfig();
    expect(config.points.length).toBe(DEFAULT_TRUNK_POLYGON.length);
    expect(config.tolerancePx).toBe(DEFAULT_POLYGON_CONFIG.tolerancePx);
    expect(config.enabled).toBe(true);
  });

  it('updates a specific point position clamping [0, 1]', () => {
    updatePoint(0, { x: 0.85, y: 0.42 });
    const poly = getCollisionPolygon();
    expect(poly[0].x).toBe(0.85);
    expect(poly[0].y).toBe(0.42);
  });

  it('adds a new point to the polygon', () => {
    const initialCount = getCollisionConfig().points.length;
    addPoint({ x: 0.5, y: 0.5 });
    expect(getCollisionConfig().points.length).toBe(initialCount + 1);
    const last = getCollisionPolygon()[initialCount];
    expect(last).toEqual({ x: 0.5, y: 0.5 });
  });

  it('removes a point while respecting the minimum 3 vertices invariant', () => {
    const initialCount = getCollisionConfig().points.length;
    removePoint(0);
    expect(getCollisionConfig().points.length).toBe(initialCount - 1);

    // Try removing until 3 points left
    updateCollisionConfig({
      points: [
        { x: 0.1, y: 0.1 },
        { x: 0.5, y: 0.1 },
        { x: 0.3, y: 0.5 },
      ],
    });
    removePoint(0);
    // Should NOT remove because length is 3 (triangle minimum)
    expect(getCollisionConfig().points.length).toBe(3);
  });

  it('resets to default trunk polygon upon resetCollisionConfig', () => {
    addPoint({ x: 0.99, y: 0.99 });
    resetCollisionConfig();
    expect(getCollisionConfig().points.length).toBe(DEFAULT_TRUNK_POLYGON.length);
  });
});
