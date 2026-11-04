import { describe, it, expect } from 'vitest';
import HeroSection from '../HeroSection';
import ProjectsSection from '../ProjectsSection';
import ExperienceSection from '../ExperienceSection';
import {
  PORTFOLIO_PROFILE,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_EXPERIENCES,
} from '../../../data/portfolioData';

describe('Sections UI Components', () => {
  describe('HeroSection', () => {
    it('renders hero with profile info by default', () => {
      const vnode = HeroSection();
      expect(vnode).toBeDefined();
      expect((vnode.props as Record<string, unknown>)['data-testid']).toBe('hero-section');
    });

    it('renders custom profile when passed as prop', () => {
      const customProfile = {
        ...PORTFOLIO_PROFILE,
        name: 'Custom Developer',
      };
      const vnode = HeroSection({ profile: customProfile });
      expect(vnode).toBeDefined();
      expect((vnode.props as Record<string, unknown>)['data-testid']).toBe('hero-section');
    });
  });

  describe('ProjectsSection', () => {
    it('renders projects section with default projects', () => {
      const vnode = ProjectsSection();
      expect(vnode).toBeDefined();
      expect((vnode.props as Record<string, unknown>)['data-testid']).toBe('projects-section');
    });

    it('renders custom project list when passed as prop', () => {
      const vnode = ProjectsSection({ projects: [PORTFOLIO_PROJECTS[0]] });
      expect(vnode).toBeDefined();
      expect((vnode.props as Record<string, unknown>)['data-testid']).toBe('projects-section');
    });
  });

  describe('ExperienceSection', () => {
    it('renders experience section with default experiences', () => {
      const vnode = ExperienceSection();
      expect(vnode).toBeDefined();
      expect((vnode.props as Record<string, unknown>)['data-testid']).toBe('experience-section');
    });

    it('renders custom experience list when passed as prop', () => {
      const vnode = ExperienceSection({
        experiences: [PORTFOLIO_EXPERIENCES[0]],
      });
      expect(vnode).toBeDefined();
      expect((vnode.props as Record<string, unknown>)['data-testid']).toBe('experience-section');
    });
  });
});
