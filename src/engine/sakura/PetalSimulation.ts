import type { CanvasDimensions, SakuraConfig, Petal } from '../types';

let nextPetalId = 1;

/**
 * Creates a new petal instance initialized with random properties within config boundaries.
 */
export function createPetal(
  dimensions: CanvasDimensions,
  config: SakuraConfig,
  initialProgress?: number
): Petal {
  const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
  const color = config.colors[Math.floor(Math.random() * config.colors.length)] || '#ffd1dc';

  const petal: Petal = {
    id: nextPetalId++,
    x: Math.random() * (dimensions.width + 40) - 20,
    y: initialProgress !== undefined
      ? initialProgress * dimensions.height
      : -size - Math.random() * 40,
    size,
    speedY: config.minSpeedY + Math.random() * (config.maxSpeedY - config.minSpeedY),
    speedX: (Math.random() - 0.5) * 15,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 1.2,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 1 + Math.random() * 2,
    oscillationPhase: Math.random() * Math.PI * 2,
    oscillationSpeed: 1.2 + Math.random() * 1.8,
    opacity: 0.6 + Math.random() * 0.35,
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
  petal.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
  petal.x = Math.random() * (dimensions.width + 60) - 30;
  petal.y = -petal.size - Math.random() * 30;
  petal.speedY = config.minSpeedY + Math.random() * (config.maxSpeedY - config.minSpeedY);
  petal.speedX = (Math.random() - 0.5) * 15;
  petal.rotation = Math.random() * Math.PI * 2;
  petal.rotationSpeed = (Math.random() - 0.5) * 1.2;
  petal.flip = Math.random() * Math.PI * 2;
  petal.flipSpeed = 1 + Math.random() * 2;
  petal.oscillationPhase = Math.random() * Math.PI * 2;
  petal.oscillationSpeed = 1.2 + Math.random() * 1.8;
  petal.opacity = 0.6 + Math.random() * 0.35;
  petal.color = config.colors[Math.floor(Math.random() * config.colors.length)] || '#ffd1dc';
}

/**
 * Updates physics, dual harmonic sway, 3D flip, and boundary recycling for a petal.
 */
export function updatePetal(
  petal: Petal,
  dt: number,
  dimensions: CanvasDimensions,
  config: SakuraConfig
): void {
  const maxDt = config.maxDeltaTime > 0 ? config.maxDeltaTime : 0.05;
  const clampedDt = Math.min(Math.max(dt, 0), maxDt);

  // Dual sinusoidal oscillation in X axis for natural breeze sway
  petal.oscillationPhase += petal.oscillationSpeed * clampedDt;
  const primarySway = Math.sin(petal.oscillationPhase) * 22;
  const secondarySway = Math.sin(petal.oscillationPhase * 0.5) * 9;
  const totalSway = primarySway + secondarySway;

  petal.x += (petal.speedX + config.wind.x + totalSway) * clampedDt;
  petal.y += (petal.speedY + config.wind.y) * clampedDt;

  petal.rotation += petal.rotationSpeed * clampedDt;
  petal.flip += petal.flipSpeed * clampedDt;

  // Boundary check: recycle when petal drifts beyond bottom or far off lateral edges
  const lateralMargin = petal.size * 3;
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

  // Simulated 3D flip around Y axis via horizontal scale
  const flipScale = Math.cos(petal.flip);
  ctx.scale(flipScale, 1);

  ctx.fillStyle = petal.color;
  ctx.globalAlpha = petal.opacity;

  // Organic sakura petal drawn with dual bezier curves and slight tip notch
  const s = petal.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.65, -s * 0.75, s * 0.75, -s * 0.1, s * 0.35, s * 0.65);
  ctx.bezierCurveTo(s * 0.15, s * 0.9, 0, s, 0, s);
  ctx.bezierCurveTo(0, s, -s * 0.15, s * 0.9, -s * 0.35, s * 0.65);
  ctx.bezierCurveTo(-s * 0.75, -s * 0.1, -s * 0.65, -s * 0.75, 0, -s);
  ctx.closePath();

  ctx.fill();
  ctx.restore();
}
