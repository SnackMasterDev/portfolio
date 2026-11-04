/**
 * Anti-Spam & Contact Form Validation Utility
 *
 * Implements invisible honeypot checking and minimum interaction time (>2.5s)
 * to effectively block automated bots and spam submissions.
 */

export const MIN_FORM_TIME_MS = 2500;

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  honeypot?: string | null;
  startTime: number;
}

export type ValidationErrorReason =
  | 'SPAM_DETECTED'
  | 'TOO_FAST'
  | 'INVALID_EMAIL'
  | 'MISSING_FIELDS';

export interface ValidationResult {
  isValid: boolean;
  error?: ValidationErrorReason;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates that the honeypot field was left empty.
 * Automated bots frequently fill all available input fields.
 */
export function isHoneypotValid(honeypot?: string | null): boolean {
  if (honeypot === undefined || honeypot === null) {
    return true;
  }
  return honeypot.trim().length === 0;
}

/**
 * Validates that the user spent a minimum realistic human time (>2.5s) on the form.
 */
export function isSubmissionTimeValid(
  startTime: number,
  submitTime: number = Date.now(),
  minTimeMs: number = MIN_FORM_TIME_MS
): boolean {
  return submitTime - startTime >= minTimeMs;
}

/**
 * Validates standard email address syntax.
 */
export function isValidEmail(email?: string | null): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Comprehensive anti-spam and field validation for contact form submissions.
 */
export function validateContactForm(
  payload: ContactPayload,
  submitTime: number = Date.now()
): ValidationResult {
  // 1. Check honeypot field
  if (!isHoneypotValid(payload.honeypot)) {
    return { isValid: false, error: 'SPAM_DETECTED' };
  }

  // 2. Check interaction duration
  if (!isSubmissionTimeValid(payload.startTime, submitTime)) {
    return { isValid: false, error: 'TOO_FAST' };
  }

  // 3. Check required fields
  if (
    !payload.name ||
    !payload.name.trim() ||
    !payload.email ||
    !payload.email.trim() ||
    !payload.message ||
    !payload.message.trim()
  ) {
    return { isValid: false, error: 'MISSING_FIELDS' };
  }

  // 4. Check email format
  if (!isValidEmail(payload.email)) {
    return { isValid: false, error: 'INVALID_EMAIL' };
  }

  return { isValid: true };
}
