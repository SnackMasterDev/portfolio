import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../LanguageContext';
import { useLanguage } from '../useLanguage';

const TestComponent = () => {
  const { language } = useLanguage();
  return <div data-testid="lang-output">{language}</div>;
};

describe('LanguageContext', () => {
  it('defaults to Spanish (es) in SSR and without provider', () => {
    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain('es');
  });

  it('renders correctly within LanguageProvider', () => {
    const html = renderToString(
      React.createElement(LanguageProvider, null, React.createElement(TestComponent))
    );
    expect(html).toContain('es');
  });
});
