import React from 'react';
import type { Project } from '../../../data/portfolioData';

export const PhysicsCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <article className="relative overflow-hidden md:col-span-1 md:row-span-2 rounded-3xl bg-[#242426]/75 border border-[#3c3b3d]/70 p-6 flex flex-col justify-between backdrop-blur-xl hover:border-[#f3a4c2]/50 hover:shadow-[0_0_35px_rgba(243,164,194,0.12)] transition-all duration-300 group">
      <div>
        <div className="flex items-center justify-between pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#f3a4c2]">ENGINE</span>
          <span className="text-xs font-mono text-[#aaa7a3]">02</span>
        </div>
        <div className="p-3 my-2 rounded-2xl bg-[#1c1c1e]/80 border border-[#3c3b3d]/60 font-mono text-[11px] text-[#f3a4c2] leading-tight space-y-1">
          <div className="text-[#aaa7a3]">// Delta-time loop</div>
          <div>dt = (now - last) / 1000</div>
          <div>x += (vx + wind) * dt</div>
          <div className="text-emerald-400">● GPU Accelerated 60 FPS</div>
        </div>
        <h4 className="text-xl font-bold text-[#f2f0ed] mt-4 mb-1 group-hover:text-white transition-colors">
          {project.title}
        </h4>
        <p className="text-xs text-[#aaa7a3] leading-relaxed mt-2">{project.description}</p>
      </div>

      <div className="pt-4 border-t border-[#3c3b3d]/40">
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-[#1c1c1e] text-[#aaa7a3] border border-[#3c3b3d]/60 font-mono">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs font-mono text-[#f3a4c2]">Interactivo en esta página</span>
      </div>
    </article>
  );
};
