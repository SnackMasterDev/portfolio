import React from 'react';
import type { Project } from '../../../data/portfolioData';

export const DevBrainCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <article className="relative overflow-hidden md:col-span-2 rounded-3xl bg-[#242426]/75 border border-[#3c3b3d]/70 p-6 flex flex-col justify-between backdrop-blur-xl hover:border-[#f3a4c2]/50 hover:shadow-[0_0_35px_rgba(243,164,194,0.12)] transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#f3a4c2]">SYSTEMS & AI</span>
        <span className="text-xs font-mono text-[#aaa7a3]">03</span>
      </div>

      <div className="my-3">
        <h4 className="text-xl font-bold text-[#f2f0ed] group-hover:text-white transition-colors">
          {project.title}
        </h4>
        <p className="text-xs font-mono text-[#f3a4c2] mt-0.5">{project.tagline}</p>
        <p className="text-xs text-[#aaa7a3] leading-relaxed mt-2 max-w-xl">{project.description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#3c3b3d]/40">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-[#1c1c1e] text-[#aaa7a3] border border-[#3c3b3d]/60 font-mono">
              {tag}
            </span>
          ))}
        </div>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-[#f3a4c2] hover:underline font-mono">
            Repositorio ↗
          </a>
        )}
      </div>
    </article>
  );
};
