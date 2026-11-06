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
  private lastReboundTime = -10000;
  private isCurrentlyRecoiling = false;

  private readonly recoilImpulse: number;
  private readonly damping: number;
  private readonly speedThreshold: number;
  private readonly cooldownMs: number;
  private readonly getTreeEl: () => HTMLElement | null;
  private readonly onReboundCallback?: (normal: Point2D, impactX: number, impactY: number) => void;

  constructor(config?: CollisionManagerConfig) {
    this.recoilImpulse = config?.recoilImpulseDistance ?? 80;
    this.damping = config?.recoilDamping ?? 0.80;
    this.speedThreshold = config?.speedThresholdFraction ?? 0.30;
    this.cooldownMs = config?.reboundCooldownMs ?? 220;
    this.getTreeEl =
      config?.getTreeElement ??
      (() => {
        if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return null;
        return document.getElementById('sakura-tree') ?? document.getElementById('sakura-tree-img');
      });
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
    viewportSpeedFraction: number,
    motionDx = 0,
    motionDy = 0,
    motionDist = 0
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
      // Solo colisiones rápidas en la ventana de tiempo activan el rebote contra el tronco
      const canRebound = now - this.lastReboundTime > this.cooldownMs;
      const isFastStroke = viewportSpeedFraction >= this.speedThreshold && (motionDist === 0 || motionDist >= 15);
      if (isFastStroke && canRebound) {
        this.triggerRebound(collision.normal, collision.clampedX, collision.clampedY, now, motionDx, motionDy);
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
   * Imparts an elastic spring impulse rebounding strictly opposite to the swing direction.
   */
  public triggerRebound(
    normal: Point2D,
    impactX: number,
    impactY: number,
    timestamp: number,
    motionDx = 0,
    motionDy = 0
  ): void {
    this.lastReboundTime = timestamp;
    this.isCurrentlyRecoiling = true;

    const impulse = this.recoilImpulse;
    const motionLen = Math.hypot(motionDx, motionDy);

    let rx: number;
    let ry: number;

    if (motionLen > 0.001) {
      // Rebote hacia el lado contrario exacto de donde venía el golpe
      rx = -motionDx / motionLen;
      ry = -motionDy / motionLen;
    } else {
      rx = normal.x !== 0 || normal.y !== 0 ? normal.x : -1;
      ry = normal.x !== 0 || normal.y !== 0 ? normal.y : -0.5;
    }

    this.recoilX = rx * impulse;
    this.recoilY = ry * impulse;

    this.onReboundCallback?.({ x: rx, y: ry }, impactX, impactY);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      // Dislodge extra petals from the tree
      const strikeEvt = new CustomEvent('sakura-tree-strike', {
        detail: { x: impactX, y: impactY, count: 65 },
      });
      window.dispatchEvent(strikeEvt);

      // Trigger blade clash spark effect
      const clashEvt = new CustomEvent('katana-clash', {
        detail: { x: impactX, y: impactY, normal: { x: rx, y: ry } },
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
    this.lastReboundTime = -10000;
  }
}
