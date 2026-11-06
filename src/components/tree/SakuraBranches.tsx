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
  breezeAnim: string;
}

// Configuración calibrada exacta enviada por el usuario
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
    breezeAnim: 'animate-[branch-breeze-1_5.5s_ease-in-out_infinite]',
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
    breezeAnim: 'animate-[branch-breeze-2_6.2s_ease-in-out_infinite_0.4s]',
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
    breezeAnim: 'animate-[branch-breeze-3_5.8s_ease-in-out_infinite_0.8s]',
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
    breezeAnim: 'animate-[branch-breeze-1_4.8s_ease-in-out_infinite_1.2s]',
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
    breezeAnim: 'animate-[branch-breeze-2_6.6s_ease-in-out_infinite_0.2s]',
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
    breezeAnim: 'animate-[branch-breeze-3_5.2s_ease-in-out_infinite_1.6s]',
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
    breezeAnim: 'animate-[branch-breeze-1_6.0s_ease-in-out_infinite_0.9s]',
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
    breezeAnim: 'animate-[branch-breeze-2_4.9s_ease-in-out_infinite_1.1s]',
  },
];

export const SakuraBranches: React.FC<SakuraBranchesProps> = ({ isRecoiling }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {CALIBRATED_BRANCHES.map((b) => {
        const flipScale = b.flipX ? -b.scale : b.scale;
        return (
          <img
            key={b.id}
            src={`/assets/tree/${b.src}.webp`}
            alt=""
            aria-hidden="true"
            className={`absolute max-w-none transition-transform duration-300 ${
              isRecoiling
                ? 'animate-[branch-impact-shudder_0.52s_cubic-bezier(0.36,0.07,0.19,0.97)]'
                : b.breezeAnim
            }`}
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.width}%`,
              zIndex: b.z,
              opacity: b.opacity,
              transform: `scale(${flipScale}, ${b.scale}) rotate(${b.rot}deg)`,
              transformOrigin: 'center center',
            }}
          />
        );
      })}
    </div>
  );
};

export default SakuraBranches;
