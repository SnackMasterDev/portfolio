import { useState, useEffect } from 'react';
import type { CursorState, KatanaMotionConfig } from '../../engine/cursor/types';
import {
  calculateAngleDegrees,
  calculateSpeed,
  lerpAngleDegrees,
} from '../../engine/cursor/kinematics';

export function setupKatanaMotionListener(
  onUpdate: (state: CursorState) => void,
  config?: KatanaMotionConfig
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (typeof document !== 'undefined' && document.body?.classList) {
    document.body.classList.add('cursor-none');
  }

  const lerpFactor = config?.lerpFactor ?? 0.35;
  const threshold = config?.minMovementThreshold ?? 1.5;
  const isReducedMotion = config?.prefersReducedMotion === true;

  let isFirstMove = true;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let currentAngle = 0;
  let currentSpeed = 0;
  let rafId: number | null = null;
  let pendingEvent: { clientX: number; clientY: number } | null = null;

  const processMotion = () => {
    rafId = null;
    if (!pendingEvent) return;

    const { clientX, clientY } = pendingEvent;
    const now = performance.now();

    if (isFirstMove) {
      isFirstMove = false;
      lastX = clientX;
      lastY = clientY;
      lastTime = now;
      onUpdate({
        x: lastX,
        y: lastY,
        angle: isReducedMotion ? 0 : currentAngle,
        speed: 0,
        isVisible: true,
      });
      return;
    }

    const dtSeconds = lastTime > 0 ? (now - lastTime) / 1000 : 0.016;
    const dx = clientX - lastX;
    const dy = clientY - lastY;
    const dist = Math.hypot(dx, dy);

    if (dist >= threshold) {
      if (!isReducedMotion) {
        const targetAngle = calculateAngleDegrees(dx, dy);
        currentAngle = lerpAngleDegrees(currentAngle, targetAngle, lerpFactor);
      } else {
        currentAngle = 0;
      }
      currentSpeed = calculateSpeed(dx, dy, dtSeconds);
    }

    lastX = clientX;
    lastY = clientY;
    lastTime = now;

    onUpdate({
      x: lastX,
      y: lastY,
      angle: isReducedMotion ? 0 : currentAngle,
      speed: currentSpeed,
      isVisible: true,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    pendingEvent = { clientX: e.clientX, clientY: e.clientY };
    if (rafId === null) {
      rafId = window.requestAnimationFrame(processMotion);
    }
  };

  const handleMouseLeave = () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingEvent = null;
    isFirstMove = true;
    currentSpeed = 0;
    onUpdate({
      x: lastX,
      y: lastY,
      angle: isReducedMotion ? 0 : currentAngle,
      speed: 0,
      isVisible: false,
    });
  };

  const handleMouseEnter = () => {
    onUpdate({
      x: lastX,
      y: lastY,
      angle: isReducedMotion ? 0 : currentAngle,
      speed: currentSpeed,
      isVisible: true,
    });
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('mouseenter', handleMouseEnter);

  return () => {
    if (typeof document !== 'undefined' && document.body?.classList) {
      document.body.classList.remove('cursor-none');
    }
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingEvent = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('mouseenter', handleMouseEnter);
  };
}

export function useKatanaMotion(config?: KatanaMotionConfig): CursorState {
  const [state, setState] = useState<CursorState>({
    x: -100,
    y: -100,
    angle: 0,
    speed: 0,
    isVisible: false,
  });

  const lerpFactor = config?.lerpFactor;
  const minMovementThreshold = config?.minMovementThreshold;
  const prefersReducedMotion = config?.prefersReducedMotion;

  useEffect(() => {
    return setupKatanaMotionListener(setState, {
      lerpFactor,
      minMovementThreshold,
      prefersReducedMotion,
    });
  }, [lerpFactor, minMovementThreshold, prefersReducedMotion]);

  return state;
}
