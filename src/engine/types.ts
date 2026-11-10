export interface Vector2D {
  x: number;
  y: number;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export type { RainPetal } from './sakura/sakuraRainEngine';

export interface TreeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SlashEventDetail {
  x: number;
  y: number;
  angle: number;
  speed: number;
  startX?: number;
  startY?: number;
  distance?: number;
}

export interface SakuraConfig {
  petalCount: number;
  minSpeedY: number;
  maxSpeedY: number;
  minSize: number;
  maxSize: number;
  wind: Vector2D;
  colors: string[];
  maxDeltaTime: number;
  prefersReducedMotion?: boolean;
  treeBounds?: TreeBounds;
  groundY?: number;
  maxRestingPetals?: number;
}
