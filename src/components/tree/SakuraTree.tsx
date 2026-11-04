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
      className={`group relative mx-auto w-full max-w-4xl cursor-pointer select-none overflow-hidden rounded-2xl border border-[#3c3b3d]/60 bg-gradient-to-b from-[#262628]/40 to-[#1c1c1e]/90 p-2 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-[#f3a4c2]/50 ${
        isRecoiling ? 'animate-[tree-recoil_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)]' : ''
      } ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Árbol de cerezo sagrado. Haz clic o corta con la katana para desprender pétalos."
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <img
          src="/assets/imagen-fondo.webp"
          alt="Árbol de Cerezo Sakura Milenario"
          className="h-full w-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent opacity-80" />
      </div>

      <div className="flex items-center justify-between px-3 py-2 text-xs text-[#aaa7a3]">
        <span className="flex items-center gap-1.5 font-mono text-[#f3a4c2]">
          <span className="h-2 w-2 rounded-full bg-[#f3a4c2] animate-ping" />
          Árbol de Cerezo Milenario
        </span>
        <span className="text-[11px] text-[#aaa7a3]/70 group-hover:text-[#f2f0ed] transition-colors">
          🌸 Golpea con la Katana ({strikeCount} cortes)
        </span>
      </div>
    </div>
  );
};

export default SakuraTree;
