import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { useContactForm } from '../useContactForm';
import { validateContactForm } from '../../../utils/antiSpam';

describe('useContactForm logic and thematic validation', () => {
  it('validates empty fields with thematic missing fields message', () => {
    const payload = {
      name: '',
      email: '',
      message: '',
      honeypot: '',
      startTime: Date.now() - 6000,
    };

    const result = validateContactForm(payload, Date.now());
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('MISSING_FIELDS');
  });

  it('renders a harness component calling useContactForm in idle state', () => {
    let capturedState: any;
    const TestComponent = () => {
      const state = useContactForm();
      capturedState = state;
      return React.createElement('div', null, state.status);
    };

    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain('idle');
    expect(capturedState.status).toBe('idle');
    expect(capturedState.isSubmitting).toBe(false);
    expect(capturedState.formData.name).toBe('');
  });
});
