import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SakuraTree } from '../SakuraTree';

describe('SakuraTree Component', () => {
  it('renders tree container and decorative image markup', () => {
    const html = renderToString(React.createElement(SakuraTree));

    expect(html).toContain('id="sakura-tree"');
    expect(html).toContain('data-testid="sakura-tree"');
    expect(html).toContain('src="/assets/tree/imagen-fondo.webp"');
    expect(html).toContain('src="/assets/tree/tronco.webp"');
    expect(html).toContain('Árbol de Cerezo Milenario');
    expect(html).toContain('role="button"');
  });

  it('renders accessible label explaining interaction with katana', () => {
    const html = renderToString(React.createElement(SakuraTree));

    expect(html).toContain('aria-label="Árbol de cerezo sagrado. Haz clic o corta con la katana para desprender pétalos."');
    expect(html).toContain('Golpea con la Katana');
  });

  it('renders foliage layer with calibrated branches anchored to wood stems', () => {
    const html = renderToString(React.createElement(SakuraTree));

    expect(html).toContain('src="/assets/tree/rama_1.webp"');
    expect(html).toContain('src="/assets/tree/rama_2.webp"');
    expect(html).toContain('src="/assets/tree/rama_3.webp"');
    expect(html).toContain('src="/assets/tree/rama_4.webp"');
    expect(html).toContain('transform-origin:85% 20%');
    expect(html).toContain('transform-origin:83% 56%');
  });
});
