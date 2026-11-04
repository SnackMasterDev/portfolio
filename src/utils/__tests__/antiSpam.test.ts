import { describe, it, expect } from 'vitest';
import {
  isHoneypotValid,
  isSubmissionTimeValid,
  validateContactForm,
  MIN_FORM_TIME_MS,
  type ContactPayload,
} from '../antiSpam';

describe('antiSpam utility', () => {
  describe('MIN_FORM_TIME_MS', () => {
    it('is set to at least 2500ms (2.5 seconds)', () => {
      expect(MIN_FORM_TIME_MS).toBeGreaterThanOrEqual(2500);
    });
  });

  describe('isHoneypotValid', () => {
    it('returns true when honeypot field is empty', () => {
      expect(isHoneypotValid('')).toBe(true);
      expect(isHoneypotValid('   ')).toBe(true);
      expect(isHoneypotValid(undefined)).toBe(true);
      expect(isHoneypotValid(null)).toBe(true);
    });

    it('returns false when honeypot field is filled by a bot', () => {
      expect(isHoneypotValid('http://spam.com')).toBe(false);
      expect(isHoneypotValid('bot_input')).toBe(false);
    });
  });

  describe('isSubmissionTimeValid', () => {
    it('returns false if submitted faster than 2.5 seconds', () => {
      const startTime = 10000;
      const submitTime = startTime + 1500; // 1.5s
      expect(isSubmissionTimeValid(startTime, submitTime)).toBe(false);
    });

    it('returns true if submitted after 2.5 seconds or more', () => {
      const startTime = 10000;
      const submitTime = startTime + 2600; // 2.6s
      expect(isSubmissionTimeValid(startTime, submitTime)).toBe(true);
    });

    it('allows custom minimum time threshold', () => {
      const startTime = 1000;
      const submitTime = startTime + 3000;
      expect(isSubmissionTimeValid(startTime, submitTime, 5000)).toBe(false);
      expect(isSubmissionTimeValid(startTime, submitTime, 2000)).toBe(true);
    });
  });

  describe('validateContactForm', () => {
    const validPayload: ContactPayload = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, world! I love the sakura animation.',
      honeypot: '',
      startTime: 10000,
    };

    it('validates a legitimate submission after 3s', () => {
      const result = validateContactForm(validPayload, 10000 + 3000);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects bot when honeypot is filled', () => {
      const result = validateContactForm(
        { ...validPayload, honeypot: 'spam-bot-value' },
        10000 + 4000
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('SPAM_DETECTED');
    });

    it('rejects bot when submitted in under 2.5s', () => {
      const result = validateContactForm(
        validPayload,
        10000 + 1000 // 1s
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('TOO_FAST');
    });

    it('rejects invalid email addresses', () => {
      const result = validateContactForm(
        { ...validPayload, email: 'not-an-email' },
        10000 + 3000
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('INVALID_EMAIL');
    });

    it('rejects missing or whitespace-only required fields', () => {
      const emptyName = validateContactForm(
        { ...validPayload, name: '   ' },
        10000 + 3000
      );
      expect(emptyName.isValid).toBe(false);
      expect(emptyName.error).toBe('MISSING_FIELDS');

      const emptyMessage = validateContactForm(
        { ...validPayload, message: '' },
        10000 + 3000
      );
      expect(emptyMessage.isValid).toBe(false);
      expect(emptyMessage.error).toBe('MISSING_FIELDS');
    });
  });
});
