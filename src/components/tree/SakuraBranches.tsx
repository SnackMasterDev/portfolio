import React from 'react';

export interface SakuraBranchesProps {
  isRecoiling: boolean;
}

interface BranchConfig {
  id: string;
  src: string;
  left: number;
  top: number;
  width: number;
  scale: number;
  rot: number;
  flipX: boolean;
  z: number;
  opacity: number;
  origin: string;
  breezeAnim: string;
}

// Configuración calibrada exacta del usuario con pivotes fijados a la base del tronco
const CALIBRATED_BRANCHES: BranchConfig[] = [
  {
    id: 'rama_1_7013',
    src: 'rama_1',
    left: 62.5,
    top: 19.5,
    width: 36,
    scale: 0.66,
    rot: 0,
    flipX: false,
    z: 15,
    opacity: 1,
    origin: 'bottom left',
    breezeAnim: 'animate-[branch-tip-sway-1_5.8s_ease-in-out_infinite]',
  },
  {
    id: 'rama_1_7946',
    src: 'rama_1',
    left: 33,
    top: 17,
    width: 36,
    scale: 0.56,
    rot: 0,
    flipX: true,
    z: 15,
    opacity: 1,
    origin: 'bottom right',
    breezeAnim: 'animate-[branch-tip-sway-2_6.4s_ease-in-out_infinite_0.5s]',
  },
  {
    id: 'rama_4_8968',
    src: 'rama_4',
    left: 12,
    top: 12.5,
    width: 52,
    scale: 1,
    rot: 0,
    flipX: false,
    z: 15,
    opacity: 1,
    origin: 'bottom center',
    breezeAnim: 'animate-[branch-tip-sway-3_5.4s_ease-in-out_infinite_1.1s]',
  },
  {
    id: 'rama_3_6132',
    src: 'rama_3',
    left: 22,
    top: 14.5,
    width: 32,
    scale: 0.9,
    rot: 4,
    flipX: false,
    z: 15,
    opacity: 1,
    origin: 'center right',
    breezeAnim: 'animate-[branch-tip-sway-1_5.0s_ease-in-out_infinite_1.7s]',
  },
  {
    id: 'rama_4_5896',
    src: 'rama_4',
    left: 10.5,
    top: -10.5,
    width: 52,
    scale: 1,
    rot: 35,
    flipX: false,
    z: 15,
    opacity: 1,
    origin: 'bottom right',
    breezeAnim: 'animate-[branch-tip-sway-2_6.8s_ease-in-out_infinite_0.3s]',
  },
  {
    id: 'rama_2_4776',
    src: 'rama_2',
    left: 40,
    top: -4,
    width: 18,
    scale: 1,
    rot: 91,
    flipX: false,
    z: 14,
    opacity: 1,
    origin: 'bottom center',
    breezeAnim: 'animate-[branch-tip-sway-3_4.6s_ease-in-out_infinite_1.4s]',
  },
  {
    id: 'rama_4_5438',
    src: 'rama_4',
    left: 54,
    top: -22,
    width: 52,
    scale: 0.58,
    rot: 55,
    flipX: true,
    z: 15,
    opacity: 1,
    origin: 'bottom center',
    breezeAnim: 'animate-[branch-tip-sway-1_6.2s_ease-in-out_infinite_0.8s]',
  },
  {
    id: 'rama_2_3918',
    src: 'rama_2',
    left: 50,
    top: -8,
    width: 18,
    scale: 1,
    rot: 80,
    flipX: false,
    z: 14,
    opacity: 1,
    origin: 'bottom center',
    breezeAnim: 'animate-[branch-tip-sway-2_5.1s_ease-in-out_infinite_1.2s]',
  },
];

export const SakuraBranches: React.FC<SakuraBranchesProps> = ({ isRecoiling }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {CALIBRATED_BRANCHES.map((b) => {
        const flipScale = b.flipX ? -b.scale : b.scale;
        return (
          /* Contenedor estático: Conserva 100% fiel la posición, rotación y escala exacta del JSON */
          <div
            key={b.id}
            className="pointer-events-none absolute"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.width}%`,
              zIndex: b.z,
              opacity: b.opacity,
              transform: `scale(${flipScale}, ${b.scale}) rotate(${b.rot}deg)`,
              transformOrigin: b.origin,
            }}
          >
            {/* Imagen animada: El pivote está en la base (tronco), por lo que la base no se mueve y solo se mecen las puntas */}
            <img
              src={`/assets/tree/${b.src}.webp`}
              alt=""
              aria-hidden="true"
              className={`block h-auto w-full max-w-none object-contain transition-transform duration-300 ${
                isRecoiling
                  ? 'animate-[branch-impact-shudder_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)]'
                  : b.breezeAnim
              }`}
              style={{
                transformOrigin: b.origin,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SakuraBranches;
