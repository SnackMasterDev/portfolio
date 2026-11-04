import React from 'react';
import { PORTFOLIO_PROJECTS, type Project } from '../../data/portfolioData';
import { FeaturedCard } from './bento/FeaturedCard';
import { PhysicsCard } from './bento/PhysicsCard';
import { DevBrainCard } from './bento/DevBrainCard';
import { MetricsCard } from './bento/MetricsCard';

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({
  projects = PORTFOLIO_PROJECTS,
}: ProjectsSectionProps = {}): React.ReactElement {
  const featured = projects.find((p) => p.id === 'pricescope') ?? projects[0];
  const devbrain = projects.find((p) => p.id === 'devbrain') ?? projects[1] ?? featured;
  const physics = projects.find((p) => p.id === 'sakura-interactive') ?? projects[2] ?? featured;

  return (
    <section
      id="proyectos"
      data-testid="projects-section"
      className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#f3a4c2] mb-2">
          TRABAJO SELECCIONADO
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[#f2f0ed]">
          Bento Grid de Proyectos
        </h3>
        <p className="text-sm text-[#aaa7a3] mt-2 max-w-md mx-auto">
          Arquitectura, sistemas en tiempo real y experiencias interactivas de alto rendimiento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto">
        <FeaturedCard project={featured} />
        <PhysicsCard project={physics} />
        <DevBrainCard project={devbrain} />
        <MetricsCard />
      </div>
    </section>
  );
}

export default ProjectsSection;
