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
 * Calculates cumulative and net distance traveled within a calibrated time window (e.g. 350ms or 500ms).
 * Strictly distance-based relative to viewport units (ancho/alto/diagonal) without dividing by time (no px/s spikes).
 */
export function calculateWindowDistance(
  samples: MotionSample[],
  now: number,
  windowMs: number = 350,
  viewportWidth: number = 1200,
  viewportHeight: number = 800
): {
  distance: number;
  viewportDistanceFraction: number;
  pathDistance: number;
  netDisplacement: number;
  dx: number;
  dy: number;
  startX: number;
  startY: number;
} {
  while (samples.length > 1 && now - samples[0].time > windowMs) {
    samples.shift();
  }

  const viewportDiagonal = Math.hypot(viewportWidth, viewportHeight) || 1200;

  if (samples.length < 2) {
    return {
      distance: 0,
      viewportDistanceFraction: 0,
      pathDistance: 0,
      netDisplacement: 0,
      dx: 0,
      dy: 0,
      startX: samples[0]?.x ?? 0,
      startY: samples[0]?.y ?? 0,
    };
  }

  let pathDistance = 0;
  for (let i = 1; i < samples.length; i++) {
    pathDistance += Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y);
  }

  const oldest = samples[0];
  const latest = samples[samples.length - 1];
  const dx = latest.x - oldest.x;
  const dy = latest.y - oldest.y;
  const netDisplacement = Math.hypot(dx, dy);

  // Effective distance traveled represents the intentional directional stroke
  const distance = Math.max(netDisplacement, pathDistance * 0.85);
  const viewportDistanceFraction = distance / viewportDiagonal;

  return {
    distance,
    viewportDistanceFraction,
    pathDistance,
    netDisplacement,
    dx,
    dy,
    startX: oldest.x,
    startY: oldest.y,
  };
}

/**
 * Computes speed fraction of viewport over a calibrated time window (e.g. 350ms or 500ms).
 */
export function calculateWindowSpeed(
  samples: MotionSample[],
  now: number,
  windowMs: number = 350,
  viewportWidth: number = 1200,
  viewportHeight: number = 800
): {
  speedFraction: number;
  distance: number;
  viewportDistanceFraction: number;
  pathDistance: number;
  netDisplacement: number;
  dtSeconds: number;
  dx: number;
  dy: number;
  startX: number;
  startY: number;
} {
  const metrics = calculateWindowDistance(samples, now, windowMs, viewportWidth, viewportHeight);
  if (samples.length < 2) {
    return {
      ...metrics,
      speedFraction: 0,
      dtSeconds: 0,
    };
  }

  const oldest = samples[0];
  const latest = samples[samples.length - 1];
  const dtSeconds = Math.max((latest.time - oldest.time) / 1000, 0.04);
  const speedPxPerSec = metrics.distance / dtSeconds;
  const viewportDiagonal = Math.hypot(viewportWidth, viewportHeight) || 1000;
  const speedFraction = speedPxPerSec / viewportDiagonal;

  return {
    ...metrics,
    speedFraction,
    dtSeconds,
  };
}
