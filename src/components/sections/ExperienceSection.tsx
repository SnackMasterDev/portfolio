import React from 'react';
import { PORTFOLIO_EXPERIENCES, type Experience } from '../../data/portfolioData';

interface ExperienceSectionProps {
  experiences?: Experience[];
}

export function ExperienceSection({
  experiences = PORTFOLIO_EXPERIENCES,
}: ExperienceSectionProps = {}): React.ReactElement {
  return (
    <section
      data-testid="experience-section"
      className="relative z-10 max-w-4xl mx-auto px-6 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#f3a4c2] mb-2">
          Career
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-[#f2f0ed]">
          Professional Experience
        </h3>
      </div>

      <div className="space-y-8 border-l border-[#3c3b3d] ml-4 md:ml-8 pl-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative group">
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-[#1c1c1e] bg-[#f3a4c2]" />
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-2">
              <h4 className="text-lg font-semibold text-[#f2f0ed]">
                {exp.role}{' '}
                <span className="text-sm font-normal text-[#aaa7a3]">
                  @ {exp.company}
                </span>
              </h4>
              <span className="text-xs font-mono text-[#f3a4c2]">
                {exp.period}
              </span>
            </div>

            <p className="text-sm text-[#aaa7a3] leading-relaxed mb-3">
              {exp.description}
            </p>

            <ul className="space-y-1.5">
              {exp.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="text-xs text-[#aaa7a3]/90 flex items-start gap-2"
                >
                  <span className="text-[#f3a4c2] select-none">&bull;</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
