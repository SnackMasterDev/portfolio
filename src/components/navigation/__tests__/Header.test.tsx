import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import Header from '../Header';
import HeaderMobileMenu from '../HeaderMobileMenu';
import { getTranslations } from '../../../data/translations';

describe('Header Component', () => {
  it('renders branding, status badge, social links, and actions', () => {
    const html = renderToString(React.createElement(Header));
    expect(html).toContain('SnackMasterDev');
    expect(html).toContain('Disponible para Trabajar');
    expect(html).toContain('Descargar CV');
    expect(html).toContain('GitHub');
    expect(html).toContain('LinkedIn');
  });

  it('renders mobile hamburger toggle button with accessibility attributes', () => {
    const html = renderToString(React.createElement(Header));
    expect(html).toContain('data-testid="header-hamburger-button"');
    expect(html).toContain('aria-controls="mobile-navigation-menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('Abrir menú de navegación');
  });

  it('renders HeaderMobileMenu with links and actions when open', () => {
    const t = getTranslations('es').header;
    const html = renderToString(
      React.createElement(HeaderMobileMenu, {
        isOpen: true,
        onClose: () => {},
        t,
        language: 'es',
      })
    );

    expect(html).toContain('id="mobile-navigation-menu"');
    expect(html).toContain('data-testid="mobile-menu-backdrop"');
    expect(html).toContain('Descargar CV');
    expect(html).toContain('GitHub');
    expect(html).toContain('LinkedIn');
    expect(html).toContain('Audio OFF');
    expect(html).toContain('ES');
    expect(html).toContain('EN');
  });

  it('returns null when HeaderMobileMenu is closed', () => {
    const t = getTranslations('es').header;
    const html = renderToString(
      React.createElement(HeaderMobileMenu, {
        isOpen: false,
        onClose: () => {},
        t,
        language: 'es',
      })
    );

    expect(html).toBe('');
  });
});
