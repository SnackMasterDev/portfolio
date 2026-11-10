import type { CanvasDimensions } from '../../engine/types';
import { sampleFlowerBlossomPosition } from '../../engine/sakura/flowerZones';
import {
  SAKURA_PETAL_PALETTES,
  calculateAdaptivePetalSize,
  drawSakuraPetal,
  getViewportScale,
  type RainPetal,
} from '../../engine/sakura/sakuraRainEngine';

export interface GroundLandingContext {
  groundY: number;
  scrollY: number;
  dimensions: CanvasDimensions;
  treeBounds?: { x: number; y: number; width: number; height: number };
}

/**
 * Dibuja un pétalo de sakura con transformaciones 3D, inclinación, arqueo y paleta cromática,
 * mapeando sus coordenadas espaciales de página completa al espacio visible del canvas (fixed).
 */
export function drawRainPetalItem(
  ctx: CanvasRenderingContext2D,
  p: RainPetal,
  swingVelocity: number,
  pitchScale: number,
  absPitch: number,
  alpha = 1,
  scrollY = 0
): void {
  // Coordenada Y proyectada en la pantalla: posición física en página menos el scroll actual
  const renderY = p.y - scrollY;

  ctx.save();
  ctx.translate(p.x, renderY);
  if (alpha < 1) {
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  }

  const rollAngle = p.isResting && p.restingRoll !== undefined
    ? p.restingRoll
    : swingVelocity * 0.42 + Math.sin(p.yawAngle) * 0.18;
  ctx.rotate(rollAngle);

  const clampedScaleY = p.isResting && p.restingScaleY !== undefined
    ? p.restingScaleY
    : Math.sign(pitchScale || 1) * Math.max(0.12, absPitch);
  const scaleX = p.isResting && p.restingScaleX !== undefined
    ? p.restingScaleX
    : 0.85 + 0.15 * Math.cos(p.yawAngle);
  ctx.scale(scaleX, clampedScaleY);

  const isUnderside = pitchScale < 0;
  const camberBend = absPitch * p.baseSize * 0.16;
  const dynamicArch = 0.35 + 0.30 * (1 - Math.min(1, absPitch));
  const dynamicCurl = swingVelocity * 0.18;
  const palette =
    SAKURA_PETAL_PALETTES[(p.paletteIndex ?? 0) % SAKURA_PETAL_PALETTES.length] ??
    SAKURA_PETAL_PALETTES[0];

  drawSakuraPetal(
    ctx,
    p.baseSize,
    isUnderside,
    camberBend,
    clampedScaleY,
    dynamicArch,
    dynamicCurl,
    palette
  );
  ctx.restore();
}

/**
 * Resetea y recicla un pétalo en coordenadas globales de documento al nacer desde las flores del árbol,
 * recalculando su tamaño y balance físico aerodinámico para el tamaño actual del viewport.
 */
export function respawnPetal(
  p: RainPetal,
  treeBounds: { x: number; y: number; width: number; height: number } | undefined,
  dimensions: CanvasDimensions
): void {
  const blossom = sampleFlowerBlossomPosition(treeBounds, dimensions);
  const scale = getViewportScale(dimensions.width);

  p.x = blossom.x + (Math.random() - 0.5) * 18 * scale;
  p.y = blossom.y + (Math.random() - 0.5) * 14 * scale;
  p.baseSize = calculateAdaptivePetalSize(dimensions.width, p.z);
  p.swingAmplitude = (38 + Math.random() * 24) * p.z * scale;
  p.windDrift = (14 + Math.random() * 16) * p.z * scale;
  p.baseVy = (52 + Math.random() * 32) * p.z * Math.max(0.75, scale);

  p.paletteIndex = Math.floor(Math.random() * SAKURA_PETAL_PALETTES.length);
  p.phase = Math.random() * Math.PI * 2;
  p.yawAngle = Math.random() * Math.PI * 2;
  p.landingProgress = 0;
  p.isResting = false;
  p.restingAlpha = 1;
  p.restingRoll = undefined;
  p.restingScaleX = undefined;
  p.restingScaleY = undefined;
}

/**
 * Actualiza la física espacial a lo largo de toda la altura del documento,
 * y desacelera fluidamente sobre el footer cuando se llega al suelo.
 */
export function updateAndRenderPetal(
  ctx: CanvasRenderingContext2D,
  p: RainPetal,
  dt: number,
  groundContext: GroundLandingContext
): void {
  const { groundY, scrollY, dimensions, treeBounds } = groundContext;

  // 1. Pétalo ya posado en reposo sobre el suelo (footer)
  if (p.isResting) {
    p.restingAlpha = (p.restingAlpha ?? 1) - 0.18 * dt;
    if ((p.restingAlpha ?? 0) <= 0) {
      respawnPetal(p, treeBounds, dimensions);
    }
    const renderY = p.y - scrollY;
    if (renderY >= -60 && renderY <= dimensions.height + 60) {
      // Dibuja la sombra de contacto en reposo
      ctx.save();
      ctx.fillStyle = `rgba(30, 20, 25, ${(0.14 * (p.restingAlpha ?? 1)).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(
        p.x,
        renderY + p.baseSize * 0.35,
        p.baseSize * 0.9,
        3,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      drawRainPetalItem(ctx, p, 0, p.restingScaleY ?? 0.12, Math.abs(p.restingScaleY ?? 0.12), p.restingAlpha ?? 1, scrollY);
    }
    return;
  }

  // 2. Transición y amortiguación aerodinámica natural al llegar al suelo (footer)
  const distToGround = groundY - p.y;
  if (distToGround <= 65) {
    const t = Math.max(0, Math.min(1, distToGround / 65));
    // Amortiguamiento suave cuadrático: 1 lejos del suelo, 0 al tocar tierra
    const cushion = t * t * (3 - 2 * t);
    p.landingProgress = 1 - cushion;

    // Frenado vertical continuo sin snap: desacelera orgánicamente hacia la superficie
    const pitchScale = Math.sin(p.phase) * cushion + 0.18 * (1 - cushion);
    const absPitch = Math.max(0.12, Math.abs(pitchScale));
    const aerodynamicDrag = 0.4 + 0.6 * (1 - absPitch);

    const fallSpeed = p.baseVy * (0.6 + aerodynamicDrag) * (0.2 + 0.8 * cushion);
    p.y += fallSpeed * dt;

    // Desaceleración horizontal sincronizada
    p.phase += p.phaseSpeed * (0.35 + 0.65 * cushion) * dt;
    p.yawAngle += p.yawSpeed * (0.3 + 0.7 * cushion) * dt;

    const swingVelocity = Math.cos(p.phase) * cushion;
    p.x += (swingVelocity * p.swingAmplitude * 1.5 * cushion + p.windDrift * (0.25 + 0.75 * cushion)) * dt;

    if (distToGround <= 1.2 || p.y >= groundY) {
      p.y = groundY;
      p.isResting = true;
      p.restingAlpha = 1;
      p.landingProgress = 1;
      // Congelar la orientación exacta y escala para garantizar continuidad C1 perfecta
      p.restingRoll = swingVelocity * 0.42 + Math.sin(p.yawAngle) * 0.18;
      p.restingScaleX = 0.85 + 0.15 * Math.cos(p.yawAngle);
      p.restingScaleY = Math.sign(pitchScale || 1) * Math.max(0.12, absPitch);
    }

    const renderY = p.y - scrollY;
    // Solo dibujar si está en el campo de visión del canvas
    if (renderY >= -60 && renderY <= dimensions.height + 60) {
      const shadowFactor = p.landingProgress;
      ctx.save();
      ctx.fillStyle = `rgba(30, 20, 25, ${(0.14 * shadowFactor).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(
        p.x,
        renderY + p.baseSize * 0.35,
        p.baseSize * 0.9 * shadowFactor,
        3 * shadowFactor,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      drawRainPetalItem(ctx, p, swingVelocity, pitchScale, absPitch, 1, scrollY);
    }
    return;
  }

  // 3. Vuelo continuo y aerodinámica Richard Williams por toda la página
  p.phase += p.phaseSpeed * dt;
  p.yawAngle += p.yawSpeed * dt;

  const swingVelocity = Math.cos(p.phase);
  const pitchScale = Math.sin(p.phase);
  const absPitch = Math.abs(pitchScale);

  const aerodynamicDrag = 0.4 + 0.6 * (1 - absPitch);
  p.y += p.baseVy * (0.6 + aerodynamicDrag) * dt;
  p.x += (swingVelocity * p.swingAmplitude * 1.8 + p.windDrift) * dt;

  // Si sobrepasa el suelo o el fondo total de la página, reciclar arriba en el cerezo
  if (p.y > groundY + 40) {
    respawnPetal(p, treeBounds, dimensions);
  }
  if (p.x > dimensions.width + 50) p.x = -40;
  if (p.x < -40) p.x = dimensions.width + 40;

  // Solo renderizar si el pétalo cae dentro del viewport visible actual
  const renderY = p.y - scrollY;
  if (renderY >= -60 && renderY <= dimensions.height + 60) {
    drawRainPetalItem(ctx, p, swingVelocity, pitchScale, absPitch, 1, scrollY);
  }
}
