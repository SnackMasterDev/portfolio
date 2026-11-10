import React from 'react';
import { useKatanaMotion } from './useKatanaMotion';
import type { KatanaMotionConfig, CursorVariant } from '../../engine/cursor/types';
import { KatanaSvgContent } from './KatanaSvgContent';

export interface KatanaCursorProps {
  className?: string;
  config?: KatanaMotionConfig;
}

export const KatanaCursor: React.FC<KatanaCursorProps> = ({ className, config }) => {
  const { x, y, angle, isVisible, variant } = useKatanaMotion(config);

  // No renderizar el cursor katana si el dispositivo no soporta hover o no tiene puntero fino (móviles/táctiles)
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const isTouchOnly = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchOnly) {
      return null;
    }
  }

  const isText = variant === 'text';

  // En text: estrictamente 0deg (recto en vertical). En pointer y default: sigue la inercia angular
  const displayAngle = isText ? 0 : angle;

  // Centro de rotación y anclaje: En text se centra en el báculo (27, 27); en pointer y default en la tsuba (18, 38)
  const originX = isText ? 27 : 18;
  const originY = isText ? 27 : 38;

  return (
    <div
      aria-hidden="true"
      data-testid="katana-cursor"
      data-variant={variant}
      className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className ?? ''}`}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) translate(-${originX}px, -${originY}px) rotate(${displayAngle}deg) ${
          variant === 'pointer'
            ? 'scale(1.15)'
            : variant === 'clicking'
            ? 'scale(0.92)'
            : 'scale(1)'
        }`,
        transformOrigin: `${originX}px ${originY}px`,
        transition: 'opacity 0.15s ease',
      }}
    >
      <svg
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={getVariantFilter(variant)}
      >
        <KatanaSvgContent variant={variant} />
      </svg>
    </div>
  );
};

function getVariantFilter(variant: CursorVariant): string {
  switch (variant) {
    case 'pointer':
      return 'drop-shadow-[0_2px_8px_rgba(244,63,94,0.65)] drop-shadow-[0_0_2px_rgba(24,24,27,0.85)]';
    case 'text':
      return 'drop-shadow-[0_2px_8px_rgba(56,189,248,0.7)] drop-shadow-[0_0_2px_rgba(24,24,27,0.85)]';
    case 'clicking':
      return 'drop-shadow-[0_2px_12px_rgba(244,63,94,0.9)] brightness-110';
    default:
      return 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] drop-shadow-[0_0_1px_rgba(24,24,27,0.9)]';
  }
}

export default KatanaCursor;
