import { describe, it, expect } from 'vitest';
import {
  FLOWER_BLOSSOM_ZONES,
  createFlowerPetal,
  spawnBranchFlowerPetals,
} from '../branchFlowerPetals';
import type { SakuraConfig } from '../../types';

describe('branchFlowerPetals', () => {
  const config: SakuraConfig = {
    petalCount: 50,
    minSpeedY: 50,
    maxSpeedY: 100,
    minSize: 10,
    maxSize: 20,
    wind: { x: 10, y: 0 },
    colors: ['#fce7f3', '#fbcfe8'],
    maxDeltaTime: 0.05,
  };

  it('defines valid blossom zones within canopy coordinates', () => {
    expect(FLOWER_BLOSSOM_ZONES.length).toBeGreaterThanOrEqual(6);
    for (const zone of FLOWER_BLOSSOM_ZONES) {
      expect(zone.xMin).toBeGreaterThanOrEqual(0);
      expect(zone.xMax).toBeLessThanOrEqual(1);
      expect(zone.yMin).toBeGreaterThanOrEqual(0);
      expect(zone.yMax).toBeLessThanOrEqual(0.5); // Flores ubicadas en la copa
    }
  });

  it('creates petal with falling downward speed from flower location', () => {
    const petal = createFlowerPetal(300, 200, config);
    expect(petal.isBurst).toBe(true);
    expect(petal.speedY).toBeGreaterThan(0); // Caída hacia abajo
    expect(Math.abs(petal.x - 300)).toBeLessThanOrEqual(30);
    expect(Math.abs(petal.y - 200)).toBeLessThanOrEqual(25);
  });

  it('spawns requested number of petals across tree flower zones', () => {
    const mockRect = {
      left: 100,
      top: 50,
      width: 1000,
      height: 600,
      right: 1100,
      bottom: 650,
      x: 100,
      y: 50,
      toJSON: () => {},
    } as DOMRect;

    const petals = spawnBranchFlowerPetals(mockRect, 0, { width: 1200, height: 800 }, 30, config);
    expect(petals.length).toBe(30);

    for (const p of petals) {
      // Petals must spawn within canopy flower regions (X in tree width, Y in top half of tree)
      expect(p.x).toBeGreaterThanOrEqual(100);
      expect(p.x).toBeLessThanOrEqual(1100);
      expect(p.y).toBeGreaterThanOrEqual(40);
      expect(p.y).toBeLessThanOrEqual(50 + 600 * 0.55);
    }
  });
});
