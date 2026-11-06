/**
 * Pure kinematic calculation utilities for Katana Cursor motion.
 */

export function calculateAngle(dx: number, dy: number): number {
  return Math.atan2(dy, dx);
}

export function calculateAngleDegrees(dx: number, dy: number): number {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function calculateSpeed(dx: number, dy: number, dtSeconds: number): number {
  if (dtSeconds <= 0) return 0;
  const vx = dx / dtSeconds;
  const vy = dy / dtSeconds;
  return Math.hypot(vx, vy);
}

export function calculateViewportSpeedFraction(
  dx: number,
  dy: number,
  dtSeconds: number,
  viewportWidth: number,
  viewportHeight: number
): number {
  const safeDt = Math.max(dtSeconds, 0.016);
  const speedPxPerSec = calculateSpeed(dx, dy, safeDt);
  const viewportDiagonal = Math.hypot(viewportWidth, viewportHeight) || 1000;
  return speedPxPerSec / viewportDiagonal;
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function lerpAngleDegrees(start: number, end: number, factor: number): number {
  let diff = (end - start) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return start + diff * factor;
}

export interface MotionSample {
  x: number;
  y: number;
  time: number;
}

/**
 * Computes speed fraction of viewport over a calibrated time window (e.g. 500ms = 0.5s).
 */
export function calculateWindowSpeed(
  samples: MotionSample[],
  now: number,
  windowMs: number = 500,
  viewportWidth: number = 1200,
  viewportHeight: number = 800
): {
  speedFraction: number;
  distance: number;
  dtSeconds: number;
  dx: number;
  dy: number;
  startX: number;
  startY: number;
} {
  while (samples.length > 1 && now - samples[0].time > windowMs) {
    samples.shift();
  }

  if (samples.length < 2) {
    return { speedFraction: 0, distance: 0, dtSeconds: 0, dx: 0, dy: 0, startX: 0, startY: 0 };
  }

  const latest = samples[samples.length - 1];

  // Identifica el inicio del movimiento activo dentro de la ventana (descarta reposo previo)
  let activeStartIdx = 0;
  for (let i = samples.length - 2; i >= 0; i--) {
    const s = samples[i];
    const prev = i > 0 ? samples[i - 1] : s;
    const stepDist = Math.hypot(s.x - prev.x, s.y - prev.y);
    const stepDt = (s.time - prev.time) / 1000;
    if (stepDist < 2 && stepDt > 0.04) {
      activeStartIdx = i;
      break;
    }
  }

  const oldest = samples[activeStartIdx];
  const dtSeconds = Math.max((latest.time - oldest.time) / 1000, 0.04);
  const dx = latest.x - oldest.x;
  const dy = latest.y - oldest.y;
  const distance = Math.hypot(dx, dy);

  let pathDistance = 0;
  for (let i = activeStartIdx + 1; i < samples.length; i++) {
    pathDistance += Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y);
  }
  const effectiveDistance = Math.max(distance, pathDistance * 0.85);

  const speedPxPerSec = effectiveDistance / dtSeconds;
  const viewportDiagonal = Math.hypot(viewportWidth, viewportHeight) || 1000;
  const speedFraction = speedPxPerSec / viewportDiagonal;

  return {
    speedFraction,
    distance: effectiveDistance,
    dtSeconds,
    dx,
    dy,
    startX: oldest.x,
    startY: oldest.y,
  };
}
