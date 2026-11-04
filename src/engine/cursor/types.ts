export interface CursorState {
  x: number;
  y: number;
  angle: number; // in degrees
  speed: number; // in px/s
  isVisible: boolean;
}

export interface KatanaMotionConfig {
  lerpFactor?: number;
  minMovementThreshold?: number;
  prefersReducedMotion?: boolean;
}
