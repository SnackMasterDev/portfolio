import type { Petal, SlashEventDetail } from '../types';

/**
 * Applies expansive shockwave and directional aerodynamic wake to petals on a slash.
 */
export function applyWindSlash(
  petals: Petal[],
  detail: SlashEventDetail,
  scrollY: number = 0,
  length = 360,
  halfWidth = 200
): void {
  const rad = (detail.angle * Math.PI) / 180;
  const fwdX = Math.cos(rad);
  const fwdY = Math.sin(rad);
  const normX = -fwdY;
  const normY = fwdX;
  const speedFactor = Math.min(Math.max(detail.speed / 280, 1), 4.5);

  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    const screenY = p.y - scrollY;
    const dx = p.x - detail.x;
    const dy = screenY - detail.y;
    const distToSlash = Math.hypot(dx, dy);

    const dBack = -(dx * fwdX + dy * fwdY);
    const dSide = dx * normX + dy * normY;

    // Afecta a cualquier pétalo en el radio de choque (240px) o en la estela direccional extendida
    const inShockwave = distToSlash <= 240;
    const inDirectionalWake =
      dBack >= -80 &&
      dBack <= length &&
      Math.abs(dSide) <= halfWidth * Math.max((dBack + 80) / (length + 80), 0.35);

    if (inShockwave || inDirectionalWake) {
      const proximity = inShockwave ? 1 - distToSlash / 240 : 1 - Math.abs(dSide) / halfWidth;
      const sideSign = dSide >= 0 ? 1 : dx >= 0 ? 1 : -1;
      const force = (0.7 + 0.3 * proximity) * (520 * speedFactor);

      const wakeX = normX * sideSign * force * 2.4;
      const wakeY = normY * sideSign * force * 2.4;
      const dragX = fwdX * force * 1.2;
      const dragY = fwdY * force * 1.2;

      // Resetea la gravedad pesada para que todos los pétalos salgan volando
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
