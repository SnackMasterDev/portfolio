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

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function lerpAngleDegrees(start: number, end: number, factor: number): number {
  let diff = (end - start) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return start + diff * factor;
}
