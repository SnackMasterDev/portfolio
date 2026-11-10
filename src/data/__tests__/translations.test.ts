import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, getTranslations } from '../translations';

describe('translations', () => {
  it('provides complete translations for Spanish and English', () => {
    const es = getTranslations('es');
    const en = getTranslations('en');

    expect(es).toBeDefined();
    expect(en).toBeDefined();

    expect(es.header.availableForWork).toBe('Disponible para Trabajar');
    expect(en.header.availableForWork).toBe('Available for Work');

    expect(es.projects.kicker).toBe('PROYECTOS');
    expect(en.projects.kicker).toBe('PROJECTS');
    expect(es.projects.title).toBe('Proyectos Destacados');
    expect(en.projects.title).toBe('Featured Projects');

    expect(es.experience.kicker).toBe('TRAYECTORIA');
    expect(en.experience.kicker).toBe('CAREER');

    expect(es.experience.title).toBe('Experiencia Profesional');
    expect(en.experience.title).toBe('Professional Experience');

    expect(es.contact.title).toBe('Hablemos');
    expect(en.contact.title).toBe("Let's Talk");
  });

  it('falls back to Spanish when invalid language is passed', () => {
    // @ts-expect-error Testing invalid language fallback
    const fallback = getTranslations('fr');
    expect(fallback).toEqual(TRANSLATIONS.es);
  });
});
