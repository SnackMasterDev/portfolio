import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import SectionDivider from '../SectionDivider';

describe('SectionDivider Component', () => {
  it('renders separator with default kintsugi variant', () => {
    const html = renderToString(React.createElement(SectionDivider));
    expect(html).toContain('role="separator"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('#d4af37');
  });

  it('renders sumi variant with cherry blossom accent', () => {
    const html = renderToString(
      React.createElement(SectionDivider, { variant: 'sumi' })
    );
    expect(html).toContain('role="separator"');
    expect(html).toContain('🌸');
  });
});
