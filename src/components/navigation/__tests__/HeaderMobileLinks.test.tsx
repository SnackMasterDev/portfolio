import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { HeaderMobileLinks } from '../HeaderMobileLinks';
import { getTranslations } from '../../../data/translations';

const tEs = getTranslations('es');
const tEn = getTranslations('en');

describe('HeaderMobileLinks', () => {
  it('renders CV download and social links in Spanish', () => {
    const html = renderToString(
      React.createElement(HeaderMobileLinks, {
        t: tEs.header,
        language: 'es',
        onClose: () => {},
      })
    );

    expect(html).toContain('href="/cv.pdf"');
    expect(html).toContain('download="CV_Juan_Camilo_Garcia_ES.pdf"');
    expect(html).toContain('https://github.com/SnackMasterDev/portfolio');
    expect(html).toContain('https://github.com/SnackMasterDev');
    expect(html).toContain('https://linkedin.com/in/juan-camilo-garcia-');
  });

  it('renders English CV link when language is en', () => {
    const html = renderToString(
      React.createElement(HeaderMobileLinks, {
        t: tEn.header,
        language: 'en',
        onClose: () => {},
      })
    );

    expect(html).toContain('href="/cv_en.pdf"');
  });
});
