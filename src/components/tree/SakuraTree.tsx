import React, { useState, useCallback, useEffect } from 'react';
import SakuraBranches from './SakuraBranches';

export interface SakuraTreeProps {
  className?: string;
  onStrike?: () => void;
}

export const SakuraTree: React.FC<SakuraTreeProps> = ({ className = '', onStrike }) => {
  const [isRecoiling, setIsRecoiling] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);

  const triggerStrikeFeedback = useCallback(() => {
    setIsRecoiling(true);
    setStrikeCount((prev) => prev + 1);
    onStrike?.();

    setTimeout(() => {
      setIsRecoiling(false);
    }, 550);
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
      className={`group relative w-full max-w-none cursor-pointer select-none overflow-hidden ${className}`}
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

        {/* Capa 1: Tronco y samurai (Base física del árbol con colisión) */}
        <img
          id="sakura-tree-img"
          src="/assets/tree/tronco.webp"
          alt="Árbol de Cerezo Sakura Milenario"
          className={`absolute left-[44%] top-[-8%] w-[60%] max-w-none object-contain pointer-events-none z-10 transition-transform duration-300 ${
            isRecoiling ? 'scale-[1.008] -translate-x-0.5' : ''
          }`}
          loading="eager"
        />

        {/* Capa 2: Follaje y ramas multicapa animadas con brisa e impacto */}
        <SakuraBranches isRecoiling={isRecoiling} />

        {/* Máscara de fundido inferior suave con el color pergamino washi (#f4eee5) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-[#f4eee5] via-[#f4eee5]/60 to-transparent" />
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 text-xs text-[#6b6966]">
        <span className="flex items-center gap-1.5 font-mono text-[#db2777]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#db2777] animate-ping" />
          Árbol de Cerezo Milenario
        </span>
        <span className="text-[11px] text-[#6b6966]/80 group-hover:text-[#db2777] transition-colors">
          🌸 Golpea con la Katana ({strikeCount} cortes)
        </span>
      </div>
    </div>
  );
};

export default SakuraTree;
