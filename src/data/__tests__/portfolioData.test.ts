import { describe, it, expect } from 'vitest';
import {
  PORTFOLIO_PROFILE,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_EXPERIENCES,
  getPortfolioProfile,
  getPortfolioProjects,
  getPortfolioExperiences,
} from '../portfolioData';

describe('portfolioData', () => {
  it('contains valid profile for Juan Camilo García (SnackMasterDev)', () => {
    expect(PORTFOLIO_PROFILE).toBeDefined();
    expect(PORTFOLIO_PROFILE.name).toContain('Juan Camilo García');
    expect(PORTFOLIO_PROFILE.alias).toBe('SnackMasterDev');
    expect(PORTFOLIO_PROFILE.title).toBeDefined();
    expect(PORTFOLIO_PROFILE.bio.length).toBeGreaterThan(20);
    expect(PORTFOLIO_PROFILE.skills.length).toBeGreaterThanOrEqual(3);
    expect(PORTFOLIO_PROFILE.socialLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('contains featured projects including ServiceFlow and ReservApp', () => {
    expect(Array.isArray(PORTFOLIO_PROJECTS)).toBe(true);
    expect(PORTFOLIO_PROJECTS.length).toBeGreaterThanOrEqual(2);

    const projectTitles = PORTFOLIO_PROJECTS.map((p) => p.title);
    expect(projectTitles).toContain('ServiceFlow');
    expect(projectTitles).toContain('ReservApp');

    PORTFOLIO_PROJECTS.forEach((project) => {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.tagline).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.tags.length).toBeGreaterThan(0);
    });
  });

  it('contains valid professional experiences', () => {
    expect(Array.isArray(PORTFOLIO_EXPERIENCES)).toBe(true);
    expect(PORTFOLIO_EXPERIENCES.length).toBeGreaterThanOrEqual(1);

    PORTFOLIO_EXPERIENCES.forEach((exp) => {
      expect(exp.id).toBeTruthy();
      expect(exp.role).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.period).toBeTruthy();
      expect(exp.description).toBeTruthy();
      expect(exp.highlights.length).toBeGreaterThan(0);
    });
  });

  it('returns valid bilingual data for ES and EN without Spanglish', () => {
    const profileEs = getPortfolioProfile('es');
    const profileEn = getPortfolioProfile('en');
    expect(profileEs.title).toContain('Desarrollador Frontend');
    expect(profileEn.title).toContain('Frontend Developer');

    const projectsEs = getPortfolioProjects('es');
    const projectsEn = getPortfolioProjects('en');
    expect(projectsEs.length).toBe(projectsEn.length);
    const pricescopeEn = projectsEn.find((p) => p.id === 'pricescope');
    expect(pricescopeEn?.tagline).toContain('Multi-Currency');

    const expEs = getPortfolioExperiences('es');
    const expEn = getPortfolioExperiences('en');
    expect(expEs.length).toBe(expEn.length);
    expect(expEn[0].role).toContain('Frontend Tech Lead');
    expect(expEs[0].role).toContain('Líder Técnico Frontend');
  });
});
