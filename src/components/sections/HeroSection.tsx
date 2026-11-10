import React from 'react';
import { getPortfolioProfile, type Profile } from '../../data/portfolioData';
import { useLanguage } from '../../context/useLanguage';

interface HeroSectionProps {
  profile?: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile: propProfile,
}) => {
  const { language } = useLanguage();
  const profile = propProfile ?? getPortfolioProfile(language);

  return (
    <section
      data-testid="hero-section"
      className="relative z-10 max-w-4xl mx-auto px-6 pt-6 pb-10 text-center flex flex-col items-center space-y-6"
    >
      <h1 className="font-rancho text-5xl md:text-7xl font-bold tracking-normal text-[#1c1c1e]">
        {profile.name}
      </h1>

      <p className="text-lg md:text-xl text-[#57534e] max-w-2xl font-normal leading-relaxed">
        {profile.title}
      </p>

      <p className="text-sm md:text-base text-[#57534e]/90 max-w-xl leading-relaxed">
        {profile.bio}
      </p>

      <div className="flex flex-wrap justify-center gap-2 pt-1 max-w-xl">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 text-xs rounded-md bg-white border border-[#e3dacd] text-[#1c1c1e] shadow-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
