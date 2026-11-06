export interface FlowerBlossomZone {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

// Zonas anatómicas exactas de flores en las ramas del árbol (normalizadas en % del contenedor 1392x752)
export const FLOWER_BLOSSOM_ZONES: FlowerBlossomZone[] = [
  // Rama 4 Copa #1 (Copa izquierda)
  { xMin: 0.14, xMax: 0.38, yMin: 0.12, yMax: 0.30 },
  // Rama 4 Copa #2 (Copa media alta izquierda)
  { xMin: 0.22, xMax: 0.46, yMin: 0.05, yMax: 0.25 },
  // Rama 2 Punta #1 & #2 (Flores superiores de la copa central)
  { xMin: 0.42, xMax: 0.58, yMin: 0.03, yMax: 0.18 },
  { xMin: 0.50, xMax: 0.65, yMin: 0.02, yMax: 0.16 },
  // Rama 4 Copa #3 (Copa derecha alta)
  { xMin: 0.60, xMax: 0.84, yMin: 0.08, yMax: 0.30 },
  // Rama 1 Media #1 (Flores derecha)
  { xMin: 0.70, xMax: 0.90, yMin: 0.22, yMax: 0.42 },
  // Rama 1 Media #2 (Flores centro-izquierda)
  { xMin: 0.36, xMax: 0.58, yMin: 0.20, yMax: 0.38 },
  // Rama 3 Larga (Flores rama larga izquierda)
  { xMin: 0.20, xMax: 0.42, yMin: 0.16, yMax: 0.32 },
];

/**
 * Obtiene coordenadas aleatorias situadas sobre las flores de las ramas del cerezo.
 */
export function sampleFlowerBlossomPosition(
  treeBounds?: { x: number; y: number; width: number; height: number },
  defaultDimensions?: { width: number; height: number }
): { x: number; y: number } {
  const zones = FLOWER_BLOSSOM_ZONES;
  const zone = zones[Math.floor(Math.random() * zones.length)];

  if (treeBounds) {
    return {
      x: treeBounds.x + (zone.xMin + Math.random() * (zone.xMax - zone.xMin)) * treeBounds.width,
      y: treeBounds.y + (zone.yMin + Math.random() * (zone.yMax - zone.yMin)) * treeBounds.height,
    };
  }

  const w = defaultDimensions?.width || 1200;
  const h = defaultDimensions?.height || 800;
  return {
    x: w * (zone.xMin + Math.random() * (zone.xMax - zone.xMin)),
    y: h * (zone.yMin + Math.random() * (zone.yMax - zone.yMin)),
  };
}
