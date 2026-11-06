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
  backColor?: string;
  airResistance?: number;
  isBurst?: boolean;
  isResting?: boolean;
  restingLife?: number;
  slashImpulseX?: number;
  slashImpulseY?: number;
  baseSpeedY?: number;
}

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
