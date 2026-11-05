import React from 'react';
import { useKatanaMotion } from './useKatanaMotion';
import type { KatanaMotionConfig, CursorVariant } from '../../engine/cursor/types';

export interface KatanaCursorProps {
  className?: string;
  config?: KatanaMotionConfig;
}

export const KatanaCursor: React.FC<KatanaCursorProps> = ({ className, config }) => {
  const { x, y, angle, isVisible, variant, isClashing = false } = useKatanaMotion(config);

  const displayAngle = variant === 'text' ? -45 : angle;

  return (
    <div
      aria-hidden="true"
      data-testid="katana-cursor"
      data-variant={variant}
      className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className ?? ''}`}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) translate(-12px, -22px) rotate(${displayAngle}deg) ${
          isClashing
            ? 'scale(1.35)'
            : variant === 'pointer'
            ? 'scale(1.22)'
            : variant === 'clicking'
            ? 'scale(0.92)'
            : 'scale(1)'
        }`,
        transformOrigin: '12px 22px',
        transition: 'transform 0.08s ease-out, opacity 0.15s ease',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${getVariantFilter(variant)} ${isClashing ? 'drop-shadow-[0_0_24px_rgba(251,191,36,1)] brightness-150' : ''}`}
      >
        {/* Chispas de choque metálico contra el tronco */}
        {isClashing && (
          <g stroke="#FDE047" strokeWidth="1.6" strokeLinecap="round">
            <line x1="41" y1="22" x2="47" y2="17" />
            <line x1="41" y1="22" x2="48" y2="22" />
            <line x1="41" y1="22" x2="47" y2="27" />
            <line x1="41" y1="22" x2="38" y2="15" />
            <line x1="41" y1="22" x2="38" y2="29" />
          </g>
        )}

        {/* Filo principal de acero */}
        <path
          d="M16 20.8L35.5 21.2C37.5 21.5 39.5 22 41 22C39.5 22 37.5 22.5 35.5 22.8L16 23.2Z"
          fill={isClashing ? '#FFFBEB' : variant === 'pointer' ? '#FFF1F2' : variant === 'text' ? '#E0F2FE' : '#F1F5F9'}
        />
        <path
          d="M16 21.5L40 22L16 22.5"
          stroke={isClashing ? '#F59E0B' : variant === 'pointer' ? '#F43F5E' : '#FFFFFF'}
          strokeWidth="0.8"
        />

        {/* Destello de punta en modo Pointer (enlaces/botones) */}
        {variant === 'pointer' && !isClashing && (
          <circle cx="40.5" cy="22" r="2" fill="#F43F5E" className="animate-ping" />
        )}

        {/* Habaki (collarín de hoja) */}
        <rect x="13.5" y="20.2" width="2.5" height="3.6" rx="0.5" fill={variant === 'pointer' ? '#FBBF24' : '#F59E0B'} />
        {/* Tsuba (guarda circular) */}
        <ellipse cx="13" cy="22" rx="1.8" ry="4.5" fill="#1E293B" stroke={variant === 'pointer' ? '#FBBF24' : '#F59E0B'} strokeWidth="0.8" />
        {/* Tsuka (empuñadura) */}
        <rect x="3" y="20.5" width="9.5" height="3" rx="0.8" fill="#0F172A" />
        {/* Tsukaito (encordado tradicional) */}
        <line x1="5.5" y1="20.5" x2="4.5" y2="23.5" stroke={variant === 'text' ? '#38BDF8' : '#EF4444'} strokeWidth="0.9" />
        <line x1="8" y1="20.5" x2="7" y2="23.5" stroke={variant === 'text' ? '#38BDF8' : '#EF4444'} strokeWidth="0.9" />
        <line x1="10.5" y1="20.5" x2="9.5" y2="23.5" stroke={variant === 'text' ? '#38BDF8' : '#EF4444'} strokeWidth="0.9" />
      </svg>
    </div>
  );
};

function getVariantFilter(variant: CursorVariant): string {
  switch (variant) {
    case 'pointer':
      return 'drop-shadow-[0_0_14px_rgba(244,63,94,0.95)]';
    case 'text':
      return 'drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]';
    case 'clicking':
      return 'drop-shadow-[0_0_18px_rgba(251,191,36,1)] brightness-125';
    default:
      return 'drop-shadow-[0_0_8px_rgba(243,164,194,0.65)]';
  }
}

export default KatanaCursor;
