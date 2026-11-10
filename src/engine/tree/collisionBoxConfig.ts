import { DEFAULT_TRUNK_POLYGON, type Point2D } from './trunkHitbox';

export interface PolygonHitboxConfig {
  points: Point2D[];    // Puntos normalizados del polígono [0, 1]
  tolerancePx: number;  // Margen de colisión en px
  enabled: boolean;     // Si la colisión personalizada está activa
  visible: boolean;     // Si el borde rojo es visible
  editMode: boolean;    // Si el modo pluma / edición de vértices está activo
}

export const DEFAULT_POLYGON_CONFIG: PolygonHitboxConfig = {
  points: DEFAULT_TRUNK_POLYGON.map((p) => ({ ...p })),
  tolerancePx: 45,
  enabled: true,
  visible: false,
  editMode: false,
};

const STORAGE_KEY = 'portfolio_sakura_polygon_hitbox';
let currentConfig: PolygonHitboxConfig = initConfig();
const listeners = new Set<(cfg: PolygonHitboxConfig) => void>();

function initConfig(): PolygonHitboxConfig {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      ...DEFAULT_POLYGON_CONFIG,
      points: DEFAULT_TRUNK_POLYGON.map((p) => ({ ...p })),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        ...DEFAULT_POLYGON_CONFIG,
        points: DEFAULT_TRUNK_POLYGON.map((p) => ({ ...p })),
      };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_POLYGON_CONFIG,
      ...parsed,
      points: Array.isArray(parsed.points) && parsed.points.length >= 3
        ? parsed.points
        : DEFAULT_TRUNK_POLYGON.map((p) => ({ ...p })),
    };
  } catch {
    return {
      ...DEFAULT_POLYGON_CONFIG,
      points: DEFAULT_TRUNK_POLYGON.map((p) => ({ ...p })),
    };
  }
}

export function getCollisionConfig(): PolygonHitboxConfig {
  return currentConfig;
}

export function updateCollisionConfig(partial: Partial<PolygonHitboxConfig>): void {
  currentConfig = { ...currentConfig, ...partial };
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          points: currentConfig.points,
          tolerancePx: currentConfig.tolerancePx,
          enabled: currentConfig.enabled,
          visible: currentConfig.visible,
        })
      );
    } catch {
      // Ignorar fallos de almacenamiento
    }
  }
  listeners.forEach((listener) => listener(currentConfig));
}

export function updatePoint(index: number, newPoint: Point2D): void {
  if (index < 0 || index >= currentConfig.points.length) return;
  const newPoints = [...currentConfig.points];
  newPoints[index] = {
    x: Math.max(0, Math.min(1, Number(newPoint.x.toFixed(4)))),
    y: Math.max(0, Math.min(1, Number(newPoint.y.toFixed(4)))),
  };
  updateCollisionConfig({ points: newPoints });
}

export function addPoint(newPoint: Point2D, insertAfterIndex?: number): void {
  const p = {
    x: Math.max(0, Math.min(1, Number(newPoint.x.toFixed(4)))),
    y: Math.max(0, Math.min(1, Number(newPoint.y.toFixed(4)))),
  };
  const newPoints = [...currentConfig.points];
  if (typeof insertAfterIndex === 'number' && insertAfterIndex >= 0 && insertAfterIndex < newPoints.length) {
    newPoints.splice(insertAfterIndex + 1, 0, p);
  } else {
    newPoints.push(p);
  }
  updateCollisionConfig({ points: newPoints });
}

export function removePoint(index: number): void {
  if (currentConfig.points.length <= 3) return; // Mínimo 3 puntos para un polígono válido
  if (index < 0 || index >= currentConfig.points.length) return;
  const newPoints = currentConfig.points.filter((_, i) => i !== index);
  updateCollisionConfig({ points: newPoints });
}

export function resetCollisionConfig(): void {
  updateCollisionConfig({
    points: DEFAULT_TRUNK_POLYGON.map((p) => ({ ...p })),
    tolerancePx: 45,
    enabled: true,
    visible: true,
  });
}

export function subscribeCollisionConfig(listener: (cfg: PolygonHitboxConfig) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCollisionPolygon(): Point2D[] {
  return currentConfig.points;
}
