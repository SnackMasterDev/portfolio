import React from 'react';

export const MetricsCard: React.FC = () => {
  return (
    <article className="relative overflow-hidden md:col-span-1 rounded-3xl bg-[#242426]/75 border border-[#3c3b3d]/70 p-6 flex flex-col justify-between backdrop-blur-xl hover:border-[#f3a4c2]/50 hover:shadow-[0_0_35px_rgba(243,164,194,0.12)] transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">TELEMETRÍA</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>

      <div className="my-2">
        <div className="text-4xl font-extrabold font-mono tracking-tight text-[#f3a4c2]">
          120<span className="text-xl text-[#aaa7a3]">FPS</span>
        </div>
        <p className="text-xs text-[#f2f0ed] font-medium mt-1">Fluidez ProMotion</p>
        <p className="text-[11px] text-[#aaa7a3] leading-snug mt-1">Cero tirones, bucle rAF desacoplado y bundle comprimido en &lt;75KB.</p>
      </div>

      <div className="pt-2 border-t border-[#3c3b3d]/40 flex items-center justify-between text-[11px] font-mono text-[#aaa7a3]">
        <span>Build: 157ms</span>
        <span className="text-emerald-400">100% Score</span>
      </div>
    </article>
  );
};
