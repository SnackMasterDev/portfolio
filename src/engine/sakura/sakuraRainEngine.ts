import { sampleFlowerBlossomPosition } from './flowerZones';

export interface SakuraPetalPalette {
  name: string;
  frontGradient: readonly [string, string, string];
  frontInner: string;
  backGradient: readonly [string, string];
  backInner: string;
  veinFront: string;
  veinBack: string;
}

/**
 * Variaciones cromáticas botánicas y naturales de Sakura (Flores de Cerezo japonesas):
 * 1. Somei-Yoshino: Rosa perlado suave clásico.
 * 2. Shiro-Sakura: Blanco níveo con rubor sutil en la punta.
 * 3. Beni-Sakura: Carmesí vivo y profundo con reverso escarlata.
 * 4. Kanzan-Sakura: Rosa magenta imperial (Yaezakura de doble floración).
 * 5. Momo-Sakura: Melocotón cálido al amanecer con rubor coral.
 */
export const SAKURA_PETAL_PALETTES: readonly SakuraPetalPalette[] = [
  {
    name: 'Somei-Yoshino (Classic)',
    frontGradient: [
      'rgba(255, 236, 243, 0.97)',
      'rgba(255, 184, 200, 0.95)',
      'rgba(228, 114, 148, 0.97)',
    ],
    frontInner: 'rgba(214, 92, 132, 0.82)',
    backGradient: [
      'rgba(232, 132, 164, 0.96)',
      'rgba(190, 76, 116, 0.98)',
    ],
    backInner: 'rgba(255, 218, 230, 0.88)',
    veinFront: 'rgba(255, 255, 255, 0.72)',
    veinBack: 'rgba(255, 235, 242, 0.55)',
  },
  {
    name: 'Shiro-Sakura (Blanco Nieve)',
    frontGradient: [
      'rgba(255, 255, 255, 0.98)',
      'rgba(255, 228, 236, 0.96)',
      'rgba(244, 167, 187, 0.97)',
    ],
    frontInner: 'rgba(220, 120, 148, 0.78)',
    backGradient: [
      'rgba(247, 182, 198, 0.95)',
      'rgba(217, 107, 138, 0.97)',
    ],
    backInner: 'rgba(255, 240, 245, 0.90)',
    veinFront: 'rgba(255, 255, 255, 0.85)',
    veinBack: 'rgba(255, 245, 248, 0.60)',
  },
  {
    name: 'Beni-Sakura (Carmesí Vivo)',
    frontGradient: [
      'rgba(255, 210, 222, 0.97)',
      'rgba(244, 114, 146, 0.96)',
      'rgba(214, 40, 96, 0.98)',
    ],
    frontInner: 'rgba(175, 24, 76, 0.86)',
    backGradient: [
      'rgba(199, 37, 88, 0.97)',
      'rgba(140, 20, 58, 0.98)',
    ],
    backInner: 'rgba(255, 180, 200, 0.88)',
    veinFront: 'rgba(255, 230, 240, 0.75)',
    veinBack: 'rgba(255, 195, 215, 0.55)',
  },
  {
    name: 'Kanzan-Sakura (Rosa Magenta)',
    frontGradient: [
      'rgba(255, 226, 235, 0.97)',
      'rgba(240, 133, 168, 0.96)',
      'rgba(192, 59, 104, 0.98)',
    ],
    frontInner: 'rgba(165, 38, 82, 0.84)',
    backGradient: [
      'rgba(184, 50, 96, 0.97)',
      'rgba(125, 24, 60, 0.98)',
    ],
    backInner: 'rgba(255, 195, 215, 0.86)',
    veinFront: 'rgba(255, 240, 246, 0.75)',
    veinBack: 'rgba(255, 215, 230, 0.55)',
  },
  {
    name: 'Momo-Sakura (Melocotón Cálido)',
    frontGradient: [
      'rgba(255, 242, 235, 0.97)',
      'rgba(252, 165, 165, 0.95)',
      'rgba(225, 91, 116, 0.97)',
    ],
    frontInner: 'rgba(205, 70, 90, 0.82)',
    backGradient: [
      'rgba(221, 107, 120, 0.96)',
      'rgba(168, 50, 68, 0.98)',
    ],
    backInner: 'rgba(255, 220, 215, 0.88)',
    veinFront: 'rgba(255, 250, 245, 0.75)',
    veinBack: 'rgba(255, 225, 220, 0.55)',
  },
] as const;

export interface RainPetal {
  x: number;
  y: number;
  z: number;
  baseSize: number;
  phase: number;
  phaseSpeed: number;
  yawAngle: number;
  yawSpeed: number;
  swingAmplitude: number;
  baseVy: number;
  windDrift: number;
  paletteIndex?: number;
  landingProgress?: number;
  isResting?: boolean;
  restingAlpha?: number;
  restingRoll?: number;
  restingScaleX?: number;
  restingScaleY?: number;
}

/**
 * Dibujo vectorial 3D con arqueo longitudinal en C (`arch`), torsión asimétrica de puntas en giros (`curl`),
 * reborde cóncavo de doble cara (anverso/envés) y muesca característica de flor de cerezo.
 */
export function drawSakuraPetal(
  ctx: CanvasRenderingContext2D,
  size: number,
  isUnderside: boolean,
  _camberBend: number,
  scaleY = isUnderside ? -0.42 : 0.42,
  arch = 0.48,
  curl = 0.15,
  palette: SakuraPetalPalette = SAKURA_PETAL_PALETTES[0]
): void {
  const signY = isUnderside ? -1 : 1;
  const effAbsSy = Math.max(0.08, Math.abs(scaleY));
  const archComp = signY / effAbsSy;

  const bendY = -arch * size * 0.36 * archComp;
  const twistY = curl * size * 0.22 * archComp;
  const bellyY = arch * size * 0.28 * archComp;
  const lobeSpread = size * 0.14 * signY;

  const stemX = -size * 0.90;
  const stemY = bendY - twistY * 0.50;

  const tipUpperX = size * 0.92;
  const tipUpperY = bendY + twistY * 0.50 - lobeSpread;

  const notchX = size * 0.76;
  const notchY = bendY * 0.92 + twistY * 0.45;

  const tipLowerX = size * 0.92;
  const tipLowerY = bendY + twistY * 0.50 + lobeSpread;

  const topCp1X = -size * 0.32;
  const topCp1Y = -size * 0.74 * signY + bellyY * 0.65;
  const topCp2X = size * 0.38;
  const topCp2Y = -size * 0.80 * signY + bellyY * 0.60 + twistY * 0.35;

  const botCp1X = size * 0.38;
  const botCp1Y = size * 0.80 * signY + bellyY * 1.15 + twistY * 0.35;
  const botCp2X = -size * 0.32;
  const botCp2Y = size * 0.74 * signY + bellyY * 1.15;

  // 1. Silueta principal arqueada del pétalo (vientre exterior + puntas curvadas)
  ctx.beginPath();
  ctx.moveTo(stemX, stemY);
  ctx.bezierCurveTo(topCp1X, topCp1Y, topCp2X, topCp2Y, tipUpperX, tipUpperY);
  ctx.lineTo(notchX, notchY);
  ctx.lineTo(tipLowerX, tipLowerY);
  ctx.bezierCurveTo(botCp1X, botCp1Y, botCp2X, botCp2Y, stemX, stemY);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, -size, 0, size);
  if (isUnderside) {
    grad.addColorStop(0, palette.backGradient[0]);
    grad.addColorStop(1, palette.backGradient[1]);
  } else {
    grad.addColorStop(0, palette.frontGradient[0]);
    grad.addColorStop(0.55, palette.frontGradient[1]);
    grad.addColorStop(1, palette.frontGradient[2]);
  }
  ctx.fillStyle = grad;
  ctx.fill();

  // 2. Cuenco cóncavo interior / pliegue 3D visible al arquearse y girar
  if (Math.abs(arch) > 0.08) {
    const innerCp1X = -size * 0.28;
    const innerCp1Y = size * 0.08 * signY + bellyY * 0.88;
    const innerCp2X = size * 0.32;
    const innerCp2Y = size * 0.10 * signY + bellyY * 0.82 + twistY * 0.30;

    ctx.beginPath();
    ctx.moveTo(stemX, stemY);
    ctx.bezierCurveTo(topCp1X, topCp1Y, topCp2X, topCp2Y, tipUpperX, tipUpperY);
    ctx.lineTo(notchX, notchY);
    ctx.bezierCurveTo(innerCp2X, innerCp2Y, innerCp1X, innerCp1Y, stemX, stemY);
    ctx.closePath();

    ctx.fillStyle = isUnderside ? palette.backInner : palette.frontInner;
    ctx.fill();
  }

  // 3. Nervadura central arqueada siguiendo el volumen del giro
  ctx.strokeStyle = isUnderside ? palette.veinBack : palette.veinFront;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(stemX * 0.84, stemY * 0.82);
  ctx.quadraticCurveTo(
    size * 0.05,
    bellyY * 0.88 + twistY * 0.2,
    notchX * 0.92,
    notchY * 0.90
  );
  ctx.stroke();
}

export const REFERENCE_VIEWPORT_WIDTH = 1392;

/**
 * Factor de escala adaptativo basado en el viewport (curvatura suave para mobile/tablet/desktop/4k).
 * Cumple con la Regla 7 (animaciones y dimensiones físicas ancladas a dimensiones de viewport).
 */
export function getViewportScale(viewportWidth: number): number {
  const safeWidth = Math.max(320, Math.min(3840, viewportWidth || REFERENCE_VIEWPORT_WIDTH));
  return Math.sqrt(safeWidth / REFERENCE_VIEWPORT_WIDTH);
}

/**
 * Calcula el tamaño del pétalo adaptado dinámicamente al tamaño del viewport y la profundidad z.
 */
export function calculateAdaptivePetalSize(viewportWidth: number, depth = 1): number {
  const scale = getViewportScale(viewportWidth);
  const baseReferenceSize = 11 + depth * 7.5;
  return Math.round(baseReferenceSize * scale * 10) / 10;
}

/**
 * Genera el conjunto de pétalos de lluvia: pétalos ambientales distribuidos por toda la página
 * desde el inicio y pétalos originados en las flores del árbol, adaptando escala y dinámicas
 * físicas fluidamente al ancho del viewport.
 */
export function createRainPetals(
  petalCount: number,
  width: number,
  height: number,
  treeBounds?: { x: number; y: number; width: number; height: number },
  options?: { blossomsOnly?: boolean }
): RainPetal[] {
  const scale = getViewportScale(width);
  const blossomsOnly = options?.blossomsOnly ?? false;

  return Array.from({ length: petalCount }, (_, i) => {
    const depth = 0.45 + Math.random() * 0.75;
    const paletteIndex = Math.floor(Math.random() * SAKURA_PETAL_PALETTES.length);
    const baseSize = calculateAdaptivePetalSize(width, depth);

    // Pétalos ambientales iniciales distribuidos por toda la página
    let x = Math.random() * width;
    let y = Math.random() * height;

    // Pétalos nacidos directamente desde las flores de las ramas del árbol
    if (treeBounds && (blossomsOnly || i >= Math.floor(petalCount * 0.5))) {
      const blossom = sampleFlowerBlossomPosition(treeBounds, { width, height });
      x = blossom.x + (Math.random() - 0.5) * 16 * scale;
      y = blossom.y + (Math.random() - 0.5) * 12 * scale;
    }

    return {
      x,
      y,
      z: depth,
      baseSize,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 1.3 + Math.random() * 0.8,
      yawAngle: Math.random() * Math.PI * 2,
      yawSpeed: (Math.random() - 0.5) * 1.2,
      swingAmplitude: (38 + Math.random() * 24) * depth * scale,
      baseVy: (52 + Math.random() * 32) * depth * Math.max(0.75, scale),
      windDrift: (14 + Math.random() * 16) * depth * scale,
      paletteIndex,
      landingProgress: 0,
      isResting: false,
      restingAlpha: 1,
    };
  });
}
