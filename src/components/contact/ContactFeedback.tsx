import React from 'react';
import type { FormSubmissionStatus } from './useContactForm';

interface ContactFeedbackProps {
  status: FormSubmissionStatus;
  message: string;
}

export const ContactFeedback: React.FC<ContactFeedbackProps> = ({
  status,
  message,
}) => {
  if (status === 'idle') return null;

  const colorStyles =
    status === 'success'
      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
      : status === 'error'
        ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
        : 'bg-[#262628] border-[#3c3b3d] text-[#aaa7a3]';

  return (
    <div role="status" aria-live="polite" className={`text-xs p-3 rounded-lg border ${colorStyles}`}>
      {message}
    </div>
  );
};
