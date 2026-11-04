import type { CanvasDimensions, SakuraConfig, Petal } from '../types';

let nextPetalId = 1;

export const SAKURA_PAIRS: { face: string; back: string }[] = [
  { face: '#f7b8d0', back: '#be185d' },
  { face: '#ee91b8', back: '#9d174d' },
  { face: '#f6a9c7', back: '#b91c1c' },
  { face: '#ff85a2', back: '#881337' },
  { face: '#fad0df', back: '#a21caf' },
  { face: '#fbcfe8', back: '#9f1239' },
];

export const SAKURA_PALETTE = SAKURA_PAIRS.map((p) => p.face);

/**
 * Creates a new petal instance initialized with random properties within config boundaries.
 */
export function createPetal(
  dimensions: CanvasDimensions,
  config: SakuraConfig,
  initialProgress?: number
): Petal {
  const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
  const pairIndex = Math.floor(Math.random() * SAKURA_PAIRS.length);
  const pair = SAKURA_PAIRS[pairIndex];
  const colors = config.colors?.length ? config.colors : SAKURA_PALETTE;
  const color = colors.includes(pair.face) ? pair.face : colors[Math.floor(Math.random() * colors.length)];

  let spawnX = Math.random() * (dimensions.width || 800);
  let spawnY = -size - Math.random() * 50;

  if (initialProgress !== undefined) {
    spawnY = initialProgress * (dimensions.height || 600);
  } else if (config.treeBounds) {
    spawnX = config.treeBounds.x + Math.random() * config.treeBounds.width;
    spawnY = config.treeBounds.y + Math.random() * (config.treeBounds.height * 0.5);
  }

  const petal: Petal = {
    id: nextPetalId++,
    x: spawnX,
    y: spawnY,
    size,
    speedY: config.minSpeedY + Math.random() * (config.maxSpeedY - config.minSpeedY),
    speedX: (Math.random() - 0.5) * 20,
    rotation: (Math.random() - 0.5) * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 1.5,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 1.5 + Math.random() * 2.5,
    oscillationPhase: Math.random() * Math.PI * 2,
    oscillationSpeed: 1.5 + Math.random() * 2,
    opacity: 0.85 + Math.random() * 0.15,
    color,
    backColor: pair.back,
  };

  return petal;
}

/**
 * Creates an energetic burst petal expelled from the cherry tree when struck.
 */
export function createBurstPetal(
  originX: number,
  originY: number,
  config: SakuraConfig
): Petal {
  const p = createPetal({ width: 800, height: 600 }, config);
  p.x = originX + (Math.random() - 0.5) * 80;
  p.y = originY + (Math.random() - 0.5) * 50;
  p.speedX = (Math.random() - 0.5) * 160;
  p.speedY = -30 + Math.random() * 90;
  p.flipSpeed = 3.5 + Math.random() * 4.5;
  p.rotationSpeed = (Math.random() - 0.5) * 3.5;
  p.isBurst = true;
  return p;
}

/**
 * Resets an existing petal's state to spawn smoothly above the viewport top or from the tree.
 */
export function recyclePetal(
  petal: Petal,
  dimensions: CanvasDimensions,
  config: SakuraConfig
): void {
  const pairIndex = Math.floor(Math.random() * SAKURA_PAIRS.length);
  const pair = SAKURA_PAIRS[pairIndex];
  const colors = config.colors?.length ? config.colors : SAKURA_PALETTE;

  petal.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
  petal.color = colors.includes(pair.face) ? pair.face : colors[Math.floor(Math.random() * colors.length)];
  petal.backColor = pair.back;

  if (config.treeBounds) {
    petal.x = config.treeBounds.x + Math.random() * config.treeBounds.width;
    petal.y = config.treeBounds.y + Math.random() * (config.treeBounds.height * 0.5);
  } else {
    petal.x = Math.random() * (dimensions.width || 800);
    petal.y = -petal.size - Math.random() * 40;
  }

  petal.speedY = config.minSpeedY + Math.random() * (config.maxSpeedY - config.minSpeedY);
  petal.speedX = (Math.random() - 0.5) * 20;
  petal.rotation = (Math.random() - 0.5) * Math.PI;
  petal.rotationSpeed = (Math.random() - 0.5) * 1.5;
  petal.flip = Math.random() * Math.PI * 2;
  petal.opacity = 0.85 + Math.random() * 0.15;
  petal.isBurst = false;
}

/**
 * Advances physical simulation of a petal by delta-time with fluid non-linear aerodynamics.
 */
export function updatePetal(
  petal: Petal,
  dt: number,
  dimensions: CanvasDimensions,
  config: SakuraConfig
): void {
  const maxDt = config.maxDeltaTime ?? 0.05;
  const clampedDt = Math.min(Math.max(dt, 0), maxDt);

  petal.oscillationPhase += petal.oscillationSpeed * clampedDt;

  // 3D Angle of attack (normalZ: 1 = flat facing viewer, 0 = edge-on cutting through air)
  const normalZ = Math.cos(petal.flip);
  const flatness = Math.abs(normalZ);

  // Aerodynamic resistance: flat orientation slows fall; edge orientation accelerates
  const dragFactor = 0.55 + 0.45 * (1 - flatness);
  const effectiveSpeedY = petal.speedY * dragFactor;

  // Lateral aerodynamic lift: flat petal glides sideways along its rotational tilt
  const glideLift = Math.sin(petal.rotation) * (flatness * 35);

  // Gentle atmospheric air anomalies (turbulent micro-drafts, not simple static sine)
  const phase = petal.oscillationPhase;
  const microTurbulence = Math.sin(phase * 0.8) * 18 + Math.cos(phase * 1.7 + petal.y * 0.003) * 10;

  petal.x += (petal.speedX + config.wind.x + glideLift + microTurbulence) * clampedDt;
  petal.y += (effectiveSpeedY + config.wind.y) * clampedDt;

  // Fluid tumbling: rotation rate adjusts with drag
  const dynamicFlipRate = petal.flipSpeed * (0.8 + 0.4 * flatness);
  petal.flip += dynamicFlipRate * clampedDt;
  petal.rotation += petal.rotationSpeed * clampedDt;

  // Boundary check: recycle when petal drifts beyond bottom or far off lateral edges
  const lateralMargin = petal.size * 4;
  if (
    petal.y > dimensions.height + petal.size ||
    petal.x < -lateralMargin ||
    petal.x > dimensions.width + lateralMargin
  ) {
    recyclePetal(petal, dimensions, config);
  }
}

/**
 * Renders an organic 3D dual-sided sakura petal with distinct front/back tones and curved vein.
 */
export function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal): void {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);

  // Smooth 3D perspective flip with razor edge
  const normalZ = Math.cos(petal.flip);
  const isFront = normalZ >= 0;
  const flipScale = Math.max(Math.abs(normalZ), 0.12);
  ctx.scale(flipScale, 1);

  // Dual-sided coloration: Front face is radiant sakura; Back face is rich rose/magenta
  ctx.fillStyle = isFront ? petal.color : (petal.backColor || '#9d174d');
  ctx.globalAlpha = petal.opacity * (isFront ? 1.0 : 0.92);
  ctx.shadowColor = isFront ? 'rgba(243, 164, 194, 0.45)' : 'rgba(157, 23, 77, 0.35)';
  ctx.shadowBlur = isFront ? 5 : 3;

  // Organic sakura petal with notch
  const s = petal.size;
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, 0);
  ctx.bezierCurveTo(-s * 0.25, -s * 0.65, s * 0.55, -s * 0.4, s * 0.5, 0);
  ctx.bezierCurveTo(s * 0.25, s * 0.45, -s * 0.25, s * 0.38, -s * 0.5, 0);
  ctx.fill();

  ctx.restore();
}
