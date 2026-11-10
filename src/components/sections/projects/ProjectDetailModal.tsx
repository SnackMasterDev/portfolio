import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../../../data/portfolioData';
import { useLanguage } from '../../../context/useLanguage';
import { getTranslations } from '../../../data/translations';
import { ProjectModalHeader } from './ProjectModalHeader';

export interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { language } = useLanguage();
  const t = getTranslations(language).projects;

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fdfbf7] border border-[#d6cebf] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-[#1c1c1e] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ProjectModalHeader
          title={project.title}
          tagline={project.tagline}
          onClose={onClose}
          closeAriaLabel={t.modalCloseAria}
        />

        <p className="text-sm text-[#57534e] leading-relaxed">
          {project.longDescription || project.description}
        </p>

        {project.architecture && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#1c1c1e] font-semibold">
              {t.modalArchTitle}
            </h4>
            <ul className="space-y-1.5 text-xs text-[#57534e]">
              {project.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#be185d] select-none font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-xs rounded-lg bg-white border border-[#d6cebf] text-[#1c1c1e] font-mono shadow-2xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[#d6cebf]">
          {project.link && project.link !== '#' && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#db2777] hover:bg-[#be185d] text-white font-medium text-xs shadow-xs transition-colors">
              {t.openLiveApp}
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-[#d6cebf] hover:bg-white text-xs text-[#1c1c1e] font-medium transition-colors">
              {t.viewCode}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalNode, document.body);
  }

  return modalNode;
};

export default ProjectDetailModal;
