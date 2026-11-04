import React, { useState, useCallback } from 'react';

export interface SakuraTreeProps {
  className?: string;
  onStrike?: () => void;
}

export const SakuraTree: React.FC<SakuraTreeProps> = ({ className = '', onStrike }) => {
  const [isRecoiling, setIsRecoiling] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);

  const handleStrike = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX || rect.left + rect.width * 0.5;
      const clickY = e.clientY || rect.top + rect.height * 0.4;

      setIsRecoiling(true);
      setStrikeCount((prev) => prev + 1);
      onStrike?.();

      if (typeof window !== 'undefined') {
        const event = new CustomEvent('sakura-tree-strike', {
          detail: { x: clickX, y: clickY, count: 50 },
        });
        window.dispatchEvent(event);
      }

      setTimeout(() => {
        setIsRecoiling(false);
      }, 550);
    },
    [onStrike]
  );

  return (
    <div
      id="sakura-tree"
      data-testid="sakura-tree"
      onClick={handleStrike}
      className={`group relative w-full max-w-none cursor-pointer select-none overflow-hidden transition-transform duration-300 ${
        isRecoiling ? 'animate-[tree-recoil_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)]' : ''
      } ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Árbol de cerezo sagrado. Haz clic o corta con la katana para desprender pétalos."
    >
      <div className="relative w-full overflow-hidden">
        <img
          src="/assets/imagen-fondo.webp"
          alt="Árbol de Cerezo Sakura Milenario"
          className="h-auto w-full max-h-[85vh] object-cover object-center filter brightness-100 contrast-100 pointer-events-none transition-transform duration-700 group-hover:scale-[1.01]"
          loading="eager"
        />
        {/* Máscara de fundido inferior suave con el color pergamino washi (#f4eee5) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f4eee5] via-[#f4eee5]/60 to-transparent" />
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
