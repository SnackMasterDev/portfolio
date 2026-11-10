import React, { useState } from 'react';
import { getPortfolioProjects, type Project } from '../../data/portfolioData';
import { ProjectShowcaseCard } from './projects/ProjectShowcaseCard';
import { ProjectDetailModal } from './projects/ProjectDetailModal';
import { useLanguage } from '../../context/useLanguage';
import { getTranslations } from '../../data/translations';

export interface ProjectsSectionProps {
  projects?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects: propProjects,
}) => {
  const { language } = useLanguage();
  const t = getTranslations(language).projects;
  const allProjects = propProjects ?? getPortfolioProjects(language);
  const showcaseProjects = allProjects.filter((p) => p.featured !== false);

  const [modalProject, setModalProject] = useState<Project | null>(null);

  return (
    <section
      id="proyectos"
      data-testid="projects-section"
      className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#be185d] mb-2">
          {t.kicker}
        </h2>
        <h3 className="font-rancho text-3xl md:text-5xl font-bold tracking-normal text-[#1c1c1e]">
          {t.title}
        </h3>
        <p className="text-sm text-[#57534e] mt-2 max-w-xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="space-y-10">
        {showcaseProjects.map((project, index) => (
          <ProjectShowcaseCard
            key={project.id}
            project={project}
            index={index}
            onOpenDetail={setModalProject}
          />
        ))}
      </div>

      <ProjectDetailModal project={modalProject} onClose={() => setModalProject(null)} />
    </section>
  );
};

export default ProjectsSection;
