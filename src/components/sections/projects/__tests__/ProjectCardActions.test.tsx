import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ProjectCardActions } from '../ProjectCardActions';
import type { Project } from '../../../../data/portfolioData';
import { getTranslations } from '../../../../data/translations';

const tEs = getTranslations('es');

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project',
  tagline: 'Test Tagline',
  description: 'Test description',
  tags: ['React'],
  link: 'https://example.com/demo',
  github: 'https://github.com/example/repo',
};

describe('ProjectCardActions', () => {
  it('renders demo, code and spec action buttons', () => {
    const html = renderToString(
      React.createElement(ProjectCardActions, {
        project: mockProject,
        t: tEs.projects,
        onOpenDetail: () => {},
      })
    );

    expect(html).toContain('href="https://example.com/demo"');
    expect(html).toContain('href="https://github.com/example/repo"');
    expect(html).toContain(tEs.projects.exploreDemo);
    expect(html).toContain(tEs.projects.viewCode);
    expect(html).toContain(tEs.projects.viewTechSpecs);
  });
});
