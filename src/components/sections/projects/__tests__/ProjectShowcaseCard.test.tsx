import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ProjectShowcaseCard } from '../ProjectShowcaseCard';
import { PORTFOLIO_PROJECTS } from '../../../../data/portfolioData';

describe('ProjectShowcaseCard', () => {
  it('renders project metadata, image, and action links', () => {
    const project = PORTFOLIO_PROJECTS[0]; // PriceScope
    const html = renderToString(
      React.createElement(ProjectShowcaseCard, {
        project,
        index: 0,
        onOpenDetail: () => {},
      })
    );

    expect(html).toContain('PriceScope');
    expect(html).toContain(project.tagline);
    expect(html).toContain(project.description);
    expect(html).toContain('img');
    expect(html).toContain('/projects/pricescope.jpg');
    expect(html).toContain('Ficha Técnica');
  });
});
