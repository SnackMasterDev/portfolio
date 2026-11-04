export type CursorVariant = 'default' | 'pointer' | 'text' | 'clicking';

export interface CursorState {
  x: number;
  y: number;
  angle: number; // in degrees
  speed: number; // in px/s
  isVisible: boolean;
  variant: CursorVariant;
}

export interface KatanaMotionConfig {
  lerpFactor?: number;
  minMovementThreshold?: number;
  prefersReducedMotion?: boolean;
}
