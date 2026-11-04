import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SakuraTree } from '../SakuraTree';

describe('SakuraTree Component', () => {
  it('renders tree container and decorative image markup', () => {
    const html = renderToString(React.createElement(SakuraTree));

    expect(html).toContain('id="sakura-tree"');
    expect(html).toContain('data-testid="sakura-tree"');
    expect(html).toContain('src="/assets/imagen-fondo.webp"');
    expect(html).toContain('Árbol de Cerezo Milenario');
    expect(html).toContain('role="button"');
  });

  it('renders accessible label explaining interaction with katana', () => {
    const html = renderToString(React.createElement(SakuraTree));

    expect(html).toContain('aria-label="Árbol de cerezo sagrado. Haz clic o corta con la katana para desprender pétalos."');
    expect(html).toContain('Golpea con la Katana');
  });
});
