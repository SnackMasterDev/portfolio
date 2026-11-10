import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ProjectModalHeader } from '../ProjectModalHeader';

describe('ProjectModalHeader', () => {
  it('renders modal title, tagline and close button', () => {
    const html = renderToString(
      React.createElement(ProjectModalHeader, {
        title: 'PriceScope',
        tagline: 'Monitor de Inflación',
        onClose: () => {},
        closeAriaLabel: 'Cerrar modal',
      })
    );

    expect(html).toContain('PriceScope');
    expect(html).toContain('Monitor de Inflación');
    expect(html).toContain('aria-label="Cerrar modal"');
    expect(html).toContain('✕');
  });
});
