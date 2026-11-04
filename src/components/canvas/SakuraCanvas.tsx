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
      className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'}
      aria-hidden="true"
    />
  );
};

export default SakuraCanvas;
