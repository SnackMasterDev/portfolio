import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import ContactSubmitButton from '../ContactSubmitButton';

describe('ContactSubmitButton Component', () => {
  it('renders default idle button in sumi-e dark palette', () => {
    const html = renderToString(
      React.createElement(ContactSubmitButton, {
        isSubmitting: false,
        status: 'idle',
      })
    );

    expect(html).toContain('type="submit"');
    expect(html).toContain('Enviar Mensaje');
    expect(html).toContain('bg-[#1c1c1e]');
    expect(html).toContain('text-[#f4eee5]');
  });

  it('renders submitting state with disabled attribute and cursor-wait', () => {
    const html = renderToString(
      React.createElement(ContactSubmitButton, {
        isSubmitting: true,
        status: 'submitting',
      })
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('Enviando...');
    expect(html).toContain('cursor-wait');
  });

  it('renders success state with harmonious bamboo green and affirmative copy', () => {
    const html = renderToString(
      React.createElement(ContactSubmitButton, {
        isSubmitting: false,
        status: 'success',
      })
    );

    expect(html).toContain('Mensaje entregado con honor');
    expect(html).toContain('bg-[#14532d]');
  });

  it('renders error state with lacquer red and thematic copy', () => {
    const html = renderToString(
      React.createElement(ContactSubmitButton, {
        isSubmitting: false,
        status: 'error',
        statusMessage: 'El pergamino está incompleto.',
      })
    );

    expect(html).toContain('El pergamino está incompleto.');
    expect(html).toContain('bg-[#7f1d1d]');
  });
});
