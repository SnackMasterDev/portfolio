import {
  DEFAULT_TRUNK_POLYGON,
  denormalizePolygon,
  resolveTrunkCollision,
  type Point2D,
} from '../tree/trunkHitbox';

export interface CollisionManagerConfig {
  recoilImpulseDistance?: number;
  recoilDamping?: number;
  speedThresholdFraction?: number;
  reboundCooldownMs?: number;
  getTreeElement?: () => HTMLElement | null;
  onRebound?: (normal: Point2D, impactX: number, impactY: number) => void;
}

export interface CollisionStepResult {
  x: number;
  y: number;
  isColliding: boolean;
  isRecoiling: boolean;
}

export class TrunkCollisionManager {
  private recoilX = 0;
  private recoilY = 0;
  private lastReboundTime = 0;
  private isCurrentlyRecoiling = false;

  private readonly recoilImpulse: number;
  private readonly damping: number;
  private readonly speedThreshold: number;
  private readonly cooldownMs: number;
  private readonly getTreeEl: () => HTMLElement | null;
  private readonly onReboundCallback?: (normal: Point2D, impactX: number, impactY: number) => void;

  constructor(config?: CollisionManagerConfig) {
    this.recoilImpulse = config?.recoilImpulseDistance ?? 60;
    this.damping = config?.recoilDamping ?? 0.82;
    this.speedThreshold = config?.speedThresholdFraction ?? 0.20;
    this.cooldownMs = config?.reboundCooldownMs ?? 280;
    this.getTreeEl =
      config?.getTreeElement ??
      (() =>
        typeof document !== 'undefined' && typeof document.getElementById === 'function'
          ? document.getElementById('sakura-tree-img')
          : null);
    this.onReboundCallback = config?.onRebound;
  }

  /**
   * Resolves mouse position against the tree trunk:
   * 1. Clamps position outside the trunk so cursor NEVER penetrates the bark.
   * 2. If moving into the trunk at speed >= 20% viewport/s, triggers elastic rebound.
   */
  public updateAndResolve(
    rawX: number,
    rawY: number,
    viewportSpeedFraction: number
  ): CollisionStepResult {
    const treeEl = this.getTreeEl();
    if (!treeEl) {
      return {
        x: rawX + this.recoilX,
        y: rawY + this.recoilY,
        isColliding: false,
        isRecoiling: this.isCurrentlyRecoiling,
      };
    }

    const rect = treeEl.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return {
        x: rawX + this.recoilX,
        y: rawY + this.recoilY,
        isColliding: false,
        isRecoiling: this.isCurrentlyRecoiling,
      };
    }

    const screenPolygon = denormalizePolygon(DEFAULT_TRUNK_POLYGON, rect);
    const collision = resolveTrunkCollision(rawX, rawY, screenPolygon, 6);

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

    if (collision.isColliding) {
      // High-speed strike triggers rebound
      const canRebound = now - this.lastReboundTime > this.cooldownMs;
      if (viewportSpeedFraction >= this.speedThreshold && canRebound) {
        this.triggerRebound(collision.normal, collision.clampedX, collision.clampedY, now);
      }
    }

    return {
      x: collision.clampedX + this.recoilX,
      y: collision.clampedY + this.recoilY,
      isColliding: collision.isColliding,
      isRecoiling: this.isCurrentlyRecoiling,
    };
  }

  /**
   * Imparts an elastic spring impulse away from the trunk surface.
   */
  public triggerRebound(
    normal: Point2D,
    impactX: number,
    impactY: number,
    timestamp: number
  ): void {
    this.lastReboundTime = timestamp;
    this.isCurrentlyRecoiling = true;

    // Normal points outward from trunk; throw katana back along normal
    const impulse = this.recoilImpulse;
    const nx = normal.x !== 0 || normal.y !== 0 ? normal.x : -1;
    const ny = normal.x !== 0 || normal.y !== 0 ? normal.y : -0.5;

    this.recoilX = nx * impulse;
    this.recoilY = ny * impulse;

    this.onReboundCallback?.({ x: nx, y: ny }, impactX, impactY);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      // Dislodge extra petals from the tree
      const strikeEvt = new CustomEvent('sakura-tree-strike', {
        detail: { x: impactX, y: impactY, count: 65 },
      });
      window.dispatchEvent(strikeEvt);

      // Trigger blade clash spark effect
      const clashEvt = new CustomEvent('katana-clash', {
        detail: { x: impactX, y: impactY, normal: { x: nx, y: ny } },
      });
      window.dispatchEvent(clashEvt);
    }
  }

  /**
   * Advances the spring simulation by one frame.
   * Returns true if recoil is still active.
   */
  public stepSpring(): boolean {
    if (!this.isCurrentlyRecoiling) return false;

    this.recoilX *= this.damping;
    this.recoilY *= this.damping;

    if (Math.hypot(this.recoilX, this.recoilY) < 0.6) {
      this.recoilX = 0;
      this.recoilY = 0;
      this.isCurrentlyRecoiling = false;
      return false;
    }

    return true;
  }

  public getRecoilOffset(): Point2D {
    return { x: this.recoilX, y: this.recoilY };
  }

  public reset(): void {
    this.recoilX = 0;
    this.recoilY = 0;
    this.isCurrentlyRecoiling = false;
    this.lastReboundTime = 0;
  }
}
