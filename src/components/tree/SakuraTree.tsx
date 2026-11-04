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
      className={`group relative mx-auto w-full max-w-5xl cursor-pointer select-none overflow-hidden transition-transform duration-300 ${
        isRecoiling ? 'animate-[tree-recoil_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)]' : ''
      } ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Árbol de cerezo sagrado. Haz clic o corta con la katana para desprender pétalos."
    >
      <div className="relative aspect-[21/9] md:aspect-[24/9] w-full overflow-hidden">
        <img
          src="/assets/imagen-fondo.webp"
          alt="Árbol de Cerezo Sakura Milenario"
          className="h-full w-full object-cover object-center filter brightness-90 contrast-110 pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
          loading="eager"
        />
        {/* Máscaras de degradado suaves en los 4 bordes para fundir perfectamente la imagen con el fondo #1c1c1e */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-[#1c1c1e]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1c1c1e] via-transparent to-[#1c1c1e]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#1c1c1e_92%)]" />
      </div>

      <div className="mt-2 flex items-center justify-center gap-3 text-xs text-[#aaa7a3]">
        <span className="flex items-center gap-1.5 font-mono text-[#f3a4c2]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f3a4c2] animate-ping" />
          Árbol de Cerezo Milenario
        </span>
        <span className="text-[11px] text-[#aaa7a3]/60 group-hover:text-[#f3a4c2] transition-colors">
          🌸 Golpea con la Katana ({strikeCount} cortes)
        </span>
      </div>
    </div>
  );
};

export default SakuraTree;
