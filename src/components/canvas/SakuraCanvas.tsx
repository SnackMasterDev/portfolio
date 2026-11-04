import React, { useRef } from 'react';
import type { SakuraConfig } from '../../engine/types';
import { useSakuraAnimation } from './useSakuraAnimation';

export interface SakuraCanvasProps {
  className?: string;
  config?: Partial<SakuraConfig>;
}

export const SakuraCanvas: React.FC<SakuraCanvasProps> = ({ className, config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useSakuraAnimation(canvasRef, config);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'pointer-events-none fixed inset-0 z-20 h-full w-full'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 20,
      }}
      aria-hidden="true"
    />
  );
};

export default SakuraCanvas;
