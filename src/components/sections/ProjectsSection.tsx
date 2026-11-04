import React from 'react';
import { PORTFOLIO_PROJECTS, type Project } from '../../data/portfolioData';

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({
  projects = PORTFOLIO_PROJECTS,
}: ProjectsSectionProps = {}): React.ReactElement {
  return (
    <section
      data-testid="projects-section"
      className="relative z-10 max-w-5xl mx-auto px-6 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#f3a4c2] mb-2">
          Portfolio
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-[#f2f0ed]">
          Featured Projects
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col justify-between p-6 rounded-xl bg-[#262628]/90 border border-[#3c3b3d] hover:border-[#f3a4c2]/40 transition-all backdrop-blur-sm"
          >
            <div>
              <h4 className="text-lg font-semibold text-[#f2f0ed] mb-1">
                {project.title}
              </h4>
              <p className="text-xs text-[#f3a4c2] font-mono mb-3">
                {project.tagline}
              </p>
              <p className="text-sm text-[#aaa7a3] leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] rounded bg-[#1c1c1e] text-[#aaa7a3] border border-[#3c3b3d]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-medium">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f3a4c2] hover:underline"
                  >
                    Live Demo &rarr;
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#aaa7a3] hover:text-[#f2f0ed] transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
