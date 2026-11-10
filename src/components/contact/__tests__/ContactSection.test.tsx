import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import ContactSection from '../ContactSection';
import { ContactFeedback } from '../ContactFeedback';
import { ContactFormField } from '../ContactFormField';

describe('ContactSection Component', () => {
  it('renders section markup with accessible id, heading, and form', () => {
    const html = renderToString(React.createElement(ContactSection));

    expect(html).toContain('data-testid="contact-section"');
    expect(html).toContain('id="contact"');
    expect(html).toContain('aria-labelledby="contact-heading"');
    expect(html).toContain('aria-label="Formulario de contacto"');
    expect(html).toContain('Hablemos');
  });

  it('renders invisible honeypot input with tabIndex -1 and hidden container', () => {
    const html = renderToString(React.createElement(ContactSection));

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('name="honeypot"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toMatch(/autocomplete="off"/i);
  });

  it('renders all required form inputs and submit button', () => {
    const html = renderToString(React.createElement(ContactSection));

    expect(html).toContain('id="contact-name"');
    expect(html).toContain('id="contact-email"');
    expect(html).toContain('id="contact-message"');
    expect(html).toContain('Enviar Mensaje');
    // Notification banner removed, state is communicated in button
    expect(html).not.toContain('role="status"');
  });
});

describe('ContactFormField Component', () => {
  it('renders label and input with corresponding htmlFor and id', () => {
    const html = renderToString(
      React.createElement(ContactFormField, {
        id: 'user-email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'test@example.com',
      })
    );

    expect(html).toContain('for="user-email"');
    expect(html).toContain('id="user-email"');
    expect(html).toContain('Email Address');
    expect(html).toContain('type="email"');
  });
});

describe('ContactFeedback Component', () => {
  it('returns empty string when status is idle', () => {
    const html = renderToString(
      React.createElement(ContactFeedback, {
        status: 'idle',
        message: '',
      })
    );
    expect(html).toBe('');
  });

  it('renders polite live region for success status with emerald styles', () => {
    const html = renderToString(
      React.createElement(ContactFeedback, {
        status: 'success',
        message: '¡Mensaje enviado con éxito!',
      })
    );
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('emerald');
    expect(html).toContain('¡Mensaje enviado con éxito!');
  });

  it('renders polite live region for error status with rose styles', () => {
    const html = renderToString(
      React.createElement(ContactFeedback, {
        status: 'error',
        message: 'Por favor completa todos los campos.',
      })
    );
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('rose');
    expect(html).toContain('Por favor completa todos los campos.');
  });
});
