import type { CanvasDimensions, SakuraConfig, Petal } from '../types';

let nextPetalId = 1;

export const SAKURA_PALETTE = [
  '#f7b8d0',
  '#ee91b8',
  '#f6a9c7',
  '#d96d9b',
  '#fad0df',
  '#ff85a2',
];

/**
 * Creates a new petal instance initialized with random properties within config boundaries.
 */
export function createPetal(
  dimensions: CanvasDimensions,
  config: SakuraConfig,
  initialProgress?: number
): Petal {
  const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
  const colors = config.colors?.length ? config.colors : SAKURA_PALETTE;
  const color = colors[Math.floor(Math.random() * colors.length)];

  const petal: Petal = {
    id: nextPetalId++,
    x: Math.random() * (dimensions.width || 800),
    y: initialProgress !== undefined
      ? initialProgress * (dimensions.height || 600)
      : -size - Math.random() * 50,
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
  };

  return petal;
}

/**
 * Resets an existing petal's state to spawn smoothly above the viewport top.
 */
export function recyclePetal(
  petal: Petal,
  dimensions: CanvasDimensions,
  config: SakuraConfig
): void {
  const colors = config.colors?.length ? config.colors : SAKURA_PALETTE;
  petal.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
  petal.x = Math.random() * (dimensions.width || 800);
  petal.y = -petal.size - Math.random() * 40;
  petal.speedY = config.minSpeedY + Math.random() * (config.maxSpeedY - config.minSpeedY);
  petal.speedX = (Math.random() - 0.5) * 20;
  petal.rotation = (Math.random() - 0.5) * Math.PI;
  petal.rotationSpeed = (Math.random() - 0.5) * 1.5;
  petal.flip = Math.random() * Math.PI * 2;
  petal.color = colors[Math.floor(Math.random() * colors.length)];
  petal.opacity = 0.85 + Math.random() * 0.15;
}

/**
 * Advances physical simulation of a petal by delta-time in seconds.
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

  // Dual harmonic sway
  const primarySway = Math.sin(petal.oscillationPhase) * 24;
  const secondarySway = Math.sin(petal.oscillationPhase * 0.6) * 12;
  const totalSway = primarySway + secondarySway;

  petal.x += (petal.speedX + config.wind.x + totalSway * 0.8) * clampedDt;
  petal.y += (petal.speedY + config.wind.y) * clampedDt;

  petal.rotation += petal.rotationSpeed * clampedDt;
  petal.flip += petal.flipSpeed * clampedDt;

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
 * Renders an organic sakura petal on a 2D canvas context with 3D flip illusion and bezier curves.
 */
export function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal): void {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);

  // Smooth 3D flip between 0.4 and 1.0 to preserve visible petal mass
  const flipScale = 0.45 + Math.abs(Math.cos(petal.flip)) * 0.55;
  ctx.scale(flipScale, 1);

  ctx.fillStyle = petal.color;
  ctx.globalAlpha = petal.opacity;
  ctx.shadowColor = 'rgba(243, 164, 194, 0.4)';
  ctx.shadowBlur = 4;

  // Organic sakura petal with curved notch and soft body
  const s = petal.size;
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, 0);
  ctx.bezierCurveTo(-s * 0.25, -s * 0.65, s * 0.55, -s * 0.4, s * 0.5, 0);
  ctx.bezierCurveTo(s * 0.25, s * 0.45, -s * 0.25, s * 0.38, -s * 0.5, 0);
  ctx.fill();

  ctx.restore();
}
