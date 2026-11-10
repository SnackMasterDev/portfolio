import { useState, useEffect } from 'react';
import type { CursorState, CursorVariant, KatanaMotionConfig } from '../../engine/cursor/types';
import {
  calculateAngleDegrees,
  calculateSpeed,
  calculateWindowDistance,
  lerpAngleDegrees,
  type MotionSample,
} from '../../engine/cursor/kinematics';
import { TrunkCollisionManager } from '../../engine/cursor/trunkCollisionPhysics';

export function setupKatanaMotionListener(
  onUpdate: (state: CursorState) => void,
  config?: KatanaMotionConfig
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Si es un dispositivo exclusivamente táctil o sin puntero fino, no activar cursor personalizado
  const isTouchOnly =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isTouchOnly) {
    return () => {};
  }

  if (typeof document !== 'undefined' && document.body?.classList) {
    document.body.classList.add('cursor-none');
  }

  const lerpFactor = config?.lerpFactor ?? 0.35;
  const threshold = config?.minMovementThreshold ?? 1.5;
  const isReducedMotion = config?.prefersReducedMotion === true;

  const collisionManager = new TrunkCollisionManager();

  let isFirstMove = true;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let currentAngle = 0;
  let currentSpeed = 0;
  let currentVariant: CursorVariant = 'default';
  let isClicking = false;
  let rafId: number | null = null;
  let pendingEvent: { clientX: number; clientY: number } | null = null;
  const motionSamples: MotionSample[] = [];
  let lastSlashTime = 0;
  let hasSlashedInCurrentStroke = false;

  const detectVariant = (target: EventTarget | null): CursorVariant => {
    if (isClicking) return 'clicking';
    const el = target as Element | null;
    if (!el || typeof el.closest !== 'function') return 'default';

    if (el.closest('input:not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]')) {
      return 'text';
    }
    if (el.closest('a, button, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer')) {
      return 'pointer';
    }
    return 'default';
  };

  const notifyState = (
    x: number,
    y: number,
    angle: number,
    speed: number,
    isVisible: boolean
  ) => {
    onUpdate({
      x,
      y,
      angle,
      speed,
      isVisible,
      variant: isClicking ? 'clicking' : currentVariant,
    });
  };

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
      motionSamples.push({ x: clientX, y: clientY, time: now });
      notifyState(lastX, lastY, isReducedMotion ? 0 : currentAngle, 0, true);
      return;
    }

    const dtSeconds = lastTime > 0 ? (now - lastTime) / 1000 : 0.016;
    const dx = clientX - lastX;
    const dy = clientY - lastY;
    const dist = Math.hypot(dx, dy);
    const dtSafe = Math.max(dtSeconds, 0.016);

    const vpW = (typeof window !== 'undefined' ? window.innerWidth : 0) || 1200;
    const vpH = (typeof window !== 'undefined' ? window.innerHeight : 0) || 800;

    motionSamples.push({ x: clientX, y: clientY, time: now });

    // Poda de muestras que superan la ventana máxima de medio segundo (500ms)
    while (motionSamples.length > 1 && now - motionSamples[0].time > 500) {
      motionSamples.shift();
    }

    // Cálculo estricto por distancia recorrida en unidades de viewport (1/3s ~ 350ms y 1/2s ~ 500ms)
    // Sin divisiones por tiempo ni fórmulas inestables de píxeles/segundo
    const samples350 = motionSamples.filter((s) => now - s.time <= 350);
    const metrics350 = calculateWindowDistance(samples350, now, 350, vpW, vpH);
    const metrics500 = calculateWindowDistance(motionSamples, now, 500, vpW, vpH);

    const strokeStartX =
      metrics350.viewportDistanceFraction >= 0.50 ? metrics350.startX : metrics500.startX;
    const strokeStartY =
      metrics350.viewportDistanceFraction >= 0.50 ? metrics350.startY : metrics500.startY;

    // Resetea el candado de golpe si el cursor frena/desacelera o transcurren 500ms
    if (dist < 3.0 || now - lastSlashTime >= 500) {
      hasSlashedInCurrentStroke = false;
    }

    if (dist >= threshold) {
      if (!isReducedMotion) {
        const targetAngle = calculateAngleDegrees(dx, dy);
        currentAngle = lerpAngleDegrees(currentAngle, targetAngle, lerpFactor);
      } else {
        currentAngle = 0;
      }
      currentSpeed = calculateSpeed(dx, dy, dtSafe);

      // Activación del corte y colisión por distancia recorrida en unidades de viewport:
      // Requiere al menos 50% de la diagonal del viewport en 1/3s (~350ms) o 1/2s (500ms) como secreto / easter egg
      // Candado estricto: Se activa EXACTAMENTE 1 sola vez por trazo
      const isSlashActivated =
        !hasSlashedInCurrentStroke &&
        (metrics350.viewportDistanceFraction >= 0.50 || metrics500.viewportDistanceFraction >= 0.50) &&
        now - lastSlashTime >= 500;

      if (
        isSlashActivated &&
        typeof window !== 'undefined' &&
        typeof window.dispatchEvent === 'function'
      ) {
        lastSlashTime = now;
        hasSlashedInCurrentStroke = true;

        // Estela de corte y viento: ángulo y distancia exacta desde el inicio del trazo hasta la colisión
        const strokeDist = Math.hypot(clientX - strokeStartX, clientY - strokeStartY);
        const strokeAngle =
          strokeDist > 0.001
            ? (Math.atan2(clientY - strokeStartY, clientX - strokeStartX) * 180) / Math.PI
            : currentAngle;

        const slashEvent = new CustomEvent('katana-slash', {
          detail: {
            x: clientX,
            y: clientY,
            startX: strokeStartX,
            startY: strokeStartY,
            angle: strokeAngle,
            speed: currentSpeed,
            distance: strokeDist,
          },
        });
        window.dispatchEvent(slashEvent);

        // Efecto 2: Si el trazo del corte intersecta o cruza el árbol, activa la sacudida y lluvia de flores
        const hitTree =
          collisionManager.isNearTrunk(clientX, clientY) ||
          collisionManager.isStrokeNearTrunk(motionSamples);

        if (hitTree) {
          const strikeEvt = new CustomEvent('sakura-tree-strike', {
            detail: { x: clientX, y: clientY, count: 22 },
          });
          window.dispatchEvent(strikeEvt);
        }

        // Reinicia las muestras al punto actual para consumir el trazo y evitar disparos dobles/triples
        motionSamples.length = 0;
        motionSamples.push({ x: clientX, y: clientY, time: now });
      }
    }

    lastX = clientX;
    lastY = clientY;
    lastTime = now;

    // Movimiento natural 100% libre y fluido sin interferencias de rebote artificial
    notifyState(
      clientX,
      clientY,
      isReducedMotion ? 0 : currentAngle,
      currentSpeed,
      true
    );
  };

  const handleMouseMove = (e: MouseEvent) => {
    currentVariant = detectVariant(e.target);
    pendingEvent = { clientX: e.clientX, clientY: e.clientY };
    if (rafId === null) {
      rafId = window.requestAnimationFrame(processMotion);
    }
  };

  const handleMouseDown = () => {
    isClicking = true;
    notifyState(lastX, lastY, currentAngle, currentSpeed, true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    isClicking = false;
    currentVariant = detectVariant(e.target);
    notifyState(lastX, lastY, currentAngle, currentSpeed, true);
  };

  const handleMouseLeave = () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    collisionManager.reset();
    hasSlashedInCurrentStroke = false;
    motionSamples.length = 0;
    pendingEvent = null;
    isFirstMove = true;
    notifyState(lastX, lastY, currentAngle, 0, false);
  };

  const handleMouseEnter = () => {
    hasSlashedInCurrentStroke = false;
    motionSamples.length = 0;
    isFirstMove = true;
    notifyState(lastX, lastY, isReducedMotion ? 0 : currentAngle, currentSpeed, true);
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
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
    collisionManager.reset();
    pendingEvent = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
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
    variant: 'default',
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
