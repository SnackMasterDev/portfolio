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
        ? 0.9
        : 1 - Math.abs(dSide) / halfWidth;

      const sideSign = dSide >= 0 ? 1 : dx >= 0 ? 1 : -1;
      const force = (0.7 + 0.3 * proximity) * (580 * speedFactor);

      const wakeX = normX * sideSign * force * 2.2;
      const dragX = fwdX * force * 1.4;

      // SIEMPRE impulsa hacia ARRIBA y hacia afuera, NUNCA hacia abajo al suelo
      const wakeY = -Math.abs(normY * sideSign * force * 0.8);
      const dragY = -Math.abs(fwdY * force * 0.4);

      // Resetea velocidad de caída a flotación ascendente
      p.speedY = -90 - Math.random() * 70;
      p.speedX = (dx >= 0 ? 1 : -1) * (90 + Math.random() * 100) + fwdX * 120;

      if (p.isResting) {
        p.isResting = false;
        p.opacity = 0.95;
        p.y -= 35;
      }

      p.slashImpulseX = (p.slashImpulseX ?? 0) + wakeX + dragX + (dx >= 0 ? 140 : -140);
      p.slashImpulseY = (p.slashImpulseY ?? 0) + wakeY + dragY - 380;
      p.flipSpeed = 9 + Math.random() * 7;
      p.rotationSpeed = (Math.random() - 0.5) * 26;
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
  bladeReach = 130
): void {
  const speed = Math.hypot(bladeVx, bladeVy);
  if (speed < 0.8) return;

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
      // Impulso enérgico para que el desplazamiento sea claramente visible
      const push = proximity * (speed * 4.5 + 220);
      const pushX = (dx / dist) * push + normVx * speed * 2.2 * proximity;
      const pushY = (dy / dist) * push * 0.7 + normVy * speed * 1.2 * proximity - (180 + speed * 1.5) * proximity;

      p.slashImpulseX = (p.slashImpulseX ?? 0) + pushX;
      p.slashImpulseY = (p.slashImpulseY ?? 0) + pushY;
      p.speedY = Math.min(p.speedY, 20);
      p.speedX = (dx >= 0 ? 1 : -1) * (50 + Math.random() * 70) + normVx * speed * 0.4;
      p.flipSpeed = 6 + Math.random() * 5;
      p.rotationSpeed = (Math.random() - 0.5) * 14;

      if (p.isResting) {
        p.isResting = false;
        p.opacity = 0.9;
        p.y -= 25;
      }
    }
  }
}
