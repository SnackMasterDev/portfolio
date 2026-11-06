import type { CanvasDimensions, SakuraConfig, Petal, SlashEventDetail } from '../types';
import { sampleFlowerBlossomPosition } from './flowerZones';

let nextPetalId = 1;

export const SAKURA_PAIRS: { face: string; back: string }[] = [
  { face: '#fce7f3', back: '#f472b6' },
  { face: '#fbcfe8', back: '#ec4899' },
  { face: '#f9a8d4', back: '#db2777' },
  { face: '#fdf2f8', back: '#f472b6' },
  { face: '#fad0df', back: '#e879a9' },
  { face: '#fee2e2', back: '#f87171' },
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
    const pos = sampleFlowerBlossomPosition(config.treeBounds);
    spawnX = pos.x;
    spawnY = pos.y;
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
    flipSpeed: 0.9 + Math.random() * 1.3,
    oscillationPhase: Math.random() * Math.PI * 2,
    oscillationSpeed: 1.2 + Math.random() * 1.6,
    opacity: 0.85 + Math.random() * 0.15,
    color,
    backColor: pair.back,
    isResting: false,
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
  p.flipSpeed = 3.2 + Math.random() * 2.5;
  p.rotationSpeed = (Math.random() - 0.5) * 3;
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
    const pos = sampleFlowerBlossomPosition(config.treeBounds);
    petal.x = pos.x;
    petal.y = pos.y;
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
  petal.isResting = false;
  petal.restingLife = 0;
  petal.slashImpulseX = 0;
  petal.slashImpulseY = 0;
}

/**
 * Applies triangular aerodynamic wake behind the katana blade.
 * The triangle apex is at the sword tip (x, y) and widens backward like a boat wake.
 */
export function applyWindSlash(
  petals: Petal[],
  detail: SlashEventDetail,
  scrollY: number = 0,
  length = 260,
  halfWidth = 120
): void {
  const rad = (detail.angle * Math.PI) / 180;
  const fwdX = Math.cos(rad);
  const fwdY = Math.sin(rad);
  const normX = -fwdY;
  const normY = fwdX;
  const speedFactor = Math.min(Math.max(detail.speed / 300, 1), 4);

  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    const screenY = p.y - scrollY;
    const dx = p.x - detail.x;
    const dy = screenY - detail.y;

    const dBack = -(dx * fwdX + dy * fwdY);
    const dSide = dx * normX + dy * normY;

    if (dBack >= -25 && dBack <= length) {
      const progress = (dBack + 25) / (length + 25);
      const localHalfWidth = halfWidth * Math.max(progress, 0.25);

      if (Math.abs(dSide) <= localHalfWidth) {
        const sideSign = dSide >= 0 ? 1 : -1;
        const proximity = 1 - Math.abs(dSide) / localHalfWidth;
        const force = (0.5 + 0.5 * proximity) * (180 * speedFactor);

        const wakeX = normX * sideSign * force * 1.6;
        const wakeY = normY * sideSign * force * 1.6;
        const dragX = -fwdX * force * 0.35;
        const dragY = -fwdY * force * 0.35;

        if (p.isResting) {
          p.isResting = false;
          p.opacity = 0.9;
          p.speedY = 40 + Math.random() * 40;
        }

        p.slashImpulseX = (p.slashImpulseX ?? 0) + wakeX + dragX;
        p.slashImpulseY = (p.slashImpulseY ?? 0) + wakeY + dragY - 25;
        p.flipSpeed = 4 + Math.random() * 4;
        p.rotationSpeed = (Math.random() - 0.5) * 12;
      }
    }
  }
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

  if (petal.isResting) {
    petal.restingLife = (petal.restingLife ?? 0) + clampedDt;
    if (petal.restingLife > 10) {
      petal.opacity -= clampedDt * 0.15;
      if (petal.opacity <= 0.05) {
        recyclePetal(petal, dimensions, config);
      }
    }
    return;
  }

  if (petal.slashImpulseX) {
    petal.x += petal.slashImpulseX * clampedDt;
    petal.slashImpulseX *= 0.91;
    if (Math.abs(petal.slashImpulseX) < 1) petal.slashImpulseX = 0;
  }
  if (petal.slashImpulseY) {
    petal.y += petal.slashImpulseY * clampedDt;
    petal.slashImpulseY *= 0.91;
    if (Math.abs(petal.slashImpulseY) < 1) petal.slashImpulseY = 0;
  }

  petal.oscillationPhase += petal.oscillationSpeed * clampedDt;

  const normalZ = Math.cos(petal.flip);
  const flatness = Math.abs(normalZ);

  const dragFactor = 0.55 + 0.45 * (1 - flatness);
  let effectiveSpeedY = petal.speedY * dragFactor;
  const glideLift = Math.sin(petal.rotation) * (flatness * 30);

  const phase = petal.oscillationPhase;
  const microTurbulence = Math.sin(phase * 0.8) * 15 + Math.cos(phase * 1.7 + petal.y * 0.003) * 8;

  petal.x += (petal.speedX + config.wind.x + glideLift + microTurbulence) * clampedDt;

  // Ground approach & gentle flat landing
  const groundY = config.groundY ?? dimensions.height;
  if (config.groundY !== undefined) {
    const distToGround = groundY - petal.y;
    if (distToGround <= 30 && distToGround > 0) {
      effectiveSpeedY *= Math.max(distToGround / 30, 0.15);
      petal.flipSpeed *= 0.85;
      petal.rotationSpeed *= 0.85;
    } else if (distToGround <= 0) {
      petal.y = groundY;
      petal.isResting = true;
      petal.restingLife = 0;
      petal.speedX = 0;
      petal.speedY = 0;
      petal.rotationSpeed = 0;
      petal.flipSpeed = 0;
      petal.flip = 0;
      petal.rotation = Math.sin(petal.id) * 0.25;
      return;
    }
  }

  petal.y += (effectiveSpeedY + config.wind.y) * clampedDt;

  const dynamicFlipRate = petal.flipSpeed * (0.8 + 0.4 * flatness);
  petal.flip += dynamicFlipRate * clampedDt;
  petal.rotation += petal.rotationSpeed * clampedDt;

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
 * Renders an organic 3D dual-sided sakura petal with distinct front/back tones.
 */
export function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal, renderY?: number): void {
  ctx.save();
  ctx.translate(petal.x, renderY !== undefined ? renderY : petal.y);
  ctx.rotate(petal.rotation);

  const normalZ = petal.isResting ? 1.0 : Math.cos(petal.flip);
  const isFront = normalZ >= 0;
  const flipScale = petal.isResting ? 1.0 : Math.max(Math.abs(normalZ), 0.15);
  ctx.scale(flipScale, 1);

  ctx.fillStyle = isFront ? petal.color : (petal.backColor || '#ec4899');
  ctx.globalAlpha = petal.opacity * (isFront ? 1.0 : 0.9);
  ctx.shadowColor = isFront ? 'rgba(252, 231, 243, 0.45)' : 'rgba(236, 72, 153, 0.35)';
  ctx.shadowBlur = petal.isResting ? 1 : (isFront ? 4 : 2);

  const s = petal.size;
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, 0);
  ctx.bezierCurveTo(-s * 0.25, -s * 0.65, s * 0.55, -s * 0.4, s * 0.5, 0);
  ctx.bezierCurveTo(s * 0.25, s * 0.45, -s * 0.25, s * 0.38, -s * 0.5, 0);
  ctx.fill();

  ctx.restore();
}
