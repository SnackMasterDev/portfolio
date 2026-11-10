import type { Language } from '../context/useLanguage';
import type { Profile, Project, Experience, SocialLink } from './portfolioData.types';
import { PORTFOLIO_PROFILE_ES, PORTFOLIO_PROJECTS_ES, PORTFOLIO_EXPERIENCES_ES } from './portfolioData.es';
import { PORTFOLIO_PROFILE_EN, PORTFOLIO_PROJECTS_EN, PORTFOLIO_EXPERIENCES_EN } from './portfolioData.en';

export type { Profile, Project, Experience, SocialLink };
export {
  PORTFOLIO_PROFILE_ES,
  PORTFOLIO_PROJECTS_ES,
  PORTFOLIO_EXPERIENCES_ES,
  PORTFOLIO_PROFILE_EN,
  PORTFOLIO_PROJECTS_EN,
  PORTFOLIO_EXPERIENCES_EN,
};

// Defaults canónicos (en español por defecto según especificación)
export const PORTFOLIO_PROFILE: Profile = PORTFOLIO_PROFILE_ES;
export const PORTFOLIO_PROJECTS: Project[] = PORTFOLIO_PROJECTS_ES;
export const PORTFOLIO_EXPERIENCES: Experience[] = PORTFOLIO_EXPERIENCES_ES;

export function getPortfolioProfile(lang: Language): Profile {
  return lang === 'en' ? PORTFOLIO_PROFILE_EN : PORTFOLIO_PROFILE_ES;
}

export function getPortfolioProjects(lang: Language): Project[] {
  return lang === 'en' ? PORTFOLIO_PROJECTS_EN : PORTFOLIO_PROJECTS_ES;
}

export function getPortfolioExperiences(lang: Language): Experience[] {
  return lang === 'en' ? PORTFOLIO_EXPERIENCES_EN : PORTFOLIO_EXPERIENCES_ES;
}
