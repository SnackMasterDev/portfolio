import React from 'react';
import SakuraBranches from './SakuraBranches';

export interface SakuraTreeProps {
  className?: string;
}

export const SakuraTree: React.FC<SakuraTreeProps> = ({ className = '' }) => {
  return (
    <div
      id="sakura-tree"
      data-testid="sakura-tree"
      className={`relative w-full max-w-none select-none overflow-hidden ${className}`}
      aria-label="Árbol de cerezo sagrado en floración."
    >
      <div className="relative w-full aspect-[1392/752] overflow-hidden">
        {/* Capa 0: Fondo cielo, montañas y pradera limpia */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/assets/tree/imagen-fondo.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center filter brightness-100 contrast-100"
            loading="eager"
          />
          {/* Degradado de fusión inferior ubicado exclusivamente sobre la imagen de fondo */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f4eee5] via-[#f4eee5]/60 to-transparent" />
        </div>

        {/* Capa 1: Tronco y samurai (Base física del árbol 1:1 idéntica al calibrador) */}
        <img
          id="sakura-tree-img"
          src="/assets/tree/tronco.webp"
          alt="Árbol de Cerezo Sakura Milenario"
          className="pointer-events-none absolute block max-w-none object-contain"
          style={{
            left: '33%',
            top: '-19%',
            width: '60%',
            zIndex: 10,
            opacity: 1,
            transform: 'scale(0.52, 0.52) rotate(0deg)',
            transformOrigin: 'center center',
          }}
          loading="eager"
        />

        {/* Capa 2: Follaje y ramas fijadas a la madera con brisa sutil en las puntas */}
        <SakuraBranches />
      </div>
    </div>
  );
};

export default SakuraTree;
