import React from 'react';
import type { Project } from '../../../data/portfolioData';
import type { Translations } from '../../../data/translations';

export interface ProjectCardActionsProps {
  project: Project;
  t: Translations['projects'];
  onOpenDetail?: (project: Project) => void;
}

export const ProjectCardActions: React.FC<ProjectCardActionsProps> = ({
  project,
  t,
  onOpenDetail,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {project.link && project.link !== '#' && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#f4eee5] text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
        >
          {t.exploreDemo}
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#f4eee5] text-[#1c1c1e] text-xs font-medium border border-[#d6cebf] transition-colors"
        >
          {t.viewCode}
        </a>
      )}
      {onOpenDetail && (
        <button
          type="button"
          onClick={() => onOpenDetail(project)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#d6cebf] hover:bg-white text-xs font-medium text-[#57534e] hover:text-[#1c1c1e] transition-colors cursor-pointer active:scale-[0.98]"
        >
          {t.viewTechSpecs}
        </button>
      )}
    </div>
  );
};

export default ProjectCardActions;
