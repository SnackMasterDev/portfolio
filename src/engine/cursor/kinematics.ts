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
 * Computes speed fraction of viewport over a calibrated time window (e.g. 250ms = 0.25s).
 */
export function calculateWindowSpeed(
  samples: MotionSample[],
  now: number,
  windowMs: number = 250,
  viewportWidth: number = 1200,
  viewportHeight: number = 800
): { speedFraction: number; distance: number; dtSeconds: number } {
  while (samples.length > 1 && now - samples[0].time > windowMs) {
    samples.shift();
  }

  if (samples.length < 2) {
    return { speedFraction: 0, distance: 0, dtSeconds: 0 };
  }

  const oldest = samples[0];
  const latest = samples[samples.length - 1];
  const dtSeconds = Math.max((latest.time - oldest.time) / 1000, 0.016);
  const dx = latest.x - oldest.x;
  const dy = latest.y - oldest.y;
  const distance = Math.hypot(dx, dy);

  const speedPxPerSec = distance / dtSeconds;
  const viewportDiagonal = Math.hypot(viewportWidth, viewportHeight) || 1000;
  const speedFraction = speedPxPerSec / viewportDiagonal;

  return { speedFraction, distance, dtSeconds };
}
