import React, { useState, useEffect, useRef } from 'react';
import { CALIBRATED_BRANCHES } from './branchConfig';

export interface SakuraBranchesProps {
  className?: string;
}

const BRANCH_DIMENSIONS: Record<string, { width: number; height: number }> = {
  rama_1: { width: 470, height: 316 },
  rama_2: { width: 189, height: 208 },
  rama_3: { width: 421, height: 176 },
  rama_4: { width: 752, height: 527 },
};

export const SakuraBranches: React.FC<SakuraBranchesProps> = ({ className = '' }) => {
  const [strikeId, setStrikeId] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStrike = () => {
      setStrikeId((prev) => prev + 1);
      setIsShaking(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsShaking(false);
      }, 420);
    };

    window.addEventListener('sakura-tree-strike', handleStrike);
    return () => {
      window.removeEventListener('sakura-tree-strike', handleStrike);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 overflow-visible ${className}`.trim()}>
      {CALIBRATED_BRANCHES.map((b, idx) => {
        const flipScale = b.flipX ? -b.scale : b.scale;
        const shudderBase = idx % 2 === 0 ? 'branch-shudder-ccw' : 'branch-shudder-cw';
        const suffix = strikeId % 2 === 0 ? '-a' : '-b';
        const animClass = isShaking ? `${shudderBase}${suffix}` : b.breezeClass;

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
              width={BRANCH_DIMENSIONS[b.src]?.width ?? 470}
              height={BRANCH_DIMENSIONS[b.src]?.height ?? 316}
              className={`block h-auto w-full max-w-none object-contain ${animClass}`}
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
