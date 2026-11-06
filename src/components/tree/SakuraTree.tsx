import React, { useState, useCallback, useEffect } from 'react';
import SakuraBranches from './SakuraBranches';

export interface SakuraTreeProps {
  className?: string;
  onStrike?: () => void;
}

export const SakuraTree: React.FC<SakuraTreeProps> = ({ className = '', onStrike }) => {
  const [strikeCount, setStrikeCount] = useState(0);

  const triggerStrikeFeedback = useCallback(() => {
    setStrikeCount((prev) => prev + 1);
    onStrike?.();
  }, [onStrike]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStrikeEvent = () => {
      triggerStrikeFeedback();
    };

    window.addEventListener('sakura-tree-strike', handleStrikeEvent);
    return () => {
      window.removeEventListener('sakura-tree-strike', handleStrikeEvent);
    };
  }, [triggerStrikeFeedback]);

  const handleStrike = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX || rect.left + rect.width * 0.5;
      const clickY = e.clientY || rect.top + rect.height * 0.4;

      triggerStrikeFeedback();

      if (typeof window !== 'undefined') {
        const event = new CustomEvent('sakura-tree-strike', {
          detail: { x: clickX, y: clickY, count: 50 },
        });
        window.dispatchEvent(event);
      }
    },
    [triggerStrikeFeedback]
  );

  return (
    <div
      id="sakura-tree"
      data-testid="sakura-tree"
      onClick={handleStrike}
      className={`relative w-full max-w-none select-none overflow-hidden ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Árbol de cerezo sagrado. Haz clic o corta con la katana para desprender pétalos."
    >
      <div className="relative w-full aspect-[1392/752] overflow-hidden">
        {/* Capa 0: Fondo cielo, montañas y pradera limpia */}
        <img
          src="/assets/tree/imagen-fondo.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center filter brightness-100 contrast-100 pointer-events-none"
          loading="eager"
        />

        {/* Capa 1: Tronco y samurai (Base física del árbol fija e inalterable) */}
        <div
          id="sakura-tree-img-container"
          className="absolute pointer-events-none z-10"
          style={{
            left: '33%',
            top: '-19%',
            width: '60%',
            transform: 'scale(0.52)',
            transformOrigin: 'center center',
          }}
        >
          <img
            id="sakura-tree-img"
            src="/assets/tree/tronco.webp"
            alt="Árbol de Cerezo Sakura Milenario"
            className="w-full h-auto object-contain pointer-events-none"
            loading="eager"
          />
        </div>

        {/* Capa 2: Follaje y ramas fijadas a la madera con brisa sutil en las puntas */}
        <SakuraBranches />

        {/* Máscara de fundido inferior suave con el color pergamino washi (#f4eee5) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-[#f4eee5] via-[#f4eee5]/60 to-transparent" />
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 text-xs text-[#6b6966]">
        <span className="flex items-center gap-1.5 font-mono text-[#db2777]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#db2777] animate-ping" />
          Árbol de Cerezo Milenario
        </span>
        <span className="text-[11px] text-[#6b6966]/80">
          🌸 Golpea con la Katana ({strikeCount} cortes)
        </span>
      </div>
    </div>
  );
};

export default SakuraTree;
