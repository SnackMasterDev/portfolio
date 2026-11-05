import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrunkCollisionManager } from '../trunkCollisionPhysics';

describe('TrunkCollisionManager', () => {
  let fakeElement: HTMLElement;

  beforeEach(() => {
    fakeElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 1000,
        height: 1000,
        right: 1000,
        bottom: 1000,
        x: 0,
        y: 0,
        toJSON: () => {},
      }),
    } as unknown as HTMLElement;
  });

  it('allows free movement when cursor is outside the trunk', () => {
    const manager = new TrunkCollisionManager({
      getTreeElement: () => fakeElement,
    });

    const result = manager.updateAndResolve(100, 100, 0.05);
    expect(result.isColliding).toBe(false);
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.isRecoiling).toBe(false);
  });

  it('clamps position outside when cursor enters the trunk at low speed', () => {
    const manager = new TrunkCollisionManager({
      getTreeElement: () => fakeElement,
    });

    // Center of trunk around x=670, y=600
    const result = manager.updateAndResolve(670, 600, 0.05);
    expect(result.isColliding).toBe(true);
    expect(result.isRecoiling).toBe(false); // No rebound at low speed
    // Must be pushed away from the center
    expect(result.x !== 670 || result.y !== 600).toBe(true);
  });

  it('triggers elastic rebound when cursor strikes trunk at speed >= 20% viewport/s', () => {
    const onRebound = vi.fn();

    const manager = new TrunkCollisionManager({
      getTreeElement: () => fakeElement,
      recoilImpulseDistance: 50,
      speedThresholdFraction: 0.20,
      onRebound,
    });

    const result = manager.updateAndResolve(670, 600, 0.25);
    expect(result.isColliding).toBe(true);
    expect(result.isRecoiling).toBe(true);

    // Verifies rebound callback invoked with normal and impact coordinates
    expect(onRebound).toHaveBeenCalledTimes(1);
    expect(onRebound).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('decays spring recoil offset on successive stepSpring calls', () => {
    const manager = new TrunkCollisionManager({
      getTreeElement: () => fakeElement,
      recoilImpulseDistance: 50,
      recoilDamping: 0.5,
    });

    manager.triggerRebound({ x: 1, y: 0 }, 500, 500, performance.now());
    expect(manager.getRecoilOffset().x).toBe(50);

    const stillRecoiling1 = manager.stepSpring();
    expect(stillRecoiling1).toBe(true);
    expect(manager.getRecoilOffset().x).toBe(25);

    manager.stepSpring(); // 12.5
    manager.stepSpring(); // 6.25
    manager.stepSpring(); // 3.125
    manager.stepSpring(); // 1.56
    manager.stepSpring(); // 0.78
    const stillRecoilingFinal = manager.stepSpring(); // < 0.6 -> finishes
    expect(stillRecoilingFinal).toBe(false);
    expect(manager.getRecoilOffset().x).toBe(0);
  });
});
