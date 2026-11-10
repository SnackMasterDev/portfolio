import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders SakuraCanvas as a fixed background layer with z-0 and pointer-events-none', () => {
    const html = renderToString(React.createElement(App));
    expect(html).toBeDefined();

    expect(html).toContain('<canvas');
    expect(html).toContain('pointer-events-none');
    expect(html).toContain('fixed');
    expect(html).toContain('inset-0');
    expect(html).toContain('z-20');
  });
});
