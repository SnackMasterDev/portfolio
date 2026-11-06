import React from 'react';
import { CALIBRATED_BRANCHES } from './branchConfig';

export interface SakuraBranchesProps {
  isRecoiling?: boolean;
}

export const SakuraBranches: React.FC<SakuraBranchesProps> = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {CALIBRATED_BRANCHES.map((b) => {
        const flipScale = b.flipX ? -b.scale : b.scale;
        return (
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
              transformOrigin: 'center center',
            }}
          >
            <img
              src={`/assets/tree/${b.src}.webp`}
              alt=""
              aria-hidden="true"
              className={`block h-auto w-full max-w-none object-contain ${b.breezeClass}`}
              style={{
                transformOrigin: b.stemOrigin,
                willChange: 'transform',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SakuraBranches;
