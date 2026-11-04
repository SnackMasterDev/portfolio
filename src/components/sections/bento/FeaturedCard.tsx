import React from 'react';
import type { Project } from '../../../data/portfolioData';

export const FeaturedCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <article className="relative overflow-hidden md:col-span-2 md:row-span-2 rounded-3xl bg-[#242426]/75 border border-[#3c3b3d]/70 p-6 md:p-8 flex flex-col justify-between backdrop-blur-xl hover:border-[#f3a4c2]/50 hover:shadow-[0_0_35px_rgba(243,164,194,0.12)] transition-all duration-300 group">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">Live in Production</span>
        </div>
        <span className="text-xs font-mono text-[#aaa7a3]">01 / FLAGSHIP</span>
      </div>

      <div className="space-y-3 py-4">
        <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f2f0ed] group-hover:text-white transition-colors">
          {project.title}
        </h4>
        <p className="text-sm font-mono text-[#f3a4c2]">{project.tagline}</p>
        <p className="text-sm text-[#aaa7a3] leading-relaxed max-w-lg">{project.description}</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-[#3c3b3d]/40">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-[11px] rounded-lg bg-[#1c1c1e]/90 text-[#f2f0ed]/80 border border-[#3c3b3d]/80 font-mono">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs font-medium pt-1">
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f3a4c2] text-[#1c1c1e] font-semibold hover:bg-[#ffb7c5] transition-colors">
              Explorar Demo ↗
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#3c3b3d] text-[#aaa7a3] hover:text-white hover:border-[#aaa7a3] transition-colors">
              Código en GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
