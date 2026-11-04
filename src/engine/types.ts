export interface Vector2D {
  x: number;
  y: number;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  oscillationPhase: number;
  oscillationSpeed: number;
  opacity: number;
  color: string;
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
}
