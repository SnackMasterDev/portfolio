import React from 'react';
import { getPortfolioExperiences, type Experience } from '../../data/portfolioData';
import { useLanguage } from '../../context/useLanguage';
import { getTranslations } from '../../data/translations';

interface ExperienceSectionProps {
  experiences?: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences: propExperiences,
}) => {
  const { language } = useLanguage();
  const t = getTranslations(language).experience;
  const experiences = propExperiences ?? getPortfolioExperiences(language);

  return (
    <section
      data-testid="experience-section"
      className="relative z-10 max-w-4xl mx-auto px-6 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-[#be185d] mb-2">
          {t.kicker}
        </h2>
        <h3 className="font-rancho text-3xl md:text-5xl font-bold text-[#1c1c1e]">
          {t.title}
        </h3>
      </div>

      <div className="space-y-8 border-l-2 border-[#d6cebf] ml-4 md:ml-8 pl-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative group">
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-[#f4eee5] bg-[#db2777]" />
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-2">
              <h4 className="text-lg font-semibold text-[#1c1c1e]">
                {exp.role}{' '}
                <span className="text-sm font-normal text-[#57534e]">
                  @ {exp.company}
                </span>
              </h4>
              <span className="text-xs font-mono text-[#be185d] font-semibold">
                {exp.period}
              </span>
            </div>

            <p className="text-sm text-[#57534e] leading-relaxed mb-3">
              {exp.description}
            </p>

            <ul className="space-y-1.5">
              {exp.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="text-xs text-[#57534e] flex items-start gap-2"
                >
                  <span className="text-[#db2777] select-none">&bull;</span>
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
