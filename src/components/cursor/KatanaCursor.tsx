import React from 'react';
import { useKatanaMotion } from './useKatanaMotion';
import type { KatanaMotionConfig } from '../../engine/cursor/types';

export interface KatanaCursorProps {
  className?: string;
  config?: KatanaMotionConfig;
}

export const KatanaCursor: React.FC<KatanaCursorProps> = ({ className, config }) => {
  const { x, y, angle, isVisible } = useKatanaMotion(config);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className ?? ''}`}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) translate(-12px, -22px) rotate(${angle}deg)`,
        transformOrigin: '12px 22px',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_10px_rgba(243,164,194,0.7)]"
      >
        {/* Hoja afilada de la katana */}
        <path
          d="M16 20.8L35.5 21.2C37.5 21.5 39.5 22 41 22C39.5 22 37.5 22.5 35.5 22.8L16 23.2Z"
          fill="#F1F5F9"
        />
        <path d="M16 21.5L40 22L16 22.5" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Habaki (cuello de cobre/oro) */}
        <rect x="13.5" y="20.2" width="2.5" height="3.6" rx="0.5" fill="#F59E0B" />
        {/* Tsuba (guarda circular) */}
        <ellipse cx="13" cy="22" rx="1.8" ry="4.5" fill="#1E293B" stroke="#F59E0B" strokeWidth="0.8" />
        {/* Tsuka (empunadura) */}
        <rect x="3" y="20.5" width="9.5" height="3" rx="0.8" fill="#0F172A" />
        {/* Tsukaito (encordado rojo) */}
        <line x1="5.5" y1="20.5" x2="4.5" y2="23.5" stroke="#EF4444" strokeWidth="0.9" />
        <line x1="8" y1="20.5" x2="7" y2="23.5" stroke="#EF4444" strokeWidth="0.9" />
        <line x1="10.5" y1="20.5" x2="9.5" y2="23.5" stroke="#EF4444" strokeWidth="0.9" />
      </svg>
    </div>
  );
};

export default KatanaCursor;
