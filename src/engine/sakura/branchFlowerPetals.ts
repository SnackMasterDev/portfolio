import type { CanvasDimensions, SakuraConfig, Petal } from '../types';
import { createPetal } from './PetalSimulation';
import { FLOWER_BLOSSOM_ZONES, sampleFlowerBlossomPosition } from './flowerZones';
export type { FlowerBlossomZone } from './flowerZones';
export { FLOWER_BLOSSOM_ZONES, sampleFlowerBlossomPosition };

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
  p.speedX = -20 + Math.random() * 75; // Deriva suave lateral
  p.speedY = 120 + Math.random() * 80; // Peso físico grácil y reactivo al corte del sable: 120..200 px/s
  p.flipSpeed = 3.6 + Math.random() * 2.8;
  p.rotationSpeed = (Math.random() - 0.5) * 3.5;
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
