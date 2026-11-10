import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ProjectCardPreview } from '../ProjectCardPreview';

describe('ProjectCardPreview', () => {
  it('renders preview frame with title and screenshot image', () => {
    const html = renderToString(
      React.createElement(ProjectCardPreview, {
        title: 'PriceScope',
        image: '/projects/pricescope.jpg',
        isEven: false,
      })
    );

    expect(html).toContain('pricescope');
    expect(html).toContain('.app');
    expect(html).toContain('src="/projects/pricescope.jpg"');
    expect(html).toContain('Captura de pantalla de PriceScope');
  });

  it('renders fallback when no image provided', () => {
    const html = renderToString(
      React.createElement(ProjectCardPreview, {
        title: 'Demo App',
        isEven: true,
      })
    );

    expect(html).toContain('Vista previa');
  });
});
