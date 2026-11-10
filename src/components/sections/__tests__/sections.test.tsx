import React from 'react';
import { renderToString } from 'react-dom/server';
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
      const html = renderToString(React.createElement(HeroSection));
      expect(html).toContain('data-testid="hero-section"');
      expect(html).toContain('Juan Camilo');
    });

    it('renders custom profile when passed as prop', () => {
      const customProfile = {
        ...PORTFOLIO_PROFILE,
        name: 'Custom Developer',
      };
      const html = renderToString(React.createElement(HeroSection, { profile: customProfile }));
      expect(html).toContain('data-testid="hero-section"');
      expect(html).toContain('Custom Developer');
    });
  });

  describe('ProjectsSection', () => {
    it('renders projects section with default projects', () => {
      const html = renderToString(React.createElement(ProjectsSection));
      expect(html).toContain('data-testid="projects-section"');
      expect(html).toContain('Proyectos Destacados');
      expect(html).toContain('PriceScope');
      expect(html).toContain('En Producción');
      expect(html).toContain('Ficha Técnica');
    });

    it('renders custom project list dynamically when passed as prop', () => {
      const customProject = {
        id: 'custom-app',
        title: 'Custom App Architecture',
        tagline: 'High Performance Real-Time App',
        description: 'Testing dynamic project rendering without hardcoded state',
        tags: ['React', 'TypeScript'],
        badge: 'Custom Badge',
        metrics: ['100% Dynamic'],
        link: 'https://custom.app',
        github: 'https://github.com/custom/app',
        architecture: ['Zero duplication', 'SRP compliant'],
        featured: true,
      };

      const html = renderToString(
        React.createElement(ProjectsSection, { projects: [customProject] })
      );
      expect(html).toContain('data-testid="projects-section"');
      expect(html).toContain('Custom App Architecture');
      expect(html).toContain('Custom Badge');
      expect(html).toContain('100% Dynamic');
      expect(html).toContain('https://custom.app');
      expect(html).toContain('https://github.com/custom/app');
      expect(html).toContain('Ficha Técnica');
    });

    it('filters out non-featured projects', () => {
      const hiddenProject = {
        ...PORTFOLIO_PROJECTS[0],
        id: 'hidden-app',
        title: 'Hidden App',
        featured: false,
      };
      const html = renderToString(
        React.createElement(ProjectsSection, { projects: [hiddenProject] })
      );
      expect(html).not.toContain('Hidden App');
    });
  });

  describe('ExperienceSection', () => {
    it('renders experience section with default experiences in Spanish', () => {
      const html = renderToString(React.createElement(ExperienceSection));
      expect(html).toContain('data-testid="experience-section"');
      expect(html).toContain('Experiencia Profesional');
    });

    it('renders custom experience list when passed as prop', () => {
      const html = renderToString(
        React.createElement(ExperienceSection, {
          experiences: [PORTFOLIO_EXPERIENCES[0]],
        })
      );
      expect(html).toContain('data-testid="experience-section"');
      expect(html).toContain(PORTFOLIO_EXPERIENCES[0].role.replace('&', '&amp;'));
    });
  });
});
