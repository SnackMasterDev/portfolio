import type { Petal, SlashEventDetail } from '../types';

function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const abx = bx - ax;
  const aby = by - ay;
  const lenSq = abx * abx + aby * aby;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const apx = px - ax;
  const apy = py - ay;
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / lenSq));
  const cx = ax + t * abx;
  const cy = ay + t * aby;
  return Math.hypot(px - cx, py - cy);
}

/**
 * Applies expansive shockwave and directional aerodynamic wake to petals on a slash.
 */
export function applyWindSlash(
  petals: Petal[],
  detail: SlashEventDetail,
  scrollY: number = 0,
  length = 380,
  halfWidth = 220
): void {
  const rad = (detail.angle * Math.PI) / 180;
  const fwdX = Math.cos(rad);
  const fwdY = Math.sin(rad);
  const normX = -fwdY;
  const normY = fwdX;
  const speedFactor = Math.min(Math.max(detail.speed / 260, 1), 4.5);
  const hasSegment = detail.startX !== undefined && detail.startY !== undefined;

  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    const screenY = p.y - scrollY;
    const dx = p.x - detail.x;
    const dy = screenY - detail.y;
    const distToSlash = Math.hypot(dx, dy);

    const dBack = -(dx * fwdX + dy * fwdY);
    const dSide = dx * normX + dy * normY;

    // Abarca pétalos en el radio de choque, en la estela cónica o a lo largo de todo el trazo de la espada
    const inShockwave = distToSlash <= 260;
    const inDirectionalWake =
      dBack >= -100 &&
      dBack <= length &&
      Math.abs(dSide) <= halfWidth * Math.max((dBack + 100) / (length + 100), 0.35);

    const inStrokePath = hasSegment
      ? distToSegment(p.x, screenY, detail.startX!, detail.startY!, detail.x, detail.y) <= 220
      : false;

    if (inShockwave || inDirectionalWake || inStrokePath) {
      const proximity = inShockwave
        ? 1 - distToSlash / 260
        : inStrokePath
        ? 0.85
        : 1 - Math.abs(dSide) / halfWidth;

      const sideSign = dSide >= 0 ? 1 : dx >= 0 ? 1 : -1;
      const force = (0.7 + 0.3 * proximity) * (520 * speedFactor);

      const wakeX = normX * sideSign * force * 2.4;
      const wakeY = normY * sideSign * force * 2.4;
      const dragX = fwdX * force * 1.2;
      const dragY = fwdY * force * 1.2;

      // Resetea la gravedad pesada para que todos los pétalos (incluidos los de las flores) salgan volando
      p.speedY = -60 + (Math.random() - 0.5) * 40;
      p.speedX = (dx >= 0 ? 1 : -1) * (60 + Math.random() * 80) + fwdX * 90;

      if (p.isResting) {
        p.isResting = false;
        p.opacity = 0.9;
        p.y -= 25;
      }

      p.slashImpulseX = (p.slashImpulseX ?? 0) + wakeX + dragX + (dx >= 0 ? 90 : -90);
      p.slashImpulseY = (p.slashImpulseY ?? 0) + wakeY + dragY - 280;
      p.flipSpeed = 7 + Math.random() * 6;
      p.rotationSpeed = (Math.random() - 0.5) * 22;
    }
  }
}

/**
 * Deflects petals within proximity of the moving katana blade continuously.
 */
export function deflectPetals(
  petals: Petal[],
  bladeX: number,
  bladeY: number,
  bladeVx: number,
  bladeVy: number,
  scrollY = 0,
  bladeReach = 95
): void {
  const speed = Math.hypot(bladeVx, bladeVy);
  if (speed < 0.6) return;

  const normVx = bladeVx / speed;
  const normVy = bladeVy / speed;

  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    const screenY = p.y - scrollY;
    const dx = p.x - bladeX;
    const dy = screenY - bladeY;
    const dist = Math.hypot(dx, dy);

    if (dist < bladeReach && dist > 0.1) {
      const proximity = 1 - dist / bladeReach;
      const push = proximity * (speed * 0.9 + 50);
      const pushX = (dx / dist) * push + normVx * speed * 0.6 * proximity;
      const pushY = (dy / dist) * push + normVy * speed * 0.6 * proximity - 70 * proximity;

      p.slashImpulseX = (p.slashImpulseX ?? 0) + pushX;
      p.slashImpulseY = (p.slashImpulseY ?? 0) + pushY;
      p.speedY = Math.min(p.speedY, 80);
      p.flipSpeed += proximity * 3.5;
      p.rotationSpeed += (Math.random() - 0.5) * proximity * 10;

      if (p.isResting) {
        p.isResting = false;
        p.opacity = 0.9;
        p.y -= 15;
      }
    }
  }
}
