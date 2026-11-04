import React from 'react';
import { PORTFOLIO_PROFILE, type Profile } from '../../data/portfolioData';

interface HeroSectionProps {
  profile?: Profile;
}

export function HeroSection({
  profile = PORTFOLIO_PROFILE,
}: HeroSectionProps = {}): React.ReactElement {
  return (
    <section
      data-testid="hero-section"
      className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center space-y-6"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#3c3b3d] bg-[#262628]/80 text-xs text-[#f3a4c2] font-mono tracking-wide backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#f3a4c2] animate-pulse" />
        {profile.alias}
      </div>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f2f0ed]">
        {profile.name}
      </h1>

      <p className="text-lg md:text-xl text-[#aaa7a3] max-w-2xl font-normal leading-relaxed">
        {profile.title}
      </p>

      <p className="text-sm md:text-base text-[#aaa7a3]/80 max-w-xl leading-relaxed">
        {profile.bio}
      </p>

      <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-xl">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 text-xs rounded-md bg-[#262628] border border-[#3c3b3d] text-[#f2f0ed]/90"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4">
        {profile.socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#303033] hover:bg-[#3c3b3d] text-sm text-[#f2f0ed] font-medium transition-colors border border-[#3c3b3d]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
