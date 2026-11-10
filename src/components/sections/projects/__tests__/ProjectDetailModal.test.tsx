import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ProjectDetailModal } from '../ProjectDetailModal';
import { PORTFOLIO_PROJECTS } from '../../../../data/portfolioData';

describe('ProjectDetailModal', () => {
  it('renders null when project is null', () => {
    const html = renderToString(
      React.createElement(ProjectDetailModal, {
        project: null,
        onClose: () => {},
      })
    );
    expect(html).toBe('');
  });

  it('renders modal with project details and architecture', () => {
    const project = PORTFOLIO_PROJECTS[0];
    const html = renderToString(
      React.createElement(ProjectDetailModal, {
        project,
        onClose: () => {},
      })
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain(project.title);
    expect(html).toContain(project.tagline);
    expect(html).toContain(project.architecture![0]);
  });
});
