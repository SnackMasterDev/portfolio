import React from 'react';

export interface ProjectModalHeaderProps {
  tagline?: string;
  title: string;
  onClose: () => void;
  closeAriaLabel: string;
}

export const ProjectModalHeader: React.FC<ProjectModalHeaderProps> = ({
  tagline,
  title,
  onClose,
  closeAriaLabel,
}) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      {tagline && (
        <span className="text-xs font-mono uppercase tracking-widest text-[#be185d]">
          {tagline}
        </span>
      )}
      <h3 id="modal-project-title" className="text-2xl md:text-3xl font-bold mt-1 text-[#1c1c1e]">
        {title}
      </h3>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label={closeAriaLabel}
      className="p-2 rounded-full hover:bg-[#e3dacd]/50 text-[#57534e] hover:text-[#1c1c1e] transition-colors cursor-pointer"
    >
      ✕
    </button>
  </div>
);

export default ProjectModalHeader;
