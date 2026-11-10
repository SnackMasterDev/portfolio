import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { LanguageToggle } from '../LanguageToggle';
import { LanguageProvider } from '../../../context/LanguageContext';

describe('LanguageToggle', () => {
  it('renders ES and EN language buttons', () => {
    const html = renderToString(
      React.createElement(
        LanguageProvider,
        null,
        React.createElement(LanguageToggle)
      )
    );

    expect(html).toContain('ES');
    expect(html).toContain('EN');
    expect(html).toContain('Selector de idioma / Language selector');
    expect(html).toContain('aria-pressed="true"');
  });
});
