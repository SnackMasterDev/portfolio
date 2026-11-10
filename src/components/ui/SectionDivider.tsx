import React from 'react';

export interface SectionDividerProps {
  className?: string;
  variant?: 'sumi' | 'kintsugi';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  className = '',
  variant = 'kintsugi',
}) => {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`relative flex items-center justify-center my-12 overflow-hidden ${className}`}
    >
      {/* Línea difuminada estilo pincelada Sumi-e */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d6cebf] to-transparent" />

      {/* Acento central Kintsugi (oro envejecido) o flor Sakura */}
      <div className="absolute px-4 bg-[#f4eee5] flex items-center gap-1.5">
        {variant === 'kintsugi' ? (
          <>
            <span className="h-1 w-6 rounded-full bg-gradient-to-r from-[#d4af37]/60 to-[#d4af37]" />
            <span className="h-2 w-2 rotate-45 border border-[#d4af37] bg-[#d4af37]/20" />
            <span className="h-1 w-6 rounded-full bg-gradient-to-l from-[#d4af37]/60 to-[#d4af37]" />
          </>
        ) : (
          <span className="text-xs text-[#be185d] select-none font-serif opacity-80">🌸</span>
        )}
      </div>
    </div>
  );
};

export default SectionDivider;
