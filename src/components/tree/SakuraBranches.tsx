import React from 'react';

export interface SakuraBranchesProps {
  isRecoiling: boolean;
}

export const SakuraBranches: React.FC<SakuraBranchesProps> = ({ isRecoiling }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {/* CAPA TRASERA PROFUNDA: Da volumen, densidad y sombras al follaje */}
      <img
        src="/assets/tree/rama_4.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[40%] top-[-8%] w-[58%] max-w-none opacity-85 brightness-90 filter transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.55s_cubic-bezier(0.36,0.07,0.19,0.97)]'
            : 'animate-[branch-breeze-2_7.2s_ease-in-out_infinite]'
        }`}
        style={{ transformOrigin: '70% 90%' }}
      />
      <img
        src="/assets/tree/rama_1.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[30%] top-[10%] w-[38%] max-w-none -scale-x-100 opacity-80 brightness-95 filter transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)_0.05s]'
            : 'animate-[branch-breeze-1_5.8s_ease-in-out_infinite_1.2s]'
        }`}
        style={{ transformOrigin: '30% 85%' }}
      />

      {/* CAPA MEDIA FRONDOSA: Ramas principales conectadas a la copa del tronco */}
      <img
        src="/assets/tree/rama_4.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[44%] top-[-3%] w-[54%] max-w-none transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.52s_cubic-bezier(0.36,0.07,0.19,0.97)]'
            : 'animate-[branch-breeze-1_5.2s_ease-in-out_infinite]'
        }`}
        style={{ transformOrigin: '65% 85%' }}
      />
      <img
        src="/assets/tree/rama_1.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[48%] top-[14%] w-[36%] max-w-none transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.55s_cubic-bezier(0.36,0.07,0.19,0.97)_0.02s]'
            : 'animate-[branch-breeze-3_6.4s_ease-in-out_infinite_0.5s]'
        }`}
        style={{ transformOrigin: '80% 80%' }}
      />

      {/* CAPA FRONTAL EXTENDIDA: Ramas que caen y se extienden lateralmente */}
      <img
        src="/assets/tree/rama_3.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[32%] top-[26%] w-[32%] max-w-none transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.58s_cubic-bezier(0.36,0.07,0.19,0.97)_0.04s]'
            : 'animate-[branch-breeze-2_4.9s_ease-in-out_infinite_1.8s]'
        }`}
        style={{ transformOrigin: '90% 40%' }}
      />
      <img
        src="/assets/tree/rama_2.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[70%] top-[19%] w-[16%] max-w-none transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.48s_cubic-bezier(0.36,0.07,0.19,0.97)]'
            : 'animate-[branch-breeze-1_4.4s_ease-in-out_infinite_2.1s]'
        }`}
        style={{ transformOrigin: '20% 70%' }}
      />

      {/* RAMA EXTRA PENDIENTE: Cuelga delicadamente en primer plano sobre el sendero */}
      <img
        src="/assets/tree/rama_3.webp"
        alt=""
        aria-hidden="true"
        className={`absolute left-[24%] top-[19%] w-[26%] max-w-none -scale-x-95 rotate-[12deg] opacity-95 transition-transform ${
          isRecoiling
            ? 'animate-[branch-impact-shudder_0.54s_cubic-bezier(0.36,0.07,0.19,0.97)_0.08s]'
            : 'animate-[branch-breeze-3_5.9s_ease-in-out_infinite_1s]'
        }`}
        style={{ transformOrigin: '95% 30%' }}
      />
    </div>
  );
};

export default SakuraBranches;
