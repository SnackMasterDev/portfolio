import React from 'react';
import type { Project } from '../../../data/portfolioData';
import { useLanguage } from '../../../context/useLanguage';
import { getTranslations } from '../../../data/translations';
import { ProjectCardPreview } from './ProjectCardPreview';
import { ProjectCardActions } from './ProjectCardActions';

export interface ProjectShowcaseCardProps {
  project: Project;
  index: number;
  onOpenDetail?: (project: Project) => void;
}

export const ProjectShowcaseCard: React.FC<ProjectShowcaseCardProps> = ({
  project,
  index,
  onOpenDetail,
}) => {
  const { language } = useLanguage();
  const t = getTranslations(language).projects;
  const isEven = index % 2 === 1;

  const getBadgeConfig = () => {
    if (project.badge) {
      return { text: project.badge, dot: 'bg-emerald-500', label: 'text-emerald-700' };
    }
    switch (project.id) {
      case 'pricescope':
        return { text: t.badgeLive, dot: 'bg-emerald-500', label: 'text-emerald-700' };
      case 'serviceflow':
        return { text: t.badgeSimulation, dot: 'bg-blue-500', label: 'text-blue-700' };
      case 'mizu':
        return { text: t.badgeGraduation, dot: 'bg-cyan-500', label: 'text-cyan-700' };
      case 'sakura-interactive':
        return { text: t.badgeEngine, dot: 'bg-[#be185d]', label: 'text-[#be185d]' };
      default:
        return { text: t.badgeLive, dot: 'bg-emerald-500', label: 'text-emerald-700' };
    }
  };

  const badge = getBadgeConfig();

  return (
    <article className="group relative rounded-3xl bg-[#fdfbf7]/90 border border-[#d6cebf] p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,28,30,0.05)] hover:shadow-[0_12px_36px_rgba(28,28,30,0.1)] transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <ProjectCardPreview title={project.title} image={project.image} isEven={isEven} />

        <div className={`lg:col-span-5 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${badge.dot} animate-pulse`} />
            <span className={`text-[11px] font-mono uppercase tracking-widest ${badge.label} font-semibold`}>
              {badge.text}
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1c1e]">
              {project.title}
            </h3>
            <p className="text-xs font-mono text-[#be185d] font-semibold mt-1">
              {project.tagline}
            </p>
          </div>

          <p className="text-sm text-[#57534e] leading-relaxed">
            {project.description}
          </p>

          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.metrics.map((metric, i) => (
                <span key={i} className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-[#f4eee5] text-[#1c1c1e] border border-[#d6cebf]/80 font-medium">
                  {metric}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-white border border-[#d6cebf] text-[#78716c]">
                {tag}
              </span>
            ))}
          </div>

          <ProjectCardActions project={project} t={t} onOpenDetail={onOpenDetail} />
        </div>
      </div>
    </article>
  );
};

export default ProjectShowcaseCard;
