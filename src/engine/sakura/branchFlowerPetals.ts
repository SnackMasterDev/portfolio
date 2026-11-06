import type { CanvasDimensions, SakuraConfig, Petal } from '../types';
import { createPetal } from './PetalSimulation';

export interface FlowerBlossomZone {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

// Zonas exactas de flores en las ramas del árbol (normalizadas en % del contenedor 1392x752)
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
 * Crea un pétalo desprendido de una flor de las ramas del árbol de cerezo.
 * Cae directamente hacia abajo flotando con la brisa en lugar de proyectarse de la espada.
 */
export function createFlowerPetal(
  originX: number,
  originY: number,
  config: SakuraConfig
): Petal {
  const p = createPetal({ width: 800, height: 600 }, config);
  p.x = originX + (Math.random() - 0.5) * 24;
  p.y = originY + (Math.random() - 0.5) * 16;
  p.speedX = -20 + Math.random() * 65; // Deriva suave lateral
  p.speedY = 25 + Math.random() * 60;  // Velocidad de caída hacia abajo
  p.flipSpeed = 2.4 + Math.random() * 2.0;
  p.rotationSpeed = (Math.random() - 0.5) * 2.5;
  p.isBurst = true;
  return p;
}

/**
 * Genera pétalos distribuidos uniformemente a lo largo de las flores de las ramas.
 */
export function spawnBranchFlowerPetals(
  treeRect: DOMRect | null,
  scrollY: number,
  dimensions: CanvasDimensions,
  count: number,
  config: SakuraConfig
): Petal[] {
  const petals: Petal[] = [];
  const zones = FLOWER_BLOSSOM_ZONES;

  for (let i = 0; i < count; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const flowerX = treeRect
      ? treeRect.left + (zone.xMin + Math.random() * (zone.xMax - zone.xMin)) * treeRect.width
      : dimensions.width * (zone.xMin + Math.random() * (zone.xMax - zone.xMin));
    const flowerY = treeRect
      ? treeRect.top + scrollY + (zone.yMin + Math.random() * (zone.yMax - zone.yMin)) * treeRect.height
      : dimensions.height * (zone.yMin + Math.random() * (zone.yMax - zone.yMin)) + scrollY;

    petals.push(createFlowerPetal(flowerX, flowerY, config));
  }

  return petals;
}
